const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function register({ username, password, role }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, role }),
  });
  return res.json();
}

export async function login({ username, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });
  return res.json();
}
