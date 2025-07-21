import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';

export default function PricingScreen() {
  const router = useRouter();

  const basicPlan = {
    title: 'Free Plan',
    description: 'Perfect for individuals or small teams starting out. Includes essential features to manage your projects effectively.',
    features: [
      'Task creation & assignment',
      'Basic project views (List & Calendar)',
      'Due dates & reminders',
      'Comments & attachments',
      'Collaborators (up to 5 members)',
      'Mobile access',
    ],
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.planTitle}>Welcome to Your Free Plan</Text>

      <View style={styles.planCard}>
        <Text style={styles.planName}>{basicPlan.title}</Text>
        <Text style={styles.planDescription}>{basicPlan.description}</Text>

        <View style={styles.featuresContainer}>
          {basicPlan.features.map((feature, index) => (
            <Text key={index} style={styles.feature}>
              • {feature}
            </Text>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>  router.replace('/(tabs)')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#ffffff',
    flex:1,
    justifyContent:'center',
    marginTop:"10%"
  },
  container: {
    paddingBottom: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  planTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'blue',
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#f5faff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 20,
  },
  featuresContainer: {
    marginTop: 10,
  },
  feature: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#4E8AFE',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
