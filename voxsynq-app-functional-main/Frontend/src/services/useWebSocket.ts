import { useAuth } from '@/context/AuthContext';
import { Client } from '@stomp/stompjs';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { API_CONFIG } from '../config/api';

// Use a relative path. Expo's dev server will proxy this to your backend.
const WEBSOCKET_URL = API_CONFIG.WEBSOCKET_URL;

export const useWebSocket = (onMessageReceived: (message: any) => void) => {
  const { authData } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!authData?.user?.username) {
      return;
    }

    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      // debug: (str) => { console.log('STOMP: ' + str); },
      reconnectDelay: 5000,
    });

    client.onConnect = (frame) => {
      setIsConnected(true);

      const myUsername = authData.user.username;
      const subscriptionDestination = `/topic/messages.${myUsername}`;
      // Log exactly which topic this client is listening to.
      console.log(`[FRONTEND] User [${myUsername}] is SUBSCRIBING TO: ${subscriptionDestination}`);
      
      client.subscribe(subscriptionDestination, (message) => {
        const receivedMessage = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message'], frame.body);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client?.active) {
        client.deactivate();
        setIsConnected(false);
      }
    };
  }, [authData?.user?.username, onMessageReceived]);

  const sendMessage = (messagePayload: { content: string; recipientId: string; recipientUsername: string; }) => {
    if (stompClientRef.current?.connected && authData?.user) {
      const fullMessage = {
        senderId: authData.user.id,
        senderUsername: authData.user.username,
        ...messagePayload
      };

      stompClientRef.current.publish({
        destination: '/app/chat.privateMessage',
        body: JSON.stringify(fullMessage),
      });
    }
  };

  return { isConnected, sendMessage };
};

// New: Hook for real-time group info updates
export const useGroupWebSocket = (onGroupUpdate: (group: any) => void) => {
  const { authData } = useAuth();
  useEffect(() => {
    if (!authData?.user?.username) return;
    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      const myUsername = authData.user.username;
      const groupDestination = `/topic/group.${myUsername}`;
      client.subscribe(groupDestination, (message) => {
        const groupUpdate = JSON.parse(message.body);
        onGroupUpdate(groupUpdate);
      });
    };
    client.activate();
    return () => {
      if (client?.active) client.deactivate();
    };
  }, [authData?.user?.username, onGroupUpdate]);
};

// New generic WebSocket hook for arbitrary topics and sending
export const useCallWebSocket = (userId, onCallMessage) => {
  const { authData } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    let client;
    let socketUrl = WEBSOCKET_URL;
    let token = null;
    (async () => {
      if (!userId || !authData?.user?.id) return;
      token = await SecureStore.getItemAsync('authToken');
      if (token) {
        socketUrl = `${WEBSOCKET_URL}?token=${token}`;
      }
      client = new Client({
        brokerURL: WEBSOCKET_URL,
        webSocketFactory: () => new SockJS(socketUrl),
        reconnectDelay: 5000,
        debug: (str) => { console.log('STOMP: ' + str); },
      });
      client.onConnect = () => {
        setIsConnected(true);
        const topic = `/topic/call/${userId}`;
        console.log('Subscribing to', topic);
        client.subscribe(topic, (message) => {
          const received = JSON.parse(message.body);
          console.log('Received call signal:', received);
          onCallMessage(received);
        });
      };
      client.onStompError = (frame) => {
        console.error('STOMP Error:', frame.headers['message'], frame.body);
      };
      client.activate();
      stompClientRef.current = client;
    })();
    return () => {
      if (client?.active) {
        client.deactivate();
        setIsConnected(false);
      }
    };
  }, [userId, authData?.user?.id, onCallMessage]);

  const sendCallSignal = (signal) => {
    if (stompClientRef.current?.connected && authData?.user) {
      stompClientRef.current.publish({
        destination: '/app/call.signal',
        body: JSON.stringify(signal),
      });
    }
  };

  return { isConnected, sendCallSignal };
};

// Hook for real-time group read status updates
export const useGroupReadStatusWebSocket = (groupId: number, onReadStatusUpdate: (statuses: Record<number, number>) => void) => {
  const { authData } = useAuth();
  useEffect(() => {
    if (!authData?.user?.id || !groupId) return;
    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      const topic = `/topic/read-status.group.${groupId}.user.${authData.user.id}`;
      client.subscribe(topic, (message) => {
        const statuses = JSON.parse(message.body);
        onReadStatusUpdate(statuses);
      });
    };
    client.activate();
    return () => {
      if (client?.active) client.deactivate();
    };
  }, [authData?.user?.id, groupId, onReadStatusUpdate]);
};

// Hook for real-time private chat read status updates
export const usePrivateReadStatusWebSocket = (otherUserId: number, onReadStatusUpdate: (payload: { userId: number, otherUserId: number, lastReadTimestamp: number }) => void) => {
  const { authData } = useAuth();
  useEffect(() => {
    if (!authData?.user?.id || !otherUserId) return;
    const client = new Client({
      brokerURL: WEBSOCKET_URL,
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      const topic = `/topic/read-status.private.user.${authData.user.id}.other.${otherUserId}`;
      client.subscribe(topic, (message) => {
        const payload = JSON.parse(message.body);
        onReadStatusUpdate(payload);
      });
    };
    client.activate();
    return () => {
      if (client?.active) client.deactivate();
    };
  }, [authData?.user?.id, otherUserId, onReadStatusUpdate]);
};