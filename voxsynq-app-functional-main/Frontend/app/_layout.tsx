import { AuthProvider, useAuth } from '@/context/AuthContext'; // Make sure this path is correct!
import { CallSignalContext } from '@/context/CallSignalContext';
import { EndedCallContext } from '@/context/EndedCallContext';
import { GroupProvider } from '@/context/GroupContext';
import { SwitchToVideoContext } from '@/context/SwitchToVideoContext';
import { useCallWebSocket } from '@/services/useWebSocket';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useContext, useEffect } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Onboarding from './(auth)/Onboarding';

// Keep the splash screen visible while we figure out if the user is logged in
SplashScreen.preventAutoHideAsync();

// Create a context for call signaling
export const useCallSignal = () => useContext(CallSignalContext);
export const useEndedCall = () => useContext(EndedCallContext);

const InitialLayout = () => {
  const { authData, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [showSplash, setShowSplash] = React.useState<boolean | null>(null);
  const [showOnboarding, setShowOnboarding] = React.useState<boolean | null>(null);
  const [incomingCall, setIncomingCall] = React.useState(null);
  const [endedCallId, setEndedCallId] = React.useState(null);
  const [switchToVideo, setSwitchToVideo] = React.useState(null);
  const userId = authData?.user?.id;
  const onCallMessage = useCallback((msg) => {
    if (msg.type === 'CALL_OFFER') {
      setIncomingCall(msg);
    } else if (msg.type === 'CALL_END' || msg.type === 'CALL_REJECT') {
      setIncomingCall(null);
      if (msg.callId) setEndedCallId(msg.callId);
    } else if (msg.type === 'SWITCH_TO_VIDEO') {
      setSwitchToVideo(msg);
    } else if (msg.type === 'CALL_ANSWER') {
      // Only handle if this user is the caller
      if (authData?.user?.id === msg.toUserId) {
        // Route to the call screen with the synchronized start time
        const callType = msg.callType || msg.type;
        router.replace({
          pathname: callType === 'VIDEO' ? '/video-call-background' : '/call-background',
          params: {
            name: msg.fromUserName || 'Callee',
            avatar: '',
            callId: msg.callId,
            toUserId: msg.fromUserId,
            callStarted: true,
            callStartTime: msg.callStartTime || Date.now(),
          },
        });
      }
    }
  }, [authData?.user?.id, router]);
  const { sendCallSignal } = useCallWebSocket(userId, onCallMessage);

  const handleAcceptCall = () => {
    if (!incomingCall) return;
    const callStartTime = Date.now();
    sendCallSignal({
      type: 'CALL_ANSWER',
      fromUserId: authData.user.id,
      toUserId: incomingCall.fromUserId,
      callId: incomingCall.callId,
      callStartTime,
      fromUserName: authData.user.username,
    });
    setIncomingCall(null);
    const callType = incomingCall.callType || incomingCall.type;
    router.push({
      pathname: callType === 'VIDEO' ? '/video-call-background' : '/call-background',
      params: {
        name: incomingCall.fromUserName || 'Caller',
        avatar: '',
        callId: incomingCall.callId,
        toUserId: incomingCall.fromUserId,
        callStarted: true,
        callStartTime,
      },
    });
  };
  const handleRejectCall = () => {
    if (!incomingCall) return;
    // Send CALL_END to the caller so their call screen closes
    sendCallSignal({
      type: 'CALL_END',
      fromUserId: authData.user.id,
      toUserId: incomingCall.fromUserId,
      callId: incomingCall.callId,
    });
    setIncomingCall(null);
  };

  useEffect(() => {
    // Check if this is the first launch
    const checkFirstLaunch = async () => {
      const hasLaunched = await SecureStore.getItemAsync('hasLaunched');
      if (!hasLaunched) {
        setShowSplash(true);
        // Set the flag so next time splash won't show
        await SecureStore.setItemAsync('hasLaunched', 'true');
        // Show splash for 2 seconds, then hide
        setTimeout(() => setShowSplash(false), 2000);
      } else {
        setShowSplash(false);
      }
    };
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    // Check if onboarding has been seen
    const checkOnboarding = async () => {
      const seen = await SecureStore.getItemAsync('hasSeenOnboarding');
      console.log('Read hasSeenOnboarding:', seen);
      setShowOnboarding(seen !== 'true');
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (showSplash === null || showOnboarding === null) return; // Wait for both checks
    // Wait until both the auth state is loaded AND the router is ready
    if (loading || !navigationState?.key || showSplash || showOnboarding) return;

    // Check if the user is currently inside the main app (any route not in the '(auth)' group)
    const inApp = segments[0] !== '(auth)';

    if (authData && !inApp) {
      router.replace('/(tabs)/chats');
    } else if (!authData && inApp) {
      router.replace('/(auth)/login');
    }

    SplashScreen.hideAsync();
  }, [loading, authData, segments, navigationState?.key, router, showSplash, showOnboarding]);

  if (showSplash === null || showOnboarding === null || loading || !navigationState?.key || showSplash) {
    // Show the splash screen (native or a custom fallback if needed)
    return null;
  }
  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <GroupProvider>
      <CallSignalContext.Provider value={{ sendCallSignal }}>
        <EndedCallContext.Provider value={{ endedCallId }}>
          <SwitchToVideoContext.Provider value={{ switchToVideo, setSwitchToVideo }}>
            <>
              <Modal visible={!!incomingCall} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Incoming Call</Text>
                    <Text style={{ fontSize: 18, marginBottom: 24 }}>{incomingCall?.fromUserName || 'Unknown Caller'}</Text>
                    <View style={{ flexDirection: 'row', gap: 24 }}>
                      <Pressable onPress={handleAcceptCall} style={{ backgroundColor: '#4CAF50', padding: 16, borderRadius: 32, marginRight: 16 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Accept</Text>
                      </Pressable>
                      <Pressable onPress={handleRejectCall} style={{ backgroundColor: '#F44336', padding: 16, borderRadius: 32 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reject</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
              <Stack screenOptions={{ headerShown: false }}>
                {/* Define the main groups of screens. The useEffect above will switch between them. */}
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />

                {/* Define other screens that can be displayed on top of the entire app */}
                <Stack.Screen name="contactInfo" options={{ presentation: 'modal', headerShown: true, title: '' }}/>
                <Stack.Screen name="chat/[id]" />

                {/* You can add other top-level modal screens here as needed, like `new-call` etc. */}
              </Stack>
            </>
          </SwitchToVideoContext.Provider>
        </EndedCallContext.Provider>
      </CallSignalContext.Provider>
    </GroupProvider>
  );
};

// This is the root component of your entire app.
// It wraps EVERYTHING in the AuthProvider so all screens can access the auth state.
export default function RootLayout() {
  return (
    <ActionSheetProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ActionSheetProvider>
  );
}