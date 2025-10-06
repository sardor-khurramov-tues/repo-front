import API from '../api';

export const updateUserInStorage = async () => {
  try {
    const res = await API.get("/user");
    const updatedUser = res.data.payload;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("Failed to fetch and update user details:", error);
    // If the token is invalid, the interceptor in api.js should handle it.
    // We return null to indicate failure to the calling component.
    // return null;

    window.location.href = '/login';
    return Promise.reject(error);

  }
};

export const updateUserDetails = async (data) => {
  try {
    const res = await API.put("/user", data);
    const updatedUser = res.data.payload;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user details:", error);
    throw error;
  }
};

export const updateUserPassword = async (data) => {
  try {
    await API.put("/user/password", data);
    return true;
  } catch (error) {
    console.error("Failed to update password:", error);
    throw error;
  }
};
