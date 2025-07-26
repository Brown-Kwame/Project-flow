
import apiClient from './api';

// --- Interfaces (match your backend Goal entity/DTO) ---
export interface Goal {
  id?: number;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done'; // Or other status types
  userId: number; // The user who owns this goal (from backend's perspective)
  dueDate: string; // ISO date string e.g., "2025-07-01"
  creationDate?: string;
  lastUpdatedDate?: string;
}

// --- API Functions ---

export async function fetchGoals(userId: number): Promise<Goal[]> {
  try {
    const response = await apiClient.get(`/goals/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching goals:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch goals');
  }
}

export async function createGoal(newGoal: Omit<Goal, 'id' | 'creationDate' | 'lastUpdatedDate'>): Promise<Goal> {
  try {
    const response = await apiClient.post('/goals', newGoal);
    return response.data;
  } catch (error: any) {
    console.error('Error creating goal:', error);
    throw new Error(error.response?.data?.message || 'Failed to create goal');
  }
}

export async function updateGoal(goalId: number, updatedGoal: Goal): Promise<Goal> {
  try {
    const response = await apiClient.put(`/goals/${goalId}`, updatedGoal);
    return response.data;
  } catch (error: any) {
    console.error('Error updating goal:', error);
    throw new Error(error.response?.data?.message || 'Failed to update goal');
  }
}

export async function deleteGoal(goalId: number): Promise<void> {
  try {
    await apiClient.delete(`/goals/${goalId}`);
  } catch (error: any) {
    console.error('Error deleting goal:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete goal');
  }
}