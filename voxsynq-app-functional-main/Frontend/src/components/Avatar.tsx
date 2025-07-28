import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ImageStyle, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
  fallbackIcon?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, name = '', size = 48, style, fallbackIcon }) => {
  const [error, setError] = useState(false);
  const initials = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {imageUrl && !error ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }] as ImageStyle}
          onError={() => setError(true)}
        />
      ) : fallbackIcon ? (
        <Ionicons name={fallbackIcon as any} size={size * 0.6} color="#888" />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.45 }]}>{initials}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#eef5ff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default Avatar; 