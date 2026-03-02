import mongoose, { Schema, Document } from 'mongoose';

export enum LabStatus {
    ORDERED = 'ORDERED',
    SAMPLE_COLLECTED = 'SAMPLE_COLLECTED',
    PROCESSING = 'PROCESSING',
    RESULTS_UPLOADED = 'RESULTS_UPLOADED',
    REVIEWED = 'REVIEWED',
}

export interface ILabOrder extends Document {
    intakeId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    testName: string;
    orderedByDoctor: mongoose.Types.ObjectId;
    labTechnician?: mongoose.Types.ObjectId;
    status: LabStatus;
    resultDocumentUrl?: string;
    resultsData?: any;
    reviewedByDoctor?: mongoose.Types.ObjectId;
    orderedAt: Date;
    processedAt?: Date;
    resultsUploadedAt?: Date;
    reviewedAt?: Date;
}

const LabOrderSchema = new Schema(
    {
        intakeId: { type: Schema.Types.ObjectId, ref: 'Intake', required: true, index: true },
        patientId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        testName: { type: String, required: true },
        orderedByDoctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        labTechnician: { type: Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: Object.values(LabStatus), default: LabStatus.ORDERED },
        resultDocumentUrl: { type: String },
        resultsData: { type: Schema.Types.Mixed },
        reviewedByDoctor: { type: Schema.Types.ObjectId, ref: 'User' },
        orderedAt: { type: Date, default: Date.now },
        processedAt: { type: Date },
        resultsUploadedAt: { type: Date },
        reviewedAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<ILabOrder>('LabOrder', LabOrderSchema);
