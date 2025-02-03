import axios from 'axios';

export const BASE_URL = 'https://travelplanner-backend-zmfv.onrender.com';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`, //  backend URL
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