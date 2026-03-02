import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middleware/error.middleware';
import { UserRole } from '../types/role.enum';

export class AuthController {
    // Only Admin can register new users
    static async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password, role } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                return next(new AppError('User with this email already exists', 400));
            }

            const user = await User.create({ name, email, password, role });

            res.status(201).json({
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                return next(new AppError('User with this email already exists', 400));
            }

            // Public signup always defaults to Patient role
            const user = await User.create({
                name,
                email,
                password,
                role: UserRole.Patient,
            });

            const token = AuthService.generateToken(user._id.toString(), user.role);

            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(new AppError('Please provide email and password', 400));
            }

            const user = await User.findOne({ email }).select('+password'); // Explicitly include password for comparison

            if (!user || !(await user.comparePassword(password))) {
                return next(new AppError('Incorrect email or password', 401));
            }

            if (!user.isActive) {
                return next(new AppError('Your account has been deactivated. Please contact administration.', 403));
            }

            const token = AuthService.generateToken(user._id.toString(), user.role);

            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            next(err);
        }
    }
}
