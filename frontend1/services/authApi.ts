import apiClient, { setAuthToken } from './api';
const Auth_Service ='http://10.132.86.67:8092';

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
    const response = await apiClient.post('/users/register', data);
    const authResponse = response.data;
    
    // Set the token for future requests
    if (authResponse.token) {
      setAuthToken(authResponse.token);
    }
    
    return authResponse;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post('/users/login', data);
    const authResponse = response.data;
    
    // Set the token for future requests
    if (authResponse.token) {
      setAuthToken(authResponse.token);
    }
    
    return authResponse;
  } catch (error: any) {
    console.error('Error logging in user:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}