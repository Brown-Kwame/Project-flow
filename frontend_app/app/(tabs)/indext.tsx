import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftIcons}>
          <TouchableOpacity>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
          <Text style={styles.headerIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Logo above brand */}
      <View style={styles.logoBrand}>
        <Image
          source={require('../../assets/images/Letter-A-logo-design-in-flat-design-on-transparent-background-PNG-removebg-preview.png')}
          style={styles.logo}
        />
        <Text style={styles.brand}>asana</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Platform for teams to manage and streamline work, ultimately enabling them to achieve their goals more efficiently.
      </Text>

      {/* CTA Button */}
      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>See how it works</Text>
      </TouchableOpacity>

      {/* Images Row */}
      <View style={styles.imagesRow}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&w=200' }}
          style={styles.rowImage}
        />
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&w=200' }}
          style={styles.rowImage}
        />
      </View>

      {/* Section: AI */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>See how Asana keeps your work moving across use cases</Text>
        <Text style={styles.sectionText}>
          Let Asana AI handle work for you and surface the full context of your business—anytime, anywhere. Connect your goals to the work that helps achieve them, and supercharge your work with a working strategy for your company.
        </Text>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&w=300' }}
          style={styles.aiImage}
        />
      </View>

      {/* Collaborators */}
      <Text style={styles.collabTitle}>Collaborators of Asana</Text>
      <View style={styles.collabRow}>
        <View style={styles.collabBadge}>
          <Text style={styles.collabText}>Gartner.</Text>
        </View>
        <View style={[styles.collabBadge, { backgroundColor: '#e0f7fa' }]}>
          <Text style={styles.collabText}>IDC</Text>
        </View>
      </View>
      <View style={styles.collabRow}>
        <View style={[styles.collabBadge, { backgroundColor: '#e6f7e6' }]}>
          <Text style={styles.collabText}>FORRESTER</Text>
        </View>
      </View>

      {/* Footer Logo */}
      <Image
        source={require('../../assets/images/Letter-A-logo-design-in-flat-design-on-transparent-background-PNG-removebg-preview.png')}
        style={styles.footerLogo}
      />
      <Text style={styles.brandFooter}>asana</Text>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Contact Us */}
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>Contact Us</Text>
          <Text style={styles.footerLabel}>Send us a message</Text>
          <TextInput style={styles.footerInput} placeholder="Your name" />
          <TextInput style={styles.footerInput} placeholder="Your email" />
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
        {/* Sitemap */}
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>Sitemap</Text>
          <Text style={styles.footerLink}>Asana Work Management</Text>
          <Text style={styles.footerLink}>Asana Basics</Text>
          <Text style={styles.footerLink}>Asana Pricing</Text>
          <Text style={styles.footerLink}>Asana Desktop/App</Text>
          <Text style={styles.footerLink}>Asana Premium</Text>
        </View>
        {/* Using Asana */}
        <View style={styles.footerCol}>
          <Text style={styles.footerTitle}>Using Asana</Text>
          <Text style={styles.footerLink}>Terms and Privacy</Text>
          <Text style={styles.footerLink}>Help Center</Text>
          <Text style={styles.footerLink}>Community</Text>
          <Text style={styles.footerLink}>Blog</Text>
        </View>
      </View>
      {/* Social and Copyright */}
      <View style={styles.socialRow}>
        <Text style={styles.socialIcon}>🌐</Text>
        <Text style={styles.socialIcon}>📘</Text>
        <Text style={styles.socialIcon}>🐦</Text>
        <Text style={styles.socialIcon}>▶️</Text>
        <Text style={styles.socialIcon}>📸</Text>
        <Text style={styles.socialIcon}>English</Text>
      </View>
      <Text style={styles.copyright}>© 2025 Asana, Inc.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#e6eaff' },
  container: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: '#e6eaff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 24,
    marginBottom: 8,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  logoBrand: {
    alignItems: 'center',
    marginBottom: 4,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 2,
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c0392b',
    marginBottom: 4,
    marginTop: 0,
    letterSpacing: 1,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignSelf: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  rowImage: {
    width: 110,
    height: 70,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '92%',
    alignSelf: 'center',
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 8,
    textAlign: 'center',
  },
  readMoreButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'center',
    marginBottom: 10,
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  aiImage: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'center',
  },
  collabTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#c0392b',
    marginTop: 10,
    marginBottom: 6,
    textAlign: 'center',
  },
  collabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 10,
  },
  collabBadge: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  collabText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
  },
  footerLogo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginTop: 16,
  },
  brandFooter: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#b71c1c',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    width: '96%',
    alignSelf: 'center',
    gap: 10,
  },
  footerCol: {
    flex: 1,
    marginHorizontal: 6,
  },
  footerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  footerLabel: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 4,
  },
  footerInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  footerButton: {
    backgroundColor: '#2563EB',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerLink: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
  },
  socialIcon: {
    fontSize: 20,
    marginHorizontal: 4,
    color: '#c0392b',
  },
  copyright: {
    color: '#444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
});
