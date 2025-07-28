import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const countryOptions = [
  { name: 'Ghana', code: '+233' },
  { name: 'Nigeria', code: '+234' },
  { name: 'USA', code: '+1' },
  { name: 'UK', code: '+44' },
  { name: 'South Africa', code: '+27' },
];

interface DialerButtonProps {
  label: string | React.ReactNode;
  onPress: () => void;
  style?: object;
}

const DialerButton: React.FC<DialerButtonProps> = ({ label, onPress, style = {} }) => (
  <Pressable style={[styles.dialerButton, style]} onPress={onPress}>
    <Text style={styles.dialerButtonText}>{label}</Text>
  </Pressable>
);

const NewCallScreen = () => {
  const router = useRouter();
  const [dialedNumber, setDialedNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleCall = () => {
    if (!dialedNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }
    // Validate phone number format
    const phoneRegex = /^[\+]?[0-9]{8,16}$/;
    if (!phoneRegex.test(dialedNumber.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    Alert.alert(
      'Initiate Call',
      `Call ${dialedNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Alert.alert('Success', 'Call initiated!');
            // You can add actual call logic here
          }
        }
      ]
    );
  };

  const openAddContactModal = () => {
    setModalVisible(true);
  };

  const closeAddContactModal = () => {
    setModalVisible(false);
    setNewContactName('');
    setNewContactNumber('');
  };

  const handleAddContact = () => {
    // Here you would add logic to save the contact
    closeAddContactModal();
    Alert.alert('Contact Added', 'The contact has been added successfully.');
  };

  // Format the dialed number for display
  function formatDialedNumber(number: string): string {
    // Remove all non-digit except leading +
    let raw = number.replace(/(?!^)[^\d]/g, '');
    if (raw.startsWith('+1')) {
      // US number with country code
      const digits = raw.slice(2);
      if (digits.length <= 3) return `+1 (${digits}`;
      if (digits.length <= 6) return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (raw.startsWith('1')) {
      // US number without plus
      const digits = raw.slice(1);
      if (digits.length <= 3) return `1 (${digits}`;
      if (digits.length <= 6) return `1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (raw.length === 10) {
      // Ghanaian or other 10-digit number
      return `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
    } else if (raw.length > 6) {
      // Partial Ghanaian number
      return `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
    } else if (raw.length > 3) {
      return `${raw.slice(0, 3)} ${raw.slice(3)}`;
    }
    return raw;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2196F3" />
        </Pressable>
        <Text style={styles.headerTitle}>Voice Call</Text>
        {dialedNumber.length > 0 && (
          <Pressable
            onPress={() => {
              setNewContactNumber(dialedNumber);
              openAddContactModal();
            }}
            style={styles.addContactIcon}
          >
            <Ionicons name="person-add" size={28} color="#2196F3" />
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* DIALER INTERFACE */}
          <View style={styles.dialerFullScreen}>
            {dialedNumber.length > 0 && (
              <Text style={styles.dialedNumber}>{formatDialedNumber(dialedNumber)}</Text>
            )}
            <View style={styles.dialerPadFull}>
              {[
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
                ['*', '0', '#'],
              ].map((row, rowIndex) => (
                <View key={rowIndex} style={styles.dialerRowFull}>
                  {row.map((item) => (
                    <DialerButton
                      key={item}
                      label={item}
                      onPress={() => setDialedNumber((prev) => prev + item)}
                    />
                  ))}
                </View>
              ))}
              <View style={[styles.dialerRowFull, { justifyContent: 'center' }]}> 
                <DialerButton
                  label={<Ionicons name="backspace" size={24} color="#2196F3" />}
                  onPress={() => setDialedNumber((prev) => prev.slice(0, -1))}
                  style={styles.dialerBackspace}
                />
              </View>
              </View>
            <Pressable style={styles.dialerCallButtonFull} onPress={() => router.push(`/call-background?name=${encodeURIComponent(dialedNumber || 'Unknown')}`)}>
              <Ionicons name="call" size={32} color="#fff" />
            </Pressable>
          </View>

         {/* Add Contact Modal */}
         <Modal
           visible={modalVisible}
           animationType="slide"
           transparent
           onRequestClose={closeAddContactModal}
         >
           <View style={styles.modalOverlay}>
             <View style={styles.modalContent}>
               <Text style={styles.modalTitle}>Add Contact</Text>
               <TextInput
                 style={styles.modalInput}
                 placeholder="Name"
                 value={newContactName}
                 onChangeText={setNewContactName}
                 autoFocus
               />
               <TextInput
                 style={styles.modalInput}
                 placeholder="Phone Number"
                 value={newContactNumber}
                 onChangeText={setNewContactNumber}
                 keyboardType="phone-pad"
               />
               <View style={styles.modalButtonRow}>
                 <Pressable style={styles.modalCancelButton} onPress={closeAddContactModal}>
                   <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
                 <Pressable style={styles.modalAddButton} onPress={handleAddContact}>
                   <Text style={styles.modalAddText}>Add to Contacts</Text>
              </Pressable>
            </View>
          </View>
           </View>
         </Modal>

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  clearButton: {
    padding: 5,
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
  callButtonsSection: {
    marginBottom: 30,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
  },
  audioCallButton: {
    backgroundColor: '#4CAF50',
  },
  videoCallButton: {
    backgroundColor: '#2196F3',
  },
  callButtonIcon: {
    marginRight: 15,
  },
  callButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  recentSection: {
    marginBottom: 20,
  },
  recentCalls: {
    gap: 8,
  },
  recentCallItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  recentCallIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentCallInfo: {
    flex: 1,
  },
  recentCallName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentCallTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  recentCallButton: {
    padding: 8,
  },
  dialerFullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 0,
    marginBottom: 0,
  },
  dialedNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  dialerPadFull: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 24,
    marginTop: 32,
  },
  dialerRowFull: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dialerButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dialerButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  dialerBackspace: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dialerCallButtonFull: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
  },
  addContactText: {
    marginLeft: 8,
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  addContactIcon: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  modalAddButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  modalAddText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewCallScreen; 