import API_GATEWAY_URL from '../config';

// --- Interfaces (match your backend Task entity/DTO) ---
export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'; // Match backend enum/string values
  userId: number; // The user who owns this task
  projectId: number; // The project this task belongs to
  creationDate?: string;
  lastUpdatedDate?: string;
}

// --- API Functions ---

export async function fetchTasksByUserId(userId: number, jwtToken: string): Promise<Task[]> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/tasks/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch tasks by user: ${response.status}`);
    }

    const data: Task[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks by user:', error);
    throw error;
  }
}

export async function fetchTasksByProjectId(projectId: number, jwtToken: string): Promise<Task[]> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/tasks/project/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch tasks by project: ${response.status}`);
    }

    const data: Task[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    throw error;
  }
}

export async function createTask(newTask: Omit<Task, 'id' | 'creationDate' | 'lastUpdatedDate'>, jwtToken: string): Promise<Task> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create task: ${response.status}`);
    }

    const data: Task = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(taskId: number, updatedTask: Task, jwtToken: string): Promise<Task> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update task: ${response.status}`);
    }

    const data: Task = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(taskId: number, jwtToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete task: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}