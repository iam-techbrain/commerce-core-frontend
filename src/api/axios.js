import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    if (!window.location.port || window.location.port === '80' || window.location.port === '443') {
      return '/api';
    }
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL()
});

// Request Interceptor: Inject JWT token into Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
