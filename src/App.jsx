import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <nav style={{ display: "flex", gap: 16, padding: 16, background: "#f5f5f5" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* TODO: Add more routes for dashboard, chores, etc. */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
