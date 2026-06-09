import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { token, email } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;
  
      try {
        setLoading(true);
        setError("");
  
        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });
  
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
  
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
  
        const todos = await response.json();
  
        const total = todos.length;
        const completed = todos.filter(t => t.isCompleted).length;
        const active = total - completed;
  
        setTodoStats({ total, completed, active });
  
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  
    fetchTodoStats();
  }, [token]);

  return (
    <div>
      <h1>Profile</h1>

      <h2>User Info</h2>
      <p>Email: {email}</p>
      <p>Token: {token}</p>

      <h2>Todo Statistics</h2>

      {error && <p>{error}</p>}

      <ul>
        <li>Total: {stats.total}</li>
        <li>Completed: {stats.completed}</li>
        <li>Active: {stats.active}</li>
      </ul>
    </div>
  );
}

export default ProfilePage;