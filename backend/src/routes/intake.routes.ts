import { Router } from 'express';
import { IntakeController } from '../controllers/intake.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../types/role.enum';

const router = Router();

/**
 * @openapi
 * /intakes:
 *   post:
 *     summary: Create a new intake record
 *     tags: [Intake Workflow]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId]
 *             properties:
 *               patientId: { type: string, example: "60d21b4667d0d8992e61c484" }
 *               symptoms: { type: array, items: { type: string }, example: ["Fever", "Cough"] }
 *               vitals:
 *                 type: object
 *                 properties:
 *                   bloodPressure: { type: string, example: "120/80" }
 *                   heartRate: { type: number, example: 72 }
 *                   temperature: { type: number, example: 98.6 }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *     responses:
 *       201:
 *         description: Intake created successfully
 *
 *   get:
 *     summary: List all intakes with optional filters
 *     tags: [Intake Workflow]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *       - in: query
 *         name: state
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of intakes
 *
 * /intakes/{id}:
 *   get:
 *     summary: Get detailed intake record by id
 *     tags: [Intake Workflow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Intake found
 *
 *   patch:
 *     summary: Update basic intake data (symptoms, vitals, priority)
 *     tags: [Intake Workflow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symptoms: { type: array, items: { type: string } }
 *               vitals: { type: object }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *     responses:
 *       200:
 *         description: Intake updated
 *
 * /intakes/{id}/transition:
 *   patch:
 *     summary: Execute a state transition for the intake workflow
 *     tags: [Intake Workflow]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetState]
 *             properties:
 *               targetState: { type: string, example: "SUBMITTED" }
 *     responses:
 *       200:
 *         description: Transition successful
 *       422:
 *         description: Unprocessable Content (Clinical validation failed)
 */

router.use(authenticateJWT);

router.post('/', IntakeController.createIntake);
router.get('/', IntakeController.listIntakes);
router.get('/:id', IntakeController.getIntake);
router.patch('/:id', IntakeController.updateIntakeData);
router.patch('/:id/transition', IntakeController.transitionIntake);

export default router;
