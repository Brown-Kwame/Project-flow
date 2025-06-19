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

type UserContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  profile: DEFAULT_PROFILE,
  setProfile: () => {},
  updateProfile: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (stored) setProfile(JSON.parse(stored));
      } catch {}
    })();
  }, []);

  const updateProfile = async (updates: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);