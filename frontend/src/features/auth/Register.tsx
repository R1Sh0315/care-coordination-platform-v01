import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, CheckCircle2, Loader2, ShieldCheck, HeartPulse } from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import './Register.css';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>();

    const password = watch('password');

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/signup', {
                name: data.name,
                email: data.email,
                password: data.password,
            });

            setIsSuccess(true);

            // Dramatic pause for success animation
            setTimeout(() => {
                setAuth(response.data.user, response.data.token);
                navigate('/');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="register-card"
            >
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="register-content"
                        >
                            <div className="register-header">
                                <div className="logo-icon">
                                    <HeartPulse size={32} color="var(--accent)" />
                                </div>
                                <h1>Create Account</h1>
                                <p>Join the Care Coordination Platform</p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="error-message"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                                <div className="input-group">
                                    <label><User size={16} /> Full Name</label>
                                    <input
                                        {...register('name', { required: 'Name is required' })}
                                        placeholder="Enter your full name"
                                        className={errors.name ? 'error' : ''}
                                    />
                                    {errors.name && <span className="field-error">{errors.name.message}</span>}
                                </div>

                                <div className="input-group">
                                    <label><Mail size={16} /> Email Address</label>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                                        })}
                                        placeholder="name@hospital.com"
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="field-error">{errors.email.message}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label><Lock size={16} /> Password</label>
                                        <input
                                            type="password"
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: { value: 8, message: 'Min 8 characters' }
                                            })}
                                            placeholder="••••••••"
                                            className={errors.password ? 'error' : ''}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Confirm</label>
                                        <input
                                            type="password"
                                            {...register('confirmPassword', {
                                                validate: value => value === password || 'Passwords do not match'
                                            })}
                                            placeholder="••••••••"
                                            className={errors.confirmPassword ? 'error' : ''}
                                        />
                                    </div>
                                </div>
                                {(errors.password || errors.confirmPassword) && (
                                    <span className="field-error">
                                        {errors.password?.message || errors.confirmPassword?.message}
                                    </span>
                                )}

                                <button type="submit" className="btn btn-primary register-btn" disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="spinner" size={20} />
                                    ) : (
                                        <>Sign Up <ArrowRight size={20} /></>
                                    )}
                                </button>
                            </form>

                            <div className="register-footer">
                                Already have an account? <Link to="/login">Sign In</Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="success-state"
                        >
                            <div className="success-icon">
                                <CheckCircle2 size={64} color="var(--success)" />
                            </div>
                            <h2>Account Created!</h2>
                            <p>Welcome to the platform. Redirecting you to the dashboard...</p>
                            <div className="loading-bar">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2 }}
                                    className="loading-progress"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Decorative Elements */}
            <div className="bg-dots"></div>
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="floating-security"
            >
                <ShieldCheck size={40} opacity={0.1} />
            </motion.div>
        </div>
    );
};

export default Register;
