import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useCallSignal } from '@/context/CallSignalContext';
import { callService, userService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';

const ContactItem = ({ item, router }) => {
  const contact = item;

  const openInfo = () => {
    router.push({
      pathname: '/contactInfo',
      params: {
        contactId: contact.id,
        contactName: contact.username,
        contactEmail: contact.email,
        profilePictureUrl: contact.profilePictureUrl,
        createdAt: contact.createdAt,
      },
    });
  };

  const { authData } = useAuth();
  const { sendCallSignal } = useCallSignal();

  const onVoiceCall = async () => {
    try {
      const startedCall = await callService.startCall(authData.user.id, contact.id, 'VOICE');
      sendCallSignal({
        type: 'CALL_OFFER',
        fromUserId: authData.user.id,
        toUserId: contact.id,
        callId: startedCall.id,
        fromUserName: authData.user.username,
      });
      router.push({
        pathname: '/call-background',
        params: {
          name: contact.username,
          avatar: contact.profilePictureUrl || '',
          callId: startedCall.id,
          toUserId: contact.id,
        },
      });
    } catch (e) {
      alert('Failed to start call');
    }
  };
  const onVideoCall = async () => {
    try {
      const startedCall = await callService.startCall(authData.user.id, contact.id, 'VIDEO');
      sendCallSignal({
        type: 'CALL_OFFER',
        fromUserId: authData.user.id,
        toUserId: contact.id,
        callId: startedCall.id,
        fromUserName: authData.user.username,
        callType: 'VIDEO',
      });
      router.push({
        pathname: '/video-call-background',
        params: {
          name: contact.username,
          avatar: contact.profilePictureUrl || '',
          callId: startedCall.id,
          toUserId: contact.id,
        },
      });
    } catch (e) {
      alert('Failed to start video call');
    }
  };

  return (
    <View style={styles.contactItemContainer}>
      <Pressable style={styles.infoContainer} onPress={openInfo}>
        <View style={styles.avatar}>
          <Avatar imageUrl={contact.profilePictureUrl} name={contact.username} size={48} />
        </View>
        <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{contact.username}</Text>
            <Text style={styles.contactEmail}>{contact.email}</Text>
        </View>
      </Pressable>

      <View style={styles.callIconsContainer}>
        <Pressable onPress={onVoiceCall} hitSlop={15}>
            <Ionicons name="call" size={24} color="#007AFF" />
        </Pressable>
        <Pressable onPress={onVideoCall} hitSlop={15}>
            <Ionicons name="videocam" size={24} color="#007AFF" />
        </Pressable>
      </View>
    </View>
  );
};

const ContactsScreen = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  // --- NEW STATE to control search bar visibility ---
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const router = useRouter();
  const { authData } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authData) return;
      try {
        setLoading(true);
        const users = await userService.getAllUsers();
        setAllUsers(users.filter(user => user.id !== authData.user.id));
      } catch (error) { console.error("Failed to fetch contacts", error); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, [authData]);

  const groupedUsers = useMemo(() => {
    const filtered = allUsers.filter(user =>
      user.username?.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) return [];

    const grouped = filtered.reduce((acc, user) => {
      const firstLetter = user.username[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(user);
      return acc;
    }, {});

    return Object.keys(grouped).sort().map(letter => ({
      title: letter,
      data: grouped[letter].sort((a, b) => a.username.localeCompare(b.username))
    }));

  }, [search, allUsers]);

  if (loading || !authData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <View style={styles.headerIcons}>
          {/* --- NEW FUNCTIONALITY: Pressing this icon toggles the search bar --- */}
          <Pressable onPress={() => setIsSearchVisible(!isSearchVisible)}>
            <Ionicons name="search" size={24} color="#007AFF" />
          </Pressable>
          <Pressable onPress={() => router.push('/new-chat')}>
            <Ionicons name="person-add" size={24} color="#007AFF" />
          </Pressable>
        </View>
      </View>

      {/* --- NEW: Conditionally render the search bar based on state --- */}
      {isSearchVisible && (
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
            style={styles.searchInput}
            placeholder="Search all contacts..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#8e8e93"
            autoFocus={true} // Automatically focus the input when it appears
            />
            {search.length > 0 && (
                <Pressable onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={20} color="#8e8e93" />
                </Pressable>
            )}
        </View>
      )}

      <SectionList
        sections={groupedUsers}
        renderItem={({ item }) => <ContactItem item={item} router={router} />}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{search ? 'No results found' : 'No contacts found.'}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// --- NEW STYLES have been added for the search bar ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10, // Add some space from the header
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  contactItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  contactDetails: {
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: '#888',
  },
  callIconsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 25,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f7f7f7',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888'
  },
  emptyContainer: {
    paddingTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default ContactsScreen;