import API from './api';

export const getDepartmentsByAdmin = async () => {
  try {
    const response = await API.get('/admin/department');
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};

export const createDepartment = async (departmentData) => {
  try {
    const response = await API.post('/admin/department', departmentData);
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to create department:", error);
    throw error;
  }
};

export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await API.put(`/admin/department/${id}`, departmentData);
    return response.data.payload || response.data;
  } catch (error) {
    console.error(`Failed to update department ${id}:`, error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    await API.delete(`/admin/department/${id}`);
  } catch (error) {
    console.error(`Failed to delete department ${id}:`, error);
    throw error;
  }
};

export const getPublicDepartment = async () => {
  try {
    const response = await API.get('/public/department');
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};

export const getPublicDepartmentNonBlocked = async () => {
  try {
    const response = await API.get('/public/department?isBlocked=false');
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};
