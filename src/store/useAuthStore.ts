import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const getInitialUser = (): User | null => {
  try {
    const data = localStorage.getItem('user_data');
    if (!data || data === 'undefined') return null;
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  token: localStorage.getItem('token'),

  login: (userData, token) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('token', token);
    set({ user: userData, token });
  },

  logout: () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));