import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabaseClient';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleResetPassword = async () => {
    setResetError('');
    setResetLoading(true);
    if (!email) {
      setResetError('Email is required.');
      setResetLoading(false);
      return;
    }
    try {
      // Supabase password reset: send email
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setResetError(error.message || 'Failed to send reset email.');
        setResetLoading(false);
        return;
      }
      // Optionally, show a message to check email
      setResetError('Check your email for the reset link.');
    } catch (e) {
      setResetError('Failed to send reset email.');
    }
    setResetLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(auth)/Signin' as any)}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Reset your password below</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#666"
        />

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={resetLoading}>
          <Text style={styles.buttonText}>{resetLoading ? 'Sending...' : 'Reset Password'}</Text>
        </TouchableOpacity>
        {resetError ? <Text style={styles.error}>{resetError}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f6ff', // soft blue background
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 4,
  },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c0392b', // asana red
    marginBottom: 16,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    maxWidth: 320,
    color: '#000',
  },
  button: {
    backgroundColor: '#1f3c88', // deep blue
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    maxWidth: 320,
  },
  buttonText: {
    color: '#fff', // white text
    fontWeight: '600',
    fontSize: 15,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
