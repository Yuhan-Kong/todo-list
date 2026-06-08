import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found.</p>

      <nav>
        <Link to="/">Todos</Link>
        <Link to="/about">About</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
}

export default NotFoundPage;