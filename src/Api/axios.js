import axios from 'axios';

export const BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', //  backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});



// Add a request interceptor to include the JWT token in headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;