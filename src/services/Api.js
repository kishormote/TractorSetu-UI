import axios from "axios";

const API_BASE_URL = "http://localhost:9080";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
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
    console.error("Signup error:", error.response.data);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response.data);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token"); // Token delete karo
};

export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/profile/userdetails/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/profile/userdetails/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const createTask = async (ownerId, taskData) => {
  return axios.post(`${API_BASE_URL}/expense/tractor-owner-tasks/${ownerId}`, taskData);
};

export const getAllTasks = async (ownerId) => {
  return axios.get(`${API_BASE_URL}/expense/tractor-owner-tasks/${ownerId}`);
};

export const updateTasks = async (ownerId, taskList) => {
  return axios.put(`${API_BASE_URL}/expense/tractor-owner-tasks/${ownerId}`, { tasks: taskList });
};
