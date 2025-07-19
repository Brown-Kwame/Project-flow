import API_GATEWAY_URL from '../config';

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

export async function fetchProjectsByUserId(userId: number, jwtToken: string): Promise<Project[]> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/projects/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch projects by user: ${response.status}`);
    }

    const data: Project[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects by user:', error);
    throw error;
  }
}

export async function fetchProjectsByPortfolioId(portfolioId: number, jwtToken: string): Promise<Project[]> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/projects/portfolio/${portfolioId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch projects by portfolio: ${response.status}`);
    }

    const data: Project[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects by portfolio:', error);
    throw error;
  }
}

export async function createProject(newProject: Omit<Project, 'id' | 'creationDate' | 'lastUpdatedDate'>, jwtToken: string): Promise<Project> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newProject),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create project: ${response.status}`);
    }

    const data: Project = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProject(projectId: number, updatedProject: Project, jwtToken: string): Promise<Project> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedProject),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update project: ${response.status}`);
    }

    const data: Project = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(projectId: number, jwtToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete project: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}
