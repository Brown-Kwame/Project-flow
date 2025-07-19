import API_GATEWAY_URL from '../config';

// --- Interfaces (match your backend User entity/DTO) ---
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // Do NOT include password hash here
  // Add other user profile fields as needed
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  // Add other updatable fields
}

// --- API Functions ---

export async function getUserById(userId: number, jwtToken: string): Promise<User> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch user: ${response.status}`);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function updateUser(userId: number, data: UserUpdateRequest, jwtToken: string): Promise<User> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update user: ${response.status}`);
    }

    const updatedUser: User = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}