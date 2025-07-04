import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type PlanKey = 'standard' | 'advanced';

interface PlanDetails {
  title: string;
  description: string;
  price: string;
  badge: string;
  recommended?: boolean;
  backgroundColor: string;
  features: string[];
}

export default function PricingScreen() {
  const [isAnnual, setIsAnnual] = useState(true);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PlanKey>('standard');

  const handleSubscribe = () => router.push('/(auth)/Login');

  const plans: Record<PlanKey, PlanDetails> = {
    standard: {
      title: 'Standard',
      description: 'For newcomers exploring, access with limited features and good performance',
      price: isAnnual ? '$10.99' : '$12.99',
      badge: '13K+',
      recommended: true,
      backgroundColor: '#ffffff',

      features: [
        'Track team projects with:',
        'Asana AI',
        'Timeline',
        'Reporting',
        'Custom fields',
        'Rules',
        'Workflow builder',
        'Forms',
        'Task dependencies',
        'Project dashboards & custom charts',
        'Private projects',
        'Start dates and times',
      ]
    },
    advanced: {
      title: 'Advanced',
      description: 'For freelancers, better features and best performance',
      price: isAnnual ? '$14.99' : '$17.99',
      badge: '8K+',
     backgroundColor: '#ffffff',

      features: [
        'Everything in Starter, plus:',
        'Portfolios',
        'Lock custom fields',
        'Goals',
        'Forms branching & logic',
        'Approvals',
        'Onboarding & training',
        'Success metrics',
        'Milestones',
      ]
    }
  };

  const currentPlan = plans[activeTab];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
      
      
      </View>


      <Text style={styles.planTitle}>Choose Your Plan</Text>

      <View style={styles.toggleRow}>
        <Text style={[styles.toggleText, !isAnnual && styles.toggleActive]}>MONTHLY</Text>
        <Switch
          value={isAnnual}
          onValueChange={setIsAnnual}
          trackColor={{ false: '#555', true: '#4E8AFE' }}
          thumbColor="#E2E2E2"
        />
        <Text style={[styles.toggleText, isAnnual && styles.toggleActive]}>ANNUAL</Text>
        <Text style={styles.save}>SAVE 30%</Text>
      </View>

      <View style={styles.tabsContainer}>
        {(['standard', 'advanced'] as PlanKey[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
              {plans[tab].title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.planCard, { backgroundColor: currentPlan.backgroundColor }]}>
        {currentPlan.recommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
        )}
        <Text style={styles.planName}>{currentPlan.title}</Text>
        <Text style={styles.planDescription}>{currentPlan.description}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{currentPlan.price}</Text>
          <Text style={styles.perMonth}>/month</Text>
        </View>
        <Text style={styles.billingText}>billed {isAnnual ? 'yearly' : 'monthly'}</Text>

        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>SUBSCRIBE</Text>
        </TouchableOpacity>

        <View style={styles.featuresContainer}>
          {currentPlan.features.map((feature, index) => (
            <Text key={index} style={styles.feature}>{feature}</Text>
          ))}
        </View>
      </View>

      <View style={styles.enterpriseCard}>
        <Text style={styles.enterpriseTitle}>Enterprise</Text>
        <Text style={styles.enterpriseText}>
          For large organizations needing advanced security, control, and support
        </Text>
        <TouchableOpacity style={styles.contactButton} onPress={() => router.push('/(auth)/contact')}>
          <Text style={styles.contactButtonText}>Contact Sales</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.faqRow}>
        <Text style={styles.faqText}>Have Questions?</Text>
        <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/(auth)/contact')}>
          <Text style={styles.chatButtonText}>Chat With Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#ffffff',
  },
  container: {
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#4E8AFE',
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 4,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#111111',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  toggleText: {
    fontSize: 14,
    color: '#888888',
    marginHorizontal: 8,
  },
  toggleActive: {
    color: '#4E8AFE',
    fontWeight: 'bold',
  },
  save: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomColor: '#4E8AFE',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabButtonText: {
    color: '#4E8AFE',
    fontWeight: 'bold',
  },
  planCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  recommendedBadge: {
    backgroundColor: '#4E8AFE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  recommendedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  perMonth: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 4,
  },
  billingText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#4E8AFE',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  featuresContainer: {
    marginTop: 10,
  },
  feature: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  enterpriseCard: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  enterpriseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  enterpriseText: {
    fontSize: 14,
    color: '#444444',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#4E8AFE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  faqRow: {
    marginTop: 30,
    alignItems: 'center',
  },
  faqText: {
    color: '#222222',
    fontSize: 16,
    marginBottom: 8,
  },
  chatButton: {
    backgroundColor: '#4E8AFE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  chatButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
