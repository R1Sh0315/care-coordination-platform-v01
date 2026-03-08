import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AlertCircle, Clock, Activity } from 'lucide-react';
import api from '../../api/axios';
import '../intake/Intake.css';

interface Intake {
    _id: string;
    patientId: { name: string; email: string };
    symptoms: string[];
    priority: string;
    currentState: string;
    vitals: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
    };
    createdAt: string;
}

const TriageList: React.FC = () => {
    const [intakes, setIntakes] = useState<Intake[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTriageQueue();
    }, []);

    const fetchTriageQueue = async () => {
        try {
            // We want intakes that are either READY_FOR_TRIAGE or already TRIAGED that need attention
            const response = await api.get('/intakes');
            const data = response.data.data.filter((i: Intake) =>
                ['READY_FOR_TRIAGE', 'TRIAGED'].includes(i.currentState)
            );
            setIntakes(data);
        } catch (err) {
            console.error('Failed to fetch triage queue', err);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityClass = (priority: string) => {
        switch (priority?.toUpperCase()) {
            case 'EMERGENCY':
            case 'HIGH':
                return 'badge-danger';
            case 'URGENT':
            case 'MEDIUM':
                return 'badge-warning';
            case 'ROUTINE':
            case 'LOW':
                return 'badge-success';
            default:
                return 'badge-neutral';
        }
    };

    return (
        <div className="page-header-row">
            <div>
                <h1>Triage Queue</h1>
                <p>Prioritize and perform clinical evaluations for incoming patients</p>
            </div>

            <div className="intake-grid">
                {loading ? (
                    <div className="loading-placeholder">Loading triage queue...</div>
                ) : intakes.length === 0 ? (
                    <div className="empty-state card">
                        <AlertCircle size={48} />
                        <p>No patients currently waiting for triage.</p>
                    </div>
                ) : (
                    intakes.map(intake => (
                        <div key={intake._id} className="intake-card card" onClick={() => navigate(`/intake/${intake._id}`)}>
                            <div className="intake-card-header">
                                <span className={`badge ${getPriorityClass(intake.priority)}`}>
                                    {intake.priority || 'UNASSIGNED'}
                                </span>
                                <span className="badge badge-info">{intake.currentState}</span>
                            </div>

                            <div className="intake-card-body">
                                <div className="patient-info">
                                    <User size={18} />
                                    <h3>{intake.patientId?.name || 'Unknown Patient'}</h3>
                                </div>
                                <div className="symptoms-list">
                                    {intake.symptoms.slice(0, 3).map((s, i) => (
                                        <span key={i} className="symptom-tag">{s}</span>
                                    ))}
                                    {intake.symptoms.length > 3 && <span className="symptom-tag">+{intake.symptoms.length - 3} more</span>}
                                </div>

                                {intake.vitals && (
                                    <div className="vitals-summary" style={{ marginTop: '10px', fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                                        <Activity size={14} style={{ display: 'inline', marginRight: '5px' }} />
                                        <span>BP: {intake.vitals.bloodPressure || '-'} | HR: {intake.vitals.heartRate || '-'} | Temp: {intake.vitals.temperature || '-'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="intake-card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Clock size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                    <span>{new Date(intake.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <span style={{ color: 'var(--primary-color)', fontSize: '0.9em', fontWeight: 600 }}>Evaluate →</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TriageList;
