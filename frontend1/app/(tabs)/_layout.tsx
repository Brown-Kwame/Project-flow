import React, { useState, useMemo } from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AntDesign } from '@expo/vector-icons';

// Theme context for app-wide theme switching
export const ThemeContext = React.createContext({ theme: 'light', setTheme: (_: string) => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
const ExploreTabBarIcon = ({ color }: { color: string }) => (
  <FontAwesome size={24} name="user" color={color} />
);

const HomeTabBarIcon = ({ color }: { color: string }) => (
  <FontAwesome size={26} name="home" color={color} />
);

const TasksTabBarIcon = ({ color }: { color: string }) => (
  <FontAwesome size={24} name="check-square" color={color} />
);

const InboxTabBarIcon = ({ color }: { color: string }) => (
  <FontAwesome size={24} name="bell" color={color} />
);
const ChatTabBarIcon = ({ color }: { color: string }) => (
  <AntDesign size={24} name="message1" color={color} />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider>
      <Tabs
        detachInactiveScreens={false}
        backBehavior="initialRoute"
        screenListeners={{
          tabPress: e => {
            // Optionally, can add analytics or haptic feedback here for instant response
          },
        }}
        
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: HomeTabBarIcon,
            tabBarLabelStyle: { fontWeight: '700', fontSize: 13, letterSpacing: 0.5, marginBottom: 2 },
            tabBarItemStyle: { paddingVertical: 6, marginHorizontal: 2 },
          }}
        />
     
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Account',
            headerShown: false,
            tabBarIcon: ExploreTabBarIcon,
            tabBarLabelStyle: { fontWeight: '700', fontSize: 13, letterSpacing: 0.5, marginBottom: 2 },
            tabBarItemStyle: { paddingVertical: 6, marginHorizontal: 2 },
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}


