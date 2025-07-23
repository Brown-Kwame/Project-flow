import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');

const AuthScreen = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { login } = useUser();

  // Animated text
  const [animatedText, setAnimatedText] = useState('');
  const aiText = "This app uses advanced AI to boost your productivity with smart insights and automation.";
  const leaderboardText = "Compete daily and build streaks. The leaderboard motivates you to stay consistent!";

  // Signup form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let text = '';
    if (currentPage === 0) text = aiText;
    else if (currentPage === 1) text = leaderboardText;
    else {
      setAnimatedText('');
      return;
    }

    let index = 0;
    setAnimatedText('');
    const interval = setInterval(() => {
      setAnimatedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [currentPage]);

  const handleScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  const skipToSignUp = () => {
    scrollRef.current?.scrollTo({ x: width * 2, animated: true });
  };

  const handleSignup = async () => {
    setError('');
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}])[A-Za-z\d@$!%*?&#^()[\]{}]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setError('Password must include 8+ characters, numbers, letters, and symbols.');
      setLoading(false);
      return;
    }

    try {
      await login({ name: fullName, email, plan: 'Pro', profileImage: null });
      router.replace('/(auth)/Billing' as any);
    } catch {
      setError('Signup failed. Please try again.');
    }

    setLoading(false);
  };

  const handleLoginLink = () => {
    router.push('/(auth)/Signin' as any);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
       resizeMode="cover"
    style={{ flex: 1 }}
    >
       <SafeAreaView style={{ flex: 1 }}>
      {currentPage < 2 && (
        <TouchableOpacity style={styles.skipBtn} onPress={skipToSignUp}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={styles.container}
      >
        {/* Page 1: AI Info */}
        <View style={styles.page}>
          <Image
            source={{ uri: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanFwYXZ2NzNnMGd2eGNkZGE0ZmxhNnpqMTZ3eWN3ZndkODVkaHRjaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qgQUggAC3Pfv687qPC/giphy.gif' }}
            style={styles.gif}
            resizeMode="contain"
          />
          <Text style={styles.title} className='text-red-400'>🤖 Smart AI Inside</Text>
          <Text style={styles.description}>{animatedText}</Text>
        </View>

        {/* Page 2: Leaderboard */}
        <View style={styles.page}>
          <Image
            source={{ uri: 'https://media.giphy.com/media/l41YtZOb9EUABnuqA/giphy.gif' }}
            style={styles.gif}
            resizeMode="contain"
          />
          <Text style={styles.title}>🔥 Daily Streaks</Text>
          <Text style={styles.description}>{animatedText}</Text>
        </View>

        {/* Page 3: Signup Form */}
        <KeyboardAvoidingView
          style={[styles.page, { justifyContent: 'center', paddingTop: 20 }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.form}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} placeholder="Your first name" value={fullName} onChangeText={setFullName} />
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} placeholder="Your last name" value={fullName} onChangeText={setFullName} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="Your email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

            <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
              <Text style={styles.signupBtnText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity onPress={handleLoginLink}>
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Login</Text></Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[styles.indicator, currentPage === index && styles.activeIndicator]}
          />
        ))}
      </View>
    </SafeAreaView>
     </ImageBackground>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: {
  width,
  padding: 30,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent', // ✅ Let background show
},
  background: {
  flex: 1,
  backgroundColor: '#fff', // White base behind the transparent PNG
},
safeArea: {
  flex: 1,
},
  gif: {
    width: width * 0.7,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    padding:20,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 17,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    minHeight: 100,
  },
  form: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding:20,
    borderRadius: 16,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 10,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    color: '#444',
    fontSize: 15,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width:'100%',
   padding:15,
    marginTop: 4,
    backgroundColor:  'rgba(255,255,255,0.85)',
    color: '#000',
  },
  signupBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  signupBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    marginTop: 12,
    color: '#555',
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 12,
    alignItems: 'center',
  },
  loginBold: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  loginTextBold: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  error: {
    color: '#d00',
    textAlign: 'center',
    marginTop: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
    paddingVertical: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },
  activeIndicator: {
    backgroundColor: '#007bff',
  },
  skipBtn: {
    position: 'absolute',
    top: 12,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
});
