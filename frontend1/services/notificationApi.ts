// frontend1/src/services/notificationsApi.ts

import apiClient from './api';

// --- Interfaces (match your backend Notification entity/DTO) ---
export interface Notification {
  id?: number;
  userId: number;
  message: string;
  type: string; // e.g., "WELCOME", "LOGIN_SUCCESS", "TASK_ASSIGNED"
  readStatus: boolean;
  timestamp?: string; // ISO date string
  resourceId?: number; // Optional: ID of the related resource (e.g., taskId, projectId)
  resourceType?: string; // Optional: Type of the related resource (e.g., "TASK", "PROJECT")
}

// --- API Functions ---

// Note: createNotification is typically called by backend services (like Auth Service)
// However, if the frontend needs to trigger certain notifications, this function would be used.
export async function createNotification(newNotification: Omit<Notification, 'id' | 'timestamp' | 'readStatus'>): Promise<Notification> {
  try {
    const response = await apiClient.post('/notifications', newNotification);
    return response.data;
  } catch (error: any) {
    console.error('Error creating notification:', error);
    throw new Error(error.response?.data?.message || 'Failed to create notification');
  }
}

export async function fetchNotificationsByUserId(userId: number): Promise<Notification[]> {
  try {
    const response = await apiClient.get(`/notifications/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  try {
    await apiClient.put(`/notifications/${notificationId}/mark-read`, {});
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
}

export async function deleteNotification(notificationId: number): Promise<void> {
  try {
    await apiClient.delete(`/notifications/${notificationId}`);
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete notification');
  }
}