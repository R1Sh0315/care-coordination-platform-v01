import mongoose, { Schema, Document } from 'mongoose';

export interface IRule extends Document {
    name: string;
    description?: string;
    conditions: {
        field: string;
        operator: 'equals' | 'contains' | 'gt' | 'lt' | 'in';
        value: any;
    }[];
    actions: {
        type: 'SET_PRIORITY' | 'ASSIGN_DOCTOR_TYPE' | 'FLAG_ESCALATION';
        value: any;
    }[];
    priority: number; // For overlapping rules (weight)
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RuleSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        conditions: [
            {
                field: { type: String, required: true }, // e.g., 'symptoms', 'vitals.temperature', 'age'
                operator: { type: String, enum: ['equals', 'contains', 'gt', 'lt', 'in'], required: true },
                value: { type: Schema.Types.Mixed, required: true },
            },
        ],
        actions: [
            {
                type: { type: String, enum: ['SET_PRIORITY', 'ASSIGN_DOCTOR_TYPE', 'FLAG_ESCALATION'], required: true },
                value: { type: Schema.Types.Mixed, required: true },
            },
        ],
        priority: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IRule>('Rule', RuleSchema);
