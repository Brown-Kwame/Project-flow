import React from 'react';
import { View, StyleSheet } from 'react-native';

interface StatusIndicatorProps {
  isOnline: boolean;
  size?: 'small' | 'large'; // Add an optional size prop
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isOnline, size = 'small' }) => {
  if (!isOnline) {
    return null;
  }

  // Choose the style based on the size prop
  const indicatorStyle = size === 'large' ? styles.indicatorLarge : styles.indicatorSmall;

  return <View style={[styles.indicatorBase, indicatorStyle]} />;
};

const styles = StyleSheet.create({
  // Base styles common to both sizes
  indicatorBase: {
    backgroundColor: '#4CAF50', // Online green
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff', // White border makes it stand out
  },
  // Style for the smaller dot in the chat header
  indicatorSmall: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    bottom: 0,
    right: 0,
  },
  // Style for the larger dot on the contact info screen
  indicatorLarge: {
    width: 24, // Bigger
    height: 24,
    borderRadius: 12, // Bigger
    bottom: 5, // Positioned slightly up from the bottom edge
    right: 5,  // Positioned slightly in from the right edge
    borderWidth: 3, // A thicker border to match
  },
});

export default StatusIndicator;