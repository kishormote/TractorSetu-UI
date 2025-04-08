import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDetails from "./components/UserDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Task from "./components/Task";
import WorkLogs from "./components/WorkLogs/ViewWorkLogs";
import AddWorkLogForm from "./components/WorkLogs/AddWorkLogForm";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />
            <Route
              path="/tasks"
              element={
                <>
                  <Navbar />
                  <Task />
                </>
              }
            />
            <Route
              path="/work-logs"
              element={
                <>
                  <Navbar />
                  <WorkLogs />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <About />
                </>
              }
            />
            <Route
              path="/userDetail"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <UserDetails />
                  </>
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
