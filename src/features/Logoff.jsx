import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

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
    <button onClick={handleLogout} className="logout-button">
      Log Off
    </button>
  );
}

export default Logoff;