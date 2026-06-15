import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navigation.module.css';

function Navigation() {
    const { isAuthenticated } = useAuth();

    return (
        <nav className={styles.nav}>
        <ul>
            <li>
                <NavLink to="/about" className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}>
                    About
                </NavLink>
            </li>

            {isAuthenticated ? (
            <>
                <li>
                <NavLink to="/todos" className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}>
                    Todos
                </NavLink>
                </li>

                <li>
                <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}>
                    Profile
                </NavLink>
                </li>
            </>
            ) : (
            <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}>
                Login
                </NavLink>
            </li>
            )}
        </ul>
        </nav>
    );
    }

export default Navigation;