import API from './api';
import { API_PATHS } from '../../configs/constants';

export const authenticate = async (username, password) => {
  try {
    const res = await API.post(API_PATHS.AUTHENTICATE, { username, password });

    const token = res.data.payload.accessToken;

    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const userRes = await API.get(API_PATHS.USER);

    localStorage.setItem("user", JSON.stringify(userRes.data.payload));

    return userRes.data.payload.userRole;
  } catch (error) {
    console.error("Failed to authenticate:", error);
    throw error;
  }
};

export const signout = async () => {
  try {
    await API.post(API_PATHS.SIGN_OUT);
  } catch (error) {
    console.error("Failed to sign out on server:", error);
  } finally {
    localStorage.removeItem("user");
  }
};
