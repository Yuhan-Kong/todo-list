import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    
    if (!result.success) {
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