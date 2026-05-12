import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  vendorsService,
  StoreVendorPayload,
  UpdateVendorPayload,
  RegisterVendorPayload,
} from '../services/vendorsService';
import toast from 'react-hot-toast';

// ── Query Keys ────────────────────────────────────────────────────────────────
export const vendorKeys = {
  all: ['vendors'] as const,
  one: (id: string) => ['vendors', id] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useVendors() {
  return useQuery({
    queryKey: vendorKeys.all,
    queryFn: async () => {
      const res = await vendorsService.getAll();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 3,
  });
}

// ── Create (by admin) ─────────────────────────────────────────────────────────
export function useStoreVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: StoreVendorPayload) => vendorsService.store(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success('Vendor created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create vendor.');
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────
export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVendorPayload }) =>
      vendorsService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success('Vendor updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update vendor.');
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────
export function useDeleteVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success('Vendor deleted.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete vendor.');
    },
  });
}

// ── Self-Register ─────────────────────────────────────────────────────────────
export function useRegisterVendor() {
  return useMutation({
    mutationFn: (payload: RegisterVendorPayload) => vendorsService.register(payload),
    onSuccess: () => {
      toast.success('Registration submitted successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Registration failed.');
    },
  });
}
