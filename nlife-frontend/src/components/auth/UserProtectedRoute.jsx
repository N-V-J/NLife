import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useContext(UserContext);
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default UserProtectedRoute;
