import React, { useState, useEffect } from "react";
import {
  getFarmersByTractorOwner,
  getFarmerWorkLogs,
  getFarmerDueAmount,
  getOwnerId,
  searchFarmers,
} from "../services/Api";
import AddWorkLogForm from "../components/WorkLogs/AddWorkLogForm";
import ViewWorkLogs from "../components/WorkLogs/ViewWorkLogs";
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/pages/Home.css";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewLogs, setShowViewLogs] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [workLogs, setWorkLogs] = useState({});
  const formRef = React.useRef(null);
  const logsRef = React.useRef(null);
  const [showNewLogForm, setShowNewLogForm] = useState(false);
  const [showWorkLogModal, setShowWorkLogModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadFarmersData();
  }, []);

  const loadFarmersData = async () => {
    try {
      setLoading(true);
      const ownerId = getOwnerId();
      if (!ownerId) {
        setError("Owner ID not found");
        return;
      }

      // Get farmers associated with this tractor owner
      const farmersData = await getFarmersByTractorOwner(ownerId);
      if (!farmersData || farmersData.length === 0) {
        setError("No farmers found");
        return;
      }

      // Get work logs and due amounts for each farmer
      const farmersWithDetails = await Promise.all(
        farmersData.map(async (farmer) => {
          const logs = await getFarmerWorkLogs(farmer.id, ownerId);
          const dueAmount = await getFarmerDueAmount(farmer.id, ownerId);
          return {
            ...farmer,
            id: farmer.id, // Ensure we have the correct ID
            fullName: farmer.name, // Use the name field from the API
            phoneNumber: farmer.contact, // Use the contact field from the API
            workLogs: logs || [],
            dueAmount: dueAmount || 0,
          };
        })
      );

      setFarmers(farmersWithDetails);

      // Create work logs map
      const logsMap = {};
      farmersWithDetails.forEach((farmer) => {
        logsMap[farmer.id] = farmer.workLogs;
      });
      setWorkLogs(logsMap);
    } catch (error) {
      console.error("Error loading farmers data:", error);
      setError("Failed to load farmers data");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (farmer, action) => {
    setSelectedFarmer(farmer);
    switch (action) {
      case "add":
        setShowAddForm(true);
        setShowViewLogs(false);
        setTimeout(() => {
          formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
        break;
      case "view":
        setShowViewLogs(true);
        setShowAddForm(false);
        setTimeout(() => {
          logsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
        break;
      case "print":
        window.print();
        break;
      default:
        break;
    }
  };

  const handleCreateNewLog = () => {
    setShowNewLogForm(true);
    setShowAddForm(false);
    setShowViewLogs(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleAddWorkLog = () => {
    // Close any other open forms/modals
    setShowAddForm(false);
    setShowViewLogs(false);
    setShowNewLogForm(false);
    setShowWorkLogModal(true);
  };

  const handleWorkLogSuccess = () => {
    setShowWorkLogModal(false);
    // Refresh data
    loadFarmersData();
    // Show success message
    setError('Work log added successfully');
    setTimeout(() => setError(''), 3000);
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Farmers Work Log Summary</h2>
        <div className="header-buttons">
          <button 
            className="create-task-btn"
            onClick={() => navigate('/task')}
          >
            Create Task
          </button>
          <button 
            className="add-worklog-btn"
            onClick={handleAddWorkLog}
          >
            Add Work Log
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="farmers-table">
          <thead>
            <tr>
              <th>Farmer Name</th>
              <th>Due Amount</th>
              <th>Last Work Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => {
              return (
                <tr key={farmer.id}>
                  <td>{farmer.name || farmer.fullName || "N/A"}</td>
                  <td>₹{farmer.amountDue || farmer.dueAmount || 0}</td>
                  <td>
                    {farmer.lastWorkDate
                      ? new Date(farmer.lastWorkDate).toLocaleDateString()
                      : "No logs"}
                  </td>
                  <td>
                    <div className="dropdown">
                      <button className="action-btn">Actions ▼</button>
                      <div className="dropdown-content">
                        <button onClick={() => handleAction(farmer, "add")}>
                          Add Work Log
                        </button>
                        <button onClick={() => handleAction(farmer, "view")}>
                          View Logs
                        </button>
                        <button onClick={() => handleAction(farmer, "print")}>
                          Print Logs
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {farmers.length === 0 && <div className="no-data">No farmers found</div>}

      {selectedFarmer && showAddForm && (
        <div className="form-section" ref={formRef}>
          <h3>
            Add Work Log for {selectedFarmer.name || selectedFarmer.fullName}
          </h3>
          <AddWorkLogForm
            farmer={selectedFarmer}
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false);
              setShowViewLogs(true);
              loadFarmersData(); // Refresh data after adding
            }}
          />
        </div>
      )}

      {selectedFarmer && showViewLogs && (
        <div className="logs-section" ref={logsRef}>
          <h3>Work Logs for {selectedFarmer.name || selectedFarmer.fullName}</h3>
          <ViewWorkLogs
            farmer={selectedFarmer}
            onClose={() => {
              setShowViewLogs(false);
              setShowAddForm(false);
            }}
            showOnlyFarmerLogs={true}
            handleAction={(farmer, action) => {
              setShowViewLogs(false);
              handleAction(farmer, action);
            }}
          />
        </div>
      )}

      {showNewLogForm && (
        <div className="form-section" ref={formRef}>
          <h3>Create New Work Log</h3>
          <AddWorkLogForm
            onClose={() => {
              setShowNewLogForm(false);
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }}
            onSuccess={() => {
              setShowNewLogForm(false);
              loadFarmersData();
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }}
            isNewLog={true}
          />
        </div>
      )}

      <AnimatePresence>
        {showWorkLogModal && (
          <div className="modal-overlay">
            <motion.div 
              className="modal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="modal-header">
                <h2>Add New Work Log</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowWorkLogModal(false)}
                >
                  ×
                </button>
              </div>
              <AddWorkLogForm
                onClose={() => setShowWorkLogModal(false)}
                onSuccess={handleWorkLogSuccess}
                isNewLog={true}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
