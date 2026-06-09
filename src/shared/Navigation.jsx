import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  function navLinkStyle({ isActive }) {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: isActive ? 'underline' : 'none',
    };
  }

  return (
    <nav>
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          gap: '1rem',
          padding: 0,
        }}
      >
      </ul>
    </nav>
  );
}

export default Navigation;