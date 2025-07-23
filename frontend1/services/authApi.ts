import API_GATEWAY_URL from '../config';

// --- Interfaces (match your backend DTOs) ---
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
}

// --- API Functions ---

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData: AuthResponse = await response.json();

    if (!response.ok) {
      // Backend returns message on error
      throw new Error(responseData.message || `Registration failed with status: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_GATEWAY_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData: AuthResponse = await response.json();

    if (!response.ok) {
      // Backend returns message on error
      throw new Error(responseData.message || `Login failed with status: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}