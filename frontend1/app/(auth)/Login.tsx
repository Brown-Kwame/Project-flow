import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function BillingScreen() {
  const [selected, setSelected] = useState<'paypal' | 'card' | null>(null);
  const router = useRouter();

  const handleSubscribe = () => {
    if (!selected) {
      Alert.alert('Select Payment Method', 'Please select a payment method to continue.');
      return;
    }
    if (selected === 'paypal') {
      Alert.alert('PayPal', 'Redirecting to PayPal for payment...');
    } else {
      Alert.alert('Credit Card', 'Redirecting to credit card payment...');
    }
  };

  const handleBack = () => {
    router.push('/(auth)/Billing');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <Text style={styles.backBtnText}>{'<'} Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Subscribe to Our App</Text>
      <Text style={styles.info}>
        Unlock all features and enjoy the full experience by subscribing.
      </Text>
      <Text style={styles.choose}>Choose your payment method:</Text>

      <View style={styles.paymentRow}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selected === 'paypal' && styles.selectedOption,
          ]}
          onPress={() => setSelected('paypal')}
        >
          <Text style={styles.paymentText}>PayPal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selected === 'card' && styles.selectedOption,
          ]}
          onPress={() => setSelected('card')}
        >
          <Text style={styles.paymentText}>Credit Card</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>Subscribe Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    zIndex: 10,
  },
  backBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 4,
    alignSelf: 'center',
    marginTop: 24,
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5A5F',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#111',
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  choose: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 16,
  },
  paymentOption: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#f7f7f7',
    marginHorizontal: 4,
  },
  selectedOption: {
    borderColor: '#7c3aed',
    backgroundColor: '#e8ddff',
  },
  paymentText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
