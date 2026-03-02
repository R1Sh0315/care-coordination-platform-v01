import AuditLog from '../models/auditLog.model';
import mongoose from 'mongoose';

export interface AuditData {
    entityType: string;
    entityId: string;
    action: string;
    previousValue?: any;
    newValue?: any;
    performedBy: string;
    ipAddress?: string;
}

export class AuditService {
    static async log(data: AuditData) {
        try {
            await AuditLog.create({
                ...data,
                entityId: new mongoose.Types.ObjectId(data.entityId),
                performedBy: new mongoose.Types.ObjectId(data.performedBy),
            });
        } catch (err) {
            // In production, we might want to log this to a secondary system (like CloudWatch/Winston)
            // but we shouldn't fail the main transaction just because audit logging failed.
            console.error('CRITICAL: Audit log failed to write:', err);
        }
    }

    static async getLogsForEntity(entityType: string, entityId: string) {
        return AuditLog.find({ entityType, entityId }).sort({ timestamp: -1 }).populate('performedBy', 'name email role');
    }

    static async getGlobalLogs(filter: any = {}, limit: number = 50, skip: number = 0) {
        return AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip(skip)
            .populate('performedBy', 'name email role');
    }
}
