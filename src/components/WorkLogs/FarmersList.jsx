import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FarmersList.css';
import { getFarmerDueAmount, getFarmerWorkLogs, getOwnerId } from '../../services/Api';

const FarmersList = ({ farmers }) => {
    const [farmerLogs, setFarmerLogs] = useState({});
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [dueAmounts, setDueAmounts] = useState({});
    const ownerId = getOwnerId();

    useEffect(() => {
        farmers.forEach(farmer => {
            fetchDueAmount(farmer.id);
        });
    }, [farmers]);

    const fetchDueAmount = async (farmerId) => {
        try {
            const amount = await getFarmerDueAmount(farmerId, ownerId);
            setDueAmounts(prev => ({
                ...prev,
                [farmerId]: amount
            }));
        } catch (error) {
            console.error('Error fetching due amount:', error);
        }
    };

    const fetchFarmerLogs = async (farmerId) => {
        try {
            const data = await getFarmerWorkLogs(farmerId, ownerId);
            setFarmerLogs(prev => ({
                ...prev,
                [farmerId]: data
            }));
            setSelectedFarmer(farmerId === selectedFarmer ? null : farmerId);
        } catch (error) {
            console.error('Error fetching farmer logs:', error);
        }
    };

    return (
        <div className="farmers-list">
            <h2>Farmers List</h2>
            <div className="farmers-grid">
                {farmers.map(farmer => (
                    <motion.div
                        key={farmer.id}
                        className="farmer-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                    >
                        <div className="farmer-info">
                            <h3>{farmer.name}</h3>
                            <div className="due-amount">
                                Due Amount: ₹{dueAmounts[farmer.id] || 0}
                            </div>
                        </div>
                        
                        <button 
                            className="view-logs-btn"
                            onClick={() => fetchFarmerLogs(farmer.id)}
                        >
                            {selectedFarmer === farmer.id ? 'Hide Logs' : 'View Logs'}
                        </button>

                        <AnimatePresence>
                            {selectedFarmer === farmer.id && farmerLogs[farmer.id] && (
                                <motion.div
                                    className="logs-container"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    <table className="logs-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Task</th>
                                                <th>Area</th>
                                                <th>Amount Paid</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {farmerLogs[farmer.id].map(log => (
                                                <tr key={log.id}>
                                                    <td>{new Date(log.taskDate).toLocaleDateString()}</td>
                                                    <td>{log.tractorOwnerTask.taskName}</td>
                                                    <td>{log.area} acres</td>
                                                    <td>₹{log.amountPaid}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FarmersList; 