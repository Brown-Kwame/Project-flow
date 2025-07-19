import API_GATEWAY_URL from '../config';

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

export async function fetchPortfoliosByUserId(userId: number, jwtToken: string): Promise<Portfolio[]> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/portfolios/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch portfolios by user: ${response.status}`);
    }

    const data: Portfolio[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolios by user:', error);
    throw error;
  }
}

export async function createPortfolio(newPortfolio: Omit<Portfolio, 'id' | 'creationDate' | 'lastUpdatedDate'>, jwtToken: string): Promise<Portfolio> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/portfolios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newPortfolio),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create portfolio: ${response.status}`);
    }

    const data: Portfolio = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }
}

export async function updatePortfolio(portfolioId: number, updatedPortfolio: Portfolio, jwtToken: string): Promise<Portfolio> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/portfolios/${portfolioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updatedPortfolio),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update portfolio: ${response.status}`);
    }

    const data: Portfolio = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }
}

export async function deletePortfolio(portfolioId: number, jwtToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/portfolios/${portfolioId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to delete portfolio: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    throw error;
  }
}