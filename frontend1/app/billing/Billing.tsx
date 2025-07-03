import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const fetchPlanApi = async () => {
  // Example: Use a free API for random plan features (mock)
  try {
    const res = await fetch('https://random-data-api.com/api/v2/users?size=1');
    const data = await res.json();
    // Simulate plan info from API
    return {
      plan: 'Pro',
      nextPayment: '2025-07-01',
      paymentMethod: 'Visa **** 1234',
      planFeatures: [
        'Unlimited projects',
        'Advanced analytics',
        'Priority support',
        `Account manager: ${data[0]?.first_name || 'Alex'}`,
      ],
    };
  } catch {
    return null;
  }
};

type PlanApiData = {
  plan: string;
  nextPayment: string;
  paymentMethod: string;
  planFeatures: string[];
};

const Billing = () => {
  const [apiData, setApiData] = useState<PlanApiData | null>(null);
  useEffect(() => {
    fetchPlanApi().then((data) => setApiData(data));
  }, []);

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <Text style={styles.heading}>Billing & Plans</Text>
      <Text style={styles.subheading}>
        Manage your billing and subscription plans. Upgrade, view invoices, and see your savings.
      </Text>
      <View style={styles.cardSection}>
        <View style={styles.cardHighlight}>
          <Text style={styles.cardTitle}>Current Plan</Text>
          <Text style={styles.cardValue}>{apiData?.plan || 'Pro'}</Text>
          <View style={styles.featureList}>
            {(apiData?.planFeatures || [
              'Unlimited projects',
              'Advanced analytics',
              'Priority support',
              'Account manager: Alex',
            ]).map((f: string, i: number) => (
              <Text key={i} style={styles.featureItem}>• {f}</Text>
            ))}
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle} className='text-yellow-400'>Next Payment</Text>
          <Text style={styles.cardValue}>{apiData?.nextPayment || '2025-07-01'}</Text>
          <Text style={styles.cardDesc}>Billed annually</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <Text style={styles.cardValue}>{apiData?.paymentMethod || 'Visa **** 1234'}</Text>
          <Text style={styles.cardDesc} >Exp. 12/28</Text>
        </View>
      </View>
      <View style={styles.upgradeSection}>
        <Text style={styles.upgradeTitle}>Upgrade to Enterprise</Text>
        <Text style={styles.upgradeDesc}>Unlock AI-powered reporting, custom integrations, and dedicated account management.</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceMain}>$99</Text>
          <Text style={styles.priceSub}>/mo</Text>
        </View>
        <TouchableOpacity style={styles.upgradeBtn}>
          <Text style={styles.upgradeBtnText}>Request Demo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.savingsSection}>
        <Text style={styles.savingsTitle}>🎉 Annual Plan Savings</Text>
        <Text style={styles.savingsDesc}>Save 20% by switching to annual billing. Investors love efficiency!</Text>
        <TouchableOpacity style={styles.savingsBtn}>
          <Text style={styles.savingsBtnText}>Switch to Annual</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.invoiceSection}>
        <Text style={styles.invoiceTitle}>Recent Invoices</Text>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceDate}>2025-06-01</Text>
          <Text style={styles.invoiceAmount}>$49</Text>
          <Text style={styles.invoiceStatusPaid}>Paid</Text>
        </View>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceDate}>2025-05-01</Text>
          <Text style={styles.invoiceAmount}>$49</Text>
          <Text style={styles.invoiceStatusPaid}>Paid</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Billing;

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    margin: 16,
    color: '#222',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    marginHorizontal: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 12,
  },
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
  cardHighlight: {
    backgroundColor: '#668cff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 8,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#668cff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardDesc: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  upgradeSection: {
    backgroundColor: '#fff0f7',
    borderRadius: 18,
    margin: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#f20d69',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f20d69',
    marginBottom: 6,
  },
  upgradeDesc: {
    color: '#444',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  priceMain: {
    fontSize: 32,
    color: '#f20d69',
    fontWeight: 'bold',
  },
  priceSub: {
    fontSize: 18,
    color: '#f20d69',
    marginLeft: 2,
    marginBottom: 2,
  },
  upgradeBtn: {
    backgroundColor: '#f20d69',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
    shadowColor: '#f20d69',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  upgradeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  savingsSection: {
    backgroundColor: '#e6f7ff',
    borderRadius: 18,
    margin: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#00bfae',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  savingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00bfae',
    marginBottom: 4,
  },
  savingsDesc: {
    color: '#444',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  savingsBtn: {
    backgroundColor: '#00bfae',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: 4,
    shadowColor: '#00bfae',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  savingsBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  invoiceSection: {
    margin: 16,
    backgroundColor: '#f7faff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#668cff',
    marginBottom: 8,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  invoiceDate: {
    color: '#888',
    fontSize: 15,
    width: 100,
  },
  invoiceAmount: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
    width: 60,
    textAlign: 'right',
  },
  invoiceStatusPaid: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 15,
    width: 60,
    textAlign: 'right',
  },
  featureList: {
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'stretch',
  },
  featureItem: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 2,
  },
});