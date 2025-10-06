import axios from "axios";

console.log('API base URL:', process.env.REACT_APP_BASE_URL);

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:8900/repo",
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (originalRequest.url === '/refresh-token') {
          console.error('Refresh token is invalid, redirecting to login.');
          window.location.href = '/login';
          return Promise.reject(error);
      }

      try {
        await API.post('/refresh-token');
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('user');

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
