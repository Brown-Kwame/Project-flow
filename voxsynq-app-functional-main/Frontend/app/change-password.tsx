import { userService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomModal from '../src/components/CustomModal';

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await userService.changePassword({ currentPassword, newPassword });
      setSuccessModalVisible(true);
    } catch (e: any) {
      setError(e.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const minLength = 8;
  const passwordsMatch = newPassword === confirmPassword && newPassword.length >= minLength;
  const passwordTooShort = newPassword.length > 0 && newPassword.length < minLength;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading || !passwordsMatch}>
          <Text style={[styles.save, (!passwordsMatch || loading) && { opacity: 0.5 }]}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </Pressable>
        </View>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </Pressable>
        </View>
        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </Pressable>
        </View>
        {confirmPassword.length > 0 && (
          passwordsMatch ? (
            <View style={styles.matchRow}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
              <Text style={styles.matchText}>Passwords match</Text>
            </View>
          ) : passwordTooShort ? (
            <View style={styles.matchRow}>
              <Ionicons name="alert-circle" size={18} color="#F44336" style={{ marginRight: 6 }} />
              <Text style={[styles.matchText, { color: '#F44336' }]}>Password must be at least 8 characters</Text>
            </View>
          ) : (
            <View style={styles.matchRow}>
              <Ionicons name="close-circle" size={18} color="#F44336" style={{ marginRight: 6 }} />
              <Text style={[styles.matchText, { color: '#F44336' }]}>Passwords do not match</Text>
            </View>
          )
        )}
      </View>
      {/* Success Modal */}
      <CustomModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Password Changed"
        subtitle="Your password was updated successfully."
        actions={[{
          label: 'OK',
          onPress: () => { setSuccessModalVisible(false); router.back(); },
        }]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cancel: { color: '#007AFF', fontSize: 16 },
  save: { color: '#007AFF', fontSize: 16 },
  form: { padding: 20 },
  label: { fontSize: 14, color: '#666', marginTop: 18, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fafafa' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  supportModal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWithIcon: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  eyeIcon: { padding: 8 },
  matchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, marginTop: -4 },
  matchText: { fontSize: 13, color: '#4CAF50', fontWeight: '500' },
});

export default ChangePasswordScreen; 