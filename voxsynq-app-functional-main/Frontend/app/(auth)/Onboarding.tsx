import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewToken
} from "react-native";
import OnboardingContent from "../../components/OnboardingContent";

interface OnboardingItem {
  title: string;
  description: string;
  image: number;
}

const { width } = Dimensions.get("window");

const onboardingData: OnboardingItem[] = [
  {
    title: "Welcome to VoxSynq",
    description: "Connect with friends and family through high-quality video and voice calls.",
    image: require("../../assets/images/connect.jpg"),
  },
  {
    title: "Secure & Private",
    description: "Your conversations are encrypted and always private.",
    image: require("../../assets/images/secure.jpg"),
  },
  {
    title: "Stay Connected Anywhere",
    description: "Enjoy seamless communication wherever you are.",
    image: require("../../assets/images/mobile.jpg"),
  },
];

const Onboarding = () => {
  // Handle chevron back button
  const handleChevronBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
    // If already at the first onboarding screen, do nothing (stay on onboarding)
  };
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
      router.replace("/welcome");
    }
  };

  const handleSkip = async () => {
    await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
    router.replace("/welcome");
  };

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const idx = viewableItems[0]?.index;
    if (typeof idx === "number") {
      setCurrentIndex(idx);
    }
  });

  console.log('Onboarding component rendered');

  return (
    <View style={styles.container}>
      <FlatList
        data={onboardingData}
        ref={flatListRef}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={({ item, index }) => (
          <View style={{ width, height: '100%' }}>
            <OnboardingContent
              image={item.image}
              title={item.title}
              description={item.description}
              dots={onboardingData.map((_, dotIdx) => (
                <View
                  key={dotIdx}
                  style={[
                    styles.indicator,
                    currentIndex === dotIdx && styles.activeIndicator,
                  ]}
                />
              ))}
              skipButton={index < onboardingData.length - 1 ? (
                <View style={{ position: 'absolute', top: 40, right: 24, zIndex: 10 }}>
                  <Pressable onPress={handleSkip} accessibilityRole="button">
                    <Text style={styles.skipText}>Skip</Text>
                  </Pressable>
                </View>
              ) : null}
            />
            {/* No Next button on the last onboarding screen */}
          </View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={({ viewableItems }) => {
          const idx = viewableItems[0]?.index;
          if (typeof idx === "number") {
            setCurrentIndex(idx);
            // If user swipes past the last screen, navigate to welcome
            if (idx === onboardingData.length - 1 && viewableItems.length > 0 && viewableItems[0].isViewable) {
              setTimeout(async () => {
                await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
                router.replace("/welcome");
              }, 500); // slight delay for smooth transition
            }
          }
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    width: "100%" 
  },
  skipContainer: {
    alignItems: "flex-end",
    padding: 20,
    paddingBottom: 0,
    width: "100%",
  },
  skipText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#2196F3",
    width: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32, // Add space below buttons
    width: "100%",
    gap: 16,
  },
  navButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2196F3",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Removed all shadow and elevation properties for visibility and flat look
    minWidth: "40%",
  },
  backText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 8,
  },
  backTextDisabled: {
    color: "#B0BEC5",
  },
  navButtonDisabled: {
    borderColor: "#B0BEC5",
  },
  nextText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
});

export default Onboarding;

// Hide Expo Router header for this screen
export const screenOptions = {
  headerShown: false,
};