import Avatar from '@/components/Avatar';
import StatusIndicator from '@/components/StatusIndicator';
import { useAuth } from '@/context/AuthContext';
import { useGroups, useSetGroups, useUpdateGroup } from '@/context/GroupContext';
import { chatService, groupService, messageService } from '@/services/api';
import { useGroupWebSocket, useWebSocket } from '@/services/useWebSocket';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    FlatList,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

// This component can be extracted to its own file later if needed
// It highlights the search text within a larger string.
const HighlightedText = ({ text = '', highlight = '' }) => {
  if (!highlight.trim()) {
    return <Text>{text}</Text>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <Text>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={i} style={styles.highlightedText}>{part}</Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};

const GroupAvatar = ({ imageUrl }) => {
  const [imageError, setImageError] = useState(false);
  if (imageUrl && !imageError) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.avatarFallback}
        onError={() => setImageError(true)}
      />
    );
  }
  return (
    <View style={styles.avatarFallback}>
      <Ionicons name="people" size={28} color="#007AFF" />
    </View>
  );
};


const ChatsListScreen = () => {
  const router = useRouter();
  const { authData } = useAuth();
  const groups = useGroups();
  const setGroups = useSetGroups();
  const updateGroup = useUpdateGroup();

  // --- STATE MANAGEMENT: Merged from both versions ---
  // State from our working version
  const [conversations, setConversations] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state from the new version
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [toggleSearch, setToggleSearch] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState(new Set());

  // Animation refs from the new version
  const translateY = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  // --- DATA FETCHING LOGIC: Transplanted from our working version ---
  useEffect(() => {
    const fetchConversations = async () => {
      if (!authData) return;
      try {
        setLoading(true);
        const convos = await messageService.getConversations();
        console.log('Fetched conversations:', convos);
        const groupsFromApi = await groupService.getGroups();
        // Fetch latest message for each group
        const groupsWithLatest = await Promise.all(groupsFromApi.map(async group => {
          try {
            const messages = await messageService.getGroupMessages(group.id);
            const latest = messages && messages.length > 0
              ? messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
              : null;
            // Fetch unread count
            let unreadCount = 0;
            try {
              unreadCount = await chatService.getGroupUnreadCount(group.id);
            } catch {}
            return { ...group, latestMessage: latest, unreadCount };
          } catch {
            return { ...group, latestMessage: null, unreadCount: 0 };
          }
        }));
        // Fetch unread counts for private chats
        const convosWithUnread = await Promise.all(convos.map(async convo => {
          let unreadCount = 0;
          try {
            const otherUserId = convo.senderId === authData.user.id ? convo.recipientId : convo.senderId;
            unreadCount = await chatService.getPrivateUnreadCount(otherUserId);
          } catch {}
          return { ...convo, unreadCount };
        }));
        setConversations(convosWithUnread);
        setGroups(groupsWithLatest);
      } catch (error) {
        Alert.alert("Error", "Could not load your conversations.");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [authData]); // Refreshes if the user logs in/out

  // Helper to update unread count for a group
  const updateGroupUnreadCount = async (groupId) => {
    try {
      const unreadCount = await chatService.getGroupUnreadCount(groupId);
      setGroups(prevGroups => prevGroups.map(g => g.id === groupId ? { ...g, unreadCount } : g));
    } catch {}
  };
  // Helper to update unread count for a private chat
  const updatePrivateUnreadCount = async (otherUserId) => {
    try {
      const unreadCount = await chatService.getPrivateUnreadCount(otherUserId);
      setConversations(prevConvos => prevConvos.map(c => {
        const id = c.senderId === authData.user.id ? c.recipientId : c.senderId;
        return id === otherUserId ? { ...c, unreadCount } : c;
      }));
    } catch {}
  };

  // Add WebSocket for real-time updates
  const onMessageReceived = React.useCallback((newMessage) => {
    // Always fetch the latest conversations for consistency
    const fetchConversations = async () => {
      if (!authData) return;
      try {
        const convos = await messageService.getConversations();
        setConversations(convos);
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchConversations();

    // NEW: Update group latestMessage in real time
    if (newMessage.groupId) {
      // Only update unread count if the current user is NOT the sender
      if (newMessage.senderId !== authData.user.id) {
        updateGroupUnreadCount(newMessage.groupId);
      }
      setGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === newMessage.groupId
            ? { ...group, latestMessage: newMessage }
            : group
        )
      );
    }
    // NEW: Update private chat unread count in real time
    if (newMessage.senderId && newMessage.recipientId && !newMessage.groupId) {
      const otherUserId = newMessage.senderId === authData.user.id ? newMessage.recipientId : newMessage.senderId;
      // Only update unread count if the current user is NOT the sender
      if (newMessage.senderId !== authData.user.id) {
        updatePrivateUnreadCount(otherUserId);
      }
    }
  }, [authData]);
  useWebSocket(onMessageReceived);

  // Listen for real-time group info updates
  useGroupWebSocket((groupUpdate) => {
    updateGroup(groupUpdate);
  });

  // --- UI LOGIC & ANIMATIONS: Kept from the new version ---
  useEffect(() => {
    // This animation logic for the modal is kept exactly as it was.
    if (modalVisible) {
      modalScale.setValue(0.8);
      modalOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(modalScale, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(modalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(modalOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
  }, [modalVisible]);

  // --- NAVIGATION: Kept from new version, but will require new screens ---
  const handleNewChat = () => {
      setModalVisible(false);
      router.push('/new-chat'); // Now navigates to the new file we created
  };
 const handleNewGroupChat = () => {
     setModalVisible(false);
     router.push('/new-group-chat'); // Now navigates to the new file
 };

  // --- SELECTION MODE LOGIC: Adapted to work with our state ---
  const handleLongPress = (chatId) => {
    setSelectionMode(true);
    setSelectedChats(new Set([chatId]));
  };

  const handleChatSelect = (chatId) => {
    if (selectionMode) {
      const newSelected = new Set(selectedChats);
      newSelected.has(chatId) ? newSelected.delete(chatId) : newSelected.add(chatId);
      setSelectedChats(newSelected);
      if (newSelected.size === 0) setSelectionMode(false);
    }
  };

  const handleDeleteSelected = () => {
    // This now updates our local state. The change will not persist on reload.
    // TODO: Implement a backend API call to delete these chats.
    const updatedConversations = conversations.filter(chat => !selectedChats.has(chat.id));
    setConversations(updatedConversations);
    setSelectionMode(false);
    setSelectedChats(new Set());
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedChats(new Set());
  };

  // --- SEARCH/FILTER LOGIC: Adapted to work with our real data ---
  // Always sort conversations by latest message timestamp (descending)
  const sortedConversations = useMemo(() => {
    return conversations.slice().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (!searchText.trim()) return sortedConversations;
    const lowerSearch = searchText.toLowerCase();
    return sortedConversations.filter(convo => {
        const otherUser = convo.senderId === authData.user.id ? convo.recipientUsername : convo.senderUsername;
        return otherUser.toLowerCase().includes(lowerSearch) ||
               (convo.content && convo.content.toLowerCase().includes(lowerSearch));
    });
  }, [searchText, sortedConversations, authData]);

  const filteredGroupChats = useMemo(() => {
    if (!searchText.trim()) return groups;
    const lowerSearch = searchText.toLowerCase();
    return groups.filter(group => group.name.toLowerCase().includes(lowerSearch));
  }, [searchText, groups]);

  // Merge and sort group chats and conversations by latest message timestamp
  const mergedChats = useMemo(() => {
    // Convert group chats to have a consistent timestamp format
    const groupChatsWithTimestamp = filteredGroupChats.map(g => ({
      ...g,
      isGroup: true,
      timestamp: g.latestMessage?.timestamp || new Date(0).toISOString() // Use latest message timestamp or epoch if no messages
    }));

    // Convert private conversations to have consistent format
    const privateChatsWithTimestamp = filteredConversations.map(c => ({
      ...c,
      isGroup: false,
      timestamp: c.timestamp || new Date(0).toISOString()
    }));

    // Combine and sort all chats by timestamp (newest first)
    return [...groupChatsWithTimestamp, ...privateChatsWithTimestamp]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filteredGroupChats, filteredConversations]);

  // --- RENDER ITEM: Kept beautiful UI, adapted logic to our data structure ---
  const renderChatItem = ({ item }) => {
    if (!authData?.user) return null;
    // If this is a group chat, render differently
    if (item.isGroup) {
      const isSelected = selectedChats.has('group-' + item.id);
      return (
        <Pressable
          style={[styles.chatItem, isSelected && styles.chatItemSelectionMode]}
          onPress={async () => {
            if (selectionMode) {
              handleChatSelect('group-' + item.id);
            } else {
              // Mark group as read
              if (item.latestMessage) {
                await chatService.markGroupAsRead(item.id, new Date(item.latestMessage.timestamp).getTime() + 1);
                await updateGroupUnreadCount(item.id);
              }
              router.push({ pathname: `/group-chat`, params: { groupId: item.id, groupName: item.name } });
            }
          }}
          onLongPress={() => handleLongPress('group-' + item.id)}
        >
          {selectionMode && (
            <Pressable
              style={[styles.selectionCircle, isSelected && styles.selectionCircleSelected]}
              onPress={() => handleChatSelect('group-' + item.id)}
            >
              {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
            </Pressable>
          )}
          <View style={styles.avatarContainer}>
            <GroupAvatar imageUrl={item.imageUrl} />
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>{item.name}</Text>
              {item.latestMessage && item.latestMessage.timestamp && (
                <Text style={styles.chatTime}>
                  {new Date(item.latestMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
            <View style={styles.chatFooter}>
              {item.latestMessage ? (
                <Text style={styles.lastMessage} numberOfLines={1}>
                  <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>{item.latestMessage.senderUsername}: </Text>
                  {item.latestMessage.content && item.latestMessage.content.trim() !== ''
                    ? item.latestMessage.content
                    : item.latestMessage.imageUrl
                      ? '[Photo]'
                      : item.latestMessage.audioUrl
                        ? '[Audio]'
                        : ''}
                </Text>
              ) : (
                <Text style={styles.lastMessage} numberOfLines={1}>No messages yet.</Text>
              )}
            </View>
          </View>
        </Pressable>
      );
    }

    // Determine the "other user" from the conversation data
    const otherUser = item.senderId === authData.user.id
        ? { id: item.recipientId, name: item.recipientUsername }
        : { id: item.senderId, name: item.senderUsername };

    const isSelected = selectedChats.has(item.id);

    // Determine the preview text for the last message
    let previewText = '';
    if (item.content && item.content.trim() !== '') {
      previewText = item.content;
    } else if (item.imageUrl) {
      previewText = '[Photo]';
    } else if (item.audioUrl) {
      previewText = '[Audio]';
    } else {
      previewText = '';
    }

    return (
      <Pressable
        style={[styles.chatItem, isSelected && styles.chatItemSelectionMode]}
        onPress={async () => {
          if (selectionMode) {
            handleChatSelect(item.id);
          } else {
            // Mark private chat as read
            if (item.timestamp) {
              await chatService.markPrivateAsRead(otherUser.id, new Date(item.timestamp).getTime() + 1);
              await updatePrivateUnreadCount(otherUser.id);
            }
            router.push({ pathname: `/chat/${otherUser.id}`, params: { contactName: otherUser.name } });
          }
        }}
        onLongPress={() => handleLongPress(item.id)}
      >
        {selectionMode && (
          <Pressable
            style={[styles.selectionCircle, isSelected && styles.selectionCircleSelected]}
            onPress={() => handleChatSelect(item.id)}
          >
            {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
          </Pressable>
        )}
        <View style={styles.avatarContainer}>
          <Avatar imageUrl={item.senderId === authData.user.id ? item.recipientProfilePictureUrl : item.senderProfilePictureUrl} name={otherUser.name} size={52} />
          <StatusIndicator isOnline={true} size="small" style={{ position: 'absolute', bottom: 2, right: 2 }} />
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}><HighlightedText text={otherUser.name} highlight={searchText} /></Text>
            <Text style={styles.chatTime}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}><HighlightedText text={previewText} highlight={searchText} /></Text>
            {/* TODO: Add unread count logic later */}
          </View>
        </View>
      </Pressable>
    );
  };

  // --- MAIN RENDER: Using new UI structure with our loading/data state ---
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Selection Mode logic */}
      <View style={styles.header}>
        {selectionMode ? (
          <>
            <Pressable onPress={exitSelectionMode}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{selectedChats.size} selected</Text>
            <Pressable onPress={handleDeleteSelected}>
              <Ionicons name="trash" size={24} color="#ff4444" />
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.headerTitle}>Chats</Text>
            <View style={styles.headerActions}>
              <Pressable onPress={() => setToggleSearch(!toggleSearch)}>
                <Ionicons name="search" size={24} color="#007AFF" />
              </Pressable>
              <Pressable onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle" size={28} color="#007AFF" />
              </Pressable>
            </View>
          </>
        )}
      </View>

      {/* Search Bar */}
      {toggleSearch && <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or message..."
          value={searchText}
          onChangeText={setSearchText}
          autoFocus
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </Pressable>
        )}
      </View>}

      {/* Main List */}
      <FlatList
        data={toggleSearch ? mergedChats : mergedChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.isGroup ? `group-${item.id}` : item.id.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center', paddingTop: 50}}><Text>No conversations yet.</Text></View>}
      />

      {/* Modal for New Chat/Group */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
            <Animated.View style={[styles.modalMenu, { transform: [{ scale: modalScale }], opacity: modalOpacity }]}>
                <Pressable style={styles.modalMenuItem} onPress={handleNewChat}>
                    <Ionicons name="chatbubble-outline" size={22} color="#007AFF" style={{ marginRight: 15 }} />
                    <Text style={styles.modalMenuText}>New Chat</Text>
                </Pressable>
                <View style={styles.modalDivider} />
                <Pressable style={styles.modalMenuItem} onPress={handleNewGroupChat}>
                    <Ionicons name="people-outline" size={22} color="#007AFF" style={{ marginRight: 15 }} />
                    <Text style={styles.modalMenuText}>New Group Chat</Text>
                </Pressable>
            </Animated.View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
};

// --- STYLES: Mostly from the new version, slightly adapted ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row', gap: 16 },
  cancelButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  listContent: { paddingBottom: 20 },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#fff' },
  chatItemSelectionMode: { backgroundColor: '#eef5ff' },
  selectionCircle: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  selectionCircleSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  avatarContainer: { marginRight: 12 },
  avatarFallback: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#eef5ff',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 22, color: '#007AFF', fontWeight: 'bold' },
  chatInfo: { flex: 1, paddingVertical: 16 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 16, fontWeight: 'bold' },
  highlightedText: { backgroundColor: '#FFF59D' },
  chatTime: { fontSize: 12, color: '#888' },
  chatFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  lastMessage: { flex: 1, fontSize: 14, color: '#666' },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 80 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0',
    borderRadius: 10, marginHorizontal: 16, marginVertical: 8, paddingHorizontal: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, fontSize: 16 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalMenu: {
    position: 'absolute', top: 60, right: 16, backgroundColor: 'white',
    borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  modalMenuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 16,
  },
  modalMenuText: { fontSize: 16 },
  modalDivider: { height: 1, backgroundColor: '#f0f0f0' },
  unreadBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#F44336', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, zIndex: 2 },
  unreadBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});

export default ChatsListScreen;