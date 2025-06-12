import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Billing = () => {
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          margin: 16,
          color: '#222',
        }}>
        Billing & Plans
      </Text>
      <Text
        style={{
          fontSize: 18,
          marginHorizontal: 16,
          color: '#444',
        }}>
        Manage your billing and subscription plans. (Demo UI)
      </Text>
      <View style={styles.cardSection}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Plan</Text>
          <Text style={styles.cardValue}>Pro</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Payment</Text>
          <Text style={styles.cardValue}>2025-07-01</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <Text style={styles.cardValue}>Visa **** 1234</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Billing;

const styles = StyleSheet.create({
  cardSection: {
    margin: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#f7faff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: '#668cff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    color: '#222',
    fontWeight: 'bold',
  },
});