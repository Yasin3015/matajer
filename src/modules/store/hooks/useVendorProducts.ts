import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  vendorProductsService,
  CreateVendorProductPayload,
  UpdateVendorProductPayload,
} from '../services/vendorProductsService';
import toast from 'react-hot-toast';

export const vendorProductKeys = {
  all: (slug: string) => ['vendor-products', slug] as const,
  detail: (slug: string, id: string) => ['vendor-products', slug, id] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useVendorProducts(vendorSlug: string) {
  return useQuery({
    queryKey: vendorProductKeys.all(vendorSlug),
    queryFn: async () => {
      const res = await vendorProductsService.getAll(vendorSlug);
      return res.data.data;
    },
    enabled: !!vendorSlug,
    staleTime: 1000 * 60 * 3,
  });
}
// ── Details ──────────────────────────────────────────────────────────────────
export function useVendorProduct(vendorSlug: string, id: string) {
  return useQuery({
    queryKey: vendorProductKeys.detail(vendorSlug, id),
    queryFn: async () => {
      const res = await vendorProductsService.getById(vendorSlug, id);
      return res.data.data;
    },
    enabled: !!vendorSlug && !!id,
    staleTime: 1000 * 60 * 3,
  });
}
// ── Create ────────────────────────────────────────────────────────────────────
export function useCreateVendorProduct(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVendorProductPayload) =>
      vendorProductsService.create(vendorSlug, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorProductKeys.all(vendorSlug) });
      toast.success('Product added successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add product.');
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────
export function useUpdateVendorProduct(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVendorProductPayload }) =>
      vendorProductsService.update(vendorSlug, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorProductKeys.all(vendorSlug) });
      toast.success('Product updated!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update product.');
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────
export function useDeleteVendorProduct(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorProductsService.remove(vendorSlug, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorProductKeys.all(vendorSlug) });
      toast.success('Product deleted.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete product.');
    },
  });
}

// ── Delete Media ──────────────────────────────────────────────────────────────
export function useDeleteProductMedia(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: string) => vendorProductsService.removeMedia(vendorSlug, mediaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorProductKeys.all(vendorSlug) });
      toast.success('Image removed.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to remove image.');
    },
  });
}
