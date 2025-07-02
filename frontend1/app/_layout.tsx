import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ProjectProvider } from './context/ProjectContext';
import { UserProvider } from './context/UserContext';

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
          <Stack  screenOptions={{
              headerTitle: "", // Hide title, show back arrow
             headerShown:false// Hide back text on iOS
            }}
     >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="Slider" options={{ headerShown: false }} />
           <Stack.Screen name="Goals" options={{ headerShown: false }} />
<Stack.Screen name="billing" options={{ headerShown: false }} />
<Stack.Screen name="inbox" options={{ headerShown: false }} />
<Stack.Screen name="projects" options={{ headerShown: false }} />
<Stack.Screen name="home" options={{ headerShown: false }} />
<Stack.Screen name="creator" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ProjectProvider>
    </UserProvider>
  );
}
