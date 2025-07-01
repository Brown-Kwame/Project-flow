import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function ContactScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSend = () => {
    Alert.alert('Thank you!', 'Your message has been sent.');
    setEmail('');
    setMessage('');
  };

  const handleCancel = () => {
    setEmail('');
    setMessage('');
  };

  const handleBack = () => {
    router.push('/pricing');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <Text style={styles.backBtnText}>{'<'} Back</Text>
      </TouchableOpacity>
      <Image
        source={require('../../assets/images/Letter-A-logo-design-in-flat-design-on-transparent-background-PNG-removebg-preview.png')}
        style={styles.logo}
      />
      <Text style={styles.brand}>asana</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Contact Us</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your Message"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          placeholderTextColor="#aaa"
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#121212', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#1e1e1e', // Dark button background
    borderRadius: 8,
    zIndex: 10,
  },
  backBtnText: {
    color: '#bb86fc', // Light purple for contrast
    fontWeight: 'bold',
    fontSize: 16,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 4,
    alignSelf: 'center',
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#bb86fc', // Light purple for brand
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1e1e1e', // Dark card background
    borderRadius: 18,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#333', // Subtle border
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#ffffff', // White text
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#333', // Darker border
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#2d2d2d', // Dark input background
    color: '#ffffff', // White text
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#bb86fc', // Purple button
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#121212', // Dark text on light button
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  cancelButton: {
    backgroundColor: '#2d2d2d', // Dark button
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#333', // Subtle border
  },
  cancelButtonText: {
    color: '#bb86fc', // Light purple text
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
});