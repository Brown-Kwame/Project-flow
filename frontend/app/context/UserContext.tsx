import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const PROFILE_STORAGE_KEY = 'asana_profile';
const DEFAULT_PROFILE = {
  name: 'James Doe',
  email: 'james@futurist.com',
  plan: 'Pro',
  profileImage: null,
};

type Profile = {
  name: string;
  email: string;
  plan: string;
  profileImage: string | null;
};

// Add authentication state and methods
// Only treat as authenticated if profile is not the default

type UserContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  isAuthenticated: boolean;
  login: (profile: Profile) => Promise<void>;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  profile: DEFAULT_PROFILE,
  setProfile: () => {},
  updateProfile: async () => {},
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
          setIsAuthenticated(
            parsed && parsed.email && parsed.email !== DEFAULT_PROFILE.email
          );
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    })();
  }, []);

  const updateProfile = async (updates: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Login method
  const login = async (profile: Profile) => {
    setProfile(profile);
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setIsAuthenticated(true);
  };

  // Logout method
  const logout = async () => {
    setProfile(DEFAULT_PROFILE);
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, updateProfile, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;