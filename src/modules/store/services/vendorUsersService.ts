import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface VendorUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVendorUserPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  is_active?: boolean;
}

export interface UpdateVendorUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  is_active?: boolean;
}

/**
 * Service for /vendor/users — requires Authorization + Vendor header.
 * The Vendor header is injected per-request via the slug param.
 */
export const vendorUsersService = {
  /**
   * GET /vendor/users
   */
  getAll: (vendorSlug: string) =>
    api.get<ApiResponse<VendorUser[]>>('/vendor/users', {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * POST /vendor/users
   */
  create: (vendorSlug: string, payload: CreateVendorUserPayload) =>
    api.post<ApiResponse<VendorUser>>('/vendor/users', payload, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * PUT /vendor/users/:id
   */
  update: (vendorSlug: string, id: string, payload: UpdateVendorUserPayload) =>
    api.put<ApiResponse<VendorUser>>(`/vendor/users/${id}`, payload, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * DELETE /vendor/users/:id
   */
  remove: (vendorSlug: string, id: string) =>
    api.delete<ApiResponse<null>>(`/vendor/users/${id}`, {
      headers: { Vendor: vendorSlug },
    }),
};
