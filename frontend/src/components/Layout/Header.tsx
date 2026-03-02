import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Bell } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <header className="header">
            <div className="header-search">
                {/* Search capability could go here */}
            </div>

            <div className="header-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role badge-info badge">{user?.role}</span>
                    </div>
                    <div className="user-avatar">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
