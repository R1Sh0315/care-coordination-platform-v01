import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChevronRight, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore, UserRole } from '../../store/authStore';

const IntakeDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [intake, setIntake] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [transitioning, setTransitioning] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        fetchIntake();
    }, [id]);

    const fetchIntake = async () => {
        try {
            const response = await api.get(`/intakes/${id}`);
            setIntake(response.data.data);
        } catch (err) {
            console.error('Failed to fetch intake details', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTransition = async (targetState: string) => {
        setTransitioning(true);
        try {
            await api.patch(`/intakes/${id}/transition`, { targetState });
            await fetchIntake();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Transition failed. Check clinical requirements.');
        } finally {
            setTransitioning(false);
        }
    };

    if (loading) return <div className="loading">Loading details...</div>;
    if (!intake) return <div>Record not found.</div>;

    return (
        <div className="detail-page">
            <div className="page-header-row">
                <button onClick={() => navigate('/intake')} className="btn-secondary btn">
                    <ArrowLeft size={20} /> Back to Queue
                </button>
                <div className="header-status">
                    <span className="badge badge-info">{intake.currentState}</span>
                </div>
            </div>

            <div className="detail-layout">
                <div className="main-info">
                    <section className="card detail-card">
                        <div className="card-header">
                            <h2>Patient Information</h2>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Full Name</label>
                                <p>{intake.patientId?.name}</p>
                            </div>
                            <div className="info-item">
                                <label>Email</label>
                                <p>{intake.patientId?.email}</p>
                            </div>
                            <div className="info-item">
                                <label>Clinical Priority</label>
                                <span className={`badge ${intake.priority === 'HIGH' ? 'badge-danger' : 'badge-success'}`}>
                                    {intake.priority || 'PENDING'}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="card detail-card">
                        <div className="card-header">
                            <h2>Symptoms & Vitals</h2>
                        </div>
                        <div className="symptoms-tags">
                            {intake.symptoms.map((s: string, i: number) => (
                                <span key={i} className="symptom-tag">{s}</span>
                            ))}
                        </div>
                        <div className="vitals-display">
                            <div className="vital-box">
                                <label>BP</label>
                                <p>{intake.vitals?.bloodPressure || '--'}</p>
                            </div>
                            <div className="vital-box">
                                <label>Heart Rate</label>
                                <p>{intake.vitals?.heartRate ? `${intake.vitals.heartRate} BPM` : '--'}</p>
                            </div>
                            <div className="vital-box">
                                <label>Temp</label>
                                <p>{intake.vitals?.temperature ? `${intake.vitals.temperature}°F` : '--'}</p>
                            </div>
                        </div>
                    </section>

                    <section className="card detail-card workflow-actions">
                        <div className="card-header">
                            <h2>Available Actions</h2>
                        </div>
                        <div className="action-buttons">
                            {intake.currentState === 'DRAFT' && (user?.role === UserRole.Receptionist || user?.role === UserRole.Admin) && (
                                <button className="btn btn-primary" onClick={() => handleTransition('SUBMITTED')} disabled={transitioning}>
                                    {transitioning ? <Loader2 className="spinner" /> : 'Submit Intake'}
                                </button>
                            )}
                            {intake.currentState === 'SUBMITTED' && (user?.role === UserRole.Receptionist || user?.role === UserRole.Admin) && (
                                <button className="btn btn-primary" onClick={() => handleTransition('TRIAGE_PENDING')} disabled={transitioning}>
                                    {transitioning ? <Loader2 className="spinner" /> : 'Send to Triage'}
                                </button>
                            )}
                            {intake.currentState === 'TRIAGE_PENDING' && (user?.role === UserRole.Nurse || user?.role === UserRole.Admin) && (
                                <button className="btn btn-primary" onClick={() => handleTransition('TRIAGED')} disabled={transitioning}>
                                    {transitioning ? <Loader2 className="spinner" /> : 'Complete Triage'}
                                </button>
                            )}
                            {intake.currentState === 'TRIAGED' && (user?.role === UserRole.Nurse || user?.role === UserRole.Admin) && (
                                <button className="btn btn-primary" onClick={() => handleTransition('ASSIGNED_TO_DOCTOR')} disabled={transitioning}>
                                    {transitioning ? <Loader2 className="spinner" /> : 'Assign to Doctor'}
                                </button>
                            )}
                            {/* More transitions could follow same pattern */}
                            <p className="hint">Action availability depends on current state and user role.</p>
                        </div>
                    </section>
                </div>

                <div className="sidebar-info">
                    <section className="card detail-card history-card">
                        <div className="card-header">
                            <Clock size={18} />
                            <h2>Activity History</h2>
                        </div>
                        <div className="timeline">
                            {intake.stateHistory.map((entry: any, i: number) => (
                                <div key={i} className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <p className="transition-text">
                                            <strong>{entry.fromState}</strong> <ChevronRight size={14} /> <strong>{entry.toState}</strong>
                                        </p>
                                        <span className="timeline-date">{new Date(entry.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="timeline-item current">
                                <div className="timeline-marker active"></div>
                                <div className="timeline-content">
                                    <p className="transition-text">Initially Created (DRAFT)</p>
                                    <span className="timeline-date">{new Date(intake.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default IntakeDetail;
