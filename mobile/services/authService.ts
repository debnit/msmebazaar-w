import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  token?: string;
  error?: string;
}

// This is a simplified fetcher. In a real app, you'd want a more robust solution.
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }

  return data;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // The web version login sets an http-only cookie.
      // For mobile, the backend needs to return user/token info.
      // Assuming backend is modified to do so for non-web clients.
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
         return { success: false, error: result.error || 'Login failed' };
      }

      // We need to fetch user data separately because login API only sets cookie.
      const userResponse = await this.getCurrentUser(result.token);
      
      if (userResponse.success) {
        await AsyncStorage.setItem('token', result.token);
        await AsyncStorage.setItem('user', JSON.stringify(userResponse.user));
        return { success: true, user: userResponse.user, token: result.token };
      } else {
        return { success: false, error: 'Could not fetch user profile after login.' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Registration failed' };
      }
      
      // We need to fetch user data separately because register API only sets cookie.
      const userResponse = await this.getCurrentUser(result.token);

      if (userResponse.success) {
        await AsyncStorage.setItem('token', result.token);
        await AsyncStorage.setItem('user', JSON.stringify(userResponse.user));
        return { success: true, user: userResponse.user, token: result.token };
      } else {
        return { success: false, error: 'Could not fetch user profile after registration.' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async getCurrentUser(token: string): Promise<AuthResponse> {
    try {
        // This endpoint doesn't exist on the webapp, but is needed for mobile
        // to get user data from a token. Assuming it exists.
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch user");
        const user = await response.json();
        return { success: true, user };
    } catch (error) {
        return { success: false, error: "Session invalid" };
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    // No API call since web uses http-only cookie logout.
    // The mobile token is just invalidated by being removed.
    router.replace('/');
  },

  async getStoredAuth(): Promise<{ token: string | null; user: any | null }> {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch (error) {
      return { token: null, user: null };
    }
  },
};
