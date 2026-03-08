import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import './Appointment.css';

interface Doctor {
    _id: string;
    name: string;
    email: string;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

const BookAppointment: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingSlots, setFetchingSlots] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/clinical/appointments/doctors');
                setDoctors(res.data.data);
            } catch (err) {
                console.error("Failed to load doctors", err);
            }
        };
        fetchDoctors();
    }, []);

    const fetchSlots = async (docId: string, date: string) => {
        if (!docId || !date) return;
        setFetchingSlots(true);
        setError('');
        try {
            const res = await api.get(`/clinical/appointments/availability?doctorId=${docId}&date=${date}`);
            setSlots(res.data.data);
        } catch (err) {
            setError('Could not load availability. Please try again.');
        } finally {
            setFetchingSlots(false);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        if (selectedDoctor) {
            fetchSlots(selectedDoctor, date);
        }
    };

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const docId = e.target.value;
        setSelectedDoctor(docId);
        if (selectedDate) {
            fetchSlots(docId, selectedDate);
        }
    };

    const handleBooking = async () => {
        if (!selectedDoctor || !selectedSlot) return;
        setLoading(true);
        setError('');
        try {
            await api.post('/clinical/appointments', {
                doctorId: selectedDoctor,
                appointmentDate: selectedSlot,
                notes,
                duration: 30
            });
            setSuccess(true);
            setTimeout(() => navigate('/appointments'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Booking failed. Try another slot.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="card" style={{ maxWidth: '500px', margin: '100px auto', padding: '40px', textAlign: 'center' }}>
                <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '20px' }} />
                <h2>Appointment Booked!</h2>
                <p>Redirecting you back to your list...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header-row">
                <h1>Book Appointment</h1>
                <p>Choose your doctor and preferred time slot</p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
                {error && <div className="error-alert" style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

                <div className="form-section">
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}><User size={16} /> Select Doctor</label>
                        <select
                            value={selectedDoctor}
                            onChange={handleDoctorChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        >
                            <option value="">-- Choose Doctor --</option>
                            {doctors.map(doc => <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}><Calendar size={16} /> Preferred Date</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={handleDateChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                    </div>

                    {selectedDate && selectedDoctor && (
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}><Clock size={16} /> Available Slots</label>
                            {fetchingSlots ? (
                                <p>Loading slots...</p>
                            ) : slots.length === 0 ? (
                                <p>No slots available for this day.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                    {slots.map(slot => (
                                        <button
                                            key={slot.time}
                                            disabled={!slot.available}
                                            onClick={() => setSelectedSlot(slot.time)}
                                            style={{
                                                padding: '10px',
                                                border: '1px solid var(--border)',
                                                borderRadius: '6px',
                                                background: selectedSlot === slot.time ? 'var(--accent)' : (slot.available ? 'white' : '#f1f5f9'),
                                                color: selectedSlot === slot.time ? 'white' : (slot.available ? 'inherit' : '#94a3b8'),
                                                fontSize: '0.85em',
                                                cursor: slot.available ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            {new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Reason / Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Briefly describe the reason for visit..."
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', minHeight: '100px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/appointments')}
                            className="btn-secondary"
                            style={{ flex: 1, padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleBooking}
                            disabled={loading || !selectedSlot}
                            className="btn-primary"
                            style={{ flex: 2, padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer' }}
                        >
                            {loading ? 'Booking...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
