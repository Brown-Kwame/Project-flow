import apiClient from './api';
const User_Service ='http://10.132.86.67:8086';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export async function getUserById(userId: number): Promise<User> {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
}

export async function updateUser(userId: number, data: UserUpdateRequest): Promise<User> {
  try {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
}

// Register a new user via API Gateway
export async function registerUser({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string; }) {
  try {
    const response = await apiClient.post('/users/register', { firstName, lastName, email, password });
    return response.data;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}