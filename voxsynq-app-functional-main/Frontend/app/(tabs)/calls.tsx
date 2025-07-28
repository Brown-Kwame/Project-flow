import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useCallSignal } from '@/context/CallSignalContext';
import { useEndedCall } from '@/context/EndedCallContext';
import { callService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// Using a slightly modified HighlightedText component locally for simplicity.
const HighlightedText = ({ text = '', highlight = '' }) => {
  if (!highlight.trim()) {
    return text; // Return text directly, not wrapped in <Text>
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <Text>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={i} style={styles.highlighted}>{part}</Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};

const CallsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optimisticCalls, setOptimisticCalls] = useState([]);
  const { authData } = useAuth();
  const router = useRouter();
  const { sendCallSignal } = useCallSignal();
  const endedCallContext = useEndedCall();

  useEffect(() => {
    const fetchCallHistory = async () => {
      if (!authData?.user?.id) return;
      setLoading(true);
      try {
        const data = await callService.getCallHistory(authData.user.id);
        setCallHistory(data);
      } catch (error) {
        setCallHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCallHistory();
  }, [authData?.user?.id, endedCallContext.endedCallId]);

  const getCallIconColor = (call) => {
    if (call.status === 'MISSED') return '#F44336';
    return call.caller.id === authData?.user?.id ? '#007AFF' : '#4CAF50';
  };

  // Group consecutive calls (same user, type, direction, within 15 minutes)
  function groupCalls(calls, userId) {
    const grouped = [];
    const FIFTEEN_MIN = 15 * 60 * 1000;
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      const isOutgoing = call.caller.id === userId;
      const otherUser = isOutgoing ? call.callee : call.caller;
      const type = call.type;
      const direction = isOutgoing ? 'outgoing' : 'incoming';
      const status = call.status;
      const startTime = new Date(call.startTime).getTime();
      // Try to group with previous
      if (grouped.length > 0) {
        const prev = grouped[grouped.length - 1];
        const prevCall = prev.calls[0]; // Most recent call in group
        const prevIsOutgoing = prevCall.caller.id === userId;
        const prevOtherUser = prevIsOutgoing ? prevCall.callee : prevCall.caller;
        const prevType = prevCall.type;
        const prevDirection = prevIsOutgoing ? 'outgoing' : 'incoming';
        const prevStatus = prevCall.status;
        const prevStartTime = new Date(prevCall.startTime).getTime();
        // Group if same user, type, direction, status, and within 15 min
        if (
          otherUser.id === prevOtherUser.id &&
          type === prevType &&
          direction === prevDirection &&
          status === prevStatus &&
          Math.abs(prevStartTime - startTime) <= FIFTEEN_MIN
        ) {
          prev.calls.push(call); // Add to group (oldest last)
          prev.count++;
          continue;
        }
      }
      // Start new group
      grouped.push({ calls: [call], count: 1 });
    }
    // For rendering, flatten to one call per group (the most recent), add count
    return grouped.map(group => ({ ...group.calls[0], count: group.count }));
  }

  // Optimistic update for outgoing call
  const addOptimisticOutgoingCall = (callee, type) => {
    const now = new Date();
    setOptimisticCalls(prev => [
      {
        id: 'temp-' + now.getTime(),
        caller: authData.user,
        callee,
        type,
        status: 'OUTGOING',
        startTime: now.toISOString(),
        count: 1,
        optimistic: true,
      },
      ...prev
    ]);
  };

  // Optimistic update for incoming call
  const addOptimisticIncomingCall = (caller, type) => {
    const now = new Date();
    setOptimisticCalls(prev => [
      {
        id: 'temp-' + now.getTime(),
        caller,
        callee: authData.user,
        type,
        status: 'INCOMING',
        startTime: now.toISOString(),
        count: 1,
        optimistic: true,
      },
      ...prev
    ]);
  };

  // Remove optimistic calls that have been replaced by real backend data
  useEffect(() => {
    if (!callHistory.length) return;
    setOptimisticCalls(prev => prev.filter(opt =>
      !callHistory.some(real => {
        // Match by startTime, type, and user ids (within 1 min)
        const realTime = new Date(real.startTime).getTime();
        const optTime = new Date(opt.startTime).getTime();
        return (
          real.type === opt.type &&
          real.caller.id === opt.caller.id &&
          real.callee.id === opt.callee.id &&
          Math.abs(realTime - optTime) < 60000
        );
      })
    ));
  }, [callHistory]);

  // Patch outgoing call start to add optimistic entry
  const patchedStartCall = async (callee, type) => {
    addOptimisticOutgoingCall(callee, type);
    try {
      const startedCall = await callService.startCall(authData.user.id, callee.id, type);
      // The backend will update callHistory, which will remove the optimistic entry
      return startedCall;
    } catch (e) {
      // Optionally remove the optimistic entry on failure
      setOptimisticCalls(prev => prev.filter(opt => opt.callee.id !== callee.id || opt.type !== type));
      throw e;
    }
  };

  const CallHistoryItem = ({ call }) => {
    const isOutgoing = call.caller.id === authData?.user?.id;
    const callee = isOutgoing ? call.callee : call.caller;
    const calleeName = callee.username;
    const calleeAvatar = callee.profilePictureUrl || '';
    const isVideo = call.type === 'VIDEO';
    const isMissed = call.status === 'MISSED';
    const directionLabel = isMissed ? 'Missed' : isOutgoing ? 'Outgoing' : 'Incoming';
    const handleCall = async () => {
      try {
        const startedCall = await patchedStartCall(callee, isVideo ? 'VIDEO' : 'VOICE');
        sendCallSignal({
          type: 'CALL_OFFER',
          fromUserId: authData.user.id,
          toUserId: callee.id,
          callId: startedCall.id,
          fromUserName: authData.user.username,
          ...(isVideo ? { callType: 'VIDEO' } : { callType: 'VOICE' }),
        });
        router.push({
          pathname: isVideo ? '/video-call-background' : '/call-background',
          params: {
            name: calleeName,
            avatar: calleeAvatar,
            callId: startedCall.id,
            toUserId: callee.id,
          },
        });
      } catch (e) {
        alert('Failed to start call');
      }
    };
    return (
      <Pressable style={styles.callItem} onPress={handleCall}>
        {/* Avatar */}
        <View style={{ marginRight: 12 }}>
          <Avatar imageUrl={calleeAvatar} name={calleeName} size={44} />
        </View>
        {/* Main content */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.callName, isMissed && { color: '#F44336' }]} numberOfLines={1}>{calleeName}</Text>
            {call.count > 1 && (
              <View style={{ backgroundColor: '#007AFF', borderRadius: 10, marginLeft: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{call.count}</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Ionicons
              name={isVideo ? (isOutgoing ? 'arrow-redo' : 'arrow-undo') : (isOutgoing ? 'arrow-redo' : 'arrow-undo')}
              size={16}
              color="#888"
              style={{ marginRight: 4 }}
            />
            <Ionicons
              name={isVideo ? 'videocam' : 'call'}
              size={16}
              color="#888"
              style={{ marginRight: 4 }}
            />
            <Text style={{ fontSize: 13, color: isMissed ? '#F44336' : '#888', fontWeight: isMissed ? 'bold' : 'normal' }}>{directionLabel}</Text>
          </View>
        </View>
        {/* Date/time on the right */}
        <View style={{ minWidth: 70, alignItems: 'flex-end', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: '#888' }}>{call.startTime ? new Date(call.startTime).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : ''}</Text>
        </View>
      </Pressable>
    );
  };

  function getDuration(start, end) {
    if (!start || !end) return '';
    const diff = (new Date(end) - new Date(start)) / 1000;
    const min = Math.floor(diff / 60);
    const sec = Math.floor(diff % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  // Filter logic adapted for just call history
  const filteredCallHistory = useMemo(() => {
      let sorted = [...optimisticCalls, ...callHistory];
      sorted.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Latest first
      if (!searchText.trim()) return groupCalls(sorted, authData?.user?.id);
      const lowerSearch = searchText.toLowerCase();
      const filtered = sorted.filter(call => {
        const name = call.caller.id === authData?.user?.id ? call.callee.username : call.caller.username;
        return name.toLowerCase().includes(lowerSearch) ||
          (call.startTime && new Date(call.startTime).toLocaleString().toLowerCase().includes(lowerSearch));
      });
      return groupCalls(filtered, authData?.user?.id);
  }, [searchText, callHistory, optimisticCalls, authData?.user?.id]);

  // Debug: log grouped calls
  useEffect(() => {
    console.log('Grouped calls:', filteredCallHistory);
  }, [filteredCallHistory]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Toggle */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setIsSearchVisible(!isSearchVisible)}>
            <Ionicons name="search" size={24} color="#007AFF" />
          </Pressable>
        </View>
      </View>

      {/* Conditionally Rendered Search Bar */}
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8e8e93" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search call history..."
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={true}
          />
        </View>
      )}

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
            data={filteredCallHistory}
            renderItem={({ item }) => <CallHistoryItem call={item} />}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={<Text style={styles.sectionTitle}>Recent</Text>}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

// --- KEPT & REFINED STYLES ---
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#f7f7f7'
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  callIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  callDetails: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
  },
  missedCall: {
    color: '#F44336',
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  callTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  callDuration: {
    fontSize: 14,
    color: '#666',
  },
  callBackButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 70
  },
  highlighted: {
    backgroundColor: 'yellow'
  }
});

export default CallsScreen;