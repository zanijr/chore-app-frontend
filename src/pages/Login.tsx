import React, { useState } from "react";
import { login } from "../api";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await login(form);
      if (res.user) {
        setUser(res.user);
        navigate("/dashboard");
      } else {
        setMessage(res.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && (
        <div className="error-message">{message}</div>
      )}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <span>Don't have an account? </span>
        <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Login;
