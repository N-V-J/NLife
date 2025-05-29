import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated
} from '../services/userService';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (isAuthenticated()) {
      setCurrentUser(getCurrentUser());
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      // Remove agreement as it's not needed for the API
      const { agreement, ...userDataToSend } = userData;

      console.log('UserContext - Sending data to registerUser:', userDataToSend);
      const response = await registerUser(userDataToSend);
      console.log('UserContext - Registration response:', response);

      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      console.error('UserContext - Registration error:', err);
      setLoading(false);

      // Handle different types of error responses
      if (typeof err === 'object' && err !== null) {
        // If it's a validation error object from DRF
        if (err.email || err.password || err.non_field_errors || err.detail || Object.keys(err).length > 0) {
          setError(err);
          return { success: false, error: err };
        }
      }

      setError(err.message || 'Registration failed');
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await loginUser({ email, password });

      setCurrentUser(response.user);
      setLoading(false);

      return { success: true, user: response.user };
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed');
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isPatient: !!currentUser && currentUser.userType === 'patient',
    isDoctor: !!currentUser && currentUser.userType === 'doctor',
    isAdmin: !!currentUser && currentUser.userType === 'admin',
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserContext;
