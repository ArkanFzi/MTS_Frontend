import { create } from 'zustand';
import type { User } from '../types';

// ─── Pattern #2: Centralized State Management (Zustand) ───
// Single source of truth for authentication state across the entire app.
// Any component can call useAuthStore() to read user data or trigger login/logout.

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const getInitialUser = (): User | null => {
  try {
    const data = localStorage.getItem('user_data');
    if (!data || data === 'undefined') return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),

  login: (userData) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem('user_data');
    set({ user: null });
  },
}));
