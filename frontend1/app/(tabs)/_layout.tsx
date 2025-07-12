import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      detachInactiveScreens={false}
      backBehavior="initialRoute" // Always return to Home tab on back
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
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="home" color={color} />,
          tabBarLabelStyle: { fontWeight: '700', fontSize: 13, letterSpacing: 0.5, marginBottom: 2 },
          tabBarItemStyle: { paddingVertical: 6, marginHorizontal: 2 },
        }}
      />
      <Tabs.Screen
        name="Tasks"
        options={{
          title: 'Tasks',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="check-square" color={color} />,
          tabBarLabelStyle: { fontWeight: '700', fontSize: 13, letterSpacing: 0.5, marginBottom: 2 },
          tabBarItemStyle: { paddingVertical: 6, marginHorizontal: 2 },
        }}
      />

            <Tabs.Screen
        name="Inbox"
        options={{
          title: 'Inbox',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name='bell' color={color} />,
          tabBarLabelStyle: { fontWeight: '700', fontSize: 13, letterSpacing: 0.5, marginBottom: 2 },
          tabBarItemStyle: { paddingVertical: 6, marginHorizontal: 2 },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
          tabBarLabelStyle: { fontWeight: '700', fontSize: 13, letterSpacing: 0.5, marginBottom: 2 },
          tabBarItemStyle: { paddingVertical: 6, marginHorizontal: 2 },
        }}
      />

    </Tabs>
  );
}
