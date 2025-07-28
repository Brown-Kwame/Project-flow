import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api';

const API_BASE = API_CONFIG.BASE_URL;
const API_BASE_URL = API_CONFIG.API_BASE_URL;

async function request(endpoint: string, method: 'POST' | 'GET' | 'PUT' | 'DELETE' = 'GET', body?: any) {
  // NEW: Get the token from secure storage
  const token = await SecureStore.getItemAsync('authToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // NEW: If a token exists, add it to the Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // If status is 401 Unauthorized, maybe we should auto-logout? (Future improvement)
      const errorData = await response.json();
      throw new Error(errorData.message || 'An unknown error occurred.');
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }
    const text = await response.text();
    if (!text) {
      return null;
    }
    return JSON.parse(text);

  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth service remains the same
export const authService = {
  signup: (userData: any) => request('/auth/signup', 'POST', userData),
  signin: (credentials: any) => request('/auth/signin', 'POST', credentials),
};

// NEW: User service to fetch users
export const userService = {
  getAllUsers: () => request('/users', 'GET'),
  getMe: () => request('/users/me', 'GET'), // Fetch current user's profile
  updateMe: (data: any) => request('/users/me', 'PUT', data),
  changePassword: (data: any) => request('/users/me/password', 'PUT', data),
  deleteMe: () => request('/users/me', 'DELETE'),
};

export const messageService = {
  getChatHistory: (otherUserId: number) => request(`/messages/history/${otherUserId}`, 'GET'),
  getConversations: () => request('/messages/conversations', 'GET'),
  getGroupMessages: (groupId: number) => request(`/messages/group/${groupId}`, 'GET'),
  sendGroupMessage: (groupId: number, message: any) => request(`/messages/group/${groupId}`, 'POST', message),
  getPrivateReadStatus: async (otherUserId: number) => {
    // Corrected endpoint: /messages/private/{otherUserId}/read-status
    return request(`/messages/private/${otherUserId}/read-status`, 'GET');
  },
  markPrivateAsRead: async (otherUserId: number, timestamp: number) => {
    // Call the backend PUT endpoint to mark messages as read
    return request(`/messages/private/${otherUserId}/read?timestamp=${timestamp}`, 'PUT');
  },
  markGroupAsRead: async (groupId: number, timestamp: number) => {
    // Call the backend PUT endpoint to mark group messages as read
    return request(`/groups/${groupId}/read?timestamp=${timestamp}`, 'PUT');
  },
  getGroupReadStatuses: async (groupId: number) => {
    // Corrected endpoint: /groups/${groupId}/read-status
    return request(`/groups/${groupId}/read-status`, 'GET');
  },
};

// File upload service
export const fileService = {
  upload: async (uri: string) => {
    const token = await SecureStore.getItemAsync('authToken');
    const uriParts = uri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type: `image/${fileName.split('.').pop()}`,
    } as any);
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'File upload failed.');
    }
    const responseData = await response.json();
    // Return the static file URL for direct access
    return `${API_BASE}/uploads/${responseData.fileName}`;
  }
};

export const callService = {
  getCallHistory: (userId: string | number) => request(`/calls/history?userId=${userId}`, 'GET'),
  startCall: (callerId: string | number, calleeId: string | number, type: 'VOICE' | 'VIDEO') => request('/calls/start', 'POST', { callerId, calleeId, type }),
};

export const groupService = {
  createGroup: (data: { name: string; imageUrl?: string; memberIds: number[] }) => request('/groups/create', 'POST', data),
  getGroups: () => request('/groups', 'GET'),
  getGroup: (groupId: number) => request(`/groups/${groupId}`, 'GET'),
  getGroupMembers: (groupId: number) => request(`/groups/${groupId}/members`, 'GET'),
  addMember: (groupId: number, userId: number) => request(`/groups/${groupId}/add-member/${userId}`, 'POST'),
  removeMember: (groupId: number, userId: number) => request(`/groups/${groupId}/remove-member/${userId}`, 'DELETE'),
  updateGroup: (groupId: number, data: { name?: string; imageUrl?: string }) => request(`/groups/${groupId}`, 'PUT', data),
  deleteGroup: (groupId: number) => request(`/groups/${groupId}`, 'DELETE'),
};

export const chatService = {
  getGroupUnreadCount: (groupId: number) => request(`/groups/${groupId}/unread-count`, 'GET'),
  markGroupAsRead: (groupId: number, timestamp: number) => request(`/groups/${groupId}/read?timestamp=${timestamp}`, 'PUT'),
  getPrivateUnreadCount: (otherUserId: number) => request(`/messages/private/${otherUserId}/unread-count`, 'GET'),
  markPrivateAsRead: (otherUserId: number, timestamp: number) => request(`/messages/private/${otherUserId}/read?timestamp=${timestamp}`, 'PUT'),
};