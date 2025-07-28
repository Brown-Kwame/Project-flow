import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/api'; // Using path alias from tsconfig.json

// Define the shape of our authentication data
interface AuthData {
  token: string | null;
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
}

// Define the shape of our context value
interface AuthContextData {
  authData: AuthData | null;
  loading: boolean;
  signIn(credentials: any): Promise<void>;
  signOut(): void;
}

// Create the context with a default value that includes dummy functions
const AuthContext = createContext<AuthContextData>({
  authData: null,
  loading: true,
  signIn: async () => {}, // Dummy function
  signOut: () => {},      // Dummy function
});

// Create the AuthProvider component that will wrap our app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect runs when the component mounts. We use it to check for a stored token.
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        // Try to get the token from secure storage
        const token = await SecureStore.getItemAsync('authToken');
        const userDataString = await SecureStore.getItemAsync('userData');

        if (token && userDataString) {
          // If we have a token and user data, set the auth state
          const user = JSON.parse(userDataString);
          setAuthData({ token, user });
        }
      } catch (error) {
        console.error('Failed to load auth data', error);
      } finally {
        // We're done loading, whether we found a token or not
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // The function to handle signing in
  const signIn = async (credentials: any) => {
    try {
      // Call our API's signin endpoint
      const response = await authService.signin(credentials);

      // Create the auth data object from the backend response
      const newAuthData = {
        token: response.token,
        user: {
          id: response.id,
          username: response.username,
          email: response.email,
        },
      };

      // Set the state
      setAuthData(newAuthData);

      // Store the token and user data securely
      await SecureStore.setItemAsync('authToken', newAuthData.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(newAuthData.user));

    } catch (error) {
      // If signin fails, re-throw the error so the component can handle it
      throw error;
    }
  };

  // The function to handle signing out
  const signOut = async () => {
    // Clear the auth state
    setAuthData(null);
    // Remove the token and user data from secure storage
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('userData');
  };

  return (
    // Provide the auth state and functions to all children components
    <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to easily use the auth context in any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}