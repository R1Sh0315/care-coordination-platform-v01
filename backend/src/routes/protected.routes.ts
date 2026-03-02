import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../types/role.enum';
import { UserController } from '../controllers/user.controller';

const router = Router();

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: Retrieve a list of all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data: 
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 *
 * /patients:
 *   post:
 *     summary: Create a new patient intake (Receptionist or Admin)
 *     tags: [Front Desk]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Patient intake created successfully.
 *
 * /triage:
 *   post:
 *     summary: Process patient triage (Nurse only)
 *     tags: [Clinical]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Triage data processed.
 *
 * /treatment-plan:
 *   post:
 *     summary: Establish a treatment plan (Doctor or Specialist)
 *     tags: [Clinical]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Treatment plan established.
 *
 * /audit-logs:
 *   get:
 *     summary: Access system audit logs (Compliance Officer only)
 *     tags: [Compliance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Full system audit logs.
 *
 * /profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 */

// 1. Admin only - List all users
router.get('/admin/users', authenticateJWT, authorizeRoles(UserRole.Admin), UserController.getAllUsers);

// 2. Receptionist or Admin - Register/Manage Patient Intake
router.post('/patients', authenticateJWT, authorizeRoles(UserRole.Receptionist, UserRole.Admin), (req, res) => {
    res.status(201).json({ success: true, message: 'Patient intake created' });
});

// 3. Nurse only - Process Triage
router.post('/triage', authenticateJWT, authorizeRoles(UserRole.Nurse), (req, res) => {
    res.status(200).json({ success: true, message: 'Triage data processed' });
});

// 4. Doctor or Specialist - Create Treatment Plan
router.post('/treatment-plan', authenticateJWT, authorizeRoles(UserRole.Doctor, UserRole.Specialist), (req, res) => {
    res.status(201).json({ success: true, message: 'Treatment plan established' });
});

// 5. Compliance Officer only - Access Audit Logs
router.get('/audit-logs', authenticateJWT, authorizeRoles(UserRole.ComplianceOfficer), (req, res) => {
    res.status(200).json({ success: true, logs: 'Full system audit logs' });
});

// 6. Generic profile route for all authenticated users
router.get('/profile', authenticateJWT, UserController.getProfile);

export default router;
