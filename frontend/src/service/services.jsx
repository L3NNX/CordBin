// import axios from 'axios';
import apiClient, { API_CONFIG } from '../config/api';

// Auth Services
export const authService = {
  // Redirect to Google OAuth
  redirectToGoogleAuth: () => {
    window.location.href = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_GOOGLE_REDIRECT}`;
  },

  // Verify user authentication
  verifyAuth: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH_VERIFY);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH_LOGOUT);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// File Services
export const fileService = {
  // Initialize file upload
  initUpload: async (fileName, fileSize, fileType, totalChunks) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.FILE_UPLOAD_INIT, {
        fileName,
        fileSize,
        fileType,  // Changed from mimeType to fileType
        totalChunks  // Added totalChunks parameter
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload file chunk
  uploadChunk: async (fileId, chunkIndex, chunk, totalChunks, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('fileId', fileId);
      formData.append('chunkIndex', chunkIndex + 1); // Backend expects 1-based index
      formData.append('totalChunks', totalChunks);
      formData.append('chunk', chunk);

      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.FILE_UPLOAD_CHUNK,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // List all files
  listFiles: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.FILE_LIST);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get file details
  getFileData: async (fileId) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.FILE_DATA, {
        fileId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download file
  downloadFile: async (fileId) => {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.FILE_DOWNLOAD}/${fileId}`,
        {
          responseType: 'blob'
        }
      );
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete file
  deleteFile: async (fileIds) => {
    try {
       const ids = Array.isArray(fileIds) ? fileIds : [fileIds];
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.FILE_DELETE, {
        data: { fileIds: ids }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Status file
  getUploadStatus: async (fileId) => {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.FILE_UPLOAD_STATUS}/${fileId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create share link
  createShareLink: async (fileId, expiresIn = null) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.FILE_SHARED_CREATE, {
        fileId,
        expiresIn, // hours or null for no expiry
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove share link
  removeShareLink: async (fileId) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.FILE_SHARED_REMOVE, {
        fileId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get shared file info (NO AUTH)
  getSharedFileInfo: async (token) => {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.FILE_SHARED_INFO}/${token}/info`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download shared file (NO AUTH)
  downloadSharedFile: async (token) => {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.FILE_SHARED_DOWNLOAD}/${token}/download`,
        { responseType: 'blob' }
      );
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get storage stats
  getStorageStats: async () => {
  try {
     const response = await apiClient.get(API_CONFIG.ENDPOINTS.FILE_STATS);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},
};

export default apiClient;