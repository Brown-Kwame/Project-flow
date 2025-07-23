import React, { useEffect, useRef, useState, Suspense, lazy, useMemo } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Dynamically import BloomCard for code splitting
const BloomCard = lazy(() => import('../components/BloomCard'));

const Index = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colorMode = colorScheme === 'dark' ? 'dark' : 'light';

  // Prefetch key screens for instant navigation
  useEffect(() => {
    if (router && router.prefetch) {
      router.prefetch('/projects/Projects');
      router.prefetch('/tasks/Tasks');
      router.prefetch('/dashboard/Dashboard');
      router.prefetch('/Goals/Goals');
    }
  }, [router]);

  const themeColors = {
    light: {
      background: '#ffffff',
      text: '#1a1a1a',
      card: '#f7f9fc',
      infoBox: '#e6f0ff',
      shadow: '#cbd5e1',
    },
    dark: {
      background: '#0f1116',
      text: '#f0f0f0',
      card: '#1a1a1a',
      infoBox: '#334155',
      shadow: '#0ea5e9',
    },
  }[colorMode];

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const inbox = await AsyncStorage.getItem('asana_inbox');
        if (inbox) {
          const messages = JSON.parse(inbox);
          const unread = messages.filter((m: any) => m.user !== 'You').length;
          setUnreadCount(unread);
        } else {
          setUnreadCount(3);
        }
      } catch {
        setUnreadCount(3);
      }
    };
    fetchUnread();
  }, []);

  // Memoize bloomCards for performance
  const bloomCards = useMemo(() => [
    {
      title: 'Projects',
      subtitle: 'All your projects at a glance',
      iconName: '👥',
      onPress: () => router.push('/projects/Projects'),
    },
    {
      title: 'Tasks',
      subtitle: 'Your actionable items',
      iconName: '✅',
      onPress: () => router.push('/tasks/Tasks'),
    },
    {
      title: 'Dashboard',
      subtitle: 'Analytics & progress',
      iconName: '📊',
      onPress: () => router.push('/dashboard/Dashboard'),
    },
    {
      title: 'Goals',
      subtitle: 'Set and track goals',
      iconName: '🎯',
      onPress: () => router.push('/Goals/Goals'),
    },
  ], [router]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View className="flex-1 pt-10 px-4" style={{ backgroundColor: themeColors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: themeColors.card,
            shadowColor: themeColors.shadow,
          }}
          className="rounded-2xl p-5 shadow-sm mb-6"
        >
          <View>
            <View className="flex-row items-center mb-7">
              <Image
                source={require('../../assets/images/AI.png')}
                className="w-8 h-8 mr-3"
              />
              <Text className="text-xl font-bold tracking-wider" style={{ color: themeColors.text }}>
                Project Flow
              </Text>
              <View className="flex-1" />
            </View>

            <View
              className="rounded-xl p-4 mb-6"
              style={{ backgroundColor: themeColors.infoBox }}
            >
              <Text className="text-base leading-6" style={{ color: themeColors.text }}>
                Get a quick overview of your projects, tasks, and goals. Use the cards below to dive
                into details, track progress, and stay organized every day.
              </Text>
            </View>

            <View className="w-full items-center mb-6">
              <Suspense fallback={<Text>Loading cards...</Text>}>
                {bloomCards.map((card) => (
                  <TouchableOpacity
                    key={card.title}
                    onPress={card.onPress}
                    className="w-full mb-4"
                  >
                    <BloomCard
                      title={card.title}
                      subtitle={card.subtitle}
                      iconName={card.iconName}
                      onPress={card.onPress}
                    />
                  </TouchableOpacity>
                ))}
              </Suspense>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Index;
