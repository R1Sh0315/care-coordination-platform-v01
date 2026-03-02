import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../types/role.enum';

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "admin@example.com" }
 *               password: { type: string, format: password, example: "password123" }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Invalid credentials
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, format: email, example: "john@example.com" }
 *               password: { type: string, format: password, example: "SecurePass123" }
 *               role: { type: string, enum: ["Admin", "Doctor", "Nurse", "Staff", "Patient"] }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       403:
 *         description: Forbidden (Not an admin or invalid token)
 */

// Public routes
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);

// Admin-only: Register new staff/users
router.post('/register', authenticateJWT, authorizeRoles(UserRole.Admin), AuthController.registerUser);

export default router;
