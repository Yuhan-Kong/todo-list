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
    async function fetchStats() {
      try {
        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        const tasks = data.tasks;

        const total = tasks.length;
        const completed = tasks.filter(task => task.isCompleted).length;
        const active = tasks.filter(task => !task.isCompleted).length;

        setStats({
          total,
          completed,
          active,
        });

      } catch (err) {
        setError(err.message);
      }
    }

    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <div>
      <h1>Profile</h1>

      <h2>User Info</h2>
      <p>Name: {user?.name}</p>
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