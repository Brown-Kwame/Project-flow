import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

interface AudioRecorderBarProps {
  duration: number;
  onStop: () => void;
  onCancel: () => void;
  isUploading?: boolean;
}

const formatMillis = (ms?: number) => {
  if (!ms) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const AudioRecorderBar: React.FC<AudioRecorderBarProps> = ({ duration, onStop, onCancel, isUploading }) => {
  // Simple animated waveform effect
  const anim = useRef(new Animated.Value(0)).current;
  const [waveHeights, setWaveHeights] = useState(Array(16).fill(8));

  useEffect(() => {
    const animate = () => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => {
        setWaveHeights(Array(16).fill(0).map(() => 8 + Math.random() * 16));
        anim.setValue(0);
        animate();
      });
    };
    animate();
    return () => anim.stopAnimation();
  }, [anim]);

  return (
    <View style={stylesW.container}>
      <Pressable style={stylesW.circleButton} onPress={onCancel}>
        <MaterialCommunityIcons name="trash-can-outline" size={28} color="#F44336" />
      </Pressable>
      <View style={stylesW.waveformContainer}>
        <View style={stylesW.waveform}>
          {waveHeights.map((h, i) => (
            <Animated.View
              key={i}
              style={[
                stylesW.waveBar,
                { height: h },
              ]}
            />
          ))}
        </View>
        <Text style={stylesW.timer}>{formatMillis(duration)}</Text>
      </View>
      <Pressable style={stylesW.micButton} onPress={onStop}>
        <MaterialCommunityIcons name="microphone" size={28} color="#fff" />
      </Pressable>
    </View>
  );
};

const stylesW = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 10,
    margin: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 28,
    marginRight: 10,
    gap: 2,
  },
  waveBar: {
    width: 3,
    backgroundColor: '#2196F3',
    borderRadius: 2,
    marginHorizontal: 0.5,
  },
  timer: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
    minWidth: 48,
    textAlign: 'center',
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F44336',
    marginHorizontal: 4,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginHorizontal: 4,
    shadowColor: '#2196F3',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AudioRecorderBar; 