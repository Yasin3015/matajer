import { useQuery } from '@tanstack/react-query';
import { storefrontService, StorefrontProductFilterParams } from '../services/storefrontService';
import type { Product } from '@/core/types';

// Map API product to internal Product interface
const mapProduct = (p: any): Product => {
  const price = Number(p.price) || 0;
  const priceBefore = p.price_before != null ? Number(p.price_before) : undefined;
  const comparePrice =
    priceBefore != null && priceBefore > price ? priceBefore : undefined;
  const rating = p.rating != null && Number(p.rating) > 0 ? Number(p.rating) : undefined;
  const reviewCount =
    p.reviews_count != null && Number(p.reviews_count) > 0 ? Number(p.reviews_count) : undefined;

  return {
    id: p.id,
    name: p.name,
    description: p.description || '',
    price,
    comparePrice,
    stock: p.stock || 0,
    category: p.category?.name || '',
    images: (() => {
      if (p.images && p.images.length > 0 && p.images[0].url) return p.images.map((img: any) => img.url);
      if (p.image && typeof p.image === 'string' && p.image.trim() !== '') return [p.image];
      if (p.media && p.media.length > 0 && p.media[0].url) return p.media.map((m: any) => m.url);
      return [`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(p.name)}`];
    })(),
    rating,
    reviewCount,
    sku: p.sku || p.id || '',
    status: p.is_active === false ? 'archived' : 'active',
    storeSlug: p.vendor_slug || p.storeSlug || '',
    createdAt: p.created_at || new Date().toISOString(),
  };
};

// ── Storefront Products ───────────────────────────────────────────────────────
export function useStorefrontProducts(
  vendorSlug: string,
  params?: StorefrontProductFilterParams
) {
  return useQuery({
    queryKey: ['storefront-products', vendorSlug, params],
    queryFn: async () => {
      const res = await storefrontService.getProducts(vendorSlug, params);
      return res.data.data.map(mapProduct);
    },
    enabled: !!vendorSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Storefront Single Product ─────────────────────────────────────────────────
export function useStorefrontProduct(vendorSlug: string, slugOrId: string) {
  return useQuery({
    queryKey: ['storefront-product', vendorSlug, slugOrId],
    queryFn: async () => {
      const res = await storefrontService.getProduct(vendorSlug, slugOrId);
      return mapProduct(res.data.data);
    },
    enabled: !!vendorSlug && !!slugOrId,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Storefront Categories ─────────────────────────────────────────────────────
export function useStorefrontCategories(vendorSlug: string, search?: string) {
  return useQuery({
    queryKey: ['storefront-categories', vendorSlug, search],
    queryFn: async () => {
      const res = await storefrontService.getCategories(vendorSlug, search);
      return res.data.data;
    },
    enabled: !!vendorSlug,
    staleTime: 1000 * 60 * 10,
  });
}
