import React, { useEffect, useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import api from '../../api/axios';
import './Audit.css';

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/clinical/audit/logs');
            setLogs(response.data.data);
        } catch (err) {
            console.error('Failed to fetch audit logs', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="audit-page">
            <div className="page-header-row">
                <div>
                    <h1>Compliance Audit Logs</h1>
                    <p>Read-only immutable trace of all clinical and system actions</p>
                </div>
                <button className="btn btn-secondary">
                    <Download size={20} /> Export CSV
                </button>
            </div>

            <div className="card audit-table-container">
                <div className="table-filters">
                    <div className="search-box">
                        <Search size={18} />
                        <input placeholder="Search logs..." />
                    </div>
                    <button className="btn btn-secondary btn-sm">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                <table className="audit-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Entity</th>
                            <th>Action</th>
                            <th>Performed By</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="loading-cell">Loading audit records...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5} className="empty-cell">No audit records found.</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log._id}>
                                    <td className="date-cell">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>
                                        <span className="entity-label">{log.entityType}</span>
                                        <span className="entity-id">#{log.entityId.substring(log.entityId.length - 6)}</span>
                                    </td>
                                    <td>
                                        <span className="action-tag">{log.action}</span>
                                    </td>
                                    <td>
                                        <div className="performer">
                                            <strong>{log.performedBy?.name}</strong>
                                            <span>{log.performedBy?.role}</span>
                                        </div>
                                    </td>
                                    <td className="ip-cell">{log.ipAddress || 'Internal'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
