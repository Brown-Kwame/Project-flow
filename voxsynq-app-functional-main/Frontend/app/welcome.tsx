const WelcomeScreen = () => {
  const router = useRouter();
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    router.replace("/signup");
  };

  const handleSignIn = () => {
    router.replace("/login");
  };


  // Handle chevron/back button press
  const handleChevronPress = () => {
    // Go back to previous onboarding screen
    router.back();
  };

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const features = [
    {
      icon: "videocam",
      title: "HD Video Calls",
      description: "Crystal clear video calls with friends and family",
      color: "#2196F3",
      bgColor: "#E3F2FD",
    },
    {
      icon: "call",
      title: "Voice Calls",
      description: "High-quality voice calls anywhere, anytime",
      color: "#4CAF50",
      bgColor: "#E8F5E9",
    },
    {
      icon: "chatbubbles",
      title: "Instant Messaging",
      description: "Send messages, photos, and files instantly",
      color: "#FF9800",
      bgColor: "#FFF3E0",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" hidden={true} />

      <ScrollView
        style={[styles.scrollContainer, { paddingTop: 0 }]}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 0 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gradientBackground}>
          {/* Chevron Button (top left, matches onboarding screens) */}
          <Pressable style={styles.backContainer} onPress={() => router.replace('/Onboarding')} accessibilityRole="button">
            {/* Back button styled like sign up/sign in screens */}
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.25)',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}>
              <Feather name="chevron-left" size={28} color="#fff" />
            </View>
          </Pressable>
          {/* Logo and App Name */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                  { rotate: logoRotation },
                ],
              },
            ]}
          >
            <View style={{ alignItems: 'center' }}>
              {/* Double-layered bubble with blurred outer layer */}
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {/* Outer blurred layer */}
                <View style={{
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  shadowColor: '#2196F3',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 18,
                  elevation: 16,
                  zIndex: 1,
                  // Simulate blur with opacity and shadow
                }} />
                {/* Inner solid layer */}
                <View style={styles.logoBackground}>
                  <Ionicons name="videocam" size={50} color="#fff" />
                </View>
              </View>
              <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4, marginTop: 12 }}>VoxSynq</Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, textAlign: 'center', marginTop: 4 }}>Connect · Communicate · Collaborate</Text>
            </View>
          </Animated.View>
          {/* Why Choose VoxSynq? (not animated/rotated) */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginTop: 18, marginBottom: 12 }}>Why Choose VoxSynq?</Text>
          </View>
          {/* Features Section */}
          <Animated.View
            style={[
              styles.featuresContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, index % 2 === 0 ? -50 : 50],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: feature.bgColor },
                  ]}
                >
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color={feature.color}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
          {/* Bottom Section */}
          <Animated.View
            style={[
              styles.bottomSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                alignItems: 'center', // Center content horizontally
                justifyContent: 'center', // Center content vertically
                paddingTop: 10, // Move buttons up
                paddingBottom: 10, // Reduce space at bottom
                marginBottom: 0, // Remove extra margin
              },
            ]}
          >
            {/* Get Started Button */}
            <Pressable
              style={({ pressed }) => [
                styles.getStartedButton,
                { width: '75%' }
              ]}
              onPress={handleGetStarted}
            >
              {({ pressed }) => (
                <>
                  <Text style={[styles.getStartedText, { opacity: pressed ? 0.6 : 1 }]}>Get Started</Text>
                  <Feather
                    name="arrow-right"
                    size={20}
                    color="#2196F3"
                    style={styles.arrowIcon}
                  />
                </>
              )}
            </Pressable>
            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <Pressable
                onPress={handleSignIn}
                style={({ pressed }) => []}
              >
                {({ pressed }) => (
                  <Text style={[styles.signInLink, { opacity: pressed ? 0.6 : 1 }]}>Sign In</Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2196F3",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: "#2196F3",
    position: "relative",
    minHeight: height,
  },
  backContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 30,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 15,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -10,
    left: -10,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  featuresContainer: {
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 18,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 5,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  getStartedButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
    marginTop: -10,
    minHeight: 56,
  },
  getStartedText: {
    color: "#2196F3",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 5,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  signInText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
  },
  signInLink: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  // Decorative elements
  decorativeCircle1: {
    position: "absolute",
    width: 100,
    height: 50,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: 42,
    right: 4,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: 100,
    left: -75,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: 200,
    left: 20,
  },
});

export default WelcomeScreen;

// Hide Expo Router header for this screen
export const screenOptions = {
  headerShown: false,
};
