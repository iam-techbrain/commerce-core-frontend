import axios from 'axios';

// Express Backend Base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
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
