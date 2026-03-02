import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await User.find({}, '-password');
            res.status(200).json({ success: true, count: users.length, data: users });
        } catch (err) {
            next(err);
        }
    }

    static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await User.findById(req.user?.id, '-password');
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            res.status(200).json({ success: true, data: user });
        } catch (err) {
            next(err);
        }
    }

    // Deactivate account
    static async deactivateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            res.status(200).json({ success: true, message: 'User deactivated successfully' });
        } catch (err) {
            next(err);
        }
    }
}
