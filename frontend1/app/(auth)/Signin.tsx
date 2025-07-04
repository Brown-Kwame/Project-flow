import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Added for back button icon

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/(auth)/CreateAccount')} // direct to authhome
      >
        <Ionicons name="chevron-back" size={24} color="#c0392b" />
      </TouchableOpacity>

    

      <Text style={styles.brand}>asana</Text>

      {/* Welcome */}
      <Text style={styles.welcome}>Welcome to Asana</Text>
      <Text style={styles.subtitle}>To get started, please sign in</Text>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Log in to your account</Text>
      <Text style={styles.sectionSubtitle}>Welcome back! Select method to log in:</Text>

      {/* Social Buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or continue with email</Text>
        <View style={styles.divider} />
      </View>

      {/* Email Input */}
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>✉️</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Links */}
      <View style={styles.linksRow}>
        <TouchableOpacity>
          <Text style={styles.link}>Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/forgotpassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => router.push('/(auth)/Billing')} // direct to Billing
      >
        <Text style={styles.loginBtnText}>Log in</Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <Text style={styles.signupText}>
        Don't have an account?{' '}
        <Text
          style={styles.signupLink}
          onPress={() => router.push('/(auth)/CreateAccount')}
        >
          Create an account
        </Text>
      </Text>

      {/* Terms */}
    <Text style={styles.terms}>
  By signing up, I agree to the Asana Privacy policy and{'\n'}
  <Text style={{ textDecorationLine: 'underline' }}>Terms of Services</Text>
</Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1D26',
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
  logo: {
    width: 70,
    height: 70,
    marginBottom: 0,
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5A5F',
    marginBottom: 10,
    marginTop: -10,
    letterSpacing: 1,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#bbb',
    marginBottom: 14,
    textAlign: 'center',
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
    backgroundColor: '#2D2F3A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#3E404B',
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  socialText: {
    fontSize: 15,
    color: '#fff',
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
    backgroundColor: '#555',
    marginHorizontal: 8,
  },
  dividerText: {
    color: '#999',
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2C35',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 350,
    height: 48,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#888',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  eyeIcon: {
    fontSize: 18,
    marginLeft: 8,
    color: '#888',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 350,
    marginBottom: 10,
  },
  link: {
    color: '#4E8AFE',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  loginBtn: {
    backgroundColor: '#4E8AFE',
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
    color: '#bbb',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
    textAlign: 'center',
  },
  signupLink: {
    color: '#4E8AFE',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  terms: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
  },
});
