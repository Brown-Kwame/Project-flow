import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

// Example: Replace with your real notification fetching logic
const fetchNotifications = async () => {
  // Simulate async fetch
  return [];
  // Example: return [{ id: '1', title: 'Welcome!', body: 'Thanks for joining.' }];
};

const EmptyInbox = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No notifications yet. You're all caught up! 🎉</Text>
  </View>
);

export default function Inbox() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    load();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.header}>Inbox</Text>
      </SafeAreaView>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyInbox />}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  notificationItem: {
    backgroundColor: '#f1f5fb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  notificationTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  notificationBody: { fontSize: 14, color: '#555' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
