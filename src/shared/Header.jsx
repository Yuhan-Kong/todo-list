import { useAuth } from '../contexts/AuthContext';
import Logoff from '../features/Logoff';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>Todo List</h1>
      
      {isAuthenticated && <Logoff />}
    </header>
  );
}

export default Header;