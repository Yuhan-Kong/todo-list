import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  function navLinkStyle({ isActive }) {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: isActive ? 'underline' : 'none',
    };
  }
}

export default Navigation;