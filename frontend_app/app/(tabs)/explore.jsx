import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const PROFILE_STORAGE_KEY = 'asana_profile';
const DEFAULT_PROFILE = {
  name: 'James Doe',
  email: 'james@futurist.com',
  plan: 'Pro',
  profileImage: require('../../assets/images/home2.webp'),
};

const explore = () => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);

  // Load profile from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (stored) setProfile(JSON.parse(stored));
      } catch {}
      setLoading(false);
    })();
  }, []);

  // Save profile to AsyncStorage
  const saveProfile = useCallback(async (updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Open modal with current profile
  const openEditModal = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setModalVisible(true);
  };

  // Save edits
  const handleSave = async () => {
    setSaving(true);
    await saveProfile({ name: editName, email: editEmail });
    setSaving(false);
    setModalVisible(false);
  };

  // Simulate API polling for profile updates (performance: clear interval)
  useEffect(() => {
    const interval = setInterval(async () => {
      // Example: fetch from randomuser.me
      try {
        const res = await fetch('https://randomuser.me/api/');
        const data = await res.json();
        if (data.results && data.results[0]) {
          const apiUser = data.results[0];
          saveProfile({
            name: `${apiUser.name.first} ${apiUser.name.last}`,
            email: apiUser.email,
          });
        }
      } catch {}
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [saveProfile]);

  if (loading) return <ActivityIndicator size="large" color="#668cff" style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={{ backgroundColor: '#f7faff' }} contentContainerStyle={{ padding: 24 }}>
      <View style={styles.card}>
        <Image source={profile.profileImage} style={styles.profileImage} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.plan}>{profile.plan} User</Text>
        <TouchableOpacity style={styles.editBtn} onPress={openEditModal}>
          <FontAwesome name="edit" size={18} color="#668cff" />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>
        <Text style={styles.label}>Plan</Text>
        <Text style={styles.value}>{profile.plan}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Security</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <FontAwesome name="lock" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Update Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <FontAwesome name="shield" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Enable 2FA</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#668cff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default explore;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#668cff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  plan: {
    color: '#668cff',
    marginBottom: 8,
    fontWeight: '600',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  editBtnText: {
    color: '#668cff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  value: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#668cff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 12,
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f7faff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f7faff',
    marginRight: 8,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#668cff',
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
});