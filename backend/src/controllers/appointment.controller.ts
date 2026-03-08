import { Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserRole } from '../types/role.enum';
import { AppointmentStatus } from '../models/appointment.model';
import User from '../models/user.model';
import { AppError } from '../middleware/error.middleware';

export class AppointmentController {
    static async book(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { patientId, doctorId, appointmentDate, duration, notes } = req.body;

            // If user is a patient, enforce their own ID
            const targetPatientId = req.user?.role === UserRole.Patient ? req.user.id : patientId;

            const appointment = await AppointmentService.createAppointment(
                { patientId: targetPatientId, doctorId, appointmentDate, duration, notes },
                req.user?.id!,
                req.ip
            );
            res.status(201).json({ success: true, data: appointment });
        } catch (err) {
            next(err);
        }
    }

    static async list(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const filter: any = {};
            if (req.user?.role === UserRole.Patient) filter.patientId = req.user.id;
            if (req.user?.role === UserRole.Doctor) filter.doctorId = req.user.id;

            const appointments = await AppointmentService.listAppointments(filter);
            res.status(200).json({ success: true, count: appointments.length, data: appointments });
        } catch (err) {
            next(err);
        }
    }

    static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { status } = req.body;
            const appointment = await AppointmentService.updateStatus(req.params.id, status as AppointmentStatus, req.user?.id!, req.ip);
            res.status(200).json({ success: true, data: appointment });
        } catch (err) {
            next(err);
        }
    }

    static async listDoctors(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const doctors = await User.find({ role: UserRole.Doctor, isActive: true }).select('name email');
            res.status(200).json({ success: true, data: doctors });
        } catch (err) {
            next(err);
        }
    }

    static async getAvailability(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { doctorId, date } = req.query;
            if (!doctorId || !date) {
                throw new AppError('Doctor ID and Date are required', 400);
            }
            const slots = await AppointmentService.getAvailableSlots(doctorId as string, date as string);
            res.status(200).json({ success: true, data: slots });
        } catch (err) {
            next(err);
        }
    }
}
