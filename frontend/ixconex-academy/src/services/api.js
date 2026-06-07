import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export function getErrorMessage(error) {
  const data = error.response?.data;
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.message === 'string') return data.message;
  return error.message || 'Request failed';
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ikonex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ikonex_token');
      localStorage.removeItem('ikonex_user');
      window.dispatchEvent(new Event('ikonex:unauthorized'));
      const isPublic = PUBLIC_PATHS.some((p) => window.location.pathname.startsWith(p));
      if (!isPublic) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
