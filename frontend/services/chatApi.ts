import API_GATEWAY_URL from '../config';

// --- Interfaces (match your backend ChatMessage entity/DTO) ---
export interface ChatMessage {
  id?: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp?: string; // ISO date string
  readStatus?: boolean;
}

export interface SendMessageRequest {
  senderId: number;
  recipientId: number;
  content: string;
}

// --- REST API Functions (for history and initial send) ---

export async function sendChatMessage(data: SendMessageRequest, jwtToken: string): Promise<ChatMessage> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to send chat message: ${response.status}`);
    }

    const chatMessage: ChatMessage = await response.json();
    return chatMessage;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

export async function getChatHistory(user1Id: number, user2Id: number, jwtToken: string): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/chat/history/${user1Id}/${user2Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to get chat history: ${response.status}`);
    }

    const history: ChatMessage[] = await response.json();
    return history;
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
}

export async function markChatMessagesAsRead(senderId: number, recipientId: number, jwtToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/chat/mark-read/from/${senderId}/to/${recipientId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to mark messages as read: ${response.status}`);
    }
  } catch (error) {
    console.error('Error marking chat messages as read:', error);
    throw error;
  }
}

export async function getUnreadChatCount(senderId: number, recipientId: number, jwtToken: string): Promise<number> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/chat/unread/from/${senderId}/to/${recipientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to get unread chat count: ${response.status}`);
    }

    const count: number = await response.json();
    return count;
  } catch (error) {
    console.error('Error getting unread chat count:', error);
    throw error;
  }
}

// --- WebSocket Setup (Conceptual for real-time) ---
// Note: WebSocket integration is more complex and typically involves a dedicated library
// like 'socket.io-client' or 'stompjs' for STOMP over WebSockets.
// This is a placeholder to show how the URL would be derived.

export function getWebSocketUrl(jwtToken: string): string {
  // Replace 'http' with 'ws' and 'https' with 'wss' for WebSocket connections
  // The /ws endpoint is defined in your Spring Boot Chat Service WebSocketConfig
  // The token is passed as a query parameter for simplicity in the handshake
  // In a production app, you might pass it in a custom header during handshake
  // if your WebSocket client library supports it.
  const safeApiGatewayUrl = API_GATEWAY_URL ?? '';
  const wsProtocol = safeApiGatewayUrl.startsWith('https') ? 'wss' : 'ws';
  const wsBaseUrl = safeApiGatewayUrl.replace(/^https?:\/\//, wsProtocol + '://');
  return `${wsBaseUrl}/api/chat/ws?token=${jwtToken}`; // Assuming /api/chat/ws is your WebSocket endpoint
}