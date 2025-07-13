import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Animated, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const API_KEY = 'AIzaSyBrSJk5Vq9tSDgInYUbJ8l47jEmVOFDCbY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const ChatBot = ({ onClose, visible = true }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am your AI assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMsg.text }] }],
        }),
      });
      const data = await res.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that.';
      setMessages((prev) => [...prev, { from: 'bot', text: botText }]);
    } catch {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Network error. Please try again.' }]);
    }
    setLoading(false);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}> 
        <View style={styles.header}>
          <Text style={styles.headerText}>AI ChatBot</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <FontAwesome name="close" size={24} color="#668cff" />
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={[styles.message, item.from === 'user' ? styles.userMsg : styles.botMsg]}>
              <Text style={styles.msgText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              editable={!loading}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading}>
              <FontAwesome name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#668cff',
  },
  closeBtn: {
    marginLeft: 16,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginBottom: 12,
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#668cff22',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7faff',
  },
  msgText: {
    color: '#222',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f7faff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#668cff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
