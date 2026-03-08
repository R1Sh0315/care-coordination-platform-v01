import Appointment, { IAppointment, AppointmentStatus } from '../models/appointment.model';
import { AuditService } from './audit.service';
import { AppError } from '../middleware/error.middleware';
import mongoose from 'mongoose';

export class AppointmentService {
    static async createAppointment(data: Partial<IAppointment>, userId: string, ipAddress?: string) {
        const { doctorId, patientId, appointmentDate, duration = 30 } = data;

        // 1. Validate date
        if (new Date(appointmentDate!) < new Date()) {
            throw new AppError('Cannot book appointments in the past', 400);
        }

        // 2. Check overlap (Race condition prevention)
        const isAvailable = await this.checkAvailability(
            doctorId!.toString(),
            new Date(appointmentDate!),
            duration,
            patientId?.toString()
        );

        if (!isAvailable) {
            throw new AppError('Slot is already booked for either doctor or patient', 409);
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

    static async checkAvailability(doctorId: string, requestedDate: Date, durationStr: number, patientId?: string, excludeId?: string): Promise<boolean> {
        const start = new Date(requestedDate);
        const end = new Date(start.getTime() + durationStr * 60000);

        const filter: any = {
            status: AppointmentStatus.SCHEDULED,
            $or: [
                { doctorId: new mongoose.Types.ObjectId(doctorId) }
            ]
        };

        if (patientId) {
            filter.$or.push({ patientId: new mongoose.Types.ObjectId(patientId) });
        }

        if (excludeId) {
            filter._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
        }

        const appointments = await Appointment.find(filter);

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

    static async rescheduleAppointment(id: string, newDate: string, duration: number, userId: string, ipAddress?: string) {
        const appointment = await Appointment.findById(id);
        if (!appointment) throw new AppError('Appointment not found', 404);

        if (appointment.status === AppointmentStatus.CANCELLED || appointment.status === AppointmentStatus.COMPLETED) {
            throw new AppError(`Cannot reschedule a ${appointment.status.toLowerCase()} appointment`, 400);
        }

        const isAvailable = await this.checkAvailability(
            appointment.doctorId.toString(),
            new Date(newDate),
            duration || appointment.duration,
            appointment.patientId.toString(),
            id
        );

        if (!isAvailable) {
            throw new AppError('Time slot is already booked for either doctor or patient', 409);
        }

        const previousValue = appointment.toObject();
        appointment.appointmentDate = new Date(newDate);
        if (duration) appointment.duration = duration;

        await appointment.save();

        await AuditService.log({
            entityType: 'APPOINTMENT',
            entityId: id,
            action: 'RESCHEDULE_APPOINTMENT',
            previousValue,
            newValue: appointment.toObject(),
            performedBy: userId,
            ipAddress
        });

        return appointment;
    }


    static async listAppointments(filter: any = {}) {
        return Appointment.find(filter).populate('patientId doctorId', 'name email').sort({ appointmentDate: 1 });
    }

    static async getAppointment(id: string) {
        return Appointment.findById(id).populate('patientId doctorId', 'name email');
    }

    static async getAvailableSlots(doctorId: string, dateStr: string, patientId?: string) {
        const date = new Date(dateStr);
        const startOfDay = new Date(date.setHours(9, 0, 0, 0)); // 9 AM
        const endOfDay = new Date(date.setHours(17, 0, 0, 0)); // 5 PM
        const slotDuration = 30; // 30 mins

        const filter: any = {
            status: AppointmentStatus.SCHEDULED,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        };

        if (patientId && doctorId) {
            filter.$or = [
                { doctorId: new mongoose.Types.ObjectId(doctorId) },
                { patientId: new mongoose.Types.ObjectId(patientId) }
            ];
        } else if (doctorId) {
            filter.doctorId = new mongoose.Types.ObjectId(doctorId);
        }

        const existingApps = await Appointment.find(filter);

        const slots = [];
        let current = new Date(startOfDay);

        while (current < endOfDay) {
            const slotStart = new Date(current);
            const slotEnd = new Date(current.getTime() + slotDuration * 60000);

            const isBooked = existingApps.some(app => {
                const appStart = new Date(app.appointmentDate).getTime();
                const appEnd = appStart + app.duration * 60000;
                return (slotStart.getTime() < appEnd) && (slotEnd.getTime() > appStart);
            });

            slots.push({
                time: slotStart.toISOString(),
                available: !isBooked && slotStart > new Date()
            });

            current = new Date(current.getTime() + slotDuration * 60000);
        }

        return slots;
    }
}
