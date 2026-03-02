import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, AlertCircle, Clock } from 'lucide-react';
import api from '../../api/axios';
import './Intake.css';

interface Intake {
    _id: string;
    patientId: { name: string; email: string };
    symptoms: string[];
    priority: string;
    currentState: string;
    createdAt: string;
}

const IntakeList: React.FC = () => {
    const [intakes, setIntakes] = useState<Intake[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchIntakes();
    }, []);

    const fetchIntakes = async () => {
        try {
            const response = await api.get('/intakes');
            setIntakes(response.data.data);
        } catch (err) {
            console.error('Failed to fetch intakes', err);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'badge-danger';
            case 'MEDIUM': return 'badge-warning';
            case 'LOW': return 'badge-success';
            default: return 'badge-neutral';
        }
    };

    return (
        <div className="page-header-row">
            <div>
                <h1>Intake Queue</h1>
                <p>Manage new patient registrations and preliminary symptoms</p>
            </div>
            <button className="btn-primary btn" onClick={() => navigate('/intake/new')}>
                <Plus size={20} /> New Intake
            </button>

            <div className="intake-grid">
                {loading ? (
                    <div className="loading-placeholder">Loading intake records...</div>
                ) : intakes.length === 0 ? (
                    <div className="empty-state card">
                        <AlertCircle size={48} />
                        <p>No intake records found.</p>
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
                                    {intake.symptoms.length > 3 && <span>+{intake.symptoms.length - 3} more</span>}
                                </div>
                            </div>

                            <div className="intake-card-footer">
                                <Clock size={16} />
                                <span>{new Date(intake.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default IntakeList;
