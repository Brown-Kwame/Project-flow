import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailySummary } from '../types';

interface DailySummaryCardProps {
  data: DailySummary | null;
  isLoading?: boolean;
}

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
  data,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.loadingTitle} />
          <View style={styles.loadingDate} />
        </View>
        <View style={styles.summaryContent}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.loadingItem}>
              <View style={styles.loadingIcon} />
              <View style={styles.loadingText} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        <Text style={styles.summaryDate}>{data.todayDate}</Text>
      </View>
      <View style={styles.summaryContent}>
        <View style={styles.summaryItem}>
          <Ionicons name="mail-unread" size={16} color="#FF9800" />
          <Text style={styles.summaryText}>{data.unreadMessages} unread messages</Text>
        </View>
        <View style={styles.summaryItem}>
          <Ionicons name="call" size={16} color="#F44336" />
          <Text style={styles.summaryText}>{data.missedCalls} missed calls</Text>
        </View>
        <View style={styles.summaryItem}>
          <Ionicons name="time" size={16} color="#4CAF50" />
          <Text style={styles.summaryText}>{data.totalCallTime} total call time</Text>
        </View>
        <View style={styles.summaryItem}>
          <Ionicons name="people" size={16} color="#2196F3" />
          <Text style={styles.summaryText}>{data.onlineContacts} contacts online</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryDate: {
    fontSize: 14,
    color: '#666',
  },
  summaryContent: {
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
  },
  // Loading states
  loadingTitle: {
    width: 120,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  loadingDate: {
    width: 80,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  loadingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  loadingText: {
    width: 150,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});