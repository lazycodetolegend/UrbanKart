import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const isSilentAuthCheck = error.config?.url?.includes('/auth/me');
    if (!isSilentAuthCheck) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
