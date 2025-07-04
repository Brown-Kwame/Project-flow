import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';

const CreateAccount = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    setError('');
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    alert('Account created successfully!');
    // router.push('/(auth)/login');
  };

  const handleLoginLink = () => {
    router.push('/(auth)/Signin');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#666"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
          <Text style={styles.signupBtnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={handleLoginLink}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Changed to white
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#f2f2f2', // Light grey card
    borderRadius: 18,
    padding: 28,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginBottom: 24,
    alignSelf: 'center',
  },
  label: {
    color: '#000', // Black text
    fontSize: 15,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 2,
  },
  signupBtn: {
    backgroundColor: '#668cff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  signupBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#444', // Dark text
    fontSize: 15,
  },
  loginTextBold: {
    color: '#668cff',
    fontWeight: 'bold',
  },
  error: {
    color: '#ff4d4d',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});
