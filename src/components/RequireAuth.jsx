import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from './RequireAuth.module.css';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
        },
      });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return <p className={styles.message}>Redirecting...</p>;
  }

  return children;
}

export default RequireAuth;