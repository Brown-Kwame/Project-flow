import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_URL = 'https://iubqbncpfjopjfqoievs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1YnFibmNwZmpvcGpmcW9pZXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5OTIxMjAsImV4cCI6MjA2ODU2ODEyMH0.ZKdb3x18nz0i2HccR80sSkV8LxQeQoSzyADwAm6yrrM';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL and anon key must be set in app.json or as environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
