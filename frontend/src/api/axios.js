import axios from 'axios';

const isProd = import.meta.env.PROD;
const baseURL = isProd 
  ? 'https://taskflow-api-backend-ul7h.onrender.com/api/v1' 
  : 'http://localhost:5000/api/v1';

const api = axios.create({ baseURL });

// Auto-attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
