import React, { useEffect, useState } from 'react';
import {
    Activity,
    Pill,
    ChevronRight,
    PlusCircle,
    User,
    FileText
} from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import '../dashboard/Dashboard.css';

interface TreatmentPlan {
    _id: string;
    patientId: { name: string; email: string };
    diagnoses: string[];
    medications: { name: string; dosage: string; isControlled: boolean }[];
    currentState: string;
    version: number;
    createdBy: { name: string };
    updatedAt: string;
}

const TreatmentList: React.FC = () => {
    const { user } = useAuthStore();
    const [plans, setPlans] = useState<TreatmentPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [now, setNow] = useState(new Date());

    const fetchPlans = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const res = await api.get('/clinical/treatments');
            setPlans(res.data.data);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Failed to fetch treatment plans', err);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
        const refreshInterval = setInterval(() => fetchPlans(false), 60000);
        return () => clearInterval(refreshInterval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getStateBadgeClass = (state: string) => {
        switch (state) {
            case 'ACTIVE': return 'badge-success';
            case 'DRAFT': return 'badge-neutral';
            case 'APPROVED': return 'badge-info';
            case 'MODIFIED': return 'badge-warning';
            default: return 'badge-neutral';
        }
    };

    if (loading) return <div className="loading-placeholder">Loading clinical treatment plans...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Treatment Plans</h1>
                    <p>Establish and manage personalized clinical care pathways.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="header-actions" style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <span className="last-updated">
                            Synced: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    {(user?.role === 'Doctor' || user?.role === 'Admin') && (
                        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                            <PlusCircle size={20} /> Create Plan
                        </button>
                    )}
                </div>
            </header>

            <div className="treatment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {plans.length === 0 ? (
                    <div className="card" style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center' }}>
                        <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                        <p>No treatment plans found.</p>
                    </div>
                ) : (
                    plans.map(plan => (
                        <div key={plan._id} className="card treatment-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span className={`badge ${getStateBadgeClass(plan.currentState)}`}>
                                    {plan.currentState} v{plan.version}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Updated {new Date(plan.updatedAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={20} color="var(--accent)" />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{plan.patientId?.name}</h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Created by {plan.createdBy?.name}</p>
                                    </div>
                                </div>

                                <div className="diagnoses" style={{ marginBottom: '16px' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Activity size={16} /> Diagnoses
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {plan.diagnoses.map((d, i) => (
                                            <span key={i} style={{ padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '6px', fontSize: '0.8rem' }}>{d}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="medications" style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Pill size={16} /> Active Medications
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {plan.medications.map((m, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px', background: 'var(--background)', borderRadius: '8px', borderLeft: m.isControlled ? '3px solid var(--danger)' : '3px solid var(--success)' }}>
                                                <strong>{m.name}</strong>
                                                <span>{m.dosage}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                    Open Pathway <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TreatmentList;
