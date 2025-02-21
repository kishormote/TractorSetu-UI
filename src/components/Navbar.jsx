import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/Api";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login"); // Login page pe redirect
    };
    return (
        <nav>
                 
                 
        
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">SignUp</Link></li>
                <button onClick={handleLogout}>Logout</button>
            </ul>
        </nav>
          
    );
}
export default Navbar;
