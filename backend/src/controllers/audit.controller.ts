import { Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuditController {
    static async getLogs(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { entityType, entityId, performedBy, limit, skip } = req.query;
            const filter: any = {};
            if (entityType) filter.entityType = entityType;
            if (entityId) filter.entityId = entityId;
            if (performedBy) filter.performedBy = performedBy;

            const logs = await AuditService.getGlobalLogs(
                filter,
                parseInt(limit as string) || 50,
                parseInt(skip as string) || 0
            );

            res.status(200).json({ success: true, count: logs.length, data: logs });
        } catch (err) {
            next(err);
        }
    }

    static async getEntityAudit(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { type, id } = req.params;
            const logs = await AuditService.getLogsForEntity(type, id);
            res.status(200).json({ success: true, count: logs.length, data: logs });
        } catch (err) {
            next(err);
        }
    }
}
