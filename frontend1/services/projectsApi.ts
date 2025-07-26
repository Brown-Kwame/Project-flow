import apiClient from './api';

// --- Interfaces (match your backend Project entity/DTO) ---
export interface Project {
  id?: number;
  name: string;
  description?: string;
  userId: number; // The user who owns this project
  portfolioId: number; // The portfolio this project belongs to
  creationDate?: string;
  lastUpdatedDate?: string;
}

// --- API Functions ---

export async function fetchProjectsByUserId(userId: number): Promise<Project[]> {
  try {
    const response = await apiClient.get(`/projects/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching projects by user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch projects by user');
  }
}

export async function fetchProjectsByPortfolioId(portfolioId: number): Promise<Project[]> {
  try {
    const response = await apiClient.get(`/projects/portfolio/${portfolioId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching projects by portfolio:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch projects by portfolio');
  }
}

export async function createProject(newProject: Omit<Project, 'id' | 'creationDate' | 'lastUpdatedDate'>): Promise<Project> {
  try {
    const response = await apiClient.post('/projects', newProject);
    return response.data;
  } catch (error: any) {
    console.error('Error creating project:', error);
    throw new Error(error.response?.data?.message || 'Failed to create project');
  }
}

export async function updateProject(projectId: number, updatedProject: Project): Promise<Project> {
  try {
    const response = await apiClient.put(`/projects/${projectId}`, updatedProject);
    return response.data;
  } catch (error: any) {
    console.error('Error updating project:', error);
    throw new Error(error.response?.data?.message || 'Failed to update project');
  }
}

export async function deleteProject(projectId: number): Promise<void> {
  try {
    await apiClient.delete(`/projects/${projectId}`);
  } catch (error: any) {
    console.error('Error deleting project:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete project');
  }
}
