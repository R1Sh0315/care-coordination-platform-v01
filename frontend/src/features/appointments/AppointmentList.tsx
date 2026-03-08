import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Stethoscope, Clock, Calendar, AlertCircle, PlusCircle } from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import './Appointment.css';

interface Appointment {
    _id: string;
    patientId: { name: string; email: string };
    doctorId: { name: string; email: string };
    appointmentDate: string;
    duration: number;
    status: string;
    notes?: string;
}

const AppointmentList: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/clinical/appointments');
            setAppointments(response.data.data);
        } catch (err) {
            console.error('Failed to fetch appointments', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'SCHEDULED': return 'badge-info';
            case 'COMPLETED': return 'badge-success';
            case 'CANCELLED': return 'badge-danger';
            case 'NO_SHOW': return 'badge-warning';
            default: return 'badge-neutral';
        }
    };

    return (
        <div className="page-header-row">
            <div>
                <h1>Appointments</h1>
                <p>Manage your upcoming and past consultations</p>
            </div>

            {(user?.role === 'Patient' || user?.role === 'Admin' || user?.role === 'Receptionist') && (
                <Link to="/appointments/book" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    <PlusCircle size={18} /> Book New
                </Link>
            )}

            <div className="appointment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', width: '100%', marginTop: '24px' }}>
                {loading ? (
                    <div className="loading-placeholder">Loading appointments...</div>
                ) : appointments.length === 0 ? (
                    <div className="empty-state card" style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center' }}>
                        <AlertCircle size={48} />
                        <p>No appointments found.</p>
                    </div>
                ) : (
                    appointments.map((apt: Appointment) => (
                        <div key={apt._id} className="appointment-card card" style={{ padding: '24px', transition: 'transform 0.2s ease' }}>
                            <div className="appointment-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
                                    <Calendar size={18} />
                                    <span>{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                                </div>
                                <span className={`badge ${getStatusClass(apt.status)}`}>{apt.status}</span>
                            </div>

                            <div className="appointment-body" style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    {user?.role === 'Patient' ? (
                                        <><Stethoscope size={18} color="var(--accent)" /> <strong>Dr. {apt.doctorId?.name}</strong></>
                                    ) : (
                                        <><User size={18} color="var(--accent)" /> <strong>{apt.patientId?.name}</strong></>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9em', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    <Clock size={16} />
                                    <span>{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({apt.duration} min)</span>
                                </div>

                                {apt.notes && (
                                    <div style={{ background: 'var(--background)', padding: '12px', borderRadius: '8px', fontSize: '0.85em', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        "{apt.notes}"
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AppointmentList;
