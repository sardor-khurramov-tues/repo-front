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

export const searchDocumentAsSubmitter = async (key, limit, page) => {
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

export const getDocumentAsSubmitter = async (id) => {
  try {
    const response = await API.get(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id);
    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const deleteDocumentAsSubmitter = async (id) => {
  try {
    await API.delete(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id);
    return true;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const addContributorToDocument = async (id, appUserId, docRole) => {
  try {
    await API.put(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id + API_PATHS.CONTRIBUTOR, { appUserId, docRole });
    return true;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const removeContributorFromDocument = async (id) => {
  try {
    await API.delete(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + API_PATHS.CONTRIBUTOR + "/" + id);
    return true;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const updateDissertation = async (id, data) => {
  try {
    const response = await API.put(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id + API_PATHS.DISSERTATION, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit dissertation:", error);
    throw error;
  }
};

export const updateConfProceed = async (id, data) => {
  try {
    const response = await API.put(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id + API_PATHS.CONFERENCE_PROCEEDINGS, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit conference proceedings:", error);
    throw error;
  }
};

export const updateConfPaper = async (id, data) => {
  try {
    const response = await API.put(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id + API_PATHS.CONFERENCE_PAPER, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit conference paper:", error);
    throw error;
  }
};

export const updateBook = async (id, data) => {
  try {
    const response = await API.put(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id + API_PATHS.BOOK, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit book:", error);
    throw error;
  }
};

export const updateBookChapter = async (id, data) => {
  try {
    const response = await API.put(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id + API_PATHS.BOOK_CHAPTER, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit book chapter:", error);
    throw error;
  }
};

export const updateReport = async (id, data) => {
  try {
    const response = await API.put(API_PATHS.AUTHOR + API_PATHS.DOCUMENT + "/" + id + API_PATHS.REPORT, data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit report:", error);
    throw error;
  }
};

export const searchPublishedDocumentAsStaff = async (key, limit, page) => {
  try {
    const response = await API.get(API_PATHS.STAFF + API_PATHS.DOCUMENT + API_PATHS.FIND_BY, {
      params: {
        key: key || '',
        isPublished: true,
        limit,
        page,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const searchNonpublishedDocumentAsStaff = async (key, limit, page) => {
  try {
    const response = await API.get(API_PATHS.STAFF + API_PATHS.DOCUMENT + API_PATHS.FIND_BY, {
      params: {
        key: key || '',
        isPublished: false,
        limit,
        page,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const getDocumentAsStaff = async (id) => {
  try {
    const response = await API.get(API_PATHS.STAFF + API_PATHS.DOCUMENT + "/" + id);
    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const publishDocumentAsStaff = async (id) => {
  try {
    await API.post(API_PATHS.STAFF + API_PATHS.DOCUMENT + "/" + id);
    return true;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const deleteDocumentAsStaff = async (id) => {
  try {
    await API.delete(API_PATHS.STAFF + API_PATHS.DOCUMENT + "/" + id);
    return true;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};
