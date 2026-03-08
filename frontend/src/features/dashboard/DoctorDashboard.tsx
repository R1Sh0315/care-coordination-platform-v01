import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    ChevronRight,
    Clock,
    Activity,
    AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import './Dashboard.css';

interface Appointment {
    _id: string;
    patientId: { name: string; email: string };
    appointmentDate: string;
    duration: number;
    status: string;
    notes?: string;
}

interface Intake {
    _id: string;
    patientId: { name: string; email: string };
    priority: string;
    currentState: string;
    createdAt: string;
}

const DoctorDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [intakes, setIntakes] = useState<Intake[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch today's appointments for this doctor
                const aptRes = await api.get('/clinical/appointments');
                // Backend already filters by doctorId if role is Doctor
                setAppointments(aptRes.data.data.slice(0, 5));

                // Fetch assigned intakes
                const intakeRes = await api.get('/intakes');
                // Backend already filters by assignedDoctor if role is Doctor
                setIntakes(intakeRes.data.data.slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    if (loading) return <div className="loading-placeholder">Loading clinical dashboard...</div>;

    return (
        <div className="dashboard-container">
            <header className="page-header-row">
                <div>
                    <h1>Welcome, Dr. {user?.name.split(' ').pop()}</h1>
                    <p>Clinical overview for today's practice.</p>
                </div>
            </header>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div className="stat-card card" style={{ padding: '20px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                        <Calendar size={24} />
                    </div>
                    <div className="stat-content">
                        <h3 style={{ margin: 0 }}>{appointments.length}</h3>
                        <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--text-secondary)' }}>Appointments Today</p>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '20px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <h3 style={{ margin: 0 }}>{intakes.length}</h3>
                        <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--text-secondary)' }}>Assigned Patients</p>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '20px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3 style={{ margin: 0 }}>{intakes.filter(i => i.priority === 'HIGH' || i.priority === 'EMERGENCY').length}</h3>
                        <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--text-secondary)' }}>High Priority</p>
                    </div>
                </div>
                <div className="stat-card card" style={{ padding: '20px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                        <Activity size={24} />
                    </div>
                    <div className="stat-content">
                        <h3 style={{ margin: 0 }}>98%</h3>
                        <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--text-secondary)' }}>Compliance Rate</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                <section className="dashboard-section card" style={{ padding: '24px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Upcoming Appointments</h2>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/appointments')}>View All <ChevronRight size={16} /></button>
                    </div>
                    <div className="list-items">
                        {appointments.length === 0 ? (
                            <p className="no-data">No appointments scheduled for today.</p>
                        ) : (
                            appointments.map(apt => (
                                <div key={apt._id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{apt.patientId?.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85em', color: 'var(--text-secondary)' }}>{apt.notes || 'General Checkup'}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 600 }}>{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>{apt.status}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="dashboard-section card" style={{ padding: '24px' }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Patients Under Review</h2>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/triage')}>Triage Queue <ChevronRight size={16} /></button>
                    </div>
                    <div className="list-items">
                        {intakes.length === 0 ? (
                            <p className="no-data">No intakes assigned to you.</p>
                        ) : (
                            intakes.map(intake => (
                                <div key={intake._id} className="list-item" style={{ padding: '15px 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => navigate(`/intake/${intake._id}`)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <h4 style={{ margin: 0 }}>{intake.patientId?.name}</h4>
                                        <span className={`badge ${intake.priority === 'HIGH' || intake.priority === 'EMERGENCY' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.7em' }}>
                                            {intake.priority}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                                        <span>Status: {intake.currentState}</span>
                                        <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> {new Date(intake.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DoctorDashboard;
