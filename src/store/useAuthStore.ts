import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  // token: string | null; <-- HAPUS BARIS INI
  login: (userData: User) => void; // Hapus parameter token
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

  // Hanya menyimpan data User untuk keperluan UI (Nama, Avatar, Role)
  login: (userData) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem('user_data');
    set({ user: null });
  },
}));