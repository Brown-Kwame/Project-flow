import apiClient from './api';
const Task_Service ='http://10.132.86.67:8083';

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

export async function fetchTasksByUserId(userId: number): Promise<Task[]> {
  try {
    const response = await apiClient.get(`/tasks/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching tasks by user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks by user');
  }
}

export async function fetchTasksByProjectId(projectId: number): Promise<Task[]> {
  try {
    const response = await apiClient.get(`/tasks/project/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching tasks by project:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks by project');
  }
}

export async function createTask(newTask: Omit<Task, 'id' | 'creationDate' | 'lastUpdatedDate'>): Promise<Task> {
  try {
    const response = await apiClient.post('/tasks', newTask);
    return response.data;
  } catch (error: any) {
    console.error('Error creating task:', error);
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
}

export async function updateTask(taskId: number, updatedTask: Task): Promise<Task> {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, updatedTask);
    return response.data;
  } catch (error: any) {
    console.error('Error updating task:', error);
    throw new Error(error.response?.data?.message || 'Failed to update task');
  }
}

export async function deleteTask(taskId: number): Promise<void> {
  try {
    await apiClient.delete(`/tasks/${taskId}`);
  } catch (error: any) {
    console.error('Error deleting task:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete task');
  }
}