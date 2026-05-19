import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface VendorCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  image?: File;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
  image?: File;
}

const buildCategoryFormData = (payload: any): FormData => {
  const fd = new FormData();
  if (payload.name) fd.append('name', payload.name);
  if (payload.slug) fd.append('slug', payload.slug);
  if (payload.description) fd.append('description', payload.description);
  if (payload.image) fd.append('image', payload.image);
  return fd;
};

/**
 * Service for /vendor/categories — requires Authorization + Vendor header.
 */
export const vendorCategoriesService = {
  /**
   * GET /vendor/categories
   */
  getAll: (vendorSlug: string) =>
    api.get<ApiResponse<VendorCategory[]>>('/vendor/categories', {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * POST /vendor/categories
   */
  create: (vendorSlug: string, payload: CreateCategoryPayload) => {
    const data = payload.image ? buildCategoryFormData(payload) : payload;
    const headers: Record<string, string> = { Vendor: vendorSlug };
    return api.post<ApiResponse<VendorCategory>>('/vendor/categories', data, { headers });
  },

  /**
   * PUT /vendor/categories/:id
   */
  update: (vendorSlug: string, id: string, payload: UpdateCategoryPayload) => {
    if (payload.image) {
      const data = buildCategoryFormData(payload);
      data.append('_method', 'PUT');
      return api.post<ApiResponse<VendorCategory>>(`/vendor/categories/${id}`, data, {
        headers: { Vendor: vendorSlug },
      });
    }
    return api.put<ApiResponse<VendorCategory>>(`/vendor/categories/${id}`, payload, {
      headers: { Vendor: vendorSlug },
    });
  },

  /**
   * DELETE /vendor/categories/:id
   */
  remove: (vendorSlug: string, id: string) =>
    api.delete<ApiResponse<null>>(`/vendor/categories/${id}`, {
      headers: { Vendor: vendorSlug },
    }),
};
