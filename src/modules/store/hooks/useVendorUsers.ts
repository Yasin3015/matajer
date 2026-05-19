import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  vendorUsersService,
  CreateVendorUserPayload,
  UpdateVendorUserPayload,
} from '../services/vendorUsersService';
import toast from 'react-hot-toast';

export const vendorUserKeys = {
  all: (slug: string) => ['vendor-users', slug] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useVendorUsers(vendorSlug: string) {
  return useQuery({
    queryKey: vendorUserKeys.all(vendorSlug),
    queryFn: async () => {
      const res = await vendorUsersService.getAll(vendorSlug);
      return res.data.data;
    },
    enabled: !!vendorSlug,
    staleTime: 1000 * 60 * 3,
  });
}

// ── Create ────────────────────────────────────────────────────────────────────
export function useCreateVendorUser(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVendorUserPayload) =>
      vendorUsersService.create(vendorSlug, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorUserKeys.all(vendorSlug) });
      toast.success('Team member added successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add team member.');
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────
export function useUpdateVendorUser(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVendorUserPayload }) =>
      vendorUsersService.update(vendorSlug, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorUserKeys.all(vendorSlug) });
      toast.success('Team member updated!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update team member.');
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────
export function useDeleteVendorUser(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorUsersService.remove(vendorSlug, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorUserKeys.all(vendorSlug) });
      toast.success('Team member removed.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to remove team member.');
    },
  });
}
