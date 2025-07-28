import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useCallSignal } from '@/context/CallSignalContext';
import { useEndedCall } from '@/context/EndedCallContext';
import { useSwitchToVideo } from '@/context/SwitchToVideoContext';
import { userService } from '@/services/api';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const CallBackgroundScreen = () => {
  const { name, avatar: paramAvatar, callId, toUserId, callStarted: navCallStarted, callStartTime: navCallStartTime } = useLocalSearchParams();
  const router = useRouter();
  const { authData } = useAuth();
  const { sendCallSignal } = useCallSignal();
  const [micMuted, setMicMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const endedCallContext = useEndedCall();
  const { switchToVideo, setSwitchToVideo } = useSwitchToVideo();
  const [callStarted, setCallStarted] = useState(!!navCallStarted);
  const [callStartTime, setCallStartTime] = useState(navCallStartTime ? Number(navCallStartTime) : null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [avatar, setAvatar] = useState(paramAvatar || '');

  useEffect(() => {
    if (!avatar && toUserId) {
      userService.getAllUsers().then(users => {
        const user = users.find(u => u.id?.toString() === toUserId?.toString());
        if (user && user.profilePictureUrl) setAvatar(user.profilePictureUrl);
      });
    }
  }, [avatar, toUserId]);

  useEffect(() => {
    if (endedCallContext.endedCallId && Number(callId) === endedCallContext.endedCallId) {
      router.back();
    }
  }, [endedCallContext.endedCallId, callId, router]);

  // Toggle microphone mute
  const handleToggleMic = async () => {
    setMicMuted((prev) => !prev);
    try {
      // Note: Audio.setIsMutedAsync is not available in expo-av
      // This would need to be implemented with actual audio recording
    } catch (e) {
      Alert.alert('Error', 'Could not toggle microphone');
    }
  };

  // Toggle speakerphone
  const handleToggleSpeaker = async () => {
    setSpeakerOn((prev) => !prev);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: !speakerOn,
      });
    } catch (e) {
      Alert.alert('Error', 'Could not toggle speaker');
    }
  };

  // Switch to video call
  const handleSwitchToVideo = () => {
    if (sendCallSignal && callId && toUserId && authData?.user?.id) {
      sendCallSignal({
        type: 'SWITCH_TO_VIDEO',
        fromUserId: authData.user.id,
        toUserId: Number(toUserId),
        callId: Number(callId),
      });
    }
    const contactName = Array.isArray(name) ? name[0] : name;
    const contactAvatar = Array.isArray(avatar) ? avatar[0] : avatar;
    router.replace(`/video-call-background?name=${encodeURIComponent(contactName || 'Contact')}&avatar=${contactAvatar || ''}&callId=${callId}&toUserId=${toUserId}`);
  };

  // Listen for SWITCH_TO_VIDEO signal
  useEffect(() => {
    const handleSignal = (msg) => {
      if (msg && msg.type === 'SWITCH_TO_VIDEO' && Number(msg.callId) === Number(callId)) {
        const contactName = Array.isArray(name) ? name[0] : name;
        const contactAvatar = Array.isArray(avatar) ? avatar[0] : avatar;
        router.replace(`/video-call-background?name=${encodeURIComponent(contactName || 'Contact')}&avatar=${contactAvatar || ''}&callId=${callId}&toUserId=${toUserId}`);
      }
    };
    // Assume your context or hook supports subscribing to signals
    if (sendCallSignal && sendCallSignal.subscribe) {
      sendCallSignal.subscribe(handleSignal);
    }
    return () => {
      if (sendCallSignal && sendCallSignal.unsubscribe) {
        sendCallSignal.unsubscribe(handleSignal);
      }
    };
  }, [callId, name, avatar, router, toUserId, sendCallSignal]);

  // Listen for CALL_ANSWER signal
  useEffect(() => {
    const handleSignal = (msg: any) => {
      if (msg && msg.type === 'CALL_ANSWER' && Number(msg.callId) === Number(callId)) {
        setCallStarted(true);
        setCallStartTime(Date.now());
      }
    };
    if (sendCallSignal && sendCallSignal.subscribe) {
      sendCallSignal.subscribe(handleSignal);
    }
    return () => {
      if (sendCallSignal && sendCallSignal.unsubscribe) {
        sendCallSignal.unsubscribe(handleSignal);
      }
    };
  }, [callId, sendCallSignal]);

  // Timer logic
  useEffect(() => {
    if (callStarted && callStartTime) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStarted, callStartTime]);

  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  // End call
  const handleEndCall = () => {
    if (sendCallSignal && callId && toUserId && authData?.user?.id) {
      sendCallSignal({
        type: 'CALL_END',
        fromUserId: authData.user.id,
        toUserId: Number(toUserId),
        callId: Number(callId),
      });
    }
    router.back();
  };

  // Not implemented
  const handleNotImplemented = () => {
    Alert.alert('Not implemented yet');
  };

  useEffect(() => {
    if (
      switchToVideo &&
      Number(switchToVideo.callId) === Number(callId)
    ) {
      const contactName = Array.isArray(name) ? name[0] : name;
      const contactAvatar = Array.isArray(avatar) ? avatar[0] : avatar;
      router.replace(`/video-call-background?name=${encodeURIComponent(contactName || 'Contact')}&avatar=${contactAvatar || ''}&callId=${callId}&toUserId=${toUserId}`);
      setSwitchToVideo(null);
    }
  }, [switchToVideo, callId, name, avatar, router, toUserId, setSwitchToVideo]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#2196F3" />
      </Pressable>
      
      {/* Blue gradient overlay */}
      <LinearGradient
        colors={["#181A20", "#E3F2FD30", "#181A20"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      {/* Center avatar and name */}
      <View style={styles.centerContent}>
        <View style={styles.avatarOuterCircle}>
          <View style={styles.avatarCircle}>
            <Avatar imageUrl={avatar as string} name={Array.isArray(name) ? name[0] : name || 'C'} size={140} />
          </View>
        </View>
        <Text style={styles.contactName}>{Array.isArray(name) ? name[0] : name || 'Contact'}</Text>
        {callStarted ? (
          <Text style={styles.callingText}>{formatTime(elapsed)}</Text>
        ) : (
          <Text style={styles.callingText}>Calling...</Text>
        )}
      </View>
      {/* Bottom call controls */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.controlButton} onPress={handleToggleMic}>
          <Feather name={micMuted ? "mic-off" : "mic"} size={24} color={micMuted ? "#F44336" : "#2196F3"} />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={handleSwitchToVideo}>
          <Ionicons name="videocam" size={24} color="#2196F3" />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={handleToggleSpeaker}>
          <Ionicons name="volume-high" size={24} color={speakerOn ? "#2196F3" : "#888"} />
        </Pressable>
        <Pressable style={[styles.controlButton, styles.hangupButton]} onPress={handleEndCall}>
          <Ionicons name="call" size={24} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOuterCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E3F2FD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    marginBottom: 18,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#23272a',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    resizeMode: 'cover',
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
    fontFamily: 'System',
  },
  callingText: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(227,242,253,0.85)',
    borderRadius: 24,
    margin: 18,
    padding: 10,
    shadowColor: '#E3F2FD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  hangupButton: {
    backgroundColor: '#F44336',
    shadowColor: '#F44336',
    shadowOpacity: 0.18,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
});

export default CallBackgroundScreen; 