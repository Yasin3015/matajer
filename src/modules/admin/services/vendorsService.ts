import api from '@/core/axios';
import { Vendor, ApiResponse } from '@/core/types';

export interface StoreVendorPayload {
  owner_name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  vendor_name: string;
  slug: string;
  custom_domain?: string;
}

export interface UpdateVendorPayload {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  category?: string;
  status?: 'active' | 'suspended' | 'pending';
}

export interface RegisterVendorPayload {
  owner_name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  vendor_name: string;
  slug: string;
  custom_domain?: string;
}

export const vendorsService = {
  /**
   * GET /platform/vendors  (List all vendors)
   */
  getAll: () =>
    api.get<ApiResponse<Vendor[]>>('/platform/vendors'),

  /**
   * POST /platform/vendors  (Add vendor by admin)
   */
  store: (payload: StoreVendorPayload) =>
    api.post<ApiResponse<Vendor>>('/platform/vendors', payload),

  /**
   * PUT /platform/vendors/:id
   */
  update: (id: string, payload: UpdateVendorPayload) =>
    api.put<ApiResponse<Vendor>>(`/platform/vendors/${id}`, payload),

  /**
   * DELETE /platform/vendors/:id
   */
  remove: (id: string) =>
    api.delete<ApiResponse<null>>(`/platform/vendors/${id}`),

  /**
   * POST /vendor/register  (self-registration)
   */
  register: (payload: RegisterVendorPayload) =>
    api.post<ApiResponse<Vendor>>('/vendor/register', payload),
};
