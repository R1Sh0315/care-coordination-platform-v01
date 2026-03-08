import { Response, NextFunction } from 'express';
import User from '../models/user.model';
import Intake from '../models/intake.model';
import Appointment from '../models/appointment.model';
import AuditLog from '../models/auditLog.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserRole } from '../types/role.enum';
import { IntakeState, IntakePriority } from '../types/intake.types';
import { AppointmentStatus } from '../models/appointment.model';

export class DashboardController {
    static async getAdminStats(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // Count users by role
            const userCounts = await User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ]);

            // Count intakes by state
            const intakeCounts = await Intake.aggregate([
                { $group: { _id: '$currentState', count: { $sum: 1 } } }
            ]);

            // Count appointments by status
            const appointmentCounts = await Appointment.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]);

            // Get total patients
            const totalPatients = await User.countDocuments({ role: UserRole.Patient });

            // Get total clinical staff
            const totalStaff = await User.countDocuments({
                role: { $in: [UserRole.Doctor, UserRole.Nurse, UserRole.Specialist] }
            });

            // Get pending triages (those not yet triaged or processed)
            const pendingTriages = await Intake.countDocuments({
                currentState: { $in: [IntakeState.TRIAGE_PENDING, IntakeState.SUBMITTED] }
            });

            // Get today's scheduled appointments
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const todaysAppointments = await Appointment.countDocuments({
                appointmentDate: { $gte: today, $lt: tomorrow },
                status: AppointmentStatus.SCHEDULED
            });

            // Get recent audit logs (last 10)
            const recentLogs = await AuditLog.find()
                .populate('performedBy', 'name role')
                .sort({ timestamp: -1 })
                .limit(10);

            // High Priority Intakes
            const priorityIntakes = await Intake.find({
                priority: IntakePriority.HIGH,
                currentState: { $ne: IntakeState.COMPLETED }
            })
                .populate('patientId', 'name')
                .limit(5);

            res.status(200).json({
                success: true,
                data: {
                    summary: {
                        totalPatients,
                        totalStaff,
                        pendingTriages,
                        todaysAppointments
                    },
                    distributions: {
                        users: userCounts,
                        intakes: intakeCounts,
                        appointments: appointmentCounts
                    },
                    recentActivity: recentLogs,
                    priorityAlerts: priorityIntakes
                }
            });
        } catch (err) {
            next(err);
        }
    }
}
