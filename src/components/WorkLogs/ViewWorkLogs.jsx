import React, { useState, useEffect } from 'react';
import { getFarmerWorkLogs, getOwnerId } from '../../services/Api';
import './ViewWorkLogs.css';

const ViewWorkLogs = ({ farmer, onClose, showOnlyFarmerLogs = false, handleAction }) => {
    const [workLogs, setWorkLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const ownerId = getOwnerId();

    useEffect(() => {
        if (farmer && showOnlyFarmerLogs) {
            loadFarmerLogs();
        }
    }, [farmer]);

    const loadFarmerLogs = async () => {
        try {
            setLoading(true);
            const logs = await getFarmerWorkLogs(farmer.id, ownerId);
            setWorkLogs(logs || []);
        } catch (error) {
            setError("Failed to load work logs");
            console.error("Error loading work logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTaskName = (log) => {
        // Try different possible properties where task name might be stored
        return log.taskName || log.task?.name || log.task || "N/A";
    };

    if (loading) {
        return <div className="loading">Loading work logs...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="work-logs-container">
            {workLogs.length > 0 ? (
                <div className="work-logs-table-wrapper">
                    <table className="work-logs-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Task Name</th>
                                <th>Area (acres)</th>
                                <th>Amount Paid (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>{formatDate(log.taskDate || log.date)}</td>
                                    <td>{getTaskName(log)}</td>
                                    <td className="text-right">{log.area}</td>
                                    <td className="text-right">₹{log.amountPaid}</td>
                                </tr>
                            ))}
                            <tr className="summary-row">
                                <td colSpan="2"><strong>Total</strong></td>
                                <td className="text-right">
                                    <strong>
                                        {workLogs.reduce((sum, log) => sum + Number(log.area), 0)} acres
                                    </strong>
                                </td>
                                <td className="text-right">
                                    <strong>
                                        ₹{workLogs.reduce((sum, log) => sum + Number(log.amountPaid), 0)}
                                    </strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="no-logs">No work logs found for this farmer</div>
            )}
            
            <div className="actions">
                <button 
                    className="add-log-btn"
                    onClick={() => {
                        onClose();
                        handleAction(farmer, "add");
                    }}
                >
                    Add Work Log
                </button>
                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ViewWorkLogs; 