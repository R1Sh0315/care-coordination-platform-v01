import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore, UserRole } from '../../store/authStore';
import './LabList.css';

interface LabOrder {
    _id: string;
    testName: string;
    status: string;
    orderedAt: string;
    patientId: {
        _id: string;
        name: string;
        email: string;
    };
    orderedByDoctor: {
        name: string;
    };
    labTechnician?: {
        name: string;
    };
    resultsData?: any;
    resultDocumentUrl?: string;
}

const LabList: React.FC = () => {
    const [orders, setOrders] = useState<LabOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, user } = useAuthStore();

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/clinical/labs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data.data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch lab orders');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/clinical/labs/${id}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'ORDERED': return 'badge-ordered';
            case 'SAMPLE_COLLECTED': return 'badge-collected';
            case 'PROCESSING': return 'badge-processing';
            case 'RESULTS_UPLOADED': return 'badge-uploaded';
            case 'REVIEWED': return 'badge-reviewed';
            default: return 'badge-default';
        }
    };

    if (loading) return <div className="loading">Loading Lab Orders...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="lab-container">
            <header className="lab-header">
                <h1>Lab Management</h1>
                <p>Track and manage all laboratory diagnostic orders.</p>
            </header>

            <div className="lab-grid">
                {orders.length === 0 ? (
                    <div className="no-data">No lab orders found.</div>
                ) : (
                    <table className="lab-table">
                        <thead>
                            <tr>
                                <th>Test Name</th>
                                <th>Patient</th>
                                <th>Ordered By</th>
                                <th>Ordered At</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td><strong>{order.testName}</strong></td>
                                    <td>
                                        <div className="patient-info">
                                            <span>{order.patientId?.name || 'N/A'}</span>
                                            <small>{order.patientId?.email}</small>
                                        </div>
                                    </td>
                                    <td>Dr. {order.orderedByDoctor?.name}</td>
                                    <td>{new Date(order.orderedAt).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {(user?.role === UserRole.Admin || user?.role === UserRole.LabTechnician) ? (
                                                <>
                                                    {order.status === 'ORDERED' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(order._id, 'PROCESSING')}
                                                            className="btn-process"
                                                        >
                                                            Start Processing
                                                        </button>
                                                    )}
                                                    {order.status === 'PROCESSING' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(order._id, 'RESULTS_UPLOADED')}
                                                            className="btn-upload"
                                                        >
                                                            Complete & Upload
                                                        </button>
                                                    )}
                                                </>
                                            ) : null}
                                            
                                            {user?.role === UserRole.Doctor && order.status === 'RESULTS_UPLOADED' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(order._id, 'REVIEWED')}
                                                    className="btn-review"
                                                >
                                                    Mark Reviewed
                                                </button>
                                            )}

                                            <button className="btn-view">View Details</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LabList;
