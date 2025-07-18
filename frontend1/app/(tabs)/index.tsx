import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useRef, useEffect, useContext } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useProjectContext } from '../context/ProjectContext';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BloomCard from '../components/BloomCard';
import { ThemeContext } from './_layout';
import { Colors } from '@/constants/Colors';
// ...existing code...



const Index = () => {
  const router = useRouter();
  useProjectContext();
  useUser();
  const { theme } = useContext(ThemeContext);
  const systemColorScheme = useColorScheme();
  let colorMode: 'light' | 'dark' = 'light';
  if (theme === 'dark') colorMode = 'dark';
  else if (theme === 'system') colorMode = systemColorScheme === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorMode];

  // Unread notification count state
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Fetch unread count from AsyncStorage (simulate notifications/messages)
  React.useEffect(() => {
    const fetchUnread = async () => {
      try {
        const inbox = await AsyncStorage.getItem('asana_inbox');
        if (inbox) {
          const messages = JSON.parse(inbox);
          // Count messages not sent by 'You' as unread (demo logic)
          const unread = messages.filter((m: any) => m.user !== 'You').length;
          setUnreadCount(unread);
        } else {
          setUnreadCount(3); // fallback demo value
        }
      } catch {
        setUnreadCount(3);
      }
    };
    fetchUnread();
  }, []);

  // Card data for each summary
  const bloomCards = [
    {
      title: 'Projects',
      subtitle: 'All your projects at a glance',
      iconName: 'group',
      onPress: () => router.push('/projects/Projects'),
    },
    {
      title: 'Tasks',
      subtitle: 'Your actionable items',
      iconName: 'check-square',
      onPress: () => router.push('/tasks/Tasks'),
    },
    {
      title: 'Dashboard',
      subtitle: 'Analytics & progress',
      iconName: 'line-chart',
      onPress: () => router.push('/dashboard/Dashboard'),
    },
    {
      title: 'Goals',
      subtitle: 'Set and track goals',
      iconName: 'flag',
      onPress: () => router.push('/Goals/Goals'),
    },
  ];

  // Animation states
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
    <View style={[styles.container1, { backgroundColor: themeColors.background }]}> {/* Theme-aware container */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View
          style={[styles.container2, { backgroundColor: colorMode === 'light' ? '#f7f9fc' : themeColors.background, shadowColor: themeColors.icon }]}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
              <Image
                source={require('../../assets/images/Icon.png')}
                style={{ width: 32, height: 32, marginRight: 12 }}
              />
              <Text style={[styles.brandTitle, { color: themeColors.text }]}>Project Flow</Text>
              <View style={{ flex: 1 }} />
              {/* Notification bell icon for direct messages */}
              <TouchableOpacity onPress={() => router.push('/Inbox?section=direct-messages')} style={{ position: 'relative' }}>
                <FontAwesome name='bell' size={24} style={{ marginLeft: 12 }} color={themeColors.tint} />
                {unreadCount > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: '#ff4d4d', borderColor: themeColors.background }]}> {/* Badge color stays red for visibility */}
                    <Text style={styles.unreadText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={[styles.introBox, { backgroundColor: colorMode === 'light' ? '#e6f0ff' : themeColors.icon }]}> {/* Theme-aware intro box */}
              <Text style={[styles.introText, { color: themeColors.text }]}>Get a quick overview of your projects, tasks, and goals. Use the cards below to dive into details, track progress, and stay organized every day.</Text>
            </View>

            {/* Professional summary cards */}
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 24 }}>
              {bloomCards.map((card) => (
                <BloomCard key={card.title} {...card} />
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Index;

// Define styles object
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 18,
  },
  container2: {
    borderRadius: 18,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  introBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  introText: {
    fontSize: 16,
    lineHeight: 22,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 3,
    borderWidth: 1,
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});

