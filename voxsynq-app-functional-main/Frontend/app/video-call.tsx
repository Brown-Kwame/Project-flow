import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal as RNModal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const countryOptions = [
  { name: 'Ghana', code: '+233' },
  { name: 'Nigeria', code: '+234' },
  { name: 'USA', code: '+1' },
  { name: 'UK', code: '+44' },
  { name: 'South Africa', code: '+27' },
  { name: 'Canada', code: '+1' },
  { name: 'India', code: '+91' },
  { name: 'Germany', code: '+49' },
  { name: 'France', code: '+33' },
  { name: 'Italy', code: '+39' },
  { name: 'Spain', code: '+34' },
  { name: 'China', code: '+86' },
  { name: 'Japan', code: '+81' },
  { name: 'Australia', code: '+61' },
  { name: 'Brazil', code: '+55' },
  { name: 'Russia', code: '+7' },
  { name: 'Egypt', code: '+20' },
  { name: 'Kenya', code: '+254' },
  { name: 'Turkey', code: '+90' },
  { name: 'Mexico', code: '+52' },
  { name: 'Netherlands', code: '+31' },
  { name: 'Sweden', code: '+46' },
  { name: 'Switzerland', code: '+41' },
  { name: 'South Korea', code: '+82' },
  { name: 'Singapore', code: '+65' },
  { name: 'UAE', code: '+971' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Israel', code: '+972' },
  { name: 'Greece', code: '+30' },
  { name: 'Portugal', code: '+351' },
  { name: 'Belgium', code: '+32' },
  { name: 'Poland', code: '+48' },
  { name: 'Norway', code: '+47' },
  { name: 'Denmark', code: '+45' },
  { name: 'Finland', code: '+358' },
  { name: 'Ireland', code: '+353' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Malaysia', code: '+60' },
  { name: 'Pakistan', code: '+92' },
  { name: 'Bangladesh', code: '+880' },
  { name: 'Argentina', code: '+54' },
  { name: 'Chile', code: '+56' },
  { name: 'Colombia', code: '+57' },
  { name: 'Morocco', code: '+212' },
  { name: 'Algeria', code: '+213' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'Uganda', code: '+256' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Zimbabwe', code: '+263' },
];

// Remove back button label in navigation header
export const screenOptions = {
  headerShown: false,
};

const VideoCallScreen = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedContact, setSelectedContact] = useState<{ name: string; phoneNumber: string } | null>(null);
  const [countryCode, setCountryCode] = useState(countryOptions[0].code);
  const [countryName, setCountryName] = useState(countryOptions[0].name);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleContactSelect = () => {
    // Navigate to contacts screen for selection
            router.push('/(tabs)/contacts');
  };

  const handleVideoCall = () => {
    const numberToCall = selectedContact?.phoneNumber || phoneNumber;
    if (!numberToCall.trim()) {
      Alert.alert('Error', 'Please enter a phone number or select a contact');
      return;
    }
    // Validate phone number format
    const phoneRegex = /^[\+]?[0-9]{8,16}$/;
    if (!phoneRegex.test(numberToCall.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    Alert.alert(
      'Initiate Video Call',
      `Video call ${selectedContact?.name || numberToCall}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Video Call',
          onPress: () => {
            Alert.alert('Success', 'Video call initiated!');
            // Add actual video call logic here
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Removed custom header for native navigation header */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Phone</Text>
            <View style={styles.countryRow}>
              <Pressable style={styles.countrySelector} onPress={() => setCountryModalVisible(true)}>
                <Text style={styles.countryName}>{countryName}</Text>
                <Ionicons name="chevron-forward" size={18} color="#888" style={{ marginLeft: 6 }} />
              </Pressable>
            </View>
            <View style={styles.mobileRow}>
              <Text style={styles.countryCode}>{countryCode}</Text>
              <TextInput
                style={styles.mobileInput}
                placeholder="Phone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#888"
              />
            </View>
            <RNModal
              visible={countryModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setCountryModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.countryModalContentCustom}>
                  <Text style={styles.countryModalTitle}>Select Country</Text>
                  <FlatList
                    data={countryOptions}
                    keyExtractor={item => item.code}
                    renderItem={({ item }) => (
                      <Pressable
                        style={[styles.countryOptionCustom, item.code === countryCode && styles.countryOptionSelected]}
                        onPress={() => {
                          setCountryCode(item.code);
                          setCountryName(item.name);
                          setCountryModalVisible(false);
                        }}
                      >
                        <Text style={[styles.countryOptionTextCustom, item.code === countryCode && styles.countryOptionTextSelected]}>{item.name} ({item.code})</Text>
                      </Pressable>
                    )}
                  />
                </View>
              </View>
            </RNModal>
          </View>
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Or Select Contact</Text>
            <Pressable style={styles.contactButton} onPress={handleContactSelect}>
              <View style={styles.contactIcon}>
                <Ionicons name="people" size={24} color="#2196F3" />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactButtonText}>
                  {selectedContact ? selectedContact.name : 'Choose from contacts'}
                </Text>
                {selectedContact && (
                  <Text style={styles.contactPhone}>{selectedContact.phoneNumber}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          </View>
          <Pressable style={styles.videoCallButton} onPress={handleVideoCall}>
            <Ionicons name="videocam" size={32} color="#fff" />
            <Text style={styles.videoCallButtonText}>Video Call</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  phoneInput: {
    width: '100%',
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contactSection: {
    marginBottom: 30,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  videoCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 30,
    paddingVertical: 18,
    marginTop: 30,
  },
  videoCallButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  // inputRow style removed for robustness
  countryPicker: {
    width: 110,
    height: 50,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryName: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  countryCode: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
    minWidth: 54,
  },
  mobileInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontWeight: '500',
  },
  countryModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxHeight: 400,
    alignSelf: 'center',
    marginTop: 100,
  },
  countryOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryModalContentCustom: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    width: '90%',
    maxHeight: 420,
    alignSelf: 'center',
    marginTop: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  countryModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 16,
    textAlign: 'center',
  },
  countryOptionCustom: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 2,
  },
  countryOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  countryOptionTextCustom: {
    fontSize: 17,
    color: '#333',
    fontWeight: '500',
  },
  countryOptionTextSelected: {
    color: '#2196F3',
    fontWeight: '700',
  },
});

export default VideoCallScreen; 