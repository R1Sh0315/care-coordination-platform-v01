import { Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserRole } from '../types/role.enum';
import { AppointmentStatus } from '../models/appointment.model';

export class AppointmentController {
    static async book(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { patientId, doctorId, appointmentDate, duration, notes } = req.body;
            const appointment = await AppointmentService.createAppointment(
                { patientId, doctorId, appointmentDate, duration, notes },
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
}
