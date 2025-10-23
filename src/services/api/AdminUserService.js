import API from './api';

const BASE_URL = '/admin/user';

export const searchUsers = async (key, userRole, limit, page) => {
  try {
    const response = await API.get(`${BASE_URL}/find-by`, {
      params: {
        key: key || '',
        userRole: userRole || undefined, // Only send if a role is selected
        limit,
        page,
      },
    });
    // The structure is { code: 0, message: "success", payload: {...} }
    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const registerStaff = async (userData) => {
  try {
    const response = await API.post(`${BASE_URL}/register/staff`, userData);
    return response.data; // You might want to return the whole response for context
  } catch (error) {
    console.error("Failed to register staff:", error);
    throw error;
  }
};

export const blockUser = async (userId, isBlocked) => {
  try {
    await API.put(`${BASE_URL}/${userId}/block`, { isBlocked });
  } catch (error) {
    console.error(`Failed to update block status for user ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await API.delete(`${BASE_URL}/${userId}`);
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
};

export const resetPassword = async (userId, newPassword) => {
  try {
    await API.put(`${BASE_URL}/${userId}/password`, { newPassword });
  } catch (error) {
    console.error(`Failed to reset password for user ${userId}:`, error);
    throw error;
  }
};
