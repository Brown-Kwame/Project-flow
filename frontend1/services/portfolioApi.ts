import apiClient from './api';

// --- Interfaces (match your backend Portfolio entity/DTO) ---
export interface Portfolio {
  id?: number;
  name: string;
  description?: string;
  userId: number; // The user who owns this portfolio
  creationDate?: string;
  lastUpdatedDate?: string;
}

// --- API Functions ---

export async function fetchPortfoliosByUserId(userId: number): Promise<Portfolio[]> {
  try {
    const response = await apiClient.get(`/portfolios/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching portfolios by user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch portfolios by user');
  }
}

export async function createPortfolio(newPortfolio: Omit<Portfolio, 'id' | 'creationDate' | 'lastUpdatedDate'>): Promise<Portfolio> {
  try {
    const response = await apiClient.post('/portfolios', newPortfolio);
    return response.data;
  } catch (error: any) {
    console.error('Error creating portfolio:', error);
    throw new Error(error.response?.data?.message || 'Failed to create portfolio');
  }
}

export async function updatePortfolio(portfolioId: number, updatedPortfolio: Portfolio): Promise<Portfolio> {
  try {
    const response = await apiClient.put(`/portfolios/${portfolioId}`, updatedPortfolio);
    return response.data;
  } catch (error: any) {
    console.error('Error updating portfolio:', error);
    throw new Error(error.response?.data?.message || 'Failed to update portfolio');
  }
}

export async function deletePortfolio(portfolioId: number): Promise<void> {
  try {
    await apiClient.delete(`/portfolios/${portfolioId}`);
  } catch (error: any) {
    console.error('Error deleting portfolio:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete portfolio');
  }
}