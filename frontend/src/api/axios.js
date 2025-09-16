// src/api/axios.js
import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const authClient = axios.create({
  baseURL: BACKEND,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

const api = axios.create({
  baseURL: `${BACKEND}/api`,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// global response interceptor (simple)
api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      // session expired -> force reload to login
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
