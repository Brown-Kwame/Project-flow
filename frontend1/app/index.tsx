import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redirect to your Auth screen on app launch
    router.replace('/(auth)/AuthScreen');

  }, []);

  return null;
}
