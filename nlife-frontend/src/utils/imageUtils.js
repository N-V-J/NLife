// Image URL processing utilities for NLife application
// This ensures consistent image URL handling across all components

// Production backend URL
const PRODUCTION_BACKEND = 'https://nlife-backend-debug.onrender.com';

/**
 * Process image URLs to ensure they point to the correct backend
 * @param {string} url - The image URL to process
 * @returns {string} - The processed URL
 */
export const processImageUrl = (url) => {
  if (!url) return '';

  // If it's already a full URL (http/https), return as is
  if (url.startsWith('http') || url.startsWith('https')) {
    return url;
  }

  // If it starts with /static or /media, add the production backend URL
  if (url.startsWith('/static') || url.startsWith('/media')) {
    return `${PRODUCTION_BACKEND}${url}`;
  }

  // If it doesn't have a leading slash, add one and prepend backend URL
  if (!url.startsWith('/')) {
    return `${PRODUCTION_BACKEND}/${url}`;
  }

  // Default case - prepend backend URL
  return `${PRODUCTION_BACKEND}${url}`;
};

/**
 * Get profile picture URL with fallback
 * @param {object} user - User object that might contain profile_picture
 * @returns {string} - Processed profile picture URL or empty string
 */
export const getProfilePictureUrl = (user) => {
  if (!user) return '';
  
  // Check various possible profile picture fields
  const profilePicture = user.profile_picture || user.profilePicture || user.image;
  
  return processImageUrl(profilePicture);
};

/**
 * Get doctor profile picture URL
 * @param {object} doctor - Doctor object
 * @returns {string} - Processed profile picture URL
 */
export const getDoctorProfilePicture = (doctor) => {
  if (!doctor) return '';
  
  // Check doctor.user.profile_picture first, then doctor.profile_picture
  const profilePicture = doctor.user?.profile_picture || doctor.profile_picture || doctor.image;
  
  return processImageUrl(profilePicture);
};

/**
 * Get patient profile picture URL
 * @param {object} patient - Patient object
 * @returns {string} - Processed profile picture URL
 */
export const getPatientProfilePicture = (patient) => {
  if (!patient) return '';
  
  // Check patient.user.profile_picture first, then patient.profile_picture
  const profilePicture = patient.user?.profile_picture || patient.profile_picture || patient.image;
  
  return processImageUrl(profilePicture);
};

export default {
  processImageUrl,
  getProfilePictureUrl,
  getDoctorProfilePicture,
  getPatientProfilePicture
};
