import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoodRecommendation } from '../types';

interface MoodRecommendationItemProps {
  recommendation: MoodRecommendation;
  onCallContact?: (contactId: string, type: 'audio' | 'video') => void;
  onSendMessage?: (contactId: string, message: string) => void;
}

export const MoodRecommendationItem: React.FC<MoodRecommendationItemProps> = ({
  recommendation,
  onCallContact,
  onSendMessage,
}) => {
  const handleAction = () => {
    if (!recommendation.contactId) {
      Alert.alert('Error', 'Contact information not available');
      return;
    }

    const actionType = recommendation.type;
    // Directly trigger call or video call without alert
    if (actionType === 'call' || actionType === 'video') {
      onCallContact?.(recommendation.contactId!, actionType === 'video' ? 'video' : 'audio');
      return;
    } else if (actionType === 'message') {
      // Navigate to chat screen for this contact
      onSendMessage?.(recommendation.contactId!, ''); // Empty string signals navigation only
      return;
    }
  };

  const getActionText = () => {
    switch (recommendation.type) {
      case 'call':
        return `Call ${recommendation.contact}`;
      case 'video':
        return `Video call ${recommendation.contact}`;
      case 'message':
        return `Message ${recommendation.contact}`;
      default:
        return `Contact ${recommendation.contact}`;
    }
  };

  return (
    <Pressable style={styles.recommendationItem} onPress={handleAction}>
      <View style={styles.recommendationIcon}>
        <Ionicons name={recommendation.icon as any} size={20} color="#2196F3" />
      </View>
      <View style={styles.recommendationContent}>
        <Text style={styles.recommendationAction}>{getActionText()}</Text>
        <Text style={styles.recommendationReason}>{recommendation.reason}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#999" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  recommendationReason: {
    fontSize: 14,
    color: '#666',
  },
});