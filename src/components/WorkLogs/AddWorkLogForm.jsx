import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AddWorkLogForm.css";
import { getAllTasks, createWorkLog, getOwnerId } from "../../services/Api";

const AddWorkLogForm = ({ farmer, onClose, onSuccess, isNewLog = false }) => {
  const [formData, setFormData] = useState({
    farmerName: "",
    farmerId: null,
    taskDate: new Date().toISOString().split("T")[0],
    area: "",
    amountPaid: "",
    tractorOwnerTaskId: "",
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const ownerId = getOwnerId();

  useEffect(() => {
    if (farmer && !isNewLog) {
      setFormData((prev) => ({
        ...prev,
        farmerName: farmer.name || farmer.fullName || "",
        farmerId: farmer.id,
      }));
    }
  }, [farmer, isNewLog]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getAllTasks(ownerId);
      const tasksData = Array.isArray(response) ? response : response.data;
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        farmerId: formData.farmerId,
      };

      await createWorkLog(submissionData);
      onSuccess();
    } catch (error) {
      console.error("Error creating work log:", error);
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
      <h2>Add Work Log for {formData.farmerName}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="farmerName"
            value={formData.farmerName}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isNewLog}
            required
          />
          <label className="form-label">Farmer Name</label>
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
            value={formData.tractorOwnerTaskId}
            onChange={handleInputChange}
            className="form-input"
            required
          >
            <option value="">Select Task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.taskName || task.name}
              </option>
            ))}
          </select>
          <label className="form-label">Task</label>
        </div>

        <div className="form-group">
          <input
            type="number"
            name="area"
            value={formData.area}
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
            value={formData.amountPaid}
            onChange={handleInputChange}
            className="form-input"
            placeholder=" "
            required
          />
          <label className="form-label">Amount Paid</label>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Log"}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddWorkLogForm;
