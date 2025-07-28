// API Configuration
// Change this IP address when your network changes
export const API_CONFIG = {
  BASE_URL: 'http://192.168.244.88:8080',
  API_BASE_URL: 'http://192.168.244.88:8080/api',
  WEBSOCKET_URL: 'http://192.168.244.88:8080/ws'
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${API_CONFIG.API_BASE_URL}${endpoint}`;

// Helper function to get full WebSocket URL
export const getWebSocketUrl = () => API_CONFIG.WEBSOCKET_URL; 