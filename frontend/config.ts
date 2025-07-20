// Use Expo Constants for Hermes compatibility
import Constants from 'expo-constants';

const API_GATEWAY_URL = Constants.manifest?.extra?.EXPO_PUBLIC_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error('ERROR: EXPO_PUBLIC_API_GATEWAY_URL must be set in app.json for Supabase backend.');
}

export default API_GATEWAY_URL;
