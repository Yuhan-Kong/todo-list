import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
    const { isAuthenticated } = useAuth();
}

export default Navigation;