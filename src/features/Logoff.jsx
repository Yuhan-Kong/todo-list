import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import styles from './Logoff.module.css';

function Logoff() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    
    if (result.success) {
      navigate('/login');
    } else {
      console.error(result.error);
    }
  };

  return (
    <button onClick={handleLogout} className={styles.logoffButton}>
      Log Off
    </button>
  );
}

export default Logoff;