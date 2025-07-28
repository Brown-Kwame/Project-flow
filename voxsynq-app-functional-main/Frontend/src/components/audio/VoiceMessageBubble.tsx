import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface VoiceMessageBubbleProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  duration: number;
  timestamp: string;
  isMine?: boolean;
  showCheck?: boolean;
  waveform?: number[]; // Add waveform prop
}

const WAVEFORM_WIDTH = 90;
const WAVEFORM_HEIGHT = 22;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({ isPlaying, onPlayPause, duration, timestamp, isMine, showCheck, waveform }) => {
  // Use real waveform if provided, else fallback to flat line
  const points = waveform && waveform.length > 0
    ? waveform.map((amp, i) => [
        (i / (waveform.length - 1)) * WAVEFORM_WIDTH,
        WAVEFORM_HEIGHT / 2 - amp * (WAVEFORM_HEIGHT / 2 - 2)
      ])
    : Array.from({ length: 16 }, (_, i) => [
        (i / 15) * WAVEFORM_WIDTH,
        WAVEFORM_HEIGHT / 2
      ]);
  const polylinePoints = points.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <View style={[stylesW.voiceMessageContainer, isMine ? stylesW.mine : stylesW.theirs]}> 
      <Pressable onPress={onPlayPause} style={stylesW.voiceIconContainer}>
        <MaterialCommunityIcons
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color={'#2196F3'}
        />
      </Pressable>
      <View style={stylesW.waveformBox}>
        <Svg width={WAVEFORM_WIDTH} height={WAVEFORM_HEIGHT} style={stylesW.waveformSvg}>
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={'#2196F3'}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.85}
          />
        </Svg>
      </View>
      <Text style={stylesW.voiceDuration}>{formatTime(duration)}</Text>
      <View style={stylesW.metaBox}>
        <Text style={stylesW.voiceTimestamp}>{timestamp}</Text>
        {showCheck && isMine && (
          <Ionicons name="checkmark-done" size={16} color="#2196F3" style={{ marginLeft: 2 }} />
        )}
      </View>
    </View>
  );
};

const stylesW = StyleSheet.create({
  voiceMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 150,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: '#2196F3', // Sent bubble
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF4FF', // Received bubble
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  voiceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  waveformBox: {
    flex: 1,
    marginRight: 8,
  },
  waveformSvg: {
    width: '100%',
  },
  voiceDuration: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
    marginRight: 8,
  },
  metaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
    minWidth: 48,
    justifyContent: 'flex-end',
  },
  voiceTimestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default VoiceMessageBubble; 