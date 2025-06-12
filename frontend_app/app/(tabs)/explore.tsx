import React from 'react';
import { Platform, StyleSheet, Share, Linking, TouchableOpacity, Image, Animated, PanResponder ,ScrollView} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const futuristicGradient = ['#0f2027', '#2c5364', '#00c6ff', '#0072ff'];
const sleekCard = {
  backgroundColor: 'rgba(20,30,48,0.95)',
  borderRadius: 24,
  shadowColor: '#00c6ff',
  shadowOpacity: 0.2,
  shadowRadius: 16,
  marginVertical: 12,
  padding: 20,
  borderWidth: 1,
  borderColor: '#00c6ff33',
};

export default function SettingsAccountsScreen() {
  // For draggable profile card
  const pan = React.useRef(new Animated.ValueXY()).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y },
      ], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  const handleShare = async () => {
    await Share.share({
      message: 'Check out this futuristic productivity app! 🚀',
      url: 'https://yourapp.com',
    });
  };

  return (
    <ScrollView
    
    >
      <ThemedView style={{ ...sleekCard, alignItems: 'center', marginTop: 16 }}>
        <Animated.View style={{ transform: pan.getTranslateTransform() }} {...panResponder.panHandlers}>
          <Image source={require('../../assets/images/home2.webp')} style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 12, borderWidth: 2, borderColor: '#00c6ff' }} />
          <ThemedText type="title">James Doe</ThemedText>
          <ThemedText style={{ color: '#00c6ff', marginBottom: 8 }}>Pro User</ThemedText>
        </Animated.View>
        <TouchableOpacity onPress={handleShare} style={{ marginTop: 10, backgroundColor: '#00c6ff', borderRadius: 16, padding: 10, paddingHorizontal: 24 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Share App</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://yourapp.com/integrations')} style={{ marginTop: 10, backgroundColor: '#2c5364', borderRadius: 16, padding: 10, paddingHorizontal: 24 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>App Integrations</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={{ ...sleekCard }}>
        <ThemedText type="title">Account Settings</ThemedText>
        <ThemedText>Email: james@futurist.com</ThemedText>
        <ThemedText>Plan: Pro</ThemedText>
        <TouchableOpacity onPress={() => Linking.openURL('https://yourapp.com/account')} style={{ marginTop: 10, backgroundColor: '#00c6ff', borderRadius: 16, padding: 10, paddingHorizontal: 24 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Manage Account</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={{ ...sleekCard }}>
        <ThemedText type="title">Security</ThemedText>
        <TouchableOpacity onPress={() => Linking.openURL('https://yourapp.com/security')} style={{ marginTop: 10, backgroundColor: '#2c5364', borderRadius: 16, padding: 10, paddingHorizontal: 24 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Update Password</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://yourapp.com/2fa')} style={{ marginTop: 10, backgroundColor: '#00c6ff', borderRadius: 16, padding: 10, paddingHorizontal: 24 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Enable 2FA</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={{ ...sleekCard }}>
        <ThemedText type="title">Connect & Share</ThemedText>
        <TouchableOpacity onPress={handleShare} style={{ marginTop: 10, backgroundColor: '#00c6ff', borderRadius: 16, padding: 10, paddingHorizontal: 24 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Share App</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://yourapp.com/apps')} style={{ marginTop: 10, backgroundColor: '#2c5364', borderRadius: 16, padding: 10, paddingHorizontal: 24 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Access Linked Apps</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={{ ...sleekCard }}>
        <ThemedText type="title">Investor Mode</ThemedText>
        <ThemedText>See advanced analytics and growth metrics.</ThemedText>
        <TouchableOpacity onPress={() => Linking.openURL('https://yourapp.com/investor')} style={{ marginTop: 10, backgroundColor: '#00c6ff', borderRadius: 16, padding: 10, paddingHorizontal: 24 }}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Investor Dashboard</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
