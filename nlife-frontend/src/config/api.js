// API Configuration
// This file centralizes all API URL configuration

// PRODUCTION BACKEND URL - HARDCODED FOR GUARANTEED CONNECTION
const PRODUCTION_BACKEND_URL = 'https://nlife-backend-debug.onrender.com';

// ALWAYS USE PRODUCTION URL - NO LOCALHOST EVER!
const getBaseURL = () => {
  console.log('🚀 ALWAYS USING PRODUCTION BACKEND:', PRODUCTION_BACKEND_URL);
  console.log('🌐 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');
  console.log('� NO LOCALHOST CONNECTIONS ALLOWED!');

  // ALWAYS return production URL - no conditions, no fallbacks
  return PRODUCTION_BACKEND_URL;
};

export const API_BASE_URL = getBaseURL();
export const API_URL = `${API_BASE_URL}/api`;
export const AUTH_URL = `${API_BASE_URL}/api/auth`;
export const ADMIN_URL = `${API_BASE_URL}/admin`;

// Log the configuration for debugging
console.log('🔗 NLife API Configuration:', {
  API_BASE_URL,
  API_URL,
  AUTH_URL,
  ADMIN_URL,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  isProduction: typeof window !== 'undefined' && window.location.hostname.includes('onrender.com'),
  env: {
    VITE_API_URL: typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_URL : 'undefined',
    REACT_APP_BACKEND_URL: typeof import.meta !== 'undefined' ? import.meta.env?.REACT_APP_BACKEND_URL : 'undefined',
    REACT_APP_API_URL: typeof import.meta !== 'undefined' ? import.meta.env?.REACT_APP_API_URL : 'undefined',
  }
});

export default {
  API_BASE_URL,
  API_URL,
  AUTH_URL,
  ADMIN_URL
};
