import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
}

export default RequireAuth;