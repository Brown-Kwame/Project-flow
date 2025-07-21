import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from "expo-router";

// Hermes-compatible ID generator
const generateId = () => {
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

type Message = {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
  status: 'sending' | 'sent' | 'failed'; // Add status field
};

const EmptyChat = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No messages yet. Start the conversation! 🎉</Text>
  </View>
);

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList<Message>>(null);
  const { name } = useLocalSearchParams();

  // Load messages for this user
  useEffect(() => {
    const loadMessages = async () => {
      const stored = await AsyncStorage.getItem(`messages_${name}`);
      if (stored) setMessages(JSON.parse(stored));
      else setMessages([]);
    };
    if (name) loadMessages();
  }, [name]);

  // Save messages for this user
  useEffect(() => {
    if (name) {
      AsyncStorage.setItem(`messages_${name}`, JSON.stringify(messages));
    }
  }, [messages, name]);

  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage: Message = {
      id: generateId(),
      text: input,
      fromMe: true,
      timestamp: Date.now(),
      status: 'sending', // Set initial status
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate sending (success or failure)
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: Math.random() < 0.9 ? 'sent' : 'failed' } // 90% success
            : msg
        )
      );
    }, 1000);

    // Auto-scroll after message sends
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleDeleteMessage = (id: string) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMessages(prev => prev.filter(msg => msg.id !== id));
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      onLongPress={() => handleDeleteMessage(item.id)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.messageBubble,
          item.fromMe ? styles.fromMe : styles.fromThem,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={styles.timestampText}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {item.fromMe && (
            <Text style={styles.statusText}>
              {item.status === 'sending' && ' ⏳'}
              {item.status === 'sent' && ' ✓'}
              {item.status === 'failed' && ' ❌'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.messagesContainer,
          { flexGrow: 1, justifyContent: 'flex-end' }
        ]}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={<EmptyChat />}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messagesContainer: { padding: 12 },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: '80%',
  },
  fromMe: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  fromThem: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
