import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { adminUser, isAdmin } = useAuth();
  const location = useLocation();

  if (!adminUser) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Redirect to home page if not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
