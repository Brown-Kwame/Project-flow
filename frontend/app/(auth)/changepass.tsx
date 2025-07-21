import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../config/supabaseClient';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async () => {
    setChangeError('');
    setChangeLoading(true);
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setChangeError('All fields are required.');
      setChangeLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setChangeError('New passwords do not match.');
      setChangeLoading(false);
      return;
    }
    try {
      // Supabase change password
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setChangeError(error.message || 'Failed to change password.');
        setChangeLoading(false);
        return;
      }
      setChangeError('Password changed successfully.');
    } catch (e) {
      setChangeError('Failed to change password.');
    }
    setChangeLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      {/* Page Title */}
      <Text style={styles.title}>Change Password</Text>

      {/* Inputs */}
      <TextInput placeholder="Current Password" secureTextEntry style={styles.input} placeholderTextColor="#999" value={currentPassword} onChangeText={setCurrentPassword} />
      <TextInput placeholder="New Password" secureTextEntry style={styles.input} placeholderTextColor="#999" value={newPassword} onChangeText={setNewPassword} />
      <TextInput placeholder="Confirm New Password" secureTextEntry style={styles.input} placeholderTextColor="#999" value={confirmNewPassword} onChangeText={setConfirmNewPassword} />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword} disabled={changeLoading}>
        <Text style={styles.saveButtonText}>{changeLoading ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
      {changeError ? <Text style={styles.error}>{changeError}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
//New changepass text file