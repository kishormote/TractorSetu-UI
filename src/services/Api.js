import axios from "axios";

const API_BASE_URL = "http://localhost:9080"; 

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
