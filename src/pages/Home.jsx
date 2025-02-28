import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getOwnerId } from '../services/Api';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const ownerId = getOwnerId();

    return (
        <div className="home-container">
            <motion.div 
                className="welcome-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Welcome to Tractor Setu</h1>
                <p>Manage your farming operations efficiently</p>
            </motion.div>

            <div className="quick-actions">
                <motion.div 
                    className="action-card"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/tasks')}
                >
                    <h3>Tasks</h3>
                    <p>Manage your tractor tasks</p>
                </motion.div>

                <motion.div 
                    className="action-card"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/work-logs')}
                >
                    <h3>Work Logs</h3>
                    <p>Track farmer activities</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
