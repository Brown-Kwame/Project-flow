// Access the environment variable set in .env.local
// EXPO_PUBLIC_ prefix is required for Expo projects to expose variables to client-side code.
const API_GATEWAY_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error('ERROR: EXPO_PUBLIC_API_GATEWAY_URL must be set in app.json for Supabase backend.');
}

export default API_GATEWAY_URL;
