import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  vendorClientsService,
  CreateClientPayload,
  UpdateClientPayload,
} from '../services/vendorClientsService';
import toast from 'react-hot-toast';

export const customerKeys = {
  all: (slug: string) => ['customers', slug] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useCustomers(vendorSlug: string) {
  return useQuery({
    queryKey: customerKeys.all(vendorSlug),
    queryFn: async () => {
      const res = await vendorClientsService.getAll(vendorSlug);
      return res.data.data;
    },
    enabled: !!vendorSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Create ────────────────────────────────────────────────────────────────────
export function useCreateCustomer(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClientPayload) =>
      vendorClientsService.create(vendorSlug, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all(vendorSlug) });
      toast.success('Customer created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create customer.');
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────
export function useUpdateCustomer(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClientPayload }) =>
      vendorClientsService.update(vendorSlug, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all(vendorSlug) });
      toast.success('Customer updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update customer.');
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────
export function useDeleteCustomer(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorClientsService.remove(vendorSlug, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all(vendorSlug) });
      toast.success('Customer deleted successfully.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete customer.');
    },
  });
}
