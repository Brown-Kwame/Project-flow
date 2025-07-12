import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ProjectProvider } from './context/ProjectContext';
import { UserProvider, useUser } from './context/UserContext';
import '../global.css'
function AppNavigator() {
  const { isAuthenticated } = useUser();
  // When not authenticated, only show auth screens (Signin is always first
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerTitle: '', headerShown: false }}>
        {/* Signin is always the initial route for unauthenticated users */}
       <Stack.Screen name="(auth)/AuthScreen" options={{ headerShown: false }} />
       <Stack.Screen name="(auth)/Signin" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)/forgotpassword" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)/changepass" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)/contact" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)/pricing" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)/Billing" options={{ headerShown: false }} />
      </Stack>
    );
  }
  // Main app screens only if authenticated
  return (
    <Stack screenOptions={{ headerTitle: '', headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Slider/Slider" options={{ headerShown: false }} />
      <Stack.Screen name="Goals/Goals" options={{ headerShown: false }} />
      <Stack.Screen name="home/Mainindex" options={{ headerShown: false }} />
      <Stack.Screen name="inbox/Inbox" options={{ headerShown: false }} />
      <Stack.Screen name="projects/Projects" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard/Dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="tasks/Tasks" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <UserProvider>
      <ProjectProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AppNavigator />
          <StatusBar style="auto" />
        </ThemeProvider>
      </ProjectProvider>
    </UserProvider>
  );
}