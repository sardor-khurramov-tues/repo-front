import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

console.log('API base URL:', BASE_URL);

const API = axios.create({
  baseURL: BASE_URL,
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
          globalThis.location.href = '/login';
          throw error;
      }

      try {
        await API.post('/refresh-token');
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('user');

        globalThis.location.href = '/login';
        throw refreshError;
      }
    }

    throw error;
  }
);

export default API;
