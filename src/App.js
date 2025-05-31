import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* TODO: Add more routes for dashboard, chores, etc. */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
