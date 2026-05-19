import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VendorUser } from '@/core/types';
import { vendorAuthService, VendorLoginPayload } from '@/modules/auth/services/vendorAuthService';

export interface VendorAuthState {
  vendorUser: VendorUser | null;
  storeSlug: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (vendorSlug: string, payload: VendorLoginPayload) => Promise<{ success: boolean; errors?: Record<string, string[]>; error?: string }>;
  logout: () => void;
  setVendorContext: (user: VendorUser, token: string, storeSlug: string) => void;
}

export const useVendorAuthStore = create<VendorAuthState>()(
  persist(
    (set, get) => ({
      vendorUser: null,
      storeSlug: null,
      token: null,
      isAuthenticated: false,

      login: async (vendorSlug, payload) => {
        try {
          const res = await vendorAuthService.login(vendorSlug, payload);
          const { token, user } = res.data.data;

          localStorage.setItem('matajer_vendor_token', token);
          set({
            vendorUser: user as any,
            storeSlug: user.vendor?.slug ?? vendorSlug,
            token,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (err: any) {
          if (err?.response?.status === 422 && err?.response?.data?.errors) {
            return { success: false, errors: err.response.data.errors };
          }
          const message =
            err?.response?.data?.message || 'Invalid credentials.';
          return { success: false, error: message };
        }
      },

      logout: async () => {
        try {
          const state = get();
          if (state.storeSlug) {
            await vendorAuthService.logout(state.storeSlug);
          }
        } catch {
          // ignore logout errors silently
        } finally {
          localStorage.removeItem('matajer_vendor_token');
          set({ vendorUser: null, storeSlug: null, token: null, isAuthenticated: false });
        }
      },

      setVendorContext: (user, token, storeSlug) => {
        localStorage.setItem('matajer_vendor_token', token);
        set({ vendorUser: user, token, storeSlug, isAuthenticated: true });
      }
    }),
    { name: 'matajer-vendor-auth' }
  )
);
