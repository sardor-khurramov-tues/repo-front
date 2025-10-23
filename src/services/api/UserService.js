import API from './api';

export const updateUserInStorage = async () => {
  try {
    const res = await API.get("/user");
    const updatedUser = res.data.payload;
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("Failed to fetch and update user details:", error);

    globalThis.location.href = '/login';
    throw error;
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

export const registerAuthor = async (authorData) => {
    try {
        const response = await API.post('/register/author', authorData);
        // The API returns a 200/201 on success, which is all we need here.
        return response.data; 
    } catch (error) {
        console.error("Failed to register author:", error);
        // Throw the error so the component can catch it and display a message.
        throw error;
    }
};
