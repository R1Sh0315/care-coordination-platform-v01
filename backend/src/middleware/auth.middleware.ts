import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/role.enum';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: UserRole;
    };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }

        jwt.verify(token, secret, (err, decoded: any) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token' });
            }
            req.user = { id: decoded.id, role: decoded.role };
            next();
        });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }
};

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
