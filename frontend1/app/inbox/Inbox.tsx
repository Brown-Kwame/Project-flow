import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const demoMessages = [
  { id: '1', user: 'James', text: 'Welcome to the team chat!', timestamp: '2025-06-12T09:00:00Z' },
  { id: '2', user: 'Sarah', text: 'Let’s discuss the new feature.', timestamp: '2025-06-12T09:05:00Z' },
  { id: '3', user: 'Alex', text: 'I’ll update the docs today.', timestamp: '2025-06-12T09:10:00Z' },
];

const INBOX_STORAGE_KEY = 'asana_inbox';

const Inbox = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState(demoMessages);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const stored = await AsyncStorage.getItem(INBOX_STORAGE_KEY);
        if (stored) {
          setMessages(JSON.parse(stored));
        } else {
          setMessages(demoMessages);
        }
      } catch (e) {
        setMessages(demoMessages);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(messages)).catch(() => {});
    if (flatListRef.current) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() + Math.random()).toString(),
        user: 'You',
        text: input,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput('');
  };

  const handleEdit = (msg: any) => {
    setEditId(msg.id);
    setEditText(msg.text);
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    setMessages(prev => prev.map(m => m.id === editId ? { ...m, text: editText } : m));
    setEditId(null);
    setEditText('');
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageRow,
      item.user === 'You' ? styles.messageRight : styles.messageLeft,
      { maxWidth: '100%' }
    ]}>
      <View style={styles.avatar}><Text style={styles.avatarText}>{item.user[0]}</Text></View>
      <View style={styles.bubble}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      {item.user === 'You' && (
        <View style={styles.actions}>
          <TouchableOpacity
            accessibilityLabel="Edit message"
            accessibilityHint="Opens a modal to edit this message"
            onPress={() => handleEdit(item)}
          >
            <FontAwesome name="edit" size={16} color="#668cff" style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Delete message"
            accessibilityHint="Deletes this message"
            onPress={() => handleDelete(item.id)}
          >
            <FontAwesome name="trash" size={16} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.heading}>Team Chat & Comments</Text>
      {loading && <ActivityIndicator size="large" color="#668cff" style={{ marginTop: 20 }} />}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No messages yet.</Text>}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          accessibilityLabel="Message input"
          accessibilityHint="Type your message here"
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          accessibilityLabel="Send message"
          accessibilityHint="Sends your message to the chat"
        >
          <FontAwesome name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {/* Edit Message Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Message</Text>
            <TextInput
              style={styles.input}
              value={editText}
              onChangeText={setEditText}
              autoFocus
              accessibilityLabel="Edit message input"
              accessibilityHint="Edit your message here"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                accessibilityLabel="Cancel edit"
                accessibilityHint="Closes the edit modal without saving"
              >
                <Text style={{ color: '#668cff', fontWeight: 'bold' }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.addBtn}
                onPress={handleSaveEdit}
                disabled={!editText.trim()}
                accessibilityLabel="Save edit"
                accessibilityHint="Saves your edited message"
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 40,
    marginBottom: 8,
    alignSelf: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 18,
    maxWidth: '100%',
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#668cff33',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#668cff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    minWidth: 80,
    maxWidth: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  user: {
    fontWeight: 'bold',
    color: '#668cff',
    marginBottom: 2,
    fontSize: 13,
  },
  text: {
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
    alignSelf: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom:50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 10,
 
    fontSize: 16,
    backgroundColor: '#f7faff',
    marginRight: 10,
  },
  sendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#668cff',
    shadowColor: '#668cff', // Glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#668cff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f7faff',
    marginRight: 8,
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#668cff',
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 14,
    shadowColor: '#668cff', // Glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#668cff',
  },
});

export default Inbox;