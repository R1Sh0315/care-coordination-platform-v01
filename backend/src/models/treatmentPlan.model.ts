import mongoose, { Schema, Document } from 'mongoose';

export enum TreatmentState {
    DRAFT = 'DRAFT',
    REVIEW = 'REVIEW',
    APPROVED = 'APPROVED',
    ACTIVE = 'ACTIVE',
    MODIFIED = 'MODIFIED',
    CLOSED = 'CLOSED',
}

export interface ITreatmentStep extends Document {
    patientId: mongoose.Types.ObjectId;
    diagnoses: string[];
    medications: {
        name: string;
        dosage: string;
        isControlled: boolean;
    }[];
    labTests: string[];
    procedures: string[];
    version: number;
    currentState: TreatmentState;
    approvedBy?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TreatmentPlanSchema = new Schema(
    {
        patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        diagnoses: [{ type: String }],
        medications: [
            {
                name: { type: String, required: true },
                dosage: { type: String },
                isControlled: { type: Boolean, default: false },
            },
        ],
        labTests: [{ type: String }],
        procedures: [{ type: String }],
        version: { type: Number, default: 1 },
        currentState: { type: String, enum: Object.values(TreatmentState), default: TreatmentState.DRAFT },
        approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

// Prevent deletion of ACTIVE plans
TreatmentPlanSchema.pre('findOneAndDelete', async function (next) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc && doc.currentState === TreatmentState.ACTIVE) {
        return next(new Error('Cannot delete an ACTIVE treatment plan. Close it instead.'));
    }
    next();
});

export default mongoose.model<ITreatmentStep>('TreatmentPlan', TreatmentPlanSchema);
