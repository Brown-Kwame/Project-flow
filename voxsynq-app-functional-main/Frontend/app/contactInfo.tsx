import Avatar from '@/components/Avatar';
import StatusIndicator from '@/components/StatusIndicator';
import { useAuth } from '@/context/AuthContext';
import { useCallSignal } from '@/context/CallSignalContext';
import { callService, userService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const ActionButton = ({ icon, label, onPress }) => (
  <Pressable style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon as any} size={24} color="#007AFF" />
    <Text style={styles.actionLabel}>{label}</Text>
  </Pressable>
);

const ContactInfoScreen = () => {
  const router = useRouter();
  const { authData } = useAuth();
  const { sendCallSignal } = useCallSignal();
  const params = useLocalSearchParams();

  const { contactId, contactName, contactEmail, profilePictureUrl: paramProfilePictureUrl, createdAt } = params as {
    contactId: string;
    contactName: string;
    contactEmail: string;
    profilePictureUrl?: string;
    createdAt?: string;
  };

  const [profilePictureUrl, setProfilePictureUrl] = React.useState(paramProfilePictureUrl || '');

  React.useEffect(() => {
    if (!profilePictureUrl && contactId) {
      // Fetch user data if profilePictureUrl not passed
      userService.getAllUsers().then(users => {
        const user = users.find(u => u.id?.toString() === contactId?.toString());
        if (user && user.profilePictureUrl) setProfilePictureUrl(user.profilePictureUrl);
      });
    }
  }, [profilePictureUrl, contactId]);

  const navigateToChat = () => {
    router.push({
      pathname: `/chat/${contactId}`,
      params: { contactName },
    });
  };

  const onVoiceCall = async () => {
    try {
      const startedCall = await callService.startCall(authData.user.id, contactId, 'VOICE');
      sendCallSignal({
        type: 'CALL_OFFER',
        fromUserId: authData.user.id,
        toUserId: contactId,
        callId: startedCall.id,
        fromUserName: authData.user.username,
      });
      router.push({
        pathname: '/call-background',
        params: {
          name: contactName,
          avatar: '',
          callId: startedCall.id,
          toUserId: contactId,
        },
      });
    } catch (e) {
      alert('Failed to start call');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: 'Contacts',
          headerTransparent: true,
          headerTintColor: '#000',
        }}
      />

      <View style={styles.profileContainer}>
        {/* --- THIS IS THE CORRECTED JSX STRUCTURE --- */}
        {/* The outer View handles the overall spacing. */}
        <View style={styles.avatarWrapper}>
          {/* The inner container is for positioning the dot. */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Avatar imageUrl={profilePictureUrl} name={contactName} size={120} />
            </View>
            {/* The StatusIndicator is now positioned relative to avatarContainer */}
            <StatusIndicator isOnline={true} size="large" />
          </View>
        </View>

        <Text style={styles.name}>{contactName}</Text>
        <Text style={styles.status}>Online</Text>
      </View>

      <View style={styles.actionsContainer}>
        <ActionButton icon="chatbubble" label="Chat" onPress={navigateToChat} />
        <ActionButton icon="call" label="Voice Call" onPress={onVoiceCall} />
        <ActionButton icon="videocam" label="Video Call" onPress={async () => {
          try {
            const startedCall = await callService.startCall(authData.user.id, contactId, 'VIDEO');
            sendCallSignal({
              type: 'CALL_OFFER',
              fromUserId: authData.user.id,
              toUserId: contactId,
              callId: startedCall.id,
              fromUserName: authData.user.username,
              callType: 'VIDEO',
            });
            router.push({
              pathname: '/video-call-background',
              params: {
                name: contactName,
                avatar: '',
                callId: startedCall.id,
                toUserId: contactId,
              },
            });
          } catch (e) {
            alert('Failed to start video call');
          }
        }} />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{contactEmail}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Username</Text>
          <Text style={styles.detailValue}>{contactName}</Text>
        </View>
        {createdAt && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date Joined</Text>
            <Text style={styles.detailValue}>{new Date(createdAt).toLocaleDateString()}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

// --- CORRECTED STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  profileContainer: {
    paddingTop: 100, alignItems: 'center', paddingBottom: 30, backgroundColor: '#fff',
  },
  // New wrapper for spacing
  avatarWrapper: {
    marginBottom: 15,
  },
  // This container is now ONLY for positioning the status dot
  avatarContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  avatar: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#e0e0e0',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 50, fontWeight: 'bold', color: '#666' },
  name: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  status: { fontSize: 16, color: '#4CAF50', marginTop: 5 },
  actionsContainer: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20,
    backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e5e5e5',
  },
  actionButton: { alignItems: 'center' },
  actionLabel: { marginTop: 5, fontSize: 14, color: '#007AFF' },
  detailsContainer: {
    marginTop: 20, backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  detailItem: {
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  detailLabel: { fontSize: 14, color: '#888', marginBottom: 4 },
  detailValue: { fontSize: 16, color: '#000' },
});

export default ContactInfoScreen;