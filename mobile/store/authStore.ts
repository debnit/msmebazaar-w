import { create } from 'zustand';
import { authService, AuthResponse } from '@/services/authService';
import { router } from 'expo-router';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    const result = await authService.login({ email, password });
    if (result.success && result.user && result.token) {
      set({ 
        user: result.user, 
        token: result.token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      router.replace(result.user.isAdmin ? '/(admin)/dashboard' : '/(user)/dashboard');
    } else {
      set({ isLoading: false });
    }
    return result;
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    const result = await authService.register({ name, email, password });
    if (result.success && result.user && result.token) {
      set({ 
        user: result.user, 
        token: result.token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      router.replace(result.user.isAdmin ? '/(admin)/dashboard' : '/(user)/dashboard');
    } else {
      set({ isLoading: false });
    }
    return result;
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const { token, user } = await authService.getStoredAuth();
    if (token && user) {
      set({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
