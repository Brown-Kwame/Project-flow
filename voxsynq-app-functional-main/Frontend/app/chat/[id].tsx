import AudioPreviewBar from '@/components/audio/AudioPreviewBar';
import AudioRecorderBar from '@/components/audio/AudioRecorderBar';
import Avatar from '@/components/Avatar';
import StatusIndicator from '@/components/StatusIndicator';
import { useAuth } from '@/context/AuthContext';
import { useCallSignal } from '@/context/CallSignalContext';
import { callService, fileService, messageService } from '@/services/api';
import { usePrivateReadStatusWebSocket, useWebSocket } from '@/services/useWebSocket';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import ImageViewing from 'react-native-image-viewing';
import CustomModal from '../../src/components/CustomModal';

type ChatMessage = any;

const MAX_RECORDING_DURATION = 60000; // 60 seconds
const PROGRESS_BAR_COLOR = '#2196F3';
const PROGRESS_BAR_BG = '#e0e0e0';
const PROGRESS_BAR_HEIGHT = 4;
const SCREEN_WIDTH = Dimensions.get('window').width;

const ChatDetailScreen = () => {
  const router = useRouter();
  const { authData } = useAuth();

  const { id: contactId, contactName } = useLocalSearchParams<{ id: string, contactName: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Audio player state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [soundObj, setSoundObj] = useState<Audio.Sound | null>(null);
  const [audioStatus, setAudioStatus] = useState<any>(null);
  const [audioDurations, setAudioDurations] = useState<{ [id: string]: number }>({});

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  // No lock/cancel state needed
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewSound, setPreviewSound] = useState<Audio.Sound | null>(null);
  const [previewStatus, setPreviewStatus] = useState<any>(null);

  const { showActionSheetWithOptions } = useActionSheet();
  const [visible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photoPickerVisible, setPhotoPickerVisible] = useState(false);

  const { isConnected, sendCallSignal } = useCallSignal();

  // Add state for recipient's last read timestamp
  const [recipientLastRead, setRecipientLastRead] = useState<number>(0);
  const [contactProfilePictureUrl, setContactProfilePictureUrl] = useState<string | null>(null);

  // Subscribe to real-time private chat read status updates
  usePrivateReadStatusWebSocket(Number(contactId), (payload) => {
    console.log('Private Chat: Received read status update', payload);
    if (payload && payload.userId !== Number(authData?.user?.id)) {
      setRecipientLastRead(payload.lastReadTimestamp || 0);
    }
  });

  // Move onMessageReceived definition here
  const onMessageReceived = useCallback((newMessage: ChatMessage) => {
    setMessages(previousMessages => {
        const isOptimisticDuplicate =
            newMessage.senderId === Number(authData?.user?.id) &&
            previousMessages.some(msg => msg.id.toString().startsWith('temp-') && msg.content === newMessage.content);

        if (isOptimisticDuplicate) {
            return previousMessages.map(msg =>
                (msg.id.toString().startsWith('temp-') && msg.content === newMessage.content) ? newMessage : msg
            );
        } else {
            // If the new message is from the other user and we're in the chat, mark as read instantly
            if (newMessage.senderId !== Number(authData?.user?.id) && contactId && authData?.user) {
              const latestTimestamp = new Date(newMessage.timestamp).getTime();
              console.log('Private Chat: Marking as read on message receive', { contactId, latestTimestamp });
              messageService.markPrivateAsRead(Number(contactId), latestTimestamp + 1);
            }
            return [newMessage, ...previousMessages];
        }
    });
  }, [authData, contactId]);

  const { isConnected: wsConnected, sendMessage } = useWebSocket(onMessageReceived);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (soundObj) {
        soundObj.unloadAsync();
      }
    };
  }, [soundObj]);

  // Play or pause audio
  const handleAudioPress = async (audioUrl: string, messageId: string) => {
    // If already playing this audio, pause it
    if (playingAudioId === messageId && soundObj && audioStatus?.isPlaying) {
      await soundObj.pauseAsync();
      setAudioStatus({ ...audioStatus, isPlaying: false });
      return;
    }
    // If playing another audio, stop it
    if (soundObj) {
      await soundObj.unloadAsync();
      setSoundObj(null);
      setPlayingAudioId(null);
      setAudioStatus(null);
    }
    // Load and play new audio
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: true },
      (status: any) => {
        setAudioStatus(status);
        if (status.isLoaded && typeof status.durationMillis === 'number' && !audioDurations[messageId]) {
          setAudioDurations((prev) => ({ ...prev, [messageId]: status.durationMillis || 0 }));
        }
        if ('didJustFinish' in status && status.didJustFinish) {
          setPlayingAudioId(null);
          setSoundObj(null);
          setAudioStatus(null);
        }
      }
    );
    setSoundObj(sound);
    setPlayingAudioId(messageId);
  };

  // Start or stop recording (toggle)
  const handleMicPress = async () => {
    if (isRecording) {
      // Stop recording
      await stopRecording(false);
    } else {
      // Start recording
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const rec = new Audio.Recording();
        await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await rec.startAsync();
        setRecording(rec);
        setIsRecording(true);
        setRecordingDuration(0);
        setRecordedUri(null);
        setIsPreviewing(false);
        setIsPlayingPreview(false);
        setPreviewSound(null);
        setPreviewStatus(null);
        // Timer
        const timer = setInterval(async () => {
          const status = await rec.getStatusAsync();
          if (status.isRecording) {
            setRecordingDuration(status.durationMillis);
          }
        }, 200);
        setRecordingTimer(timer as NodeJS.Timeout);
      } catch (e) {
        console.log('Recording error:', e);
        Alert.alert('Recording Error', 'Could not start audio recording.');
        setIsRecording(false);
      }
    }
  };

  // Stop recording
  const stopRecording = async (canceled: boolean) => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        if (recordingTimer) clearInterval(recordingTimer);
        setRecordingTimer(null);
        setRecordingDuration(0);
        if (!canceled && uri) {
          setRecordedUri(uri);
          setIsPreviewing(true);
        } else {
          setRecordedUri(null);
          setIsPreviewing(false);
        }
      } catch (e) {
        setRecording(null);
        setIsRecording(false);
        setRecordedUri(null);
        setIsPreviewing(false);
      }
    } else {
      // If not currently recording, ensure preview is not shown
      setIsRecording(false);
      setIsPreviewing(false);
    }
  };

  // Lock recording: stop pan responder, keep recording until user taps stop/send
  useEffect(() => {
    if (isRecording) {
      if (recordingTimer) clearInterval(recordingTimer);
      // Timer continues
      const timer = setInterval(async () => {
        if (recording) {
          const status = await recording.getStatusAsync();
          if (status.isRecording) {
            setRecordingDuration(status.durationMillis);
          }
        }
      }, 200);
      setRecordingTimer(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  // Cancel recording
  const cancelRecording = () => {
    stopRecording(true);
  };

  // Play preview
  const playPreview = async () => {
    if (!recordedUri) return;
    if (previewSound) {
      await previewSound.unloadAsync();
      setPreviewSound(null);
      setIsPlayingPreview(false);
      setPreviewStatus(null);
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri: recordedUri },
      { shouldPlay: true },
      (status: any) => {
        setPreviewStatus(status);
        if ('didJustFinish' in status && status.didJustFinish) {
          setIsPlayingPreview(false);
        }
      }
    );
    setPreviewSound(sound);
    setIsPlayingPreview(true);
  };

  // Stop preview
  const stopPreview = async () => {
    if (previewSound) {
      await previewSound.pauseAsync();
      setIsPlayingPreview(false);
    }
  };

  // Send audio
  const sendAudio = async () => {
    if (!recordedUri) return;
    setIsUploading(true);
    let durationMillis = 0;
    try {
      // Get audio duration
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      const status = await sound.getStatusAsync();
      durationMillis = status.durationMillis || 0;
      await sound.unloadAsync();
    } catch (e) {
      durationMillis = 0;
    }
    const optimisticMessage = {
      id: `temp-audio-${Date.now()}`,
      audioUrl: recordedUri,
      content: null,
      senderId: Number(authData?.user?.id),
      timestamp: new Date().toISOString(),
      audioDurationMillis: durationMillis,
    };
    setMessages(prev => [optimisticMessage, ...prev]);
    try {
      const uploadedUrl = await fileService.upload(recordedUri);
      sendMessage({
        content: null,
        audioUrl: uploadedUrl,
        imageUrl: null,
        recipientId: contactId,
        recipientUsername: contactName,
        audioDurationMillis: durationMillis,
      });
      setIsPreviewing(false);
      setRecordedUri(null);
    } catch (e) {
      Alert.alert('Upload Failed', 'Could not upload audio.');
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    } finally {
      setIsUploading(false);
    }
  };

  // Format milliseconds to mm:ss
  const formatMillis = (ms?: number) => {
    if (!ms) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (contactId && authData) {
      setLoadingHistory(true);
      messageService.getChatHistory(Number(contactId))
        .then((history: any) => { setMessages(history.reverse()); })
        .catch((err: any) => console.error("Failed to fetch history:", err))
        .finally(() => setLoadingHistory(false));
    }
  }, [contactId, authData]);

  useEffect(() => {
    if (contactId && authData) {
      // Fetch recipient's last read timestamp
      messageService.getPrivateReadStatus(Number(contactId)).then((data: any) => {
        setRecipientLastRead(data?.lastReadTimestamp || 0);
      });
    }
  }, [contactId, authData]);

  useEffect(() => {
    // Fetch the other user's profile picture if not present
    if (!contactProfilePictureUrl && contactId) {
      messageService.getConversations().then(convos => {
        const convo = convos.find(
          c => (c.senderId === Number(contactId) && c.recipientId === authData?.user?.id) ||
               (c.recipientId === Number(contactId) && c.senderId === authData?.user?.id)
        );
        if (convo) {
          const url = convo.senderId === Number(contactId) ? convo.senderProfilePictureUrl : convo.recipientProfilePictureUrl;
          setContactProfilePictureUrl(url);
        }
      });
    }
  }, [contactId, authData, contactProfilePictureUrl]);

  // Mark messages as read when chat screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (messages.length > 0 && contactId && authData?.user) {
        // Find the latest message timestamp
        const latestMessage = messages[0]; // assuming messages are sorted newest first
        if (latestMessage) {
          const latestTimestamp = new Date(latestMessage.timestamp).getTime();
          // Mark as read up to the latest message
          console.log('Private Chat: Marking as read on focus', { contactId, latestTimestamp });
          messageService.markPrivateAsRead(Number(contactId), latestTimestamp + 1);
        }
      }
    }, [messages, contactId, authData?.user])
  );

  // Mark messages as read when new messages arrive (if user is at bottom)
  useEffect(() => {
    if (messages.length > 0 && contactId && authData?.user) {
      const latestMessage = messages[0];
      if (latestMessage && latestMessage.senderId !== Number(authData.user.id)) {
        // Only mark as read if the latest message is from the other user
        const latestTimestamp = new Date(latestMessage.timestamp).getTime();
        console.log('Private Chat: Marking as read on new message', { contactId, latestTimestamp });
        messageService.markPrivateAsRead(Number(contactId), latestTimestamp + 1);
      }
    }
  }, [messages, contactId, authData?.user]);

  const sendMessageHandler = () => {
    if (inputText.trim().length === 0 || !contactId || !contactName || !authData?.user) {
      return;
    }

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: inputText,
      senderId: Number(authData.user.id),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [optimisticMessage, ...prev]);

    sendMessage({
      content: inputText,
      recipientId: contactId,
      recipientUsername: contactName,
    });

    setInputText('');
  };

  const handleVoiceNote = () => Alert.alert("Feature Coming Soon", "Voice messaging is under development.");
  const handleImageSelection = () => {
    setPhotoPickerVisible(true);
  };

  const handleTakePhoto = async () => {
    if (!authData?.user) return;
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
      handleImageUpload(result.assets[0].uri);
    }
    setPhotoPickerVisible(false);
  };

  const handleChooseFromGallery = async () => {
    if (!authData?.user) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      handleImageUpload(result.assets[0].uri);
    }
    setPhotoPickerVisible(false);
  };

  const handleImageUpload = async (selectedImageUri: string) => {
    const optimisticMessage = {
      id: `temp-img-${Date.now()}`,
      imageUrl: selectedImageUri,
      content: null,
      senderId: Number(authData?.user?.id),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [optimisticMessage, ...prev]);
    setIsUploading(true);
    try {
      const uploadedUrl = await fileService.upload(selectedImageUri);
      sendMessage({
        content: null,
        imageUrl: uploadedUrl,
        audioUrl: null,
        recipientId: contactId,
        recipientUsername: contactName,
      });
    } catch (error: any) {
      Alert.alert('Upload Failed', error.message);
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    } finally {
      setIsUploading(false);
    }
  };
  const handleLongPress = (message: ChatMessage) => Alert.alert("Message Options", `Replying/deleting message (ID: ${message.id}) is coming soon.`);

  const renderMessage = ({ item: message }: { item: ChatMessage }) => {
    if (!authData?.user) return null;
    const isMyMessage = message.senderId === Number(authData.user.id);
    const isAudio = !!message.audioUrl;
    // Determine read receipt icon
    let readReceiptIcon = null;
    if (isMyMessage) {
      const msgTimestamp = new Date(message.timestamp).getTime();
      if (recipientLastRead >= msgTimestamp) {
        readReceiptIcon = <Ionicons name="checkmark-done" size={16} color="#2196F3" style={{ marginLeft: 4 }} />; // double tick
      } else {
        readReceiptIcon = <Ionicons name="checkmark" size={16} color="#bbb" style={{ marginLeft: 4 }} />; // single tick
      }
    }
    const isThisPlaying = playingAudioId === message.id && audioStatus?.isPlaying;
    return (
      <Pressable
        onLongPress={() => handleLongPress(message)}
        onPress={() => message.imageUrl ? (setSelectedImage(message.imageUrl), setIsVisible(true)) : null}
        style={[ styles.messageBubble, isMyMessage ? styles.fromMe : styles.fromThem, isAudio && styles.audioBubble ]}
      >
        {message.imageUrl ? (
          <Image source={{ uri: message.imageUrl }} style={{ width: 180, height: 180, borderRadius: 12, marginBottom: 6 }} />
        ) : isAudio ? (
          <View style={{ width: 180, paddingTop: 18, justifyContent: 'center' }}>
            <Text style={{
              position: 'absolute',
              top: 0,
              right: 0,
              fontSize: 12,
              color: '#007AFF',
              fontWeight: 'bold'
            }}>
              {playingAudioId === message.id && audioStatus?.positionMillis
                ? formatMillis(audioStatus.positionMillis)
                : formatMillis(
                    message.audioDurationMillis ||
                    audioDurations[message.id] ||
                    message.durationMillis ||
                    0
                  )}
            </Text>
            <Pressable
              onPress={() => isThisPlaying
                ? (soundObj && soundObj.pauseAsync() && setAudioStatus({ ...audioStatus, isPlaying: false }))
                : handleAudioPress(message.audioUrl, message.id)
              }
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            >
              <Ionicons name={isThisPlaying ? 'pause' : 'play'} size={24} color="#2196F3" />
              <View style={{ flex: 1, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginLeft: 8, marginRight: 8, justifyContent: 'center' }}>
                <View style={{
                  width: playingAudioId === message.id && audioStatus?.positionMillis && (message.audioDurationMillis || audioDurations[message.id] || message.durationMillis)
                    ? `${Math.round((audioStatus.positionMillis / (message.audioDurationMillis || audioDurations[message.id] || message.durationMillis)) * 100)}%`
                    : '0%',
                  height: 8,
                  backgroundColor: '#007AFF',
                  borderRadius: 4
                }} />
              </View>
            </Pressable>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4 }}>
              <Text style={styles.messageTime}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
              </Text>
              {isMyMessage && readReceiptIcon}
            </View>
          </View>
        ) : (
          <Text style={ isMyMessage ? styles.myMessageText : styles.otherMessageText }>{message.content}</Text>
        )}
        {!isAudio && (
          <View style={styles.messageTimeContainer}>
            <Text style={[styles.messageTime, !isMyMessage && { color: '#888' }]}> 
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
            </Text>
            {isMyMessage && readReceiptIcon}
          </View>
        )}
      </Pressable>
    );
  };

  if (loadingHistory) {
      return (
          <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" />
          </SafeAreaView>
      )
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </Pressable>
          <View style={styles.headerMain}>
           <View style={styles.headerAvatarContainer}>
                 <Avatar imageUrl={contactProfilePictureUrl} name={contactName} size={36} />
                 <StatusIndicator isOnline={true} />
           </View>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle} numberOfLines={1}>{contactName || 'Chat'}</Text>
                <Text style={styles.headerStatus}>Online</Text>
              </View>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerIcon} onPress={async () => {
              try {
                const calleeId = Number(contactId);
                const startedCall = await callService.startCall(authData.user.id, calleeId, 'VIDEO');
                if (sendCallSignal) {
                  sendCallSignal({
                    type: 'CALL_OFFER',
                    fromUserId: authData.user.id,
                    toUserId: calleeId,
                    callId: startedCall.id,
                    fromUserName: authData.user.username,
                    callType: 'VIDEO',
                  });
                }
                router.push({
                  pathname: '/video-call-background',
                  params: {
                    name: contactName,
                    avatar: '',
                    callId: startedCall.id,
                    toUserId: calleeId,
                  },
                });
              } catch (e) {
                console.error('Failed to start video call', e);
                Alert.alert('Failed to start video call');
              }
            }}>
              <Ionicons name="videocam" size={24} color="#007AFF" />
            </Pressable>
            <Pressable style={styles.headerIcon} onPress={async () => {
              try {
                const calleeId = Number(contactId);
                console.log('Starting call with:', {
                  callerId: authData.user.id,
                  calleeId,
                  type: 'VOICE'
                });
                const startedCall = await callService.startCall(authData.user.id, calleeId, 'VOICE');
                if (sendCallSignal) {
                  sendCallSignal({
                    type: 'CALL_OFFER',
                    fromUserId: authData.user.id,
                    toUserId: calleeId,
                    callId: startedCall.id,
                    fromUserName: authData.user.username,
                  });
                } else {
                  console.error('sendCallSignal is not defined');
                }
                router.push({
                  pathname: '/call-background',
                  params: {
                    name: contactName,
                    avatar: '',
                    callId: startedCall.id,
                    toUserId: calleeId,
                  },
                });
              } catch (e) {
                console.error('Failed to start call', e);
                Alert.alert('Failed to start call');
              }
            }}>
              <Ionicons name="call" size={24} color="#007AFF" />
            </Pressable>
          </View>
        </View>

        {/* Message List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesListStyle}
          contentContainerStyle={styles.messagesContainer}
          inverted
        />

        {/* Input Toolbar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            {isPreviewing ? (
              <AudioPreviewBar
                duration={previewStatus?.durationMillis || 0}
                isPlaying={isPlayingPreview}
                onPlayPause={isPlayingPreview ? stopPreview : playPreview}
                onSend={sendAudio}
                onCancel={cancelRecording}
                isUploading={isUploading}
              />
            ) : isRecording ? (
              <AudioRecorderBar
                duration={recordingDuration}
                onStop={() => handleMicPress()}
                onCancel={cancelRecording}
                isUploading={isUploading}
              >
                {isRecording && (
                  <View style={{ marginVertical: 8 }}>
                    <View style={{
                      width: '100%',
                      height: PROGRESS_BAR_HEIGHT,
                      backgroundColor: PROGRESS_BAR_BG,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <View style={{
                        width: `${Math.min(100, (recordingDuration / MAX_RECORDING_DURATION) * 100)}%`,
                        height: '100%',
                        backgroundColor: PROGRESS_BAR_COLOR,
                      }} />
                    </View>
                  </View>
                )}
              </AudioRecorderBar>
            ) : (
              <>
                <Pressable
                  style={styles.inputIcon}
                  onPress={handleMicPress}
                >
                  <Ionicons name="mic" size={24} color="#007AFF" />
                </Pressable>
                <Pressable style={styles.inputIcon} onPress={handleImageSelection}>
                  <Ionicons name="camera" size={24} color="#007AFF" />
                </Pressable>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type a message..."
                  placeholderTextColor="#999"
                  multiline
                />
                {inputText.trim().length > 0 && (
                  <Pressable style={styles.sendButton} onPress={sendMessageHandler}>
                    <Ionicons name="send" size={20} color="#fff" />
                  </Pressable>
                )}
                {isUploading && (
                  <ActivityIndicator style={{ marginLeft: 10 }} color="#007AFF" />
                )}
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <ImageViewing
        images={selectedImage ? [{ uri: selectedImage }] : []}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
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
    </>
  );
};

// --- STYLES with the visibility fix ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 10,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#e5e5e5",
    backgroundColor: "#fff",
  },
  backButton: { padding: 5 },
  headerMain: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginLeft: 10
  },
  headerAvatarContainer: { // New container for positioning
    width: 36,
    height: 36,
     marginRight: 10,
  },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#eef5ff",
    justifyContent: "center", alignItems: "center", marginRight: 10,
  },
  headerAvatarText: { fontSize: 18, color: "#007AFF", fontWeight: "bold" },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: "bold" },
  headerStatus: { fontSize: 12, color: '#4CAF50' },
  headerActions: { flexDirection: "row", alignItems: "center" },
  headerIcon: { padding: 6, marginLeft: 10 },

  messagesListStyle: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messagesContainer: {
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: "80%", borderRadius: 20, padding: 12, marginBottom: 10,
  },
  fromMe: {
    backgroundColor: "#007AFF", alignSelf: "flex-end", borderBottomRightRadius: 5,
  },
  // CORRECTED STYLE for visibility
  fromThem: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  myMessageText: {
      color: "#fff",
      fontSize: 16,
  },
  otherMessageText: {
      color: "#000",
      fontSize: 16,
  },
  messageTimeContainer: {
    flexDirection: "row", alignItems: "center", marginTop: 5, alignSelf: 'flex-end',
  },
  messageTime: { fontSize: 11, color: "#a0cfff" }, // Default light color for 'fromMe'
  readIcon: { marginLeft: 5 },
  inputContainer: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 10,
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#e5e5e5",
    backgroundColor: "#fff",
  },
  inputIcon: { padding: 8, marginRight: 4 },
  input: {
    flex: 1, backgroundColor: "#f0f2f5", borderRadius: 20, paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8, fontSize: 16, maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10, backgroundColor: "#007AFF", borderRadius: 20,
    width: 40, height: 40, justifyContent: "center", alignItems: "center",
  },
  audioBubble: {
    backgroundColor: '#eaf4ff',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
    minWidth: 120,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  audioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audioPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  audioTimer: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
    marginRight: 10,
  },
});

export default ChatDetailScreen;