import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin } from '@/core/types';
import { authService } from '@/modules/auth/services/authService';

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (identity: string, password: string) => Promise<{ success: boolean; errors?: Record<string, string[]>; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: async (identity, password) => {
        try {
          const res = await authService.login({
            identity,
            password,
            token: 'fcm_token_example_123456',
            device: 'web'
          });
          const { token, admin } = res.data.data;

          localStorage.setItem('matajer_token', token);
          set({ admin: { ...admin, email: identity } as Admin, token, isAuthenticated: true });
          return { success: true };
        } catch (err: any) {
          if (err?.response?.status === 422 && err?.response?.data?.errors) {
            return { success: false, errors: err.response.data.errors };
          }
          const message =
            err?.response?.data?.message || 'Invalid email or password.';
          return { success: false, error: message };
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // ignore logout errors silently
        } finally {
          localStorage.removeItem('matajer_token');
          set({ admin: null, token: null, isAuthenticated: false });
        }
      },
    }),
    { name: 'matajer-auth' }
  )
);
