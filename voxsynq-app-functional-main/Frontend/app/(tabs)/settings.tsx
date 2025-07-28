import { useAuth } from '@/context/AuthContext';
import { fileService, userService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomModal from '../../src/components/CustomModal';

// A reusable component for each settings item
const SettingsItem = ({ icon, label, onPress }) => (
  <Pressable style={styles.itemContainer} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#555" style={styles.itemIcon} />
    <Text style={styles.itemLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </Pressable>
);

const SettingsScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  // State for modals
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [photoPickerVisible, setPhotoPickerVisible] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  // User profile state
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    profilePictureUrl: '',
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setProfileLoading(true);
    setProfileError(false);
    userService.getMe()
      .then((data) => {
        if (mounted) {
          setProfile({
            username: data.username || '',
            email: data.email || '',
            profilePictureUrl: data.profilePictureUrl || '',
          });
          setProfileLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setProfileError(true);
          setProfileLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  // Handlers
  const handleLogout = () => {
    setLogoutModalVisible(false);
    signOut();
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await userService.deleteMe();
      Alert.alert('Account deleted');
      setDeleteModalVisible(false);
      signOut();
    } catch (e: any) {
      setDeleteError(e.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChangePhoto = () => {
    setPhotoPickerVisible(true);
  };

  const handleTakePhoto = async () => {
    setPhotoLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permissions are required.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        // Upload the image first, then update profile picture
        const fileUrl = await fileService.upload(result.assets[0].uri);
        await userService.updateMe({ profilePictureUrl: fileUrl });
        setProfile((prev) => ({ ...prev, profilePictureUrl: fileUrl }));
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile picture.');
    } finally {
      setPhotoLoading(false);
      setPhotoPickerVisible(false);
    }
  };

  const handleChooseFromGallery = async () => {
    setPhotoLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permissions are required.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        // Upload the image first, then update profile picture
        const fileUrl = await fileService.upload(result.assets[0].uri);
        await userService.updateMe({ profilePictureUrl: fileUrl });
        setProfile((prev) => ({ ...prev, profilePictureUrl: fileUrl }));
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile picture.');
    } finally {
      setPhotoLoading(false);
      setPhotoPickerVisible(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const handleNotifications = () => {
    // TODO: Navigate to notifications settings
  };

  const handleHelp = () => {
    setHelpModalVisible(true);
  };

  const handleTerms = () => {
    setTermsModalVisible(true);
  };

  const handlePrivacy = () => {
    setPrivacyModalVisible(true);
  };

  // Support modal actions
  const handleSupportEmail = () => {
    setSupportModalVisible(false);
    Linking.openURL('mailto:support@voxsynq.com');
  };
  const handleSupportChat = () => {
    setSupportModalVisible(false);
    Linking.openURL('https://livechat.voxsynq.com');
  };
  const handleSupportCall = () => {
    setSupportModalVisible(false);
    Linking.openURL('tel:+1234567890');
  };

  // Help modal actions
  const handleOpenFAQ = () => {
    setHelpModalVisible(false);
    Linking.openURL('https://faq.voxsynq.com');
  };
  const handleContactUs = () => {
    setHelpModalVisible(false);
    setSupportModalVisible(true);
  };

  // Terms modal actions
  const handleReadTerms = () => {
    setTermsModalVisible(false);
    Linking.openURL('https://terms.voxsynq.com');
  };

  // Privacy modal actions
  const handleReadPolicy = () => {
    setPrivacyModalVisible(false);
    Linking.openURL('https://privacy.voxsynq.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profilePhotoContainer} onPress={handleChangePhoto}>
            {profile.profilePictureUrl && !profileError ? (
              <Image
                source={{ uri: profile.profilePictureUrl }}
                style={styles.profilePhoto}
                onError={() => setProfileError(true)}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={80} color="#bbb" />
            )}
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEditProfile}>
            <Text style={styles.profileName}>{profileLoading ? 'Loading...' : (profile.username || 'John Doe')}</Text>
            <Text style={styles.profileInfo}>{profileLoading ? '' : (profile.email || 'john@example.com')}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <SettingsItem icon="create-outline" label="Edit Profile" onPress={handleEditProfile} />
          <SettingsItem icon="lock-closed-outline" label="Change Password" onPress={handleChangePassword} />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsItem icon="help-circle-outline" label="Help & FAQ" onPress={handleHelp} />
          <SettingsItem icon="mail-outline" label="Contact Support" onPress={() => setSupportModalVisible(true)} />
          <SettingsItem icon="document-text-outline" label="Terms of Service" onPress={handleTerms} />
          <SettingsItem icon="shield-checkmark-outline" label="Privacy Policy" onPress={handlePrivacy} />
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZoneSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Pressable style={styles.dangerButton} onPress={() => setLogoutModalVisible(true)}>
            <Ionicons name="log-out-outline" size={22} color="#D32F2F" style={styles.logoutIcon} />
            <Text style={styles.dangerText}>Logout</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={() => setDeleteModalVisible(true)}>
            <Ionicons name="trash-outline" size={22} color="#D32F2F" style={styles.logoutIcon} />
            <Text style={styles.dangerText}>Delete Account</Text>
          </Pressable>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>VoxSynq v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Support Modal */}
      <CustomModal
        visible={supportModalVisible}
        onClose={() => setSupportModalVisible(false)}
        title="Contact Support"
        subtitle="Choose how to contact us:"
        actions={[
          { label: 'Email Support', onPress: handleSupportEmail },
          { label: 'Live Chat', onPress: handleSupportChat },
          { label: 'Call Support', onPress: handleSupportCall },
          { label: 'Cancel', onPress: () => setSupportModalVisible(false), color: '#D32F2F' },
        ]}
      />

      {/* Help & FAQ Modal */}
      <CustomModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
        title="Help & FAQ"
        subtitle="How can we help you?"
        actions={[
          { label: 'Open FAQ', onPress: handleOpenFAQ },
          { label: 'Contact Us', onPress: handleContactUs },
          { label: 'Cancel', onPress: () => setHelpModalVisible(false), color: '#D32F2F' },
        ]}
      />

      {/* Terms of Service Modal */}
      <CustomModal
        visible={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
        title="Terms of Service"
        subtitle="Would you like to read our Terms of Service?"
        actions={[
          { label: 'Read Terms', onPress: handleReadTerms },
          { label: 'Cancel', onPress: () => setTermsModalVisible(false), color: '#D32F2F' },
        ]}
      />

      {/* Privacy Policy Modal */}
      <CustomModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
        title="Privacy Policy"
        subtitle="Would you like to read our Privacy Policy?"
        actions={[
          { label: 'Read Policy', onPress: handleReadPolicy },
          { label: 'Cancel', onPress: () => setPrivacyModalVisible(false), color: '#D32F2F' },
        ]}
      />

      {/* Logout Confirmation Modal */}
      <CustomModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        title="Logout"
        subtitle="Are you sure you want to logout?"
        actions={[
          { label: 'Logout', onPress: handleLogout, color: '#D32F2F' },
          { label: 'Cancel', onPress: () => setLogoutModalVisible(false) },
        ]}
      />

      {/* Delete Account Confirmation Modal */}
      <CustomModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Delete Account"
        subtitle={deleteError ? `This action is permanent.\n${deleteError}` : 'This action is permanent. Are you sure?'}
        actions={[
          { label: deleteLoading ? 'Deleting...' : 'Delete', onPress: handleDeleteAccount, color: '#D32F2F', disabled: deleteLoading },
          { label: 'Cancel', onPress: () => setDeleteModalVisible(false) },
        ]}
      />

      {/* Photo Picker Modal */}
      <CustomModal
        visible={photoPickerVisible}
        onClose={() => setPhotoPickerVisible(false)}
        title="Change Profile Photo"
        actions={[
          { label: photoLoading ? 'Loading...' : 'Take Photo', onPress: handleTakePhoto, disabled: photoLoading },
          { label: photoLoading ? 'Loading...' : 'Choose from Gallery', onPress: handleChooseFromGallery, disabled: photoLoading },
          { label: 'Cancel', onPress: () => setPhotoPickerVisible(false), color: '#D32F2F', disabled: photoLoading },
        ]}
      />
    </SafeAreaView>
  );
};

// Styles matching the new design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 4,
  },
  changePhotoText: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  profileInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dangerZoneSection: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 10,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  dangerText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
  },
  logoutIcon: {
    marginRight: 10,
  },
  versionSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    color: '#aaa',
    fontSize: 13,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalCancel: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#D32F2F',
    fontSize: 16,
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  confirmActions: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmCancel: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmCancelText: {
    color: '#333',
    fontSize: 16,
  },
});

export default SettingsScreen;