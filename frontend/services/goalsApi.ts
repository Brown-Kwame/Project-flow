
import API_GATEWAY_URL from '../config';

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

export async function fetchGoals(userId: number, jwtToken: string): Promise<Goal[]> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/goals/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch goals: ${response.status}`);
    }

    const data: Goal[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
}

export async function createGoal(newGoal: Omit<Goal, 'id' | 'creationDate' | 'lastUpdatedDate'>, jwtToken: string): Promise<Goal> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newGoal),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create goal: ${response.status}`);
    }

    const data: Goal = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
}

export async function updateGoal(goalId: number, updatedGoal: Goal, jwtToken: string): Promise<Goal> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedGoal),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update goal: ${response.status}`);
    }

    const data: Goal = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
}

export async function deleteGoal(goalId: number, jwtToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/goals/${goalId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete goal: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}