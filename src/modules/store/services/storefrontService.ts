import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface StorefrontProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  price_before?: number;
  stock: number;
  category?: { id: string; name: string; slug: string; image?: string };
  media?: Array<{ id: string; url: string; type: string }>;
  image?: string;
  images?: Array<{ id: number; url: string }>;
  rating?: number;
  reviews_count?: number;
}

export interface StorefrontCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products_count?: number;
}

export interface StorefrontProductFilterParams {
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
}

/**
 * Service for the public-facing store /store/* endpoints.
 * The Vendor header is injected per-request via the slug param.
 */
export const storefrontService = {
  /**
   * GET /store/products  (with optional filters)
   */
  getProducts: (vendorSlug: string, params?: StorefrontProductFilterParams) =>
    api.get<ApiResponse<StorefrontProduct[]>>('/store/products', {
      headers: { Vendor: vendorSlug },
      params,
    }),

  /**
   * GET /store/products/:slugOrId
   */
  getProduct: (vendorSlug: string, slugOrId: string) =>
    api.get<ApiResponse<StorefrontProduct>>(`/store/products/${slugOrId}`, {
      headers: { Vendor: vendorSlug },
    }),

  /**
   * GET /store/categories
   */
  getCategories: (vendorSlug: string, search?: string) =>
    api.get<ApiResponse<StorefrontCategory[]>>('/store/categories', {
      headers: { Vendor: vendorSlug },
      params: search ? { search } : undefined,
    }),

  /**
   * POST /store/checkout
   */
  checkout: (vendorSlug: string, payload: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    address: string;
    notes?: string;
    extra_fees?: number;
    products: Array<{ product_id: string; quantity: number }>;
  }) =>
    api.post<ApiResponse<any>>('/store/checkout', payload, {
      headers: { Vendor: vendorSlug },
    }),
};

