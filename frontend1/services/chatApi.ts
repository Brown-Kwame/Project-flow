import apiClient from './api';

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

export async function sendChatMessage(data: SendMessageRequest): Promise<ChatMessage> {
  try {
    const response = await apiClient.post('/api/chat/send', data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    throw new Error(error.response?.data?.message || 'Failed to send chat message');
  }
}

export async function getChatHistory(user1Id: number, user2Id: number): Promise<ChatMessage[]> {
  try {
    const response = await apiClient.get(`/api/chat/history/${user1Id}/${user2Id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting chat history:', error);
    throw new Error(error.response?.data?.message || 'Failed to get chat history');
  }
}

export async function markChatMessagesAsRead(senderId: number, recipientId: number): Promise<void> {
  try {
    await apiClient.put(`/api/chat/mark-read/from/${senderId}/to/${recipientId}`, {});
  } catch (error: any) {
    console.error('Error marking chat messages as read:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark messages as read');
  }
}

export async function getUnreadChatCount(senderId: number, recipientId: number): Promise<number> {
  try {
    const response = await apiClient.get(`/api/chat/unread/from/${senderId}/to/${recipientId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting unread chat count:', error);
    throw new Error(error.response?.data?.message || 'Failed to get unread chat count');
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
  const safeApiGatewayUrl = process.env.EXPO_PUBLIC_API_GATEWAY_URL ?? '';
  const wsProtocol = safeApiGatewayUrl.startsWith('https') ? 'wss' : 'ws';
  const wsBaseUrl = safeApiGatewayUrl.replace(/^https?:\/\//, wsProtocol + '://');
  return `${wsBaseUrl}/api/chat/ws?token=${jwtToken}`; // Assuming /api/chat/ws is your WebSocket endpoint
}