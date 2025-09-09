import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User, token: string) => void;
}

const API_BASE_URL = 'http://localhost:5000/api'; // Update this to your backend URL

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // For mobile, we'll need to get the token from the response
        // Since the web version uses cookies, we'll need to modify the backend
        // to return the token in the response for mobile clients
        const token = data.token || 'mock-token'; // This should come from your backend
        const user = { id: data.user?.id || '1', name: data.user?.name || 'User', email };
        
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        set({ user, token, isAuthenticated: true, isLoading: false });
        return { success: true };
      } else {
        set({ isLoading: false });
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Network error' };
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token || 'mock-token';
        const user = { id: data.user?.id || '1', name, email };
        
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        set({ user, token, isAuthenticated: true, isLoading: false });
        return { success: true };
      } else {
        set({ isLoading: false });
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Network error' };
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setUser: (user: User, token: string) => {
    set({ user, token, isAuthenticated: true });
  },
}));
