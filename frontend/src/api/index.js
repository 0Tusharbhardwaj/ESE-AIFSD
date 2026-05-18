import axios from 'axios';

// Base API instance — points to backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('empai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle global 401 (auto-logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('empai_token');
      localStorage.removeItem('empai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Employee API ─────────────────────────────────────────────────────────────
export const employeeAPI = {
  create: (data) => api.post('/employees', data),
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  search: (params) => api.get('/employees/search', { params }),
  getAnalytics: () => api.get('/employees/analytics'),
};

// ─── AI API ───────────────────────────────────────────────────────────────────
export const aiAPI = {
  recommend: (data) => api.post('/ai/recommend', data),
  rank: (data) => api.post('/ai/rank', data),
};

export default api;
