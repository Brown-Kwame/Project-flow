import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface AudioPreviewBarProps {
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSend: () => void;
  onCancel: () => void;
  isUploading?: boolean;
  waveform?: number[]; // Optional: waveform data (array of amplitudes 0-1)
  progress?: number; // Optional: playback progress (0-1)
}

const formatMillis = (ms?: number) => {
  if (!ms) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const WAVEFORM_WIDTH = 160;
const WAVEFORM_HEIGHT = 28;
const WAVEFORM_POINTS = 32;

function generateDottedWaveform(points = WAVEFORM_POINTS) {
  // Generates a subtle dotted waveform for the preview
  return Array.from({ length: points }, (_, i) => {
    // Dots alternate up/down for a subtle effect
    const y = i % 2 === 0 ? WAVEFORM_HEIGHT * 0.45 : WAVEFORM_HEIGHT * 0.55;
    return { x: (i / (points - 1)) * WAVEFORM_WIDTH, y };
  });
}

const AudioPreviewBar: React.FC<AudioPreviewBarProps> = ({
  duration,
  isPlaying,
  onPlayPause,
  onSend,
  onCancel,
  isUploading,
  waveform,
  progress = 0,
}) => {
  // Use real waveform if provided, else fallback to flat line
  const points = waveform && waveform.length > 0
    ? waveform.map((amp, i) => [
        (i / (waveform.length - 1)) * WAVEFORM_WIDTH,
        WAVEFORM_HEIGHT / 2 - amp * (WAVEFORM_HEIGHT / 2 - 2)
      ])
    : Array.from({ length: WAVEFORM_POINTS }, (_, i) => [
        (i / (WAVEFORM_POINTS - 1)) * WAVEFORM_WIDTH,
        WAVEFORM_HEIGHT / 2
      ]);
  const polylinePoints = points.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <View style={stylesW.container}>
      <Pressable style={stylesW.circleButton} onPress={onPlayPause}>
        <MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={28} color="#2196F3" />
      </Pressable>
      <View style={stylesW.waveformBox}>
        <Svg width={WAVEFORM_WIDTH} height={WAVEFORM_HEIGHT}>
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke="#2196F3"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.85}
          />
        </Svg>
        <Text style={stylesW.timer}>{formatMillis(duration)}</Text>
      </View>
      <Pressable style={stylesW.circleButtonSend} onPress={onSend} disabled={isUploading}>
        <MaterialCommunityIcons name="send" size={26} color="#fff" />
      </Pressable>
      <Pressable style={stylesW.circleButtonTrash} onPress={onCancel}>
        <MaterialCommunityIcons name="trash-can-outline" size={26} color="#F44336" />
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
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF4FF',
    borderWidth: 1,
    borderColor: '#2196F3',
    marginHorizontal: 4,
  },
  circleButtonSend: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginHorizontal: 4,
    shadowColor: '#2196F3',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  circleButtonTrash: {
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
  waveformBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  timer: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
    marginLeft: 10,
    minWidth: 48,
    textAlign: 'center',
  },
});

export default AudioPreviewBar; 