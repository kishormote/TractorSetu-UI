import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/Api";
import '../styles/components/Navbar.css';

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
                    <img src="/tractor-icon.png" alt="Tractor Setu Logo" />
                    <span>Tractor Setu</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/tasks" className="nav-link">Tasks</Link>
                    <Link to="/work-logs" className="nav-link">Work Log</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <button 
                        onClick={handleLogout}
                        className="btn btn-secondary"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
