import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const CreateIntake: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                symptoms: data.symptoms.split(',').map((s: string) => s.trim()),
                vitals: {
                    bloodPressure: data.bloodPressure,
                    heartRate: parseInt(data.heartRate),
                    temperature: parseFloat(data.temperature),
                }
            };
            await api.post('/intakes', payload);
            navigate('/intake');
        } catch (err) {
            console.error('Failed to create intake', err);
            alert('Failed to save intake. Check if patient ID is valid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <div className="page-header-row">
                <button onClick={() => navigate('/intake')} className="btn-secondary btn">
                    <ArrowLeft size={20} /> Back
                </button>
                <h1>New Patient Intake</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card form-card">
                <div className="form-section">
                    <h2>Patient Identification</h2>
                    <div className="form-group-row">
                        <div className="form-group flex-1">
                            <label>Patient User ID (MongoID)</label>
                            <input
                                {...register('patientId', { required: 'Patient ID is required' })}
                                placeholder="60d21b4667d0d899..."
                            />
                            {errors.patientId && <span className="error-text">{errors.patientId.message as string}</span>}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Clinical Symptoms</h2>
                    <div className="form-group">
                        <label>Symptoms (comma separated)</label>
                        <textarea
                            {...register('symptoms', { required: 'Please enter at least one symptom' })}
                            placeholder="Fever, Cough, Difficulty Breathing"
                        />
                        {errors.symptoms && <span className="error-text">{errors.symptoms.message as string}</span>}
                    </div>
                </div>

                <div className="form-section">
                    <h2>Vitals (Preliminary)</h2>
                    <div className="form-group-grid">
                        <div className="form-group">
                            <label>Blood Pressure</label>
                            <input {...register('bloodPressure')} placeholder="120/80" />
                        </div>
                        <div className="form-group">
                            <label>Heart Rate (BPM)</label>
                            <input type="number" {...register('heartRate')} placeholder="72" />
                        </div>
                        <div className="form-group">
                            <label>Temperature (°F)</label>
                            <input type="number" step="0.1" {...register('temperature')} placeholder="98.6" />
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <Loader2 className="spinner" /> : <><Save size={20} /> Save & Submit</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateIntake;
