import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      // In a real app, you would validate the token with the server
      setAdminUser({
        email: 'admin@nlife.com',
        role: 'admin'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // In a real app, you would make an API call to authenticate
    if (email === 'admin@nlife.com' && password === 'admin123') {
      const user = { email, role: 'admin' };
      setAdminUser(user);
      localStorage.setItem('adminToken', 'demo-token');
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const value = {
    adminUser,
    login,
    logout,
    isAdmin: !!adminUser && adminUser.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
