import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PROFILE_STORAGE_KEY = 'asana_profile';
const DEFAULT_PROFILE = {
  name: 'James Doe',
  email: 'james@futurist.com',
  plan: 'Pro',
  profileImage: require('../../assets/images/home2.webp'),
};

const HEADER_IMAGE = require('../../assets/images/explore.webp');
const fallbackImage = require('../../assets/images/home2.webp');

const Explore = () => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);
  // Teammates CRUD state
  type Teammate = { id: number; name: string; img: any };
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [teammatesLoading, setTeammatesLoading] = useState(true);
  const [inviteName, setInviteName] = useState('');
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteError, setInviteError] = useState('');

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
  const saveProfile = useCallback(async (updates: Partial<typeof DEFAULT_PROFILE>) => {
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

  // Fetch teammates from a free API (jsonplaceholder)
  useEffect(() => {
    setTeammatesLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users?_limit=6')
      .then(res => res.json())
      .then((data: any[]) => {
        setTeammates(data.map((u: any) => ({
          id: u.id,
          name: u.name.split(' ')[0],
          img: require('../../assets/images/home2.webp'), // fallback, could randomize
        })));
        setTeammatesLoading(false);
      })
      .catch(() => setTeammatesLoading(false));
  }, []);

  // Add teammate (simulate API)
  const handleInvite = async () => {
    if (!inviteName.trim()) {
      setInviteError('Name required');
      return;
    }
    // Simulate POST to API
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inviteName }),
      });
      const data = await res.json();
      setTeammates(prev => [
        ...prev,
        { id: typeof data.id === 'number' ? data.id : Math.floor(Date.now()), name: inviteName.trim(), img: require('../../assets/images/home2.webp') },
      ]);
      setInviteName('');
      setInviteModal(false);
      setInviteError('');
    } catch {
      setInviteError('Failed to invite. Try again.');
    }
  };

  // Remove teammate (simulate API)
  const handleRemoveTeammate = async (id: number) => {
    // Simulate DELETE to API
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: 'DELETE' });
      setTeammates(prev => prev.filter(tm => tm.id !== id));
    } catch {
      // fallback: still remove locally
      setTeammates(prev => prev.filter(tm => tm.id !== id));
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#668cff" style={{ marginTop: 40 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: '#f7faff' }}>
      {/* Header with image and overlay */}
      <View style={styles.headerContainer}>
        <Image source={HEADER_IMAGE} style={styles.headerImage} resizeMode="cover" />
        <View style={styles.headerDarkOverlay} />
        {/* Notification bell */}
        <TouchableOpacity style={styles.bellBtn}>
          <FontAwesome name="bell" size={22} color="#fff" />
        </TouchableOpacity>
        {/* Profile Card overlays header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image source={profile.profileImage || fallbackImage} style={styles.avatar} />
            <TouchableOpacity style={styles.avatarEditBtn} onPress={openEditModal}>
              <FontAwesome name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Use a fallback and improved display for the user's name */}
          <View style={styles.profileNameWrap}>
            <Text
              style={styles.profileName}
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {profile.name && profile.name.trim().length > 0 ? profile.name : 'Your Name'}
            </Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{profile.plan || 'Free'}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Main content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Teammates row */}
        <View style={styles.teammatesRow}>
          <Text style={styles.sectionTitle}>Teammates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teammatesScroll}>
            {teammatesLoading ? (
              <ActivityIndicator size="small" color="#668cff" style={{ marginRight: 16 }} />
            ) : (
              teammates.map((tm) => (
                <View key={tm.id} style={styles.teammateItem}>
                  <Image source={tm.img} style={styles.teammateAvatar} />
                  <Text style={styles.teammateName}>{tm.name}</Text>
                  <TouchableOpacity style={styles.removeTeammateBtn} onPress={() => handleRemoveTeammate(tm.id)}>
                    <FontAwesome name="close" size={14} color="#fff" accessibilityLabel="Remove teammate" accessibilityRole="button" />
                  </TouchableOpacity>
                </View>
              ))
            )}
            <TouchableOpacity style={styles.inviteBtn} onPress={() => setInviteModal(true)}>
              <FontAwesome name="plus" size={18} color="#668cff" />
              <Text style={styles.inviteBtnText}>Invite</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* Account/Settings section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account & Settings</Text>
          <View style={styles.infoRow}><Text style={styles.label}>Email</Text><Text style={styles.value}>{profile.email || 'No Email'}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Plan</Text><Text style={styles.value}>{profile.plan || 'Free'}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Notifications</Text><Text style={styles.value}>Enabled</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Theme</Text><Text style={styles.value}>Light</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Language</Text><Text style={styles.value}>English</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>App Version</Text><Text style={styles.value}>1.0.0</Text></View>
        </View>
        {/* Common settings actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.actionBtnFull}>
            <FontAwesome name="lock" size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnFull}>
            <FontAwesome name="sign-out" size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnFull}>
            <FontAwesome name="trash" size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Modal for editing profile */}
      <Modal visible={modalVisible} animationType="fade" transparent>
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
      {/* Invite Modal */}
      <Modal visible={inviteModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Teammate</Text>
            <TextInput
              value={inviteName}
              onChangeText={setInviteName}
              placeholder="Enter teammate email "
              style={styles.input}
              placeholderTextColor="#888"
            />
            {inviteError ? <Text style={{ color: 'red', marginBottom: 8 }}>{inviteError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => { setInviteModal(false); setInviteError(''); }} style={styles.cancelBtn}>
                <Text style={{ color: '#668cff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleInvite} style={styles.saveBtn}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 260,
    position: 'relative',
    backgroundColor: '#222',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: 0,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  profileCard: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: -60,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 18,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 2,
  },
  avatarContainer: {
    position: 'absolute',
    top: -45,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#e6e6e6',
  },
  avatarEditBtn: {
    position: 'absolute',
    right: -6,
    bottom: 0,
    backgroundColor: '#668cff',
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  profileNameWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 18, // Increased padding bottom for more space below the name
    paddingHorizontal: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    maxWidth: 220,
    width: '100%',
    letterSpacing: 0.1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 0,
  },
  planBadge: {
    backgroundColor: '#668cff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  planBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 80,
    marginBottom: 0,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  actionBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#668cff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 12,
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#668cff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
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
  bellBtn: {
    position: 'absolute',
    top: 36,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.18)',
    padding: 10,
    borderRadius: 20,
  },
  teammatesRow: {
    marginTop: 80,
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  teammatesScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  teammateItem: {
    alignItems: 'center',
    marginRight: 18,
    position: 'relative',
  },
  teammateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6e6e6',
    marginBottom: 4,
  },
  teammateName: {
    fontSize: 13,
    color: '#222',
    fontWeight: '600',
    maxWidth: 60,
    textAlign: 'center',
  },
  removeTeammateBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4d4f',
    borderRadius: 10,
    padding: 2,
    zIndex: 5,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#668cff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    backgroundColor: '#fff',
    height: 48,
    alignSelf: 'center',
  },
  inviteBtnText: {
    color: '#668cff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
});