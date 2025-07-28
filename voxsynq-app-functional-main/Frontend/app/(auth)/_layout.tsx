
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="login" />
    <Stack.Screen name="signup" />
    {/* All screens in this stack will have header hidden, including onboarding */}
  </Stack>
  );
}
