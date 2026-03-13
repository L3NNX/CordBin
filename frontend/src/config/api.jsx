// config/api.jsx
import axios from "axios";

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  ENDPOINTS: {
    AUTH_GOOGLE_REDIRECT: "/api/auth/google/redirect",
    AUTH_GOOGLE_CALLBACK: "/api/auth/google/callback",
    AUTH_VERIFY: "/api/auth/verify",
    AUTH_LOGOUT: "/api/auth/logout",

    FILE_UPLOAD_INIT: "/api/files/upload/init",
    FILE_UPLOAD_CHUNK: "/api/files/upload/chunk",
    FILE_LIST: "/api/files/list",
    FILE_DELETE: "/api/files/delete",
    FILE_DATA: "/api/files/filedata",
    FILE_DOWNLOAD: "/api/files/download",
    FILE_PREVIEW: "/api/files/preview",
    FILE_UPLOAD_STATUS: "/api/files/upload/status",

    FILE_SHARED_CREATE: "/api/files/share/create",     
    FILE_SHARED_REMOVE: "/api/files/share/remove",     
    FILE_SHARED_INFO: "/api/files/shared",             
    FILE_SHARED_DOWNLOAD: "/api/files/shared",
  },
};

// ✅ Axios instance (THIS is what has .get / .post)
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
