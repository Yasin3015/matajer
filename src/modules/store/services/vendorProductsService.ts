import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface ApiProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  price_before?: number;
  stock: number;
  category_id?: string;
  category?: { id: string; name: string; slug: string; image?: string };
  media?: Array<{ id: string; url: string; type: string }>;
  image?: string;
  images?: Array<{ id: number; url: string }>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVendorProductPayload {
  category_id?: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  price_before?: number;
  stock: number;
  images?: File[];
}

export interface UpdateVendorProductPayload extends Partial<Omit<CreateVendorProductPayload, 'images'>> {
  images?: File[];
}

const buildProductFormData = (payload: any): FormData => {
  const fd = new FormData();
  if (payload.name) fd.append('name', payload.name);
  if (payload.slug) fd.append('slug', payload.slug);
  if (payload.description) fd.append('description', payload.description);
  if (payload.price !== undefined) fd.append('price', String(payload.price));
  if (payload.price_before !== undefined) fd.append('price_before', String(payload.price_before));
  if (payload.stock !== undefined) fd.append('stock', String(payload.stock));
  if (payload.category_id) fd.append('category_id', payload.category_id);
  
  if (payload.images && payload.images.length > 0) {
    for (let i = 0; i < payload.images.length; i++) {
      const file = payload.images[i];
      fd.append(`images[${i}]`, file, file.name);
    }
  }
  return fd;
};

/**
 * Service for /vendor/products — requires Authorization + Vendor header.
 */
export const vendorProductsService = {
  /**
   * GET /vendor/products
   */
  getAll: (vendorSlug: string) =>
    api.get<ApiResponse<ApiProduct[]>>('/vendor/products', {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * GET /vendor/products/:id
   */
  getById: (vendorSlug: string, id: string) =>
    api.get<ApiResponse<ApiProduct>>(`/vendor/products/${id}`, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * POST /vendor/products
   */
  create: (vendorSlug: string, payload: CreateVendorProductPayload) => {
    const data = payload.images?.length ? buildProductFormData(payload) : payload;
    const headers: Record<string, string> = { Vendor: vendorSlug };
    return api.post<ApiResponse<ApiProduct>>('/vendor/products', data, { headers });
  },

  /**
   * PUT /vendor/products/:id
   * Note: Some backend frameworks (like Laravel) require POST with _method=PUT for multipart requests.
   * Assuming standard PUT or handling it if there are files.
   */
  update: (vendorSlug: string, id: string, payload: UpdateVendorProductPayload) => {
    // If backend requires _method=PUT for multipart FormData:
    if (payload.images?.length) {
      const data = buildProductFormData(payload);
      data.append('_method', 'PUT');
      return api.post<ApiResponse<ApiProduct>>(`/vendor/products/${id}`, data, {
        headers: { Vendor: vendorSlug },
      });
    }
    return api.put<ApiResponse<ApiProduct>>(`/vendor/products/${id}`, payload, {
      headers: { Vendor: vendorSlug },
    });
  },

  /**
   * DELETE /vendor/products/:id
   */
  remove: (vendorSlug: string, id: string) =>
    api.delete<ApiResponse<null>>(`/vendor/products/${id}`, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * DELETE /vendor/product-media/:mediaId
   */
  removeMedia: (vendorSlug: string, mediaId: string) =>
    api.delete<ApiResponse<null>>(`/vendor/product-media/${mediaId}`, {
      headers: { Vendor: vendorSlug },
    }),
};
