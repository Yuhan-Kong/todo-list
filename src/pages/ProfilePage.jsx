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
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const options = {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        };

        const response = await fetch("/api/tasks", options);

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const todos = await response.json();

        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
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

  const completionRate =
    todoStats.total === 0
      ? 0
      : (todoStats.completed / todoStats.total) * 100;

  return (
    <div>
      <h1>Profile</h1>

      <h2>User Info</h2>
      <p>Name: {email}</p>
      <p>Status: Active</p>
      <p>Token: {token}</p>

      <h2>Todo Statistics</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          <li>Total: {todoStats.total}</li>
          <li>Completed: {todoStats.completed}</li>
          <li>Active: {todoStats.active}</li>
          <li>Completion Rate: {completionRate.toFixed(1)}%</li>
        </ul>
      )}
    </div>
  );
}

export default ProfilePage;