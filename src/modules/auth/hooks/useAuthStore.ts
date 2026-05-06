import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/core/types';
import { mockUsers, mockCredentials } from '@/modules/auth/mock/users.mock';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Simulate API delay
        await new Promise((r) => setTimeout(r, 600));

        const expectedPassword = mockCredentials[email];
        if (!expectedPassword || expectedPassword !== password) {
          return { success: false, error: 'Invalid email or password.' };
        }

        const user = mockUsers.find((u) => u.email === email);
        if (!user) return { success: false, error: 'User not found.' };

        const token = `mock-jwt-${user.id}-${Date.now()}`;
        localStorage.setItem('matajer_token', token);
        set({ user, token, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        localStorage.removeItem('matajer_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'matajer-auth' }
  )
);
