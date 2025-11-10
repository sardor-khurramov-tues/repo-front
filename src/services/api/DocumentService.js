import API from './api';
import { API_PATHS } from '../../configs/constants';

export const submitDissertation = async (data) => {
  try {
    const response = await API.post(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + API_PATHS.DISSERTATION, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit dissertation:", error);
    throw error;
  }
};

export const submitConferenceProceedings = async (data) => {
  try {
    const response = await API.post(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + API_PATHS.CONFERENCE_PROCEEDINGS, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit conference proceedings:", error);
    throw error;
  }
};

export const submitConferencePaper = async (data) => {
  try {
    const response = await API.post(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + API_PATHS.CONFERENCE_PAPER, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit conference paper:", error);
    throw error;
  }
};

export const submitBook = async (data) => {
  try {
    const response = await API.post(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + API_PATHS.BOOK, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit book:", error);
    throw error;
  }
};

export const submitBookChapter = async (data) => {
  try {
    const response = await API.post(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + API_PATHS.BOOK_CHAPTER, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit book chapter:", error);
    throw error;
  }
};

export const submitReport = async (data) => {
  try {
    const response = await API.post(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + API_PATHS.REPORT, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit report:", error);
    throw error;
  }
};

export const searchDocumentBySubmitter = async (key, limit, page) => {
  try {
    const response = await API.get(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + API_PATHS.FIND_BY, {
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
