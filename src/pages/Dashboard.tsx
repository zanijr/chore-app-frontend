import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

type Chore = {
  _id: string;
  title: string;
  status: string;
  dueDate?: string;
  assignedTo?: { displayName: string };
  completedAt?: string;
};

const Dashboard: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChores = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/chores", { credentials: "include" });
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
    fetchChores();
  }, []);

  // Stats
  const total = chores.length;
  const completed = chores.filter((c) => c.status === "completed").length;
  const overdue = chores.filter((c) => {
    if (c.status === "completed") return false;
    if (!c.dueDate) return false;
    return new Date(c.dueDate) < new Date();
  }).length;
  const pending = total - completed - overdue;

  // Recent activity (last 5 completed chores)
  const recent = chores
    .filter((c) => c.status === "completed" && c.completedAt)
    .sort((a, b) => (b.completedAt && a.completedAt ? new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime() : 0))
    .slice(0, 5);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 24 }}>
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard! Here you can see an overview of your chores and activity.</p>
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <>
          <div style={{ display: "flex", gap: 24, margin: "2em 0" }}>
            <div
              style={{
                flex: 1,
                background: "#2ec4b6",
                color: "#fff",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.3em",
                boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
              }}
            >
              <div>Total Chores</div>
              <div style={{ fontSize: "2.2em", marginTop: 8 }}>{total}</div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#43aa8b",
                color: "#fff",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.3em",
                boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
              }}
            >
              <div>Completed</div>
              <div style={{ fontSize: "2.2em", marginTop: 8 }}>{completed}</div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#ff6b6b",
                color: "#fff",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.3em",
                boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
              }}
            >
              <div>Overdue</div>
              <div style={{ fontSize: "2.2em", marginTop: 8 }}>{overdue}</div>
            </div>
            <div
              style={{
                flex: 1,
                background: "#888",
                color: "#fff",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
                fontWeight: 700,
                fontSize: "1.3em",
                boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
              }}
            >
              <div>Pending</div>
              <div style={{ fontSize: "2.2em", marginTop: 8 }}>{pending}</div>
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <h3 style={{ marginBottom: 12 }}>Recent Activity</h3>
            {recent.length === 0 ? (
              <div>No recent completions.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {recent.map((c) => (
                  <li
                    key={c._id}
                    style={{
                      background: "#23272f",
                      color: "#f4f4f4",
                      borderRadius: 8,
                      padding: "1em",
                      marginBottom: 12,
                      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <strong>{c.title}</strong> completed by{" "}
                      {c.assignedTo?.displayName || "Unassigned"}
                    </span>
                    <span style={{ fontSize: "0.95em", color: "#2ec4b6" }}>
                      {c.completedAt
                        ? new Date(c.completedAt).toLocaleString()
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
