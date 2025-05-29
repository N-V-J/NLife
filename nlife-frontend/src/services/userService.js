import axios from 'axios';

// Hardcoded production URLs to ensure they work
const PRODUCTION_BACKEND = 'https://nlife-backend-debug.onrender.com';
const API_URL = `${PRODUCTION_BACKEND}/api/auth`;

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register a new user
export const registerUser = async (userData) => {
  try {
    // Add user type as patient by default for signup page
    const userDataWithType = {
      ...userData,
      user_type: 'patient'
    };

    console.log('Sending registration data:', userDataWithType);
    console.log('To endpoint:', `${API_URL}/register/patient/`);

    const response = await apiClient.post('/register/patient/', userDataWithType);
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);

      // Return the error data for better error handling
      if (error.response.data) {
        throw error.response.data;
      } else {
        throw new Error(`Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error(error.message || 'Registration failed');
    }
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/token/', credentials);

    // Store token in localStorage
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      // Get user details
      const userResponse = await apiClient.get('/me/', {
        headers: {
          'Authorization': `Bearer ${response.data.access}`
        }
      });

      localStorage.setItem('user', JSON.stringify(userResponse.data));

      return {
        token: response.data.access,
        user: userResponse.data
      };
    }

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  console.log('User logged out - all tokens cleared');
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/me/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch profile');
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    // Create a new axios instance for this request
    const token = localStorage.getItem('token');
    const isFormData = profileData instanceof FormData;

    const config = {
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    };

    const axiosInstance = axios.create(config);
    const response = await axiosInstance.put('/me/update/', profileData);

    // Update stored user data if it exists
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...response.data
      }));
    }

    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error.response ? error.response.data : new Error('Failed to update profile');
  }
};

// Get authenticated axios instance for other API endpoints
export const getAuthAxios = () => {
  // Try both token keys - 'access_token' for admin login, 'token' for regular login
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');

  return axios.create({
    baseURL: `${PRODUCTION_BACKEND}/api/`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Get user's patient profile
export const getPatientProfile = async () => {
  try {
    const authAxios = getAuthAxios();
    const response = await authAxios.get('patients/');

    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    // Find the patient profile that matches the current user
    let patientProfile = null;

    if (response.data.results) {
      patientProfile = response.data.results.find(
        patient => patient.user && patient.user.id === currentUser.id
      );
    } else if (Array.isArray(response.data)) {
      patientProfile = response.data.find(
        patient => patient.user && patient.user.id === currentUser.id
      );
    }

    return patientProfile;
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  getUserProfile,
  updateUserProfile,
  getAuthAxios,
  getPatientProfile
};
