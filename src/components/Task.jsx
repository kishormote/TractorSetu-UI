import React, { useState, useEffect } from "react";
import { createTask, getAllTasks, updateTasks } from "../services/Api";
import { getOwnerId } from "../services/Api";
import "../styles/components/Task.css";

const Task = () => {
  const ownerId = getOwnerId();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ taskName: "", price: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getAllTasks(ownerId);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.taskName || !newTask.price) return;
    try {
      await createTask(ownerId, newTask);
      setNewTask({ taskName: "", price: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTasks = async () => {
    try {
      await updateTasks(ownerId, tasks);
      fetchTasks();
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };

  return (
    <div className="task-container">
      <h2>Tractor Owner Tasks</h2>

      <div className="task-form">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.taskName}
          onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newTask.price}
          onChange={(e) => setNewTask({ ...newTask, price: e.target.value })}
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>

      <h3>Task List</h3>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="text"
              value={task.taskName}
              onChange={(e) => {
                const updatedTasks = [...tasks];
                updatedTasks[index].taskName = e.target.value;
                setTasks(updatedTasks);
              }}
            />
            <input
              type="number"
              value={task.price}
              onChange={(e) => {
                const updatedTasks = [...tasks];
                updatedTasks[index].price = e.target.value;
                setTasks(updatedTasks);
              }}
            />
          </li>
        ))}
      </ul>
      <button onClick={handleUpdateTasks}>Update Tasks</button>
    </div>
  );
};

export default Task;
