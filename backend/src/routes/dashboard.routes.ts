import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '../types/role.enum';

const router = Router();

router.get('/admin/stats', authenticateJWT, authorizeRoles(UserRole.Admin), DashboardController.getAdminStats);

export default router;
