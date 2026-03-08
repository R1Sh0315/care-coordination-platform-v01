import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { LabController } from '../controllers/lab.controller';
import { TreatmentController } from '../controllers/treatment.controller';
import { AuditController } from '../controllers/audit.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../types/role.enum';

const router = Router();

router.use(authenticateJWT);

// Appointments
router.post('/appointments', authorizeRoles(UserRole.Receptionist, UserRole.Admin, UserRole.Patient), AppointmentController.book);
router.get('/appointments', AppointmentController.list);
router.get('/appointments/doctors', AppointmentController.listDoctors);
router.get('/appointments/availability', AppointmentController.getAvailability);
router.get('/appointments/:id', AppointmentController.get);
router.patch('/appointments/:id/status', AppointmentController.updateStatus);
router.patch('/appointments/:id/reschedule', authorizeRoles(UserRole.Receptionist, UserRole.Admin, UserRole.Patient, UserRole.Doctor), AppointmentController.reschedule);

// Lab Workflow
router.post('/labs', authorizeRoles(UserRole.Doctor, UserRole.Admin), LabController.order);
router.get('/labs/pending', authorizeRoles(UserRole.LabTechnician, UserRole.Admin), LabController.getPending);
router.patch('/labs/:id/status', authorizeRoles(UserRole.LabTechnician, UserRole.Doctor, UserRole.Admin), LabController.updateStatus);

// Treatment Plans
router.post('/treatments', authorizeRoles(UserRole.Doctor, UserRole.Admin), TreatmentController.create);
router.get('/treatments', TreatmentController.list);
router.patch('/treatments/:id', authorizeRoles(UserRole.Doctor, UserRole.Admin), TreatmentController.update);
router.patch('/treatments/:id/transition', authorizeRoles(UserRole.Doctor, UserRole.Admin), TreatmentController.transition);

// Audit (Compliance Only)
router.get('/audit/logs', authorizeRoles(UserRole.ComplianceOfficer, UserRole.Admin), AuditController.getLogs);
router.get('/audit/entity/:type/:id', authorizeRoles(UserRole.ComplianceOfficer, UserRole.Admin), AuditController.getEntityAudit);

export default router;
