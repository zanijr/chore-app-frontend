import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

type Chore = {
  _id: string;
  title: string;
  status: string;
  dueDate?: string;
  assignedTo?: { displayName: string };
  createdBy?: { displayName: string };
  totalValue: number;
};

type User = {
  _id: string;
  displayName: string;
  email: string;
  role: string;
};

const Chores: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    totalValue: "",
    dueDate: "",
    assignedTo: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();

  // Fetch chores
  const fetchChores = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chores", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to fetch chores");
      }
      const data = await res.json();
      setChores(data.chores);
    } catch (err: any) {
      setError(err.message || "Failed to fetch chores");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChores();
  }, []);

  // Fetch users for assignment (only for parents)
  useEffect(() => {
    if (user?.role === "parent") {
      fetch("/api/users", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setUsers(data.users || []))
        .catch(() => setUsers([]));
    }
  }, [user]);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    if (!form.title || !form.totalValue) {
      setFormError("Title and value are required.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch("/api/chores", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          totalValue: Number(form.totalValue),
          dueDate: form.dueDate || undefined,
          assignedTo: form.assignedTo || undefined,
        }),
      });
      if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to create chore");
      }
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        totalValue: "",
        dueDate: "",
        assignedTo: "",
      });
      fetchChores();
    } catch (err: any) {
      setFormError(err.message || "Failed to create chore");
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 24 }}>
      <h2>Chores</h2>
      <p>Here you can view and manage your chores.</p>
      {user?.role === "parent" && (
        <button
          style={{
            background: "linear-gradient(90deg, #2ec4b6 60%, #43aa8b 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1.1em",
            border: "none",
            borderRadius: 8,
            padding: "0.7em 1.5em",
            marginBottom: 24,
            cursor: "pointer",
          }}
          onClick={() => setShowModal(true)}
        >
          + New Chore
        </button>
      )}
      {loading && <div>Loading chores...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && chores.length === 0 && (
        <div>No chores found.</div>
      )}
      {!loading && !error && chores.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
          <thead>
            <tr style={{ background: "#2ec4b6", color: "#fff" }}>
              <th style={{ padding: "0.5em" }}>Title</th>
              <th>Status</th>
              <th>Due</th>
              <th>Assigned To</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {chores.map((chore) => (
              <tr key={chore._id} style={{ background: "#23272f", color: "#f4f4f4" }}>
                <td style={{ padding: "0.5em" }}>{chore.title}</td>
                <td>
                  <span
                    style={{
                      padding: "0.2em 0.7em",
                      borderRadius: 8,
                      background:
                        chore.status === "completed"
                          ? "#43aa8b"
                          : chore.status === "overdue"
                          ? "#ff6b6b"
                          : "#888",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {chore.status}
                  </span>
                </td>
                <td>
                  {chore.dueDate
                    ? new Date(chore.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>{chore.assignedTo?.displayName || "Unassigned"}</td>
                <td>{chore.totalValue}</td>
                <td>
                  {(user?.role === "parent" || (chore.createdBy && (chore.createdBy.displayName === user?.username))) && (
                    <button
                      style={{
                        background: "#ff6b6b",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.3em 0.8em",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginLeft: 8,
                      }}
                      onClick={async () => {
                        if (!window.confirm("Delete this chore?")) return;
                        try {
                          const res = await fetch(`/api/chores/${chore._id}`, {
                            method: "DELETE",
                            credentials: "include",
                          });
                          if (!res.ok) {
                            alert("Failed to delete chore");
                          } else {
                            fetchChores();
                          }
                        } catch {
                          alert("Failed to delete chore");
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for new chore */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#23272f",
              color: "#f4f4f4",
              borderRadius: 12,
              padding: 32,
              minWidth: 340,
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Create New Chore</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label>Title:</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Value:</label>
                <input
                  name="totalValue"
                  type="number"
                  min={1}
                  value={form.totalValue}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Due Date:</label>
                <input
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", marginTop: 4 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Assign To:</label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", marginTop: 4 }}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.displayName} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              {formError && (
                <div className="error-message" style={{ marginBottom: 12 }}>
                  {formError}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "#888",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "0.6em 1.2em",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(90deg, #2ec4b6 60%, #43aa8b 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 8,
                    padding: "0.6em 1.2em",
                    cursor: "pointer",
                  }}
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chores;
