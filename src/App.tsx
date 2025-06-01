import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chores from "./pages/Chores";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

const HomeRedirect: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide AppNav on /login and /register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: 16, padding: 16, background: "#f5f5f5" }}>
      {user && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/chores">Chores</Link>
          <button onClick={handleLogout} style={{ marginLeft: 16 }}>Logout</button>
        </>
      )}
      {!user && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <AppNav />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chores"
          element={
            <ProtectedRoute>
              <Chores />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div style={{ padding: 24 }}><h2>404 - Page Not Found</h2></div>} />
      </Routes>
    </Router>
  );
};

export default App;
