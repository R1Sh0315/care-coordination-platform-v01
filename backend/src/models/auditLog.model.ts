import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    entityType: string;
    entityId: mongoose.Types.ObjectId;
    action: string;
    previousValue?: any;
    newValue?: any;
    performedBy: mongoose.Types.ObjectId;
    ipAddress?: string;
    timestamp: Date;
}

const AuditLogSchema = new Schema(
    {
        entityType: { type: String, required: true, index: true },
        entityId: { type: Schema.Types.ObjectId, required: true, index: true },
        action: { type: String, required: true, index: true },
        previousValue: { type: Schema.Types.Mixed },
        newValue: { type: Schema.Types.Mixed },
        performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        ipAddress: { type: String },
    },
    {
        timestamps: { createdAt: 'timestamp', updatedAt: false },
        versionKey: false
    }
);

// Immobilize audit logs - prevent updates and deletes
AuditLogSchema.pre('save', function (next) {
    if (!this.isNew) return next(new Error('Audit logs are immutable and cannot be modified.'));
    next();
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
