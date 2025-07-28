import { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const CallActionBox = ({ 
  onEndCall, 
  onToggleCamera, 
  onToggleMicrophone, 
  onReverseCamera,
  isCameraOn = true, 
  isMicOn = true 
}) => {
  const [localCameraOn, setLocalCameraOn] = useState(isCameraOn);
  const [localMicOn, setLocalMicOn] = useState(isMicOn);

  const handleReverseCamera = () => {
    console.warn('onReverseCamera');
    onReverseCamera?.();
  };

  const handleToggleCamera = () => {
    const newState = !localCameraOn;
    setLocalCameraOn(newState);
    onToggleCamera?.(newState);
  };

  const handleToggleMicrophone = () => {
    const newState = !localMicOn;
    setLocalMicOn(newState);
    onToggleMicrophone?.(newState);
  };

  const handleEndCall = () => {
    console.warn('Call ended');
    onEndCall?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        {/* Camera Reverse Button */}
        <Pressable 
          onPress={handleReverseCamera} 
          style={[styles.iconButton, !localCameraOn && styles.disabledButton]}
          disabled={!localCameraOn}
        >
          <Ionicons name="camera-reverse" size={28} color="white" />
        </Pressable>

        {/* Camera Toggle Button */}
        <Pressable 
          onPress={handleToggleCamera} 
          style={[styles.iconButton, !localCameraOn && styles.activeButton]}
        >
          <MaterialCommunityIcons 
            name={localCameraOn ? "camera" : "camera-off"} 
            size={28} 
            color="white" 
          />
        </Pressable>

        {/* Microphone Toggle Button */}
        <Pressable 
          onPress={handleToggleMicrophone} 
          style={[styles.iconButton, !localMicOn && styles.activeButton]}
        >
          <MaterialCommunityIcons 
            name={localMicOn ? "microphone" : "microphone-off"} 
            size={28} 
            color="white" 
          />
        </Pressable>

        {/* End Call Button */}
        <Pressable onPress={handleEndCall} style={styles.endCallButton}>
          <MaterialCommunityIcons name="phone-hangup" size={30} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonsContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    opacity: 0.5,
  },
  endCallButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CallActionBox;