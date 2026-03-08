import { Request, Response, NextFunction } from 'express';
import { IntakeService } from '../services/intake.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { IntakeState, IntakePriority } from '../types/intake.types';
import { AppError } from '../middleware/error.middleware';

export class IntakeController {
    static async createIntake(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { patientId, symptoms, vitals, priority } = req.body;
            const intake = await IntakeService.createIntake({ patientId, symptoms, vitals, priority }, req.user?.id!);
            res.status(201).json({ success: true, data: intake });
        } catch (err) {
            next(err);
        }
    }

    static async getIntake(req: Request, res: Response, next: NextFunction) {
        try {
            const intake = await IntakeService.getIntake(req.params.id);
            res.status(200).json({ success: true, data: intake });
        } catch (err) {
            next(err);
        }
    }

    static async listIntakes(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { priority, state, patientId } = req.query;
            const filter: any = {};
            if (priority) filter.priority = priority;
            if (state) filter.currentState = state;
            if (patientId) filter.patientId = patientId;

            // Role-based filtering
            if (req.user?.role === 'Patient') {
                filter.patientId = req.user.id;
            } else if (req.user?.role === 'Doctor') {
                // If the state is not explicitly TRIAGE_PENDING or READY_FOR_TRIAGE (where doctors see all), 
                // we should filter by assigned doctor
                if (!state || !['READY_FOR_TRIAGE', 'TRIAGE_PENDING'].includes(state as string)) {
                    filter.assignedDoctor = req.user.id;
                }
            }

            const intakes = await IntakeService.listIntakes(filter);
            res.status(200).json({ success: true, count: intakes.length, data: intakes });
        } catch (err) {
            next(err);
        }
    }

    static async transitionIntake(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { targetState } = req.body;
            if (!targetState || !Object.values(IntakeState).includes(targetState as IntakeState)) {
                throw new AppError('A valid targetState must be provided in the request body', 400);
            }

            const intake = await IntakeService.transitionState(req.params.id, targetState as IntakeState, req.user!);
            res.status(200).json({ success: true, message: `Intake transitioned to ${targetState}`, data: intake });
        } catch (err) {
            next(err);
        }
    }

    static async updateIntakeData(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const intake = await IntakeService.updateIntake(req.params.id, req.body, req.user?.id!);
            res.status(200).json({ success: true, data: intake });
        } catch (err) {
            next(err);
        }
    }
}
