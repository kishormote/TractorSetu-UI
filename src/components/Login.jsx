import React, { useState } from "react";
import { loginUser } from "../services/Api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../styles/pages/Auth.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      localStorage.setItem("token", response.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to access your account</p>
        </div>
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input 
              type="text" 
              className="form-input" 
              id="username" 
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
            <label htmlFor="username" className="form-label">Username</label>
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              className="form-input" 
              id="password" 
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <label htmlFor="password" className="form-label">Password</label>
          </div>
          
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        
        <div className="auth-links">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
