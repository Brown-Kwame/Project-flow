

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: API_GATEWAY_URL constant and its check are REMOVED from here.
// Each service file will now define its own service-specific URL.

// Create an Axios instance without a baseURL. Each service will provide the full URL.
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Keep the increased timeout for now
});

/**
 * Sets the Authorization header for all subsequent requests made by this Axios instance.
 * Call this function after a successful login/registration.
 * @param {string | null} token The JWT token to set.
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Add a request interceptor to automatically include the JWT token in every request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage for interceptor:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling or logging
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Error Response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('API Error Request (No Response):', error.request);
      } else {
        console.error('API Error Message:', error.message);
      }
    } else {
      console.error('Non-Axios Error:', error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;