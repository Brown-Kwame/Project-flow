import apiClient from './api';

// --- Interfaces (match your backend DTOs) ---
export interface Team {
  id?: number;
  name: string;
  description?: string;
  ownerUserId: number; // ID of the user who owns this team
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id?: number;
  teamId: number;
  userId: number;
  userEmail?: string; // Populated from User Service
  userName?: string; // Populated from User Service
  role: 'ADMIN' | 'MEMBER' | 'GUEST'; // Match backend enum
  joinedAt?: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  ownerUserId: number; // Will be overridden by backend with authenticated user's ID
}

export interface AddTeamMemberRequest {
  userId: number;
  role: 'ADMIN' | 'MEMBER' | 'GUEST';
}

// --- API Functions ---

export async function createTeam(data: CreateTeamRequest): Promise<Team> {
  try {
    const response = await apiClient.post('/teams', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating team:', error);
    throw new Error(error.response?.data?.message || 'Failed to create team');
  }
}

export async function fetchTeamsByOwner(ownerId: number): Promise<Team[]> {
  try {
    const response = await apiClient.get(`/teams/owner/${ownerId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching teams by owner:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch teams by owner');
  }
}

export async function fetchTeamsByMember(userId: number): Promise<Team[]> {
  try {
    const response = await apiClient.get(`/teams/member/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching teams by member:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch teams by member');
  }
}

export async function getTeamById(teamId: number): Promise<Team> {
  try {
    const response = await apiClient.get(`/teams/${teamId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting team by ID:', error);
    throw new Error(error.response?.data?.message || 'Failed to get team by ID');
  }
}

export async function updateTeam(teamId: number, data: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
  try {
    const response = await apiClient.put(`/teams/${teamId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating team:', error);
    throw new Error(error.response?.data?.message || 'Failed to update team');
  }
}

export async function deleteTeam(teamId: number): Promise<void> {
  try {
    await apiClient.delete(`/teams/${teamId}`);
  } catch (error: any) {
    console.error('Error deleting team:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete team');
  }
}

export async function addTeamMember(teamId: number, data: AddTeamMemberRequest): Promise<TeamMember> {
  try {
    const response = await apiClient.post(`/teams/${teamId}/members`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error adding team member:', error);
    throw new Error(error.response?.data?.message || 'Failed to add team member');
  }
}

export async function removeTeamMember(teamId: number, userIdToRemove: number): Promise<void> {
  try {
    await apiClient.delete(`/teams/${teamId}/members/${userIdToRemove}`);
  } catch (error: any) {
    console.error('Error removing team member:', error);
    throw new Error(error.response?.data?.message || 'Failed to remove team member');
  }
}

export async function fetchTeamMembers(teamId: number): Promise<TeamMember[]> {
  try {
    const response = await apiClient.get(`/teams/${teamId}/members`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch team members');
  }
}

export async function getTeamMember(teamId: number, userId: number): Promise<TeamMember> {
  try {
    const response = await apiClient.get(`/teams/${teamId}/members/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting team member:', error);
    throw new Error(error.response?.data?.message || 'Failed to get team member');
  }
}