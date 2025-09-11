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
  referralCode?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
         return { success: false, error: result.error || 'Login failed' };
      }

      const { user, token } = result;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { success: true, user, token };

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

      const { user, token } = result;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user, token };

    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async getCurrentUser(token: string): Promise<AuthResponse> {
    try {
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
