import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});



api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add request interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    // Check if the error is due to an expired access token
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response =  await api.post('/auth/refresh-token');
        const { accessToken } = response.data;
        //Update Authorization header with new access token
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
       
        return api(originalRequest);
      } catch (refreshError) {
      // Redirect to login or show a logout message
      console.error('Refresh token expired. Please log in again.');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;