import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    Calendar,
    ClipboardList,
    FlaskConical,
    ShieldCheck,
    LogOut
} from 'lucide-react';
import { useAuthStore, UserRole } from '../../store/authStore';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuthStore();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: Object.values(UserRole) },
        { name: 'Intake Queue', path: '/intake', icon: <ClipboardList size={20} />, roles: [UserRole.Admin, UserRole.Receptionist, UserRole.Nurse] },
        { name: 'Triage Queue', path: '/triage', icon: <Stethoscope size={20} />, roles: [UserRole.Admin, UserRole.Nurse, UserRole.Doctor] },
        { name: 'Appointments', path: '/appointments', icon: <Calendar size={20} />, roles: [UserRole.Admin, UserRole.Receptionist, UserRole.Doctor, UserRole.Nurse] },
        { name: 'Treatment Plans', path: '/treatments', icon: <Users size={20} />, roles: [UserRole.Admin, UserRole.Doctor, UserRole.Nurse] },
        { name: 'Lab Workflow', path: '/labs', icon: <FlaskConical size={20} />, roles: [UserRole.Admin, UserRole.Doctor, UserRole.LabTechnician] },
        { name: 'Audit Logs', path: '/audit', icon: <ShieldCheck size={20} />, roles: [UserRole.Admin, UserRole.ComplianceOfficer] },
    ];

    const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <ShieldCheck className="brand-icon" />
                <span>CarePlatform</span>
            </div>

            <nav className="sidebar-nav">
                {filteredMenu.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
