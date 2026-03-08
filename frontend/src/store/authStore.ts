import { create } from 'zustand';

export const UserRole = {
    Admin: 'Admin',
    Receptionist: 'Receptionist',
    Nurse: 'Nurse',
    Doctor: 'Doctor',
    Specialist: 'Specialist',
    LabTechnician: 'LabTechnician',
    BillingOfficer: 'BillingOfficer',
    ComplianceOfficer: 'ComplianceOfficer',
    Patient: 'Patient',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string, refreshToken?: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token'),

    setAuth: (user, token, refreshToken) => {
        localStorage.setItem('token', token);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
    },
}));
