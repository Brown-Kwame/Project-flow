// Access the environment variable set in .env.local
// EXPO_PUBLIC_ prefix is required for Expo projects to expose variables to client-side code.
const API_GATEWAY_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  console.error(
    "ERROR: EXPO_PUBLIC_API_GATEWAY_URL is not defined in your .env.local file. " +
    "Please ensure it exists and contains 'EXPO_PUBLIC_API_GATEWAY_URL=http://localhost:8080' (or your actual Gateway URL)."
  );
  // For development, you might want to throw an error or use a fallback.
  // In production, build systems typically ensure this is set.
  throw new Error("API Gateway URL is not configured.");
}

export default API_GATEWAY_URL;
