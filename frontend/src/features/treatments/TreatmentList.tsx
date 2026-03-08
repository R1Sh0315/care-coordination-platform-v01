import React, { useEffect, useState } from 'react';
import {
    Activity,
    Pill,
    ChevronRight,
    PlusCircle,
    User,
    FileText,
    X,
    Plus,
    Trash2,
    Save,
    ClipboardList,
    AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import '../dashboard/Dashboard.css';

interface TreatmentPlan {
    _id: string;
    patientId: { _id: string, name: string; email: string };
    diagnoses: string[];
    medications: { name: string; dosage: string; isControlled: boolean }[];
    labTests: string[];
    procedures: string[];
    currentState: string;
    version: number;
    createdBy: { name: string };
    updatedAt: string;
    createdAt: string;
}

interface Patient {
    _id: string;
    name: string;
    email: string;
}

const TreatmentList: React.FC = () => {
    const { user } = useAuthStore();
    const [plans, setPlans] = useState<TreatmentPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [now, setNow] = useState(new Date());

    // Modal & Drawer State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);

    // Form State
    const [newPlan, setNewPlan] = useState({
        patientId: '',
        diagnoses: [] as string[],
        medications: [] as { name: string; dosage: string; isControlled: boolean }[],
        labTests: [] as string[],
        procedures: [] as string[]
    });
    const [tempDiagnosis, setTempDiagnosis] = useState('');

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

    const fetchPatients = async () => {
        try {
            const res = await api.get('/admin/users');
            const patientUsers = res.data.data.filter((u: any) => u.role === 'Patient');
            setPatients(patientUsers);
        } catch (err) {
            console.error('Failed to fetch patients', err);
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

    useEffect(() => {
        if (isCreateModalOpen) fetchPatients();
    }, [isCreateModalOpen]);

    const getStateBadgeClass = (state: string) => {
        switch (state) {
            case 'ACTIVE': return 'badge-success';
            case 'DRAFT': return 'badge-neutral';
            case 'APPROVED': return 'badge-info';
            case 'MODIFIED': return 'badge-warning';
            case 'CLOSED': return 'badge-neutral';
            default: return 'badge-neutral';
        }
    };

    const handleCreatePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/clinical/treatments', newPlan);
            setIsCreateModalOpen(false);
            setNewPlan({
                patientId: '',
                diagnoses: [],
                medications: [],
                labTests: [],
                procedures: []
            });
            fetchPlans();
        } catch (err) {
            console.error('Failed to create plan', err);
            alert('Failed to create treatment plan. Ensure all fields are valid.');
        }
    };

    const handleTransition = async (planId: string, targetState: string) => {
        try {
            await api.patch(`/clinical/treatments/${planId}/transition`, { targetState });
            fetchPlans(false);
            // Update selected plan if drawer is open
            if (selectedPlan?._id === planId) {
                const res = await api.get('/clinical/treatments');
                const updated = res.data.data.find((p: any) => p._id === planId);
                setSelectedPlan(updated);
            }
        } catch (err) {
            console.error('Transition failed', err);
        }
    };

    const addMedication = () => {
        setNewPlan({
            ...newPlan,
            medications: [...newPlan.medications, { name: '', dosage: '', isControlled: false }]
        });
    };

    const removeMedication = (index: number) => {
        const updated = [...newPlan.medications];
        updated.splice(index, 1);
        setNewPlan({ ...newPlan, medications: updated });
    };

    if (loading) return <div className="loading-placeholder">Loading clinical pathways...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Clinical Pathways</h1>
                    <p>Dynamic care coordination and treatment management.</p>
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
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsCreateModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                        >
                            <PlusCircle size={20} /> Create Plan
                        </button>
                    )}
                </div>
            </header>

            <div className="treatment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                {plans.length === 0 ? (
                    <div className="card" style={{ gridColumn: '1/-1', padding: '80px', textAlign: 'center', background: 'white' }}>
                        <FileText size={64} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                        <h3 style={{ color: 'var(--text-muted)' }}>No treatment plans found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Create a new plan to start coordinate care for your patients.</p>
                    </div>
                ) : (
                    plans.map(plan => (
                        <div
                            key={plan._id}
                            className="card treatment-card"
                            style={{
                                padding: '28px',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'white',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                border: '1px solid var(--border)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <span className={`badge ${getStateBadgeClass(plan.currentState)}`} style={{ padding: '6px 12px', borderRadius: '8px' }}>
                                    {plan.currentState} v{plan.version}
                                </span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    {new Date(plan.updatedAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'var(--accent-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={24} color="var(--accent)" />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{plan.patientId?.name}</h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Clinical lead: {plan.createdBy?.name}</p>
                                    </div>
                                </div>

                                <div className="diagnoses" style={{ marginBottom: '20px' }}>
                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                                        <Activity size={18} /> Diagnoses
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {plan.diagnoses.map((d, i) => (
                                            <span key={i} style={{ padding: '6px 14px', background: 'var(--bg-secondary)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500 }}>{d}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="medications" style={{ marginBottom: '28px' }}>
                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                                        <Pill size={18} /> Medications
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {plan.medications.slice(0, 3).map((m, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '10px 14px', background: 'var(--background)', borderRadius: '10px', borderLeft: '4px solid ' + (m.isControlled ? 'var(--danger)' : 'var(--success)') }}>
                                                <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {m.isControlled && <AlertCircle size={14} color="var(--danger)" />} {m.name}
                                                </strong>
                                                <span style={{ color: 'var(--text-muted)' }}>{m.dosage}</span>
                                            </div>
                                        ))}
                                        {plan.medications.length > 3 && (
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '4px 0' }}>+ {plan.medications.length - 3} more medications</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    onClick={() => setSelectedPlan(plan)}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent)', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                    Open Pathway <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Plan Modal */}
            {isCreateModalOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="modal-content card" style={{ width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative', animation: 'slideIn 0.3s ease-out' }}>
                        <button onClick={() => setIsCreateModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--accent-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ClipboardList size={24} color="var(--accent)" />
                            </div>
                            <h2 style={{ margin: 0 }}>Establish Care Pathway</h2>
                        </div>

                        <form onSubmit={handleCreatePlan} className="create-plan-form">
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--primary)' }}>Target Patient</label>
                                <select
                                    required
                                    value={newPlan.patientId}
                                    onChange={(e) => setNewPlan({ ...newPlan, patientId: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)', fontSize: '1rem' }}
                                >
                                    <option value="">Select a patient...</option>
                                    {patients.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--primary)' }}>Diagnoses</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <input
                                        type="text"
                                        value={tempDiagnosis}
                                        onChange={(e) => setTempDiagnosis(e.target.value)}
                                        placeholder="Add diagnosis e.g. Hypertension"
                                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (tempDiagnosis) {
                                                setNewPlan({ ...newPlan, diagnoses: [...newPlan.diagnoses, tempDiagnosis] });
                                                setTempDiagnosis('');
                                            }
                                        }}
                                        style={{ padding: '0 16px', borderRadius: '10px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 600 }}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {newPlan.diagnoses.map((d, i) => (
                                        <span key={i} style={{ padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {d} <X size={14} style={{ cursor: 'pointer' }} onClick={() => {
                                                const updated = [...newPlan.diagnoses];
                                                updated.splice(i, 1);
                                                setNewPlan({ ...newPlan, diagnoses: updated });
                                            }} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label style={{ margin: 0, fontWeight: 600, color: 'var(--primary)' }}>Medication Protocol</label>
                                    <button type="button" onClick={addMedication} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Plus size={16} /> Add Med
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {newPlan.medications.map((m, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '10px', padding: '16px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            <input
                                                placeholder="Med Name"
                                                value={m.name}
                                                onChange={(e) => {
                                                    const updated = [...newPlan.medications];
                                                    updated[i].name = e.target.value;
                                                    setNewPlan({ ...newPlan, medications: updated });
                                                }}
                                                style={{ flex: 2, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                                            />
                                            <input
                                                placeholder="Dosage"
                                                value={m.dosage}
                                                onChange={(e) => {
                                                    const updated = [...newPlan.medications];
                                                    updated[i].dosage = e.target.value;
                                                    setNewPlan({ ...newPlan, medications: updated });
                                                }}
                                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
                                            />
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={m.isControlled}
                                                    onChange={(e) => {
                                                        const updated = [...newPlan.medications];
                                                        updated[i].isControlled = e.target.checked;
                                                        setNewPlan({ ...newPlan, medications: updated });
                                                    }}
                                                /> Controlled
                                            </label>
                                            <button type="button" onClick={() => removeMedication(i)} style={{ color: 'var(--danger)', background: 'none', border: 'none' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', gap: '16px' }}>
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', border: 'none', fontWeight: 600 }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Save size={20} /> Authorize Treatment Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pathway Drawer (Side Panel) */}
            {selectedPlan && (
                <>
                    <div className="drawer-overlay" onClick={() => setSelectedPlan(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, backdropFilter: 'blur(2px)' }}></div>
                    <div className="drawer-content card" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '90%', maxWidth: '500px', background: 'white', zIndex: 1001, padding: '40px', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', animation: 'slideRight 0.3s ease-out' }}>
                        <button onClick={() => setSelectedPlan(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={28} />
                        </button>

                        <div style={{ marginBottom: '40px' }}>
                            <span className={`badge ${getStateBadgeClass(selectedPlan.currentState)}`} style={{ marginBottom: '16px', display: 'inline-block' }}>
                                {selectedPlan.currentState}
                            </span>
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>Recovery Pathway</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Patient Case: {selectedPlan.patientId?.name}</p>
                        </div>

                        <div className="drawer-sections" style={{ display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
                            <section>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '16px' }}>Clinical Status Transition</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                    <button
                                        disabled={selectedPlan.currentState === 'ACTIVE'}
                                        onClick={() => handleTransition(selectedPlan._id, 'ACTIVE')}
                                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: selectedPlan.currentState === 'ACTIVE' ? 'var(--success)' : 'white', color: selectedPlan.currentState === 'ACTIVE' ? 'white' : 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Activate Plan
                                    </button>
                                    <button
                                        disabled={selectedPlan.currentState === 'REVIEW'}
                                        onClick={() => handleTransition(selectedPlan._id, 'REVIEW')}
                                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: selectedPlan.currentState === 'REVIEW' ? 'var(--accent)' : 'white', color: selectedPlan.currentState === 'REVIEW' ? 'white' : 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Send for Review
                                    </button>
                                    <button
                                        disabled={selectedPlan.currentState === 'APPROVED'}
                                        onClick={() => handleTransition(selectedPlan._id, 'APPROVED')}
                                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: selectedPlan.currentState === 'APPROVED' ? 'var(--info)' : 'white', color: selectedPlan.currentState === 'APPROVED' ? 'white' : 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Approve Plan
                                    </button>
                                    <button
                                        disabled={selectedPlan.currentState === 'CLOSED'}
                                        onClick={() => handleTransition(selectedPlan._id, 'CLOSED')}
                                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', color: 'var(--danger)', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Close Case
                                    </button>
                                </div>
                            </section>

                            <section>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '16px' }}>Full Medication Schedule</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {selectedPlan.medications.map((m, i) => (
                                        <div key={i} className="protocol-item" style={{ padding: '16px', background: 'var(--background)', borderRadius: '14px', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {m.name} {m.isControlled && <AlertCircle size={16} color="var(--danger)" />}
                                                </strong>
                                                <span className="badge-neutral" style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>{m.dosage}</span>
                                            </div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" /> Mark as administered
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '16px' }}>Timeline</h4>
                                <div style={{ borderLeft: '2px solid var(--border)', marginLeft: '10px', paddingLeft: '20px' }}>
                                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                                        <div style={{ position: 'absolute', left: '-27px', top: '5px', width: '12px', height: '12px', background: 'var(--success)', borderRadius: '50%' }}></div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Created Pathway</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(selectedPlan.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-27px', top: '5px', width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Last Clinical Sync</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(selectedPlan.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                            <button
                                disabled
                                className="btn-secondary"
                                style={{ width: '100%', padding: '16px', borderRadius: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: 0.6, cursor: 'not-allowed' }}
                            >
                                <FileText size={20} /> Generate Patient Brief (Coming Soon)
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TreatmentList;
