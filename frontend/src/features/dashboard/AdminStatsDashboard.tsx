import React, { useEffect, useState } from 'react';
import {
    Users,
    Calendar,
    Activity,
    AlertTriangle,
    Clock,
    TrendingUp,
    Shield
} from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import './Dashboard.css';

interface AdminStats {
    summary: {
        totalPatients: number;
        totalStaff: number;
        pendingTriages: number;
        todaysAppointments: number;
    };
    distributions: {
        users: { _id: string, count: number }[];
        intakes: { _id: string, count: number }[];
        appointments: { _id: string, count: number }[];
    };
    recentActivity: any[];
    priorityAlerts: any[];
}

const AdminStatsDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/admin/stats');
                setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="loading-placeholder">Calculating system metrics...</div>;
    if (!stats) return <div className="error-state">Failed to load dashboard data.</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>System Overview</h1>
                    <p>Welcome back, {user?.name}. Here's what's happening across the platform.</p>
                </div>
                <div className="header-actions">
                    <span className="last-updated">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
            </header>

            {/* Top Summary Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon patient-icon">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.summary.totalPatients}</h3>
                        <p>Registered Patients</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon staff-icon">
                        <Shield size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.summary.totalStaff}</h3>
                        <p>Active Clinical Staff</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon triage-icon">
                        <Activity size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.summary.pendingTriages}</h3>
                        <p>Pending Triages</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon appointment-icon">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.summary.todaysAppointments}</h3>
                        <p>Today's Appointments</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-grid">
                {/* Priority Alerts */}
                <section className="alerts-section card">
                    <div className="section-header">
                        <h2><AlertTriangle size={20} color="var(--danger)" /> Urgent Attention Required</h2>
                    </div>
                    <div className="alert-list">
                        {stats.priorityAlerts.length === 0 ? (
                            <p className="empty-msg">No urgent cases reported.</p>
                        ) : (
                            stats.priorityAlerts.map(alert => (
                                <div key={alert._id} className="alert-item">
                                    <div className="alert-dot"></div>
                                    <div className="alert-content">
                                        <strong>{alert.patientId?.name}</strong>
                                        <span>Status: {alert.currentState}</span>
                                    </div>
                                    <button className="view-btn">Review</button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* System Activity */}
                <section className="activity-section card">
                    <div className="section-header">
                        <h2><Clock size={20} /> System Audit log</h2>
                    </div>
                    <div className="activity-timeline">
                        {stats.recentActivity.map(log => (
                            <div key={log._id} className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-info">
                                    <div className="timeline-time">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="timeline-desc">
                                        <strong>{log.performedBy?.name}</strong> {log.action.replace(/_/g, ' ').toLowerCase()}
                                        <span className="entity-label">{log.entityType}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Distribution Insights */}
                <section className="insights-section card">
                    <div className="section-header">
                        <h2><TrendingUp size={20} /> Platform Load</h2>
                    </div>
                    <div className="distribution-list">
                        <div className="dist-item">
                            <label>Appointment Load</label>
                            <div className="dist-bar-container">
                                {stats.distributions.appointments.map(d => (
                                    <div
                                        key={d._id}
                                        className="dist-segment"
                                        title={`${d._id}: ${d.count}`}
                                        style={{
                                            flex: d.count,
                                            background: d._id === 'SCHEDULED' ? 'var(--accent)' : 'var(--border)'
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <div className="dist-item">
                            <label>Workflow States</label>
                            <div className="dist-bar-container">
                                {stats.distributions.intakes.map(d => (
                                    <div
                                        key={d._id}
                                        className="dist-segment"
                                        title={`${d._id}: ${d.count}`}
                                        style={{
                                            flex: d.count,
                                            background: d._id === 'TRIAGE_PENDING' ? 'var(--warning)' : 'var(--success)'
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminStatsDashboard;
