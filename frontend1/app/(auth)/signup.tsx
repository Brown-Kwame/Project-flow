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
import { useUser } from '../context/UserContext';
import { registerUser } from '../../services/userApi';
import { supabase } from '../../config/supabaseClient'; // Import Supabase client

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const { login } = useUser();
  const handleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await registerUser({ firstName, lastName, email, password });
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Signup failed. Please try again.');
    }
    setLoading(false);
  };
  const handleLoginLink = () => {
    router.push('/(auth)/Signin' as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form} className=''>
        <Text style={styles.title} className='text-red-600'>Create Account</Text>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#aaa"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          placeholderTextColor="#aaa"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
          <Text style={styles.signupBtnText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
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

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // changed from dark
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#f9f9f9', // changed from dark
    borderRadius: 18,

    padding: 28,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222', // changed from white
    marginBottom: 24,
    alignSelf: 'center',
  },
  label: {
    color: '#444', // changed from #ccc
    fontSize: 15,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc', // lighter border
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff', // changed from dark
    color: '#000', // text color black
    marginBottom: 2,
  },
  signupBtn: {
    backgroundColor: '#007bff', // blue primary
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
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
    color: '#666', // softer gray
    fontSize: 15,
  },
  loginTextBold: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  error: {
    color: '#d00',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});



