import API from './api';
import { API_PATHS } from '../../configs/constants';

export const getPublicDepartmentNonBlocked = async () => {
  try {
    const response = await API.get(API_PATHS.PUBLIC + API_PATHS.DEPARTMENT + '?isBlocked=false');
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};

export const getPublicFacultyNonBlocked = async () => {
  try {
    const response = await API.get(API_PATHS.PUBLIC + API_PATHS.DEPARTMENT + '?depType=FACULTY&isBlocked=false');
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};

export const getPublicConferenceNonBlocked = async () => {
  try {
    const response = await API.get(API_PATHS.PUBLIC + API_PATHS.DEPARTMENT + '?depType=CONFERENCE&isBlocked=false');
    return response.data.payload || response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};

export const searchPublicAuthor = async (key, limit, page) => {
  try {
    const response = await API.get(API_PATHS.PUBLIC + API_PATHS.AUTHOR + API_PATHS.FIND_BY, {
      params: {
        key: key || '',
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
