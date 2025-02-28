import React, { useState, useEffect } from 'react';
import FarmersList from './FarmersList';
import WorkLogForm from './WorkLogForm';
import './WorkLogs.css';
import { getFarmersByTractorOwner, getOwnerId } from '../../services/Api';

const WorkLogs = () => {
    const [farmers, setFarmers] = useState([]);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const ownerId = getOwnerId();

    useEffect(() => {
        if (ownerId) {
            fetchFarmers();
        }
    }, [ownerId]);

    const fetchFarmers = async () => {
        try {
            const data = await getFarmersByTractorOwner(ownerId);
            setFarmers(data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
        }
    };

    const handleWorkLogAdded = (newFarmer) => {
        if (newFarmer) {
            setFarmers(prevFarmers => {
                if (!prevFarmers.find(f => f.id === newFarmer.id)) {
                    return [...prevFarmers, newFarmer];
                }
                return prevFarmers;
            });
        }
        fetchFarmers();
    };

    return (
        <div className="work-logs-container">
            <div className="work-logs-header">
                <h1>Work Logs Management</h1>
            </div>
            
            <div className="work-logs-content">
                <div className="work-log-form-section">
                    <WorkLogForm onWorkLogAdded={handleWorkLogAdded} />
                </div>
                
                <div className="farmers-list-section">
                    <FarmersList 
                        farmers={farmers} 
                        onFarmerSelect={setSelectedFarmer}
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkLogs; 