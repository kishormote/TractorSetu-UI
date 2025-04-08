import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/Api";
import "../styles/components/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src="/assets/tractor-icon.png" alt="Tractor Setu Logo" />
          <span>Tractor Setu</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/tasks" className="nav-link">
            Tasks
          </NavLink>
          <NavLink to="/work-logs" className="nav-link">
            Work Log
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
