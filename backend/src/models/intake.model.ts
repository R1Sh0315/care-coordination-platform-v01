import mongoose, { Schema, Document } from 'mongoose';
import { IntakeState, IntakePriority } from '../types/intake.types';

export interface IStateHistoryEntry {
    fromState: IntakeState;
    toState: IntakeState;
    changedBy: mongoose.Types.ObjectId;
    timestamp: Date;
}

export interface IVitals {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
}

export interface IIntake extends Document {
    patientId: mongoose.Types.ObjectId;
    symptoms: string[];
    vitals: IVitals;
    priority?: IntakePriority;
    assignedDoctor?: mongoose.Types.ObjectId;
    currentState: IntakeState;
    stateHistory: IStateHistoryEntry[];
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

const StateHistorySchema = new Schema(
    {
        fromState: { type: String, enum: Object.values(IntakeState), required: true },
        toState: { type: String, enum: Object.values(IntakeState), required: true },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const IntakeSchema = new Schema(
    {
        patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        symptoms: [{ type: String }],
        vitals: {
            bloodPressure: { type: String },
            heartRate: { type: Number },
            temperature: { type: Number },
        },
        priority: { type: String, enum: Object.values(IntakePriority) },
        assignedDoctor: { type: Schema.Types.ObjectId, ref: 'User' },
        currentState: { type: String, enum: Object.values(IntakeState), default: IntakeState.DRAFT },
        stateHistory: [StateHistorySchema],
        version: { type: Number, default: 0 }, // For optimistic concurrency
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    }
);

// Middleware for versioning
IntakeSchema.pre('save', function (next) {
    this.increment();
    next();
});

export default mongoose.model<IIntake>('Intake', IntakeSchema);
