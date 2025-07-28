import { useAuth } from '@/context/AuthContext';
import { useGroup } from '@/context/GroupContext';
import { fileService, messageService } from '@/services/api';
import { useGroupReadStatusWebSocket, useGroupWebSocket, useWebSocket } from '@/services/useWebSocket';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AudioRecorderBar from '../src/components/audio/AudioRecorderBar';
import CustomModal from '../src/components/CustomModal';

const GroupChatScreen = () => {
  const { groupId, groupName } = useLocalSearchParams();
  const { authData } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const flatListRef = useRef(null);
  // Add state for playback progress
  const [playingAudioUrl, setPlayingAudioUrl] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const soundRef = useRef(null);
  const [audioRenderTick, setAudioRenderTick] = useState(0);
  const [isAudioBusy, setIsAudioBusy] = useState(false);
  const [photoPickerVisible, setPhotoPickerVisible] = useState(false);

  // Add state for group read statuses
  const [groupReadStatuses, setGroupReadStatuses] = useState<Record<number, number>>({});

  // Subscribe to real-time group read status updates
  useGroupReadStatusWebSocket(Number(groupId), (statuses) => {
    console.log('Group Chat: Received read status update', statuses);
    setGroupReadStatuses(statuses || {});
  });

  const group = useGroup(Number(groupId));

  // Fetch group messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const msgs = await messageService.getGroupMessages(Number(groupId));
        setMessages(msgs);
      } catch (e) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      messageService.getGroupReadStatuses(Number(groupId)).then((data: any) => {
        setGroupReadStatuses(data || {});
      });
    }
  }, [groupId]);

  // Listen for real-time group info updates
  useGroupWebSocket((groupUpdate) => {
    if (groupUpdate.id === Number(groupId)) {
      setGroup(groupUpdate);
    }
  });

  // WebSocket for real-time updates
  const onMessageReceived = React.useCallback((msg) => {
    if (msg.groupId === Number(groupId)) {
      setMessages(prev => {
        const updatedMessages = [...prev, msg];
        // Find the latest message timestamp in the updated list
        const latestMessage = updatedMessages.reduce((latest, m) => {
          return new Date(m.timestamp).getTime() > new Date(latest.timestamp).getTime() ? m : latest;
        }, msg);
        if (groupId && authData?.user) {
          const latestTimestamp = new Date(latestMessage.timestamp).getTime();
          if (msg.senderId !== authData.user.id) {
            messageService.markGroupAsRead(Number(groupId), latestTimestamp + 1);
          }
        }
        return updatedMessages;
      });
    }
  }, [groupId, authData]);
  useWebSocket(onMessageReceived);

  // Sort messages from newest to oldest for FlatList inverted
  const sortedMessages = React.useMemo(() => {
    return [...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [messages]);

  // Send text message
  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await messageService.sendGroupMessage(Number(groupId), {
        senderId: authData.user.id,
        senderUsername: authData.user.username,
        content: input,
      });
      setInput('');
    } catch (e) {
      // Optionally show error
    }
  };

  // Send image (refactored to use modal)
  const handleImageSend = () => {
    setPhotoPickerVisible(true);
  };

  const handleTakePhoto = async () => {
    if (!authData?.user) return;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permissions needed!');
      setPhotoPickerVisible(false);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setIsUploading(true);
      try {
        const imageUrl = await fileService.upload(result.assets[0].uri);
        await messageService.sendGroupMessage(Number(groupId), {
          senderId: authData.user.id,
          senderUsername: authData.user.username,
          imageUrl,
        });
      } catch (e) {
        Alert.alert('Error', 'Failed to send image.');
      } finally {
        setIsUploading(false);
      }
    }
    setPhotoPickerVisible(false);
  };

  const handleChooseFromGallery = async () => {
    if (!authData?.user) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions needed!');
      setPhotoPickerVisible(false);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setIsUploading(true);
      try {
        const imageUrl = await fileService.upload(result.assets[0].uri);
        await messageService.sendGroupMessage(Number(groupId), {
          senderId: authData.user.id,
          senderUsername: authData.user.username,
          imageUrl,
        });
      } catch (e) {
        Alert.alert('Error', 'Failed to send image.');
      } finally {
        setIsUploading(false);
      }
    }
    setPhotoPickerVisible(false);
  };

  // Audio recording logic
  const startRecording = async () => {
    try {
      setRecordedUri(null);
      setRecordingDuration(0);
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone permission is required.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      rec.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) setRecordingDuration(status.durationMillis);
      });
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
      setIsRecording(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const cancelRecording = () => {
    setRecording(null);
    setRecordedUri(null);
    setRecordingDuration(0);
    setIsRecording(false);
  };

  const sendAudioMessage = async () => {
    if (!recordedUri) return;
    setIsUploading(true);
    try {
      const audioUrl = await fileService.upload(recordedUri);
      await messageService.sendGroupMessage(Number(groupId), {
        senderId: authData.user.id,
        senderUsername: authData.user.username,
        audioUrl,
        audioDurationMillis: recordingDuration,
      });
      setRecordedUri(null);
      setRecordingDuration(0);
    } catch (e) {
      Alert.alert('Error', 'Failed to send audio message.');
    } finally {
      setIsUploading(false);
    }
  };

  // Audio playback for received messages
  const playAudio = async (audioUrl) => {
    // If already loaded and paused, just resume
    if (playingAudioUrl === audioUrl && soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isPlaying) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        return;
      }
    }
    // Only reset progress if switching to a new audio
    if (soundRef.current && playingAudioUrl !== audioUrl) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setAudioProgress(0);
    }
    setPlayingAudioUrl(audioUrl);
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.durationMillis && (status.isPlaying || status.isBuffering)) {
          setAudioProgress(status.positionMillis / status.durationMillis);
        }
        setIsPlaying(!!status.isPlaying);
        if (status.didJustFinish) {
          setPlayingAudioUrl(null);
          setAudioProgress(0);
          setIsPlaying(false);
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
      await sound.playAsync();
      setIsPlaying(true);
    } catch (e) {
      setPlayingAudioUrl(null);
      setAudioProgress(0);
      setIsPlaying(false);
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      Alert.alert('Error', 'Failed to play audio.');
    }
  };

  const pauseAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      // Do NOT reset audioProgress here!
    }
  };

  // Replace handleAudioRecord
  const handleAudioRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Video call stub
  const handleVideoCall = () => {
    Alert.alert('Coming Soon', 'Group video call is under development.');
  };

  // Voice call stub
  const handleVoiceCall = () => {
    Alert.alert('Coming Soon', 'Group voice call is under development.');
  };

  // Navigate to group info
  const handleGroupInfo = () => {
    router.push({ pathname: '/group-info', params: { groupId } });
  };

  // Group avatar (use image if available, else initials or icon)
  const renderGroupAvatar = () => {
    console.log('Group object in header:', group);
    // TEMP: Hardcoded image for debug
    // return <Image source={{ uri: 'https://placekitten.com/200/200' }} style={styles.groupAvatar} />;
    if (group?.imageUrl && typeof group.imageUrl === 'string' && group.imageUrl.trim() !== '') {
      return <Image source={{ uri: group.imageUrl }} style={styles.groupAvatar} />;
    }
    if (group?.name) {
      const initials = group.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      return (
        <View style={styles.groupAvatarFallback}>
          <Text style={styles.groupAvatarText}>{initials}</Text>
        </View>
      );
    }
    return (
      <View style={styles.groupAvatarFallback}>
        <Ionicons name="people" size={28} color="#007AFF" />
      </View>
    );
  };

  // Update renderItem to show audio messages
  const renderItem = ({ item }) => {
    // Calculate duration in seconds for audio messages
    const audioDurationSec = item.audioDurationMillis ? Math.round(item.audioDurationMillis / 1000) : null;
    const isThisPlaying = playingAudioUrl === item.audioUrl && isPlaying;
    const isMyMessage = item.senderId === authData.user.id;
    // Use group.members to get member IDs
    const members = (group?.members || []).map(m => m.id);
    // Determine group read receipt icon
    let readReceiptIcon = null;
    if (isMyMessage && group && members.length > 0) {
      const msgTimestamp = new Date(item.timestamp).getTime();
      // Exclude sender from check
      const others = members.filter((id: number) => id !== authData.user.id);
      const allRead = others.every((uid: number) => (groupReadStatuses[uid] || 0) >= msgTimestamp);
      if (allRead) {
        readReceiptIcon = <Ionicons name="checkmark-done" size={16} color="#2196F3" style={{ marginLeft: 4 }} />;
      } else {
        readReceiptIcon = <Ionicons name="checkmark" size={16} color="#bbb" style={{ marginLeft: 4 }} />;
      }
    }
    return (
      <View style={[styles.messageBubble, item.senderId === authData.user.id ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.sender}>{item.senderUsername}</Text>
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
        )}
        {item.audioUrl ? (
          <View style={{ width: 180 }}>
            <Pressable
              onPress={() => (isThisPlaying ? pauseAudio() : playAudio(item.audioUrl))}
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}
            >
              <Ionicons name={isThisPlaying ? 'pause' : 'play'} size={24} color="#007AFF" />
              <View style={{ flex: 1, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginLeft: 8, marginRight: 8, justifyContent: 'center' }}>
                <View style={{ width: isThisPlaying ? `${Math.round(audioProgress * 100)}%` : '0%', height: 8, backgroundColor: '#007AFF', borderRadius: 4 }} />
              </View>
            </Pressable>
            {audioDurationSec !== null && (
              <Text style={{ position: 'absolute', top: -18, right: 0, fontSize: 12, color: '#007AFF', fontWeight: 'bold' }}>{audioDurationSec}s</Text>
            )}
          </View>
        ) : (
          <Text style={styles.messageText}>{item.content}</Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4 }}>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          {isMyMessage && readReceiptIcon}
        </View>
      </View>
    );
  };

  // Improved group chat header: back button, clickable group info, call buttons
  const GroupChatHeader = () => {
    const [imageError, setImageError] = useState(false);
    return (
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </Pressable>
        <Pressable style={styles.headerMain} onPress={handleGroupInfo}>
          <View style={styles.headerAvatarContainer}>
            {group?.imageUrl && !imageError ? (
              <Image source={{ uri: group.imageUrl }} style={styles.headerAvatarImage} onError={() => setImageError(true)} />
            ) : (
              <View style={styles.headerAvatar}>
                <Ionicons name="people" size={24} color="#007AFF" />
              </View>
            )}
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{group?.name || groupName || 'Group Chat'}</Text>
          </View>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerIcon} onPress={handleVoiceCall}>
            <Ionicons name="call" size={24} color="#007AFF" />
          </Pressable>
          <Pressable style={styles.headerIcon} onPress={handleVideoCall}>
            <Ionicons name="videocam" size={24} color="#007AFF" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GroupChatHeader />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={sortedMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          inverted
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 12 }}
          extraData={audioRenderTick}
        />
        {isRecording ? (
          <AudioRecorderBar
            duration={recordingDuration}
            onStop={stopRecording}
            onCancel={cancelRecording}
            isUploading={isUploading}
          />
        ) : recordedUri ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10 }}>
            <Text style={{ flex: 1, color: '#007AFF' }}>Ready to send audio ({Math.floor(recordingDuration / 1000)}s)</Text>
            <Pressable onPress={sendAudioMessage} style={{ marginHorizontal: 8 }} disabled={isUploading}>
              <Ionicons name="send" size={24} color="#007AFF" />
            </Pressable>
            <Pressable onPress={cancelRecording}>
              <Ionicons name="close" size={24} color="#F44336" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Pressable onPress={handleAudioRecord} style={styles.inputIcon}><Ionicons name="mic" size={24} color="#007AFF" /></Pressable>
            <Pressable onPress={handleImageSend} style={styles.inputIcon}><MaterialIcons name="photo-camera" size={24} color="#007AFF" /></Pressable>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!isUploading}
            />
            <Pressable style={styles.sendButton} onPress={handleSend} disabled={isUploading}>
              <Ionicons name="send" size={22} color="#fff" />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
      <CustomModal
        visible={photoPickerVisible}
        onClose={() => setPhotoPickerVisible(false)}
        title="Send Photo"
        actions={[
          { label: 'Take Photo', onPress: handleTakePhoto },
          { label: 'Choose from Gallery', onPress: handleChooseFromGallery },
          { label: 'Cancel', onPress: () => setPhotoPickerVisible(false), color: '#D32F2F' },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  headerContainer: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  groupAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  groupAvatarFallback: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef5ff', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  groupAvatarText: { fontSize: 18, color: '#007AFF', fontWeight: 'bold' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#222' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { marginLeft: 8 },
  messageBubble: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1eaff',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  sender: { fontWeight: 'bold', fontSize: 13, color: '#007AFF', marginBottom: 2 },
  messageText: { fontSize: 16, marginTop: 2 },
  messageImage: { width: 180, height: 180, borderRadius: 10, marginTop: 6 },
  timestamp: { fontSize: 11, color: '#888', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 10,
  },
  inputIcon: { marginRight: 8 },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  headerMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eef5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eef5ff', justifyContent: 'center', alignItems: 'center' },
  headerAvatarImage: { width: 36, height: 36, borderRadius: 18, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // backgroundColor: 'rgba(255,0,0,0.1)', // Uncomment for debug
  },
  headerIcon: {
    padding: 8,
  },
});

export default GroupChatScreen; 