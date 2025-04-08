import React, { useState, useEffect } from "react";
import { fetchRoles, signupUser } from "../services/Api";
import { useNavigate, Link } from "react-router-dom";
import '../styles/pages/Auth.css';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRoles = async () => {
      const data = await fetchRoles();
      setRoles(data);
    };
    getRoles();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupUser({ username, email, password, role });
      alert("Signup successful");
      navigate("/login");
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Tractor Setu and start farming smarter</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className="form-label">Username</label>
          </div>

          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="form-label">Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="form-label">Password</label>
          </div>

          <div className="form-group">
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>
            <label className="form-label">Role</label>
          </div>

          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>
        
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;