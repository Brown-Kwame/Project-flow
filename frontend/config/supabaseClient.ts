import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Use only manifest.extra for Expo Hermes reliability
const SUPABASE_URL = Constants.manifest?.extra?.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = Constants.manifest?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// For debugging: fallback to hardcoded values if manifest.extra is not available
// Remove these for production!
const url = SUPABASE_URL || 'https://iubqbncpfjopjfqoievs.supabase.co';
const key = SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1YnFibmNwZmpvcGpmcW9pZXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5OTIxMjAsImV4cCI6MjA2ODU2ODEyMH0.ZKdb3x18nz0i2HccR80sSkV8LxQeQoSzyADwAm6yrrM';

if (!url || !key) {
  throw new Error('Supabase environment variables are not set.');
}

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
