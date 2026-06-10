import { create } from 'zustand';
import type { User } from '../types';

// ─── Pattern #2: Centralized State Management (Zustand) ───
// Single source of truth for authentication state across the entire app.
// Any component can call useAuthStore() to read user data or trigger login/logout.

interface AuthState {
  user: User | null;
<<<<<<< HEAD
  token: string | null;
  login: (userData: User, token: string) => void;
=======
  login: (userData: User) => void;
>>>>>>> 0f5314085f3915f82e1f80342e1bc485fec9282f
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
  token: localStorage.getItem('token'),

  login: (userData) => {
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
