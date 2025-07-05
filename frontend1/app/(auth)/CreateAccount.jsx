import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

// This screen now simply routes to the canonical signup screen for consistency
export default function CreateAccount() {
  useEffect(() => {
    // Redirect immediately to signup
    router.replace('/(auth)/signup');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.info}>Redirecting to the signup screen...</Text>
      <TouchableOpacity onPress={() => router.replace('/(auth)/signup')} style={styles.button}>
        <Text style={styles.buttonText}>Go to Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  info: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#668cff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
