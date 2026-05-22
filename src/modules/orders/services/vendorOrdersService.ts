import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface VendorOrderItem {
  product_id: string;
  name?: string;
  quantity: number;
  price?: number;
  product?: {
    id: string;
    name: string;
    price: number;
    images?: string[];
  };
}

export interface VendorOrder {
  id: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  city?: string;
  address?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
  extra_fees?: number;
  notes?: string;
  total: number;
  products?: VendorOrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface UpdateOrderPayload {
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
  extra_fees?: number;
  notes?: string;
}

export const vendorOrdersService = {
  /**
   * GET /vendor/orders
   */
  getAll: (vendorSlug: string) =>
    api.get<ApiResponse<VendorOrder[]>>('/vendor/orders', {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * PUT /vendor/orders/:id
   */
  update: (vendorSlug: string, id: string, payload: UpdateOrderPayload) =>
    api.put<ApiResponse<VendorOrder>>(`/vendor/orders/${id}`, payload, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * DELETE /vendor/orders/:id
   */
  remove: (vendorSlug: string, id: string) =>
    api.delete<ApiResponse<null>>(`/vendor/orders/${id}`, {
      headers: { Vendor: vendorSlug },
    }),
};
