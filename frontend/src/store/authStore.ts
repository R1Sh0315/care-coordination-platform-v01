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
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
