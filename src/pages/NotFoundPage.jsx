import { Link } from "react-router";
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Page not found.</p>

      <nav className={styles.links}>
        <Link to="/" className={styles.link}>Todos</Link>
        <Link to="/about" className={styles.link}>About</Link>
        <Link to="/profile" className={styles.link}>Profile</Link>
      </nav>
    </div>
  );
}

export default NotFoundPage;