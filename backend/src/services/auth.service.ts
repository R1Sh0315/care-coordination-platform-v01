import jwt from 'jsonwebtoken';
import { UserRole } from '../types/role.enum';

export class AuthService {
    static generateToken(userId: string, role: UserRole): string {
        const payload = { id: userId, role };
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const expiresIn = (process.env.JWT_EXPIRATION as any) || '1h';

        return jwt.sign(payload, secret, {
            expiresIn: expiresIn,
        });
    }

    static generateRefreshToken(userId: string): string {
        const secret = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret';
        const expiresIn = (process.env.REFRESH_TOKEN_EXPIRATION as any) || '7d';

        return jwt.sign({ id: userId }, secret, {
            expiresIn: expiresIn,
        });
    }

    static verifyRefreshToken(token: string): any {
        try {
            const secret = process.env.REFRESH_TOKEN_SECRET || 'fallback_secret';
            return jwt.verify(token, secret);
        } catch (err) {
            return null;
        }
    }

    static async seedUsers() {
        const User = (await import('../models/user.model')).default;
        const count = await User.countDocuments();

        if (count === 0 && process.env.INITIAL_ADMIN_EMAIL) {
            console.log('Detecting empty database. Initializing admin account... 🛡️');
            await User.create({
                name: process.env.INITIAL_ADMIN_NAME || 'System Admin',
                email: process.env.INITIAL_ADMIN_EMAIL,
                password: process.env.INITIAL_ADMIN_PASSWORD || 'Admin@123',
                role: UserRole.Admin
            });
            console.log(`Initial Admin created: ${process.env.INITIAL_ADMIN_EMAIL} ✅`);
        }
    }
}
