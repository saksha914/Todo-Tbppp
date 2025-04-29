import { create } from 'zustand';
import { authApi } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authApi.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      await authApi.register({ username, email, password });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
})); 