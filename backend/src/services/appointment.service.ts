import Appointment, { IAppointment, AppointmentStatus } from '../models/appointment.model';
import { AuditService } from './audit.service';
import { AppError } from '../middleware/error.middleware';
import mongoose from 'mongoose';

export class AppointmentService {
    static async createAppointment(data: Partial<IAppointment>, userId: string, ipAddress?: string) {
        const { doctorId, appointmentDate, duration = 30 } = data;

        // 1. Validate date
        if (new Date(appointmentDate!) < new Date()) {
            throw new AppError('Cannot book appointments in the past', 400);
        }

        // 2. Check overlap (Race condition prevention)
        const isAvailable = await this.checkDoctorAvailability(
            doctorId!.toString(),
            new Date(appointmentDate!),
            duration
        );

        if (!isAvailable) {
            throw new AppError('Doctor is already booked for this time slot (Overlap Detected)', 409);
        }

        // 3. Create
        const appointment = await Appointment.create({ ...data, status: AppointmentStatus.SCHEDULED });

        // 4. Audit
        await AuditService.log({
            entityType: 'APPOINTMENT',
            entityId: (appointment._id as any).toString(),
            action: 'BOOK_APPOINTMENT',
            newValue: appointment.toObject(),
            performedBy: userId,
            ipAddress
        });

        return appointment;
    }

    static async checkDoctorAvailability(doctorId: string, requestedDate: Date, durationStr: number): Promise<boolean> {
        const start = new Date(requestedDate);
        const end = new Date(start.getTime() + durationStr * 60000);

        // Overlap Logic: (ExistingStart < RequestedEnd) AND (ExistingEnd > RequestedStart)
        const overlapping = await Appointment.findOne({
            doctorId: new mongoose.Types.ObjectId(doctorId),
            status: AppointmentStatus.SCHEDULED,
            $or: [
                {
                    // Existing starts during requested OR ends during requested
                    appointmentDate: { $lt: end },
                    // Note: durations can vary, so we calculate end on the fly in JS or store it.
                    // For simplicity with this model, let's use a query that covers the range.
                }
            ]
        });

        // Improved exact overlap check
        const appointments = await Appointment.find({
            doctorId: new mongoose.Types.ObjectId(doctorId),
            status: AppointmentStatus.SCHEDULED
        });

        const isBusy = appointments.some(app => {
            const appStart = new Date(app.appointmentDate).getTime();
            const appEnd = appStart + app.duration * 60000;
            const reqStart = start.getTime();
            const reqEnd = end.getTime();

            return (appStart < reqEnd) && (appEnd > reqStart);
        });

        return !isBusy;
    }

    static async updateStatus(id: string, status: AppointmentStatus, userId: string, ipAddress?: string) {
        const previous = await Appointment.findById(id);
        if (!previous) throw new AppError('Appointment not found', 404);

        if (previous.status === AppointmentStatus.CANCELLED) {
            throw new AppError('Cannot modify a cancelled appointment', 400);
        }

        const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

        await AuditService.log({
            entityType: 'APPOINTMENT',
            entityId: id,
            action: `STATUS_CHANGE_${status}`,
            previousValue: previous.toObject(),
            newValue: appointment?.toObject(),
            performedBy: userId,
            ipAddress
        });

        return appointment;
    }

    static async listAppointments(filter: any = {}) {
        return Appointment.find(filter).populate('patientId doctorId', 'name email').sort({ appointmentDate: 1 });
    }
}
