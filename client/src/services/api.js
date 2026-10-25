import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isSilentAuthCheck = url.includes('/auth/me') || url.includes('/me');
    const is401 = error.response?.status === 401;

    // Never show noisy toast notifications for silent background auth checks
    if (!isSilentAuthCheck) {
      // If 401 on an unauthenticated background check, ignore unless explicitly logging in
      const isLoginOrRegister = url.includes('/auth/login') || url.includes('/auth/register');
      if (is401 && !isLoginOrRegister) {
        return Promise.reject(error);
      }

      const message =
        error.response?.data?.message ||
        (error.response?.status === 403 ? 'Access forbidden. Admin role required.' : '') ||
        (error.response?.status === 404 ? 'Resource not found.' : '') ||
        (error.message === 'Network Error' ? 'Unable to connect to server. Please check your network.' : '') ||
        'Unable to complete request. Please try again.';

      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
