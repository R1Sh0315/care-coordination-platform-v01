import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import './Login.css';

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const setAuth = useAuthStore(state => state.setAuth);

    const from = (location.state as any)?.from?.pathname || "/";

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', data);
            const { user, token } = response.data;
            setAuth(user, token);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card card">
                <div className="login-header">
                    <div className="logo-box">
                        <ShieldCheck size={32} />
                    </div>
                    <h1>CarePlatform</h1>
                    <p>Login to access the clinical portal</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="form-group">
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            placeholder="doctor@hospital.com"
                        />
                        {errors.email && <span className="error-text">{errors.email.message as string}</span>}
                    </div>

                    <div className="form-group">
                        <label><Lock size={16} /> Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            placeholder="••••••••"
                        />
                        {errors.password && <span className="error-text">{errors.password.message as string}</span>}
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? <Loader2 className="spinner" /> : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register">Create one</Link></p>
                    <p>Contact compliance for account access</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
