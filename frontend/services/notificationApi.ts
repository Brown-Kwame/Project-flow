// frontend1/src/services/notificationsApi.ts

import API_GATEWAY_URL from '../config';

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
export async function createNotification(newNotification: Omit<Notification, 'id' | 'timestamp' | 'readStatus'>, jwtToken: string): Promise<Notification> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newNotification),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create notification: ${response.status}`);
    }

    const data: Notification = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function fetchNotificationsByUserId(userId: number, jwtToken: string): Promise<Notification[]> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/notifications/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch notifications: ${response.status}`);
    }

    const data: Notification[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: number, jwtToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/notifications/${notificationId}/mark-read`, {
      method: 'PUT', // Or PATCH, depending on your backend
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to mark notification as read: ${response.status}`);
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId: number, jwtToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete notification: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}