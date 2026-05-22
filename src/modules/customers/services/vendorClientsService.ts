import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface VendorClient {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClientPayload {
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  notes?: string;
}

export interface UpdateClientPayload {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  notes?: string;
}

export const vendorClientsService = {
  /**
   * GET /vendor/clients
   */
  getAll: (vendorSlug: string) =>
    api.get<ApiResponse<VendorClient[]>>('/vendor/clients', {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * POST /vendor/clients
   */
  create: (vendorSlug: string, payload: CreateClientPayload) =>
    api.post<ApiResponse<VendorClient>>('/vendor/clients', payload, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * PUT /vendor/clients/:id
   */
  update: (vendorSlug: string, id: string, payload: UpdateClientPayload) =>
    api.put<ApiResponse<VendorClient>>(`/vendor/clients/${id}`, payload, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * DELETE /vendor/clients/:id
   */
  remove: (vendorSlug: string, id: string) =>
    api.delete<ApiResponse<null>>(`/vendor/clients/${id}`, {
      headers: { Vendor: vendorSlug },
    }),
};
