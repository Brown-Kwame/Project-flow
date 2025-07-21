import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext'; // Import useUser
import { loginUser } from '../../services/authApi'; // Import loginUser from authApi
import { supabase } from '../../lib/supabase'; // Import supabase client

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser(); // Get login from context

  useEffect(() => {
    const loadCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (!email || !password) {
        setError('Email and password are required.');
        setLoading(false);
        return;
      }
      // Supabase login
      const { data, error: supaError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (supaError) {
        setError(supaError.message || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }
      // Only update context and navigate if session is present
      if (!data.session) {
        setError('Login failed. Please check your credentials and try again.');
        setLoading(false);
        return;
      }
      await login({
        name: data.user.user_metadata?.full_name || data.user.email,
        email: data.user.email ?? '',
        plan: 'Pro',
        profileImage: null,
      });
      // Correct navigation: go to the main tabs root, not /index
      router.replace('/(tabs)'); // This will show the main tab screen after login
    } catch (e: any) {
      setError(e.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.welcome}>Welcome to Project Flow</Text>
      <Text style={styles.subtitle}>To get started, please sign in</Text>

      <Text style={styles.sectionTitle}>Log in to your account</Text>
      <Text style={styles.sectionSubtitle}>Welcome back! Select method to log in:</Text>

      

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or continue with email</Text>
        <View style={styles.divider} />
      </View>

      {/* Email */}
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>✉️</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Remember Me + Forgot */}
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Text style={styles.link}>{rememberMe ? '✅ ' : '⬜️ '}Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/forgotpassword' as any)}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login */}
    <TouchableOpacity
      style={styles.loginBtn}
      onPress={handleLogin}
      disabled={loading}
    >
      <Text style={styles.loginBtnText}>{loading ? 'Logging in...' : 'Log in'}</Text>
    </TouchableOpacity>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {/* Manual link to index page in tabs */}
    {/* Signup */}
    <Text style={styles.signupText}>
      Don't have an account?{' '}
      <Text
        style={styles.signupLink}
        onPress={() => router.push('/(auth)/signup' as any)}
      >
        Create an account
      </Text>
    </Text>
    {/* Terms and Conditions */}
    <Text style={styles.terms}>
      By signing up, I agree to the Asana Privacy policy and
      <Text style={styles.termsLink} onPress={() => setShowTerms(!showTerms)}>
        Terms of Services {showTerms ? '▲' : '▼'}
      </Text>
    </Text>
    {showTerms && (
      <View style={styles.termsBox}>
        <Text style={styles.termsContent}>
          These terms explain how we collect, use, and store your data. By using this app,
          you agree to not misuse the platform, protect your credentials, and follow local laws.
          Refer to our full documentation for legal details and compliance policies.
        </Text>
      </View>
    )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  welcome: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
   fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
    textAlign: 'center',
    
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 10,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  socialText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'center',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  dividerText: {
    color: '#666',
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 350,
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    fontSize: 18,
    marginLeft: 8,
    color: '#666',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 350,
    marginBottom: 10,
  },
  link: {
    color: '#007bff',
    fontSize: 13,
    
  },
  loginBtn: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    color: '#555',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
    textAlign: 'center',
  },
  signupLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  terms: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: '#007bff',
    fontWeight: '600',
  },
  termsBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  termsContent: {
    color: '#333',
    fontSize: 12,
    lineHeight: 18,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginTextBold: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
