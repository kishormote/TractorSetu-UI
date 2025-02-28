import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    
    // If there's no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If there is a token, render the child routes
    return <Outlet />;
};

export default PrivateRoute; 