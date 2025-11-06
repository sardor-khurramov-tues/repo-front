import API from './api';
import { API_PATHS } from '../../configs/constants';

export const getDepartmentsByAdmin = async () => {
  try {
    const response = await API.get(API_PATHS.ADMIN + API_PATHS.DEPARTMENT);
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};

export const createDepartment = async (departmentData) => {
  try {
    const response = await API.post(API_PATHS.ADMIN + API_PATHS.DEPARTMENT, departmentData);
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to create department:", error);
    throw error;
  }
};

export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await API.put(API_PATHS.ADMIN + API_PATHS.DEPARTMENT + '/' + id, departmentData);
    return response.data.payload || response.data;
  } catch (error) {
    console.error(`Failed to update department ${id}:`, error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    await API.delete(API_PATHS.ADMIN + API_PATHS.DEPARTMENT + '/' + id);
  } catch (error) {
    console.error(`Failed to delete department ${id}:`, error);
    throw error;
  }
};

export const getPublicDepartment = async () => {
  try {
    const response = await API.get(API_PATHS.PUBLIC + API_PATHS.DEPARTMENT);
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};
