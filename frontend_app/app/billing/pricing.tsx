import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';

export default function PricingScreen() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/images/Letter-A-logo-design-in-flat-design-on-transparent-background-PNG-removebg-preview.png')}
            style={styles.logo}
          />
          <Text style={styles.headerBrand}>asana</Text>
        </View>
        <Text style={styles.headerQuestion}>Have questions</Text>
        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.chatButtonText}>Chat with us</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.planTitle}>We’ve got a plan for you</Text>

      {/* Toggle */}
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleText, !isAnnual && styles.toggleActive]}>MONTHLY</Text>
        <Switch
          value={isAnnual}
          onValueChange={setIsAnnual}
          trackColor={{ false: '#ccc', true: '#2563EB' }}
          thumbColor="#fff"
        />
        <Text style={[styles.toggleText, isAnnual && styles.toggleActive]}>ANNUAL</Text>
        <Text style={styles.freeTrial}>14 DAYS FREE TRIAL</Text>
        <Text style={styles.save}>SAVE 30% OFF</Text>
      </View>

      {/* Pricing Cards */}
      <View style={styles.cardsRow}>
        {/* Standard */}
        <View style={[styles.card, { backgroundColor: '#a78bfa' }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.recommended}>Recommended</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>13K+</Text></View>
          </View>
          <Text style={styles.cardTitle}>Standard</Text>
          <Text style={styles.cardDesc}>For newcomers exploring, access with limited features and good performance</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$10.99</Text>
            <Text style={styles.per}>/month</Text>
          </View>
          <Text style={styles.billed}>billed yearly</Text>
          <View style={styles.discountBadge}><Text style={styles.discountText}>30% OFF</Text></View>
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={styles.subscribeText}>SUBSCRIBE</Text>
          </TouchableOpacity>
          <View style={styles.features}>
            <Text style={styles.feature}>Track team projects with:</Text>
            <Text style={styles.feature}>Asana AI</Text>
            <Text style={styles.feature}>Timeline</Text>
            <Text style={styles.feature}>Reporting</Text>
            <Text style={styles.feature}>Custom fields</Text>
            <Text style={styles.feature}>Rules</Text>
            <Text style={styles.feature}>Workflow builder</Text>
            <Text style={styles.feature}>Forms</Text>
            <Text style={styles.feature}>Task dependencies</Text>
            <Text style={styles.feature}>Project dashboards & custom charts</Text>
            <Text style={styles.feature}>Private projects</Text>
            <Text style={styles.feature}>Start dates and times</Text>
          </View>
        </View>
        {/* Advanced */}
        <View style={[styles.card, { backgroundColor: '#c7d2fe' }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>8K+</Text></View>
          </View>
          <Text style={styles.cardTitle}>Advanced</Text>
          <Text style={styles.cardDesc}>For freelancers, better features and best performance</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$14.99</Text>
            <Text style={styles.per}>/month</Text>
          </View>
          <Text style={styles.billed}>billed yearly</Text>
          <TouchableOpacity style={styles.subscribeBtnAlt}>
            <Text style={styles.subscribeTextAlt}>SUBSCRIBE</Text>
          </TouchableOpacity>
          <View style={styles.features}>
            <Text style={styles.feature}>Everything in Starter, plus:</Text>
            <Text style={styles.feature}>Portfolios</Text>
            <Text style={styles.feature}>Lock custom fields</Text>
            <Text style={styles.feature}>Goals</Text>
            <Text style={styles.feature}>Forms branching & logic</Text>
            <Text style={styles.feature}>Approvals</Text>
            <Text style={styles.feature}>Onboarding & training</Text>
            <Text style={styles.feature}>Success metrics</Text>
            <Text style={styles.feature}>Milestones</Text>
          </View>
        </View>
      </View>

      {/* Enterprise */}
      <View style={styles.enterpriseCard}>
        <Text style={styles.enterpriseTitle}>Enterprise</Text>
        <Text style={styles.enterpriseBold}>Everything in Advanced, +</Text>
        <Text style={styles.enterpriseDesc}>
          Asana AI{'\n'}
          Admin announcements{'\n'}
          Block integrations{'\n'}
          User and group provisional & deprovisioning{'\n'}
          Workflow bundles
        </Text>
        <Text style={styles.letsTalk}>Let’s talk!</Text>
        <Text style={styles.enterpriseContact}>Contact us for details</Text>
        <TouchableOpacity style={styles.contactBtn}>
          <Text style={styles.contactBtnText}>Contact us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#fff' },
  container: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 6,
  },
  headerBrand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c0392b',
    marginRight: 8,
  },
  headerQuestion: {
    fontSize: 13,
    marginRight: 8,
    color: '#222',
  },
  chatButton: {
    backgroundColor: '#2d2df7',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 13,
    color: '#888',
    marginHorizontal: 4,
  },
  toggleActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  freeTrial: {
    fontSize: 12,
    color: '#2563EB',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  save: {
    fontSize: 12,
    color: '#c0392b',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 18,
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 6,
    minWidth: 170,
    maxWidth: 200,
    alignItems: 'center',
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  recommended: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  badgeText: {
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 11,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  per: {
    fontSize: 13,
    color: '#222',
    marginLeft: 2,
    marginBottom: 2,
  },
  billed: {
    fontSize: 11,
    color: '#444',
    marginBottom: 2,
  },
  discountBadge: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  discountText: {
    color: '#c0392b',
    fontWeight: 'bold',
    fontSize: 11,
  },
  subscribeBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 8,
    marginTop: 2,
    alignSelf: 'stretch',
  },
  subscribeText: {
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  subscribeBtnAlt: {
    backgroundColor: '#2d2df7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 8,
    marginTop: 12,
    alignSelf: 'stretch',
  },
  subscribeTextAlt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  features: {
    marginTop: 4,
    alignSelf: 'stretch',
  },
  feature: {
    fontSize: 11,
    color: '#222',
    marginBottom: 2,
  },
  enterpriseCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    width: '96%',
    alignSelf: 'center',
    elevation: 2,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  enterpriseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  enterpriseBold: {
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  enterpriseDesc: {
    fontSize: 12,
    color: '#222',
    marginBottom: 8,
    lineHeight: 18,
  },
  letsTalk: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  enterpriseContact: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  contactBtn: {
    backgroundColor: '#a78bfa',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});