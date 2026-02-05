// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    // Auth endpoints
    AUTH_GOOGLE_REDIRECT: '/api/auth/google/redirect',
    AUTH_GOOGLE_CALLBACK: '/api/auth/google/callback',
    AUTH_VERIFY: '/api/auth/verify',
    AUTH_LOGOUT: '/api/auth/logout',
    
    // File endpoints
    FILE_UPLOAD_INIT: '/api/files/upload/init',
    FILE_UPLOAD_CHUNK: '/api/files/upload/chunk',
    FILE_DOWNLOAD: '/api/files/download',
    FILE_LIST: '/api/files/list',
    FILE_DELETE: '/api/files/delete',
    FILE_DATA: '/api/files/filedata',
  }
};

export default API_CONFIG;