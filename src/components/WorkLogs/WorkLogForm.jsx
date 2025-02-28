import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './WorkLogForm.css';
import { getAllTasks, createWorkLog, getOwnerId, searchFarmers as searchFarmersApi } from '../../services/Api';

const WorkLogForm = ({ onWorkLogAdded }) => {
    const [formData, setFormData] = useState({
        farmerName: '',
        farmerId: null,
        taskDate: new Date().toISOString().split('T')[0],
        area: '',
        amountPaid: '',
        tractorOwnerTaskId: ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const ownerId = getOwnerId();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getAllTasks(ownerId);
            const tasksData = Array.isArray(response) ? response : response.data;
            setTasks(tasksData);
            console.log('Fetched tasks:', tasksData);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSearchFarmers = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const data = await searchFarmersApi(query);
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching farmers:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'farmerName') {
            setFormData(prev => ({ 
                ...prev, 
                [name]: value,
                farmerId: null
            }));
            handleSearchFarmers(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submissionData = {
                ...formData,
                farmerId: formData.farmerId || undefined
            };

            const data = await createWorkLog(submissionData);
            onWorkLogAdded(data.farmer);
            setFormData({
                farmerName: '',
                farmerId: null,
                taskDate: new Date().toISOString().split('T')[0],
                area: '',
                amountPaid: '',
                tractorOwnerTaskId: ''
            });
        } catch (error) {
            console.error('Error creating work log:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className="work-log-form-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2>Add New Work Log</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="farmerName"
                        value={formData.farmerName || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder=" "
                        required
                    />
                    <label className="form-label">Farmer Name</label>
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map(farmer => (
                                <div 
                                    key={farmer.id}
                                    className="search-result-item"
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            farmerName: farmer.name,
                                            farmerId: farmer.id
                                        }));
                                        setSearchResults([]);
                                    }}
                                >
                                    {farmer.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        name="taskDate"
                        value={formData.taskDate}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    />
                    <label className="form-label">Date</label>
                </div>

                <div className="form-group">
                    <select
                        name="tractorOwnerTaskId"
                        value={formData.tractorOwnerTaskId || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                    >
                        <option value="">Select Task</option>
                        {tasks && tasks.length > 0 ? (
                            tasks.map(task => (
                                <option 
                                    key={task.id} 
                                    value={task.id}
                                >
                                    {task.taskName || task.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No tasks available</option>
                        )}
                    </select>
                    <label className="form-label">Task</label>
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="area"
                        value={formData.area || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder=" "
                        required
                    />
                    <label className="form-label">Area (in acres)</label>
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="amountPaid"
                        value={formData.amountPaid || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder=" "
                        required
                    />
                    <label className="form-label">Amount Paid</label>
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Log'}
                </button>
            </form>
        </motion.div>
    );
};

export default WorkLogForm; 