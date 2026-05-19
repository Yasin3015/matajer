import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface VendorLoginPayload {
  identity: string;
  password: string;
  token?: string;
  device?: string;
}

export interface VendorAuthData {
  token: string;
  user: {
    id: string;
    name: string;
    role: string;
    email?: string;
    vendor?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export const vendorAuthService = {
  /**
   * POST /vendor/auth/login
   * Requires `Vendor: {{vendor_slug}}` header
   */
  login: (vendorSlug: string, payload: VendorLoginPayload) =>
    api.post<ApiResponse<VendorAuthData>>('/vendor/auth/login', payload, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * POST /vendor/auth/logout
   * Requires Authorization + Vendor header
   */
  logout: (vendorSlug: string) =>
    api.post<ApiResponse<null>>('/vendor/auth/logout', null, {
      headers: { Vendor: vendorSlug },
    }),
};
