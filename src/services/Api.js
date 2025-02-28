import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:9080";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getOwnerId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.id; 
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/roles`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/profile/userdetails/${userId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/profile/userdetails/${userId}`,
      profileData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const createTask = async (ownerId, taskData) => {
  return axios.post(
    `${API_BASE_URL}/expense/tractor-owner-tasks/${ownerId}`, 
    taskData,
    getAuthHeaders()
  );
};

export const getAllTasks = async (ownerId) => {
  return axios.get(`${API_BASE_URL}/expense/tractor-owner-tasks/${ownerId}`);
};

export const updateTasks = async (ownerId, taskList) => {
  return axios.put(
    `${API_BASE_URL}/expense/tractor-owner-tasks/${ownerId}`,
    { tasks: taskList },
    getAuthHeaders()
  );
};

export const getFarmersByTractorOwner = async (ownerId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expense/tractor-owner/${ownerId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch farmers:', error);
    throw error;
  }
};

export const searchFarmers = async (query) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expense/farmer/search`,
      {
        ...getAuthHeaders(),
        params: { name: query }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to search farmers:', error);
    throw error;
  }
};

export const createWorkLog = async (workLogData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/expense/work-logs`,
      workLogData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create work log:', error);
    throw error;
  }
};

export const getFarmerWorkLogs = async (farmerId, ownerId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expense/work-logs/farmer/${farmerId}/owner/${ownerId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch farmer logs:', error);
    throw error;
  }
};

export const getFarmerDueAmount = async (farmerId, ownerId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/expense/totalDue/${farmerId}/${ownerId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch due amount:', error);
    throw error;
  }
};
