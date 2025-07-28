import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from './AuthContext';

export function useProtectedRoute() {
  const { authData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // We don't want to run anything until we're sure the auth state has been loaded.
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // If the user is signed in (`authData` exists) but they are in the auth flow (login/signup),
    // we should redirect them to the main part of the app.
    if (authData && inAuthGroup) {
      router.replace('/(tabs)/chats');
    }
    // If the user is NOT signed in and they are NOT in the auth flow,
    // we should redirect them to the login screen.
    else if (!authData && !inAuthGroup) {
      router.replace('/(auth)/login');
    }

  }, [authData, segments, loading, router]); // Re-run this effect when auth state, segments, or loading changes
}