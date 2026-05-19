import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  vendorCategoriesService,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../services/vendorCategoriesService';
import toast from 'react-hot-toast';

export const vendorCategoryKeys = {
  all: (slug: string) => ['vendor-categories', slug] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useVendorCategories(vendorSlug: string) {
  return useQuery({
    queryKey: vendorCategoryKeys.all(vendorSlug),
    queryFn: async () => {
      const res = await vendorCategoriesService.getAll(vendorSlug);
      return res.data.data;
    },
    enabled: !!vendorSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Create ────────────────────────────────────────────────────────────────────
export function useCreateVendorCategory(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      vendorCategoriesService.create(vendorSlug, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorCategoryKeys.all(vendorSlug) });
      toast.success('Category created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create category.');
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────
export function useUpdateVendorCategory(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      vendorCategoriesService.update(vendorSlug, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorCategoryKeys.all(vendorSlug) });
      toast.success('Category updated!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update category.');
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────
export function useDeleteVendorCategory(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorCategoriesService.remove(vendorSlug, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorCategoryKeys.all(vendorSlug) });
      toast.success('Category deleted.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete category.');
    },
  });
}
