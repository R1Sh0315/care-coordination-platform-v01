import { Response, NextFunction } from 'express';
import { LabService } from '../services/lab.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { LabStatus } from '../models/labOrder.model';

export class LabController {
    static async order(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const order = await LabService.orderLab(req.body, req.user?.id!, req.user?.role!, req.ip);
            res.status(201).json({ success: true, data: order });
        } catch (err) {
            next(err);
        }
    }

    static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { status, results } = req.body;
            const order = await LabService.updateStatus(req.params.id, status as LabStatus, req.user!, results, req.ip);
            res.status(200).json({ success: true, data: order });
        } catch (err) {
            next(err);
        }
    }

    static async getPending(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const orders = await LabService.getPendingResults();
            res.status(200).json({ success: true, data: orders });
        } catch (err) {
            next(err);
        }
    }
}
