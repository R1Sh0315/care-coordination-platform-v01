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
}
