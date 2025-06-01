import React, { useState } from "react";
import { register } from "../api";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "child" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await register(form);
      if (res.user) {
        setUser(res.user);
        navigate("/dashboard");
      } else {
        setMessage(res.message || "Registration failed.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && (
        <div className="error-message">{message}</div>
      )}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default Register;
