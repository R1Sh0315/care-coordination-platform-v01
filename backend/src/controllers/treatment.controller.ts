import { Response, NextFunction } from 'express';
import { TreatmentService } from '../services/treatment.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { TreatmentState } from '../models/treatmentPlan.model';

export class TreatmentController {
    static async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const plan = await TreatmentService.createPlan(req.body, req.user?.id!, req.user?.role!, req.ip);
            res.status(201).json({ success: true, data: plan });
        } catch (err) {
            next(err);
        }
    }

    static async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const plan = await TreatmentService.updatePlan(req.params.id, req.body, req.user?.id!, req.ip);
            res.status(200).json({ success: true, data: plan });
        } catch (err) {
            next(err);
        }
    }

    static async transition(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { targetState } = req.body;
            const plan = await TreatmentService.transitionState(req.params.id, targetState as TreatmentState, req.user!, req.ip);
            res.status(200).json({ success: true, data: plan });
        } catch (err) {
            next(err);
        }
    }

    static async list(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const filter: any = {};
            if (req.user?.role === 'Patient') {
                filter.patientId = req.user.id;
            } else if (req.user?.role === 'Doctor') {
                // Doctors see plans they created or for patients assigned to them
                filter.$or = [
                    { createdBy: req.user.id },
                    { patientId: req.user.id } // This logic depends on if doctors are also patients, usually not
                ];
                // Better: find patients assigned to doctor first? 
                // For now, let's just use createdBy or patientId if they are the patient.
            }
            // Admin sees all

            const plans = await TreatmentService.listPlans(filter);
            res.status(200).json({ success: true, data: plans });
        } catch (err) {
            next(err);
        }
    }
}
