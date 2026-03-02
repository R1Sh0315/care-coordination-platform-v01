import mongoose, { Schema, Document } from 'mongoose';

export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    NO_SHOW = 'NO_SHOW',
}

export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    appointmentDate: Date;
    duration: number; // minutes
    status: AppointmentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema(
    {
        patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        appointmentDate: { type: Date, required: true, index: true },
        duration: { type: Number, default: 30 },
        status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.SCHEDULED },
        notes: { type: String },
    },
    { timestamps: true }
);

// Compound index to speed up availability checks
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
