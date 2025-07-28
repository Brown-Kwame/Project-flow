import { MoodRecommendationItem } from '@/components/home/MoodRecommendationItem';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const QuickStat = ({ title, value, icon, color, onPress }) => (
    <Pressable style={styles.statsCard} onPress={onPress}>
        <View style={[styles.statsIcon, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
    </Pressable>
);

const HomeScreen = () => {
  const router = useRouter();
  const { authData } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!authData) return;
      try {
        setLoading(true);
        const users = await userService.getAllUsers();
        setContacts(users.filter(user => user.id !== authData.user.id));
      } catch (err) { console.error("Failed to load home screen data", err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [authData]);

  const onRefresh = useCallback(async () => {
      setIsRefreshing(true);
      if (!authData) return;
      try {
        const users = await userService.getAllUsers();
        setContacts(users.filter(user => user.id !== authData.user.id));
      } catch (err) { console.error(err); }
      setIsRefreshing(false);
  }, [authData]);

  const handleSendMessage = (contactId: string, contactName: string) => {
    router.push({ pathname: `/chat/${contactId}`, params: { contactName } });
  };

  const moodRecommendations = contacts.slice(0, 2).map((user: any, index: number) => ({
      id: user.id.toString(),
      contact: user.username,
      contactId: user.id.toString(),
      type: 'message' as 'message' | 'call' | 'video',
      reason: index === 0 ? "They're online and active" : 'You usually chat on Tuesdays',
      icon: index === 0 ? 'wifi' : 'calendar',
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VoxSynq</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 120 }} // Add padding to bottom
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            <QuickStat title="Active Calls" value="0" icon="call" color="#4CAF50" onPress={() => router.push('/(tabs)/calls')} />
            <QuickStat title="Unread" value="0" icon="chatbubbles" color="#FF9800" onPress={() => router.push('/(tabs)/chats')} />
            <QuickStat title="Online Friends" value={contacts.length} icon="people" color="#007AFF" onPress={() => router.push('/(tabs)/contacts')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Suggestions</Text>
          {moodRecommendations.map((recommendation) => (
            <MoodRecommendationItem
                key={recommendation.id}
                recommendation={recommendation}
                onSendMessage={() => handleSendMessage(recommendation.contactId, recommendation.contact)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Calls</Text>
          <Text style={styles.placeholderText}>No upcoming calls scheduled.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Birthday Alerts</Text>
          <Text style={styles.placeholderText}>No birthdays today.</Text>
        </View>
      </ScrollView>

      {/* --- MOVED THE FAB CONTAINER HERE, OUTSIDE OF THE SCROLLVIEW --- */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  statsCard: {
    flex: 1, backgroundColor: '#f0f4f8', borderRadius: 12, padding: 15,
    alignItems: 'center',
  },
  statsIcon: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  statsValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  statsTitle: { fontSize: 12, color: '#666', textAlign: 'center' },
  placeholderText: {
    padding: 20, backgroundColor: '#f0f4f8', borderRadius: 12,
    textAlign: 'center', color: '#888'
  },
  // --- UPDATED STYLE FOR fabContainer ---
  fabContainer: {
    position: 'absolute', // This is the key to making it "float"
    bottom: 40, // Position from the bottom of the screen
    right: 20,   // Position from the right of the screen
    alignItems: 'center',
    gap: 15,
  },
  fab: {
      width: 56, height: 56, borderRadius: 28,
      justifyContent: 'center', alignItems: 'center',
      elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2},
      shadowOpacity: 0.2, shadowRadius: 4
  },
  fabCall: { backgroundColor: '#007AFF' },
  fabVideo: { backgroundColor: '#E91E63' },
});

export default HomeScreen;