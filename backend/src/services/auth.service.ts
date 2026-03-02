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
            const secret = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret';
            return jwt.verify(token, secret);
        } catch (err) {
            return null;
        }
    }
}
