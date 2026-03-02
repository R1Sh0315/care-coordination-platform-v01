import mongoose from 'mongoose';
import Intake, { IIntake } from '../models/intake.model';
import { AuditService } from './audit.service';
import { RuleEngineService } from './ruleEngine.service';
import { IntakeState } from '../types/intake.types';
import { UserRole } from '../types/role.enum';
import { AppError } from '../middleware/error.middleware';

export class IntakeService {
    private static allowedTransitions: Record<IntakeState, IntakeState[]> = {
        [IntakeState.DRAFT]: [IntakeState.SUBMITTED],
        [IntakeState.SUBMITTED]: [IntakeState.TRIAGE_PENDING],
        [IntakeState.TRIAGE_PENDING]: [IntakeState.TRIAGED],
        [IntakeState.TRIAGED]: [IntakeState.ASSIGNED_TO_DOCTOR],
        [IntakeState.ASSIGNED_TO_DOCTOR]: [IntakeState.CONSULTED],
        [IntakeState.CONSULTED]: [IntakeState.TREATMENT_STARTED],
        [IntakeState.TREATMENT_STARTED]: [IntakeState.COMPLETED],
        [IntakeState.COMPLETED]: [IntakeState.FOLLOW_UP_REQUIRED],
        [IntakeState.FOLLOW_UP_REQUIRED]: [],
    };

    private static rolePermissions: Record<string, UserRole[]> = {
        [`${IntakeState.DRAFT}->${IntakeState.SUBMITTED}`]: [UserRole.Receptionist, UserRole.Admin],
        [`${IntakeState.SUBMITTED}->${IntakeState.TRIAGE_PENDING}`]: [UserRole.Receptionist, UserRole.Admin],
        [`${IntakeState.TRIAGE_PENDING}->${IntakeState.TRIAGED}`]: [UserRole.Nurse, UserRole.Admin],
        [`${IntakeState.TRIAGED}->${IntakeState.ASSIGNED_TO_DOCTOR}`]: [UserRole.Nurse, UserRole.Admin],
        [`${IntakeState.ASSIGNED_TO_DOCTOR}->${IntakeState.CONSULTED}`]: [UserRole.Doctor, UserRole.Admin],
        [`${IntakeState.CONSULTED}->${IntakeState.TREATMENT_STARTED}`]: [UserRole.Doctor, UserRole.Admin],
        [`${IntakeState.TREATMENT_STARTED}->${IntakeState.COMPLETED}`]: [UserRole.Doctor, UserRole.Admin],
        [`${IntakeState.COMPLETED}->${IntakeState.FOLLOW_UP_REQUIRED}`]: [UserRole.Doctor, UserRole.Admin],
    };

    static async createIntake(data: Partial<IIntake>, userId: string, ipAddress?: string) {
        const intake = await Intake.create({ ...data, currentState: IntakeState.DRAFT });

        await AuditService.log({
            entityType: 'INTAKE',
            entityId: (intake._id as any).toString(),
            action: 'CREATE_INTAKE',
            newValue: intake.toObject(),
            performedBy: userId,
            ipAddress
        });

        return intake;
    }

    static async getIntake(id: string) {
        const intake = await Intake.findById(id).populate('patientId assignedDoctor', 'name email');
        if (!intake) throw new AppError('Intake not found', 404);
        return intake;
    }

    static async listIntakes(filter: any = {}) {
        return Intake.find(filter).sort({ createdAt: -1 });
    }

    static async updateIntake(id: string, data: Partial<IIntake>, userId: string, ipAddress?: string) {
        const previous = await Intake.findById(id);
        if (!previous) throw new AppError('Intake not found', 404);

        const intake = await Intake.findByIdAndUpdate(id, { $set: data }, { new: true });

        await AuditService.log({
            entityType: 'INTAKE',
            entityId: id,
            action: 'UPDATE_INTAKE',
            previousValue: previous.toObject(),
            newValue: intake?.toObject(),
            performedBy: userId,
            ipAddress
        });

        return intake;
    }

    static async transitionState(intakeId: string, targetState: IntakeState, user: { id: string; role: UserRole }, ipAddress?: string) {
        const intake = await Intake.findById(intakeId);
        if (!intake) throw new AppError('Intake record not found', 404);

        const fromState = intake.currentState;
        const previousValue = intake.toObject();

        // 1. Role Auth
        if (user.role !== UserRole.Admin) {
            const requiredRoles = this.rolePermissions[`${fromState}->${targetState}`];
            if (!requiredRoles || !requiredRoles.includes(user.role)) {
                throw new AppError(`Access Denied: Role ${user.role} unauthorized for ${fromState} -> ${targetState}`, 403);
            }
        }

        // 2. Logic Check
        if (user.role !== UserRole.Admin && !this.allowedTransitions[fromState].includes(targetState)) {
            throw new AppError(`Invalid workflow transition: ${fromState} -> ${targetState}`, 400);
        }

        // 3. Clinical Data Validation
        this.validateClinicalDependencies(intake, targetState);

        // 4. RULE ENGINE INTEGRATION: Trigger when pending triage
        if (targetState === IntakeState.TRIAGE_PENDING) {
            const evaluation = await RuleEngineService.evaluateIntake(intake);
            intake.priority = evaluation.priority;
            // You could also log evaluation details here
            console.log(`[RuleEngine] Intake ${intakeId} evaluated. Priority: ${evaluation.priority}. Applied: ${evaluation.appliedRules.join(', ')}`);
        }

        // 5. Update State
        intake.currentState = targetState;
        intake.stateHistory.push({
            fromState,
            toState: targetState,
            changedBy: new mongoose.Types.ObjectId(user.id) as any,
            timestamp: new Date(),
        });

        await intake.save();

        // 6. Audit
        await AuditService.log({
            entityType: 'INTAKE',
            entityId: intakeId,
            action: `TRANSITION_TO_${targetState}`,
            previousValue,
            newValue: intake.toObject(),
            performedBy: user.id,
            ipAddress
        });

        return intake;
    }

    private static validateClinicalDependencies(intake: IIntake, targetState: IntakeState) {
        if (targetState === IntakeState.TRIAGED) {
            const { bloodPressure, heartRate, temperature } = intake.vitals || {};
            if (!bloodPressure || !heartRate || !temperature) {
                throw new AppError('Clinical validation failed: Missing Vitals', 422);
            }
        }

        if (targetState === IntakeState.ASSIGNED_TO_DOCTOR) {
            if (!intake.priority) {
                throw new AppError('Clinical validation failed: Priority must be set', 422);
            }
        }

        if (targetState === IntakeState.COMPLETED) {
            const started = intake.stateHistory.some(e => e.toState === IntakeState.TREATMENT_STARTED);
            if (!started) throw new AppError('Process validation failed: Treatment never started', 422);
        }
    }
}
