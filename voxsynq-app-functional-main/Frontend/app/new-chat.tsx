import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, FlatList, Image, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
// NEW: Import our working API service
import { userService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const NewChatScreen = () => {
  const router = useRouter();
  const { authData } = useAuth(); // To filter ourselves out of the list

  // --- REPLACED LOGIC: State to hold backend users, not phone contacts ---
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // --- REPLACED LOGIC: Fetch users from our backend ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await userService.getAllUsers();
        // Filter out the currently logged-in user
        const filtered = allUsers.filter(user => user.id !== authData.user.id);
        setUsers(filtered);
      } catch (e) {
        Alert.alert('Error', 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authData]);

  // --- REPLACED LOGIC: Filter backend users based on search ---
  const filteredUsers = useMemo(() => {
      if (!search.trim()) return users;
      const lowerSearch = search.toLowerCase();
      return users.filter(
        (user) =>
          user.username?.toLowerCase().includes(lowerSearch) ||
          user.email?.toLowerCase().includes(lowerSearch)
      );
  }, [search, users]);

  // --- REPLACED LOGIC: Navigate to our working chat screen ---
  const handleContactSelect = (user) => {
    // Navigate directly to the one-on-one chat screen
    router.push({
      pathname: `/chat/${user.id}`,
      params: {
        contactName: user.username
      }
    });
  };

  return (
    // Replaced View with SafeAreaView for better screen fitting
    <SafeAreaView style={styles.container}>
      {/* Added Expo Router Stack.Screen for header configuration */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Start a New Chat',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </Pressable>
          ),
        }}
      />

      {/* --- KEPT UI: Section for starting chat by username/email --- */}
      <View style={styles.phoneInputSection}>
        {/* Simplified for now, can be implemented later */}
        <Text style={styles.sectionTitle}>Find User</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username or email..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.sectionTitle}>Users on VoxSynq</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // --- KEPT UI, ADAPTED LOGIC ---
            <Pressable
              style={styles.contactItem}
              onPress={() => handleContactSelect(item)}
            >
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{item.username?.charAt(0).toUpperCase() || '?'}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.username}</Text>
                <Text style={styles.contactPhone}>{item.email}</Text>
              </View>
            </Pressable>
          )}
          style={{ flex: 1, marginTop: 10 }}
        />
      )}
    </SafeAreaView>
  );
};

// --- KEPT STYLES, slightly adjusted ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eef5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactPhone: { // Re-purposed for email
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  phoneInputSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
});

export default NewChatScreen;