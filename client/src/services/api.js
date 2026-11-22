import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', withCredentials: true });

api.interceptors.request.use((config) => {
  const csrf = document.cookie.split('; ').find(row => row.startsWith('csrf_token='));
  if (csrf) config.headers['X-CSRF-Token'] = decodeURIComponent(csrf.split('=')[1]);
  return config;
});

export const getError = (error) => error.response?.data?.message || 'Network error. Please check your connection.';
