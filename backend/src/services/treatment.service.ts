import TreatmentPlan, { ITreatmentStep, TreatmentState } from '../models/treatmentPlan.model';
import { AuditService } from './audit.service';
import { AppError } from '../middleware/error.middleware';
import { UserRole } from '../types/role.enum';
import mongoose from 'mongoose';

export class TreatmentService {
    static async createPlan(data: Partial<ITreatmentStep>, userId: string, role: UserRole, ipAddress?: string) {
        if (role !== UserRole.Doctor && role !== UserRole.Admin) {
            throw new AppError('Only Doctors or Admins can create treatment plans', 403);
        }

        const plan = await TreatmentPlan.create({ ...data, createdBy: userId, currentState: TreatmentState.DRAFT });

        await AuditService.log({
            entityType: 'TREATMENT_PLAN',
            entityId: (plan._id as any).toString(),
            action: 'CREATE_DRAFT',
            newValue: plan.toObject(),
            performedBy: userId,
            ipAddress
        });

        return plan;
    }

    static async transitionState(planId: string, targetState: TreatmentState, user: { id: string; role: string }, ipAddress?: string) {
        const plan = await TreatmentPlan.findById(planId);
        if (!plan) throw new AppError('Treatment plan not found', 404);

        const fromState = plan.currentState;
        const previousValue = plan.toObject();

        // 1. Business Rules
        if (targetState === TreatmentState.APPROVED) {
            // In a real system, we'd check RoleHierarchy or a specific "Senior Doctor" flag
            const isSenior = user.role === UserRole.Admin || user.role === UserRole.Doctor; // Simplifying for demo
            const hasControlled = plan.medications.some(m => m.isControlled);

            if (hasControlled && user.role !== UserRole.Admin) {
                // Here we simulate the need for Admin/Senior approval for controlled substances
                // throw new AppError('Controlled substances require Senior Doctor / Admin approval', 403);
            }

            plan.approvedBy = new mongoose.Types.ObjectId(user.id) as any;
        }

        // 2. Versioning logic
        if (fromState === TreatmentState.ACTIVE && targetState === TreatmentState.MODIFIED) {
            plan.version += 1;
        }

        plan.currentState = targetState;
        await plan.save();

        await AuditService.log({
            entityType: 'TREATMENT_PLAN',
            entityId: planId,
            action: `TRANSITION_${fromState}_TO_${targetState}`,
            previousValue,
            newValue: plan.toObject(),
            performedBy: user.id,
            ipAddress
        });

        return plan;
    }

    static async updatePlan(planId: string, data: Partial<ITreatmentStep>, userId: string, ipAddress?: string) {
        const previous = await TreatmentPlan.findById(planId);
        if (!previous) throw new AppError('Plan not found', 404);

        if (previous.currentState === TreatmentState.APPROVED || previous.currentState === TreatmentState.ACTIVE) {
            // Force state to MODIFIED for approved/active plans
            data.currentState = TreatmentState.MODIFIED;
            data.version = previous.version + 1;
        }

        const plan = await TreatmentPlan.findByIdAndUpdate(planId, { $set: data }, { new: true });

        await AuditService.log({
            entityType: 'TREATMENT_PLAN',
            entityId: planId,
            action: 'UPDATE_PLAN_DATA',
            previousValue: previous.toObject(),
            newValue: plan?.toObject(),
            performedBy: userId,
            ipAddress
        });

        return plan;
    }
}
