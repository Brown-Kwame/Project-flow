import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useCallSignal } from '@/context/CallSignalContext';
import { useEndedCall } from '@/context/EndedCallContext';
import { useSwitchToVideo } from '@/context/SwitchToVideoContext';
import { userService } from '@/services/api';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const VideoCallBackgroundScreen = () => {
  const { name, avatar: paramAvatar, callId, callStarted: navCallStarted, callStartTime: navCallStartTime, toUserId } = useLocalSearchParams();
  const router = useRouter();
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [isViewSwapped, setIsViewSwapped] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const endedCallContext = useEndedCall();
  const { switchToVideo, setSwitchToVideo } = useSwitchToVideo();
  const [avatar, setAvatar] = useState(paramAvatar || '');
  const { authData } = useAuth();
  const { sendCallSignal } = useCallSignal();
  const [callStarted, setCallStarted] = useState(!!navCallStarted);
  const [callStartTime, setCallStartTime] = useState(navCallStartTime ? Number(navCallStartTime) : null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (endedCallContext.endedCallId && Number(callId) === endedCallContext.endedCallId) {
      router.back();
    }
  }, [endedCallContext.endedCallId, callId, router]);

  useEffect(() => {
    if (
      switchToVideo &&
      Number(switchToVideo.callId) === Number(callId)
    ) {
      const contactName = Array.isArray(name) ? name[0] : name;
      const contactAvatar = Array.isArray(avatar) ? avatar[0] : avatar;
      router.replace(`/video-call-background?name=${encodeURIComponent(contactName || 'Contact')}&avatar=${contactAvatar || ''}&callId=${callId}`);
      setSwitchToVideo(null);
    }
  }, [switchToVideo, callId, name, avatar, router, setSwitchToVideo]);

  useEffect(() => {
    if (!avatar && toUserId) {
      userService.getAllUsers().then(users => {
        const user = users.find(u => u.id?.toString() === toUserId?.toString());
        if (user && user.profilePictureUrl) setAvatar(user.profilePictureUrl);
      });
    }
  }, [avatar, toUserId]);

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

  // Toggle microphone mute
  const handleToggleMic = () => setMicMuted((prev) => !prev);
  
  // Toggle camera on/off
  const handleToggleCamera = () => {
    if (!permission?.granted) {
      Alert.alert('Camera Permission', 'Camera permission is required for video calls');
      return;
    }
    setCameraOn((prev) => !prev);
  };

  // Toggle camera type (front/back)
  const handleToggleCameraType = () => {
    if (!permission?.granted) {
      Alert.alert('Camera Permission', 'Camera permission is required for video calls');
      return;
    }
    setFacing(current => 
      current === 'front' ? 'back' : 'front'
    );
  };
  
  // Toggle speaker
  const handleToggleSpeaker = () => setSpeakerOn((prev) => !prev);
  
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
  
  // Swap main view and PiP view
  const handleSwapViews = () => {
    setIsViewSwapped(prev => !prev);
  };

  // Early returns after all hooks
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Camera permissions are loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to show the camera</Text>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </Pressable>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#2196F3" />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#2196F3" />
      </Pressable>
      
      {/* Main video feed - either camera or contact */}
      <View style={styles.videoFeedBg}>
        {isViewSwapped ? (
          // Contact is main view
          <Avatar imageUrl={avatar as string} name={Array.isArray(name) ? name[0] : name || 'Contact'} size={154} style={{ position: 'absolute', top: '25%', alignSelf: 'center' }} />
        ) : (
          // Camera is main view
          cameraOn && permission?.granted ? (
            <CameraView 
              style={styles.cameraView} 
              facing={facing}
              ref={cameraRef}
            />
          ) : (
            <LinearGradient
              colors={["#23272a", "#181A20"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          )
        )}
        
        {/* Contact Info Header - Top */}
        <View style={styles.contactInfoHeader}>
          <Text style={styles.contactName}>{Array.isArray(name) ? name[0] : name || 'Contact'}</Text>
          {callStarted ? (
            <Text style={styles.callingText}>{formatTime(elapsed)}</Text>
          ) : (
            <Text style={styles.callingText}>Calling...</Text>
          )}
        </View>
        
        {/* Centered Profile Picture Only - Show when camera is off */}
        {!cameraOn && (
          <View style={styles.centeredProfilePicture}>
            <View style={styles.centeredContactAvatar}>
              <Avatar imageUrl={avatar as string} name={Array.isArray(name) ? name[0] : name || 'Contact'} size={154} />
            </View>
          </View>
        )}
        
        {/* Picture-in-picture view - either camera or contact */}
        <Pressable style={styles.recipientPiP} onPress={handleSwapViews}>
          {isViewSwapped ? (
            // Camera is PiP view
            cameraOn && permission?.granted ? (
              <CameraView 
                style={styles.recipientPiPCamera} 
                facing={facing}
              />
            ) : (
              <View style={styles.recipientPiPPlaceholder}>
                <Ionicons name="videocam" size={32} color="#888" />
              </View>
            )
          ) : (
            // Contact is PiP view
            <Avatar imageUrl={avatar as string} name={Array.isArray(name) ? name[0] : name || 'Contact'} size={100} />
          )}
        </Pressable>
      </View>

      {/* Bottom call controls */}
      <View style={styles.bottomBarOverlay}>
        <Pressable style={styles.controlButton} onPress={handleToggleMic}>
          <Feather name={micMuted ? "mic-off" : "mic"} size={24} color={micMuted ? "#F44336" : "#2196F3"} />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={handleToggleCamera}>
          <Ionicons name={cameraOn ? "videocam" : "videocam-off"} size={24} color={cameraOn ? "#2196F3" : "#888"} />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={handleToggleCameraType}>
          <Ionicons name="camera-reverse" size={24} color="#2196F3" />
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
  },
  videoFeedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoFeedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  cameraView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  recipientPiPCamera: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  bottomBarOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(227,242,253,0.85)',
    borderRadius: 32,
    marginHorizontal: 32,
    padding: 10,
    zIndex: 2,
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
    marginHorizontal: 8,
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
  recipientPiP: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  recipientPiPImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recipientPiPPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
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
  contactInfoHeader: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  callingText: {
    fontSize: 16,
    color: '#E3F2FD',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  centeredProfilePicture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  centeredContactAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centeredContactAvatarImage: {
    width: 154,
    height: 154,
    borderRadius: 77,
    resizeMode: 'cover',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A20',
  },
  permissionText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VideoCallBackgroundScreen; 