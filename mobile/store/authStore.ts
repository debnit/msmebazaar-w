import { create } from 'zustand';
import { authService, AuthResponse, RegisterData } from '@/services/authService';
import { router } from 'expo-router';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isAgent: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
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

  register: async (data: RegisterData) => {
    set({ isLoading: true });
    const result = await authService.register(data);
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
