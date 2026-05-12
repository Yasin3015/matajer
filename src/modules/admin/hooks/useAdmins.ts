import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminsService, CreateAdminPayload, UpdateAdminPayload } from '../services/adminsService';
import toast from 'react-hot-toast';

// ── Query Keys ────────────────────────────────────────────────────────────────
export const adminKeys = {
  all: ['admins'] as const,
  one: (id: string) => ['admins', id] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useAdmins() {
  return useQuery({
    queryKey: adminKeys.all,
    queryFn: async () => {
      const res = await adminsService.getAll();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 3,
  });
}

// ── Single ─────────────────────────────────────────────────────────────────
export function useAdmin(id: string) {
  return useQuery({
    queryKey: adminKeys.one(id),
    queryFn: async () => {
      const res = await adminsService.getOne(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

// ── Create ────────────────────────────────────────────────────────────────────
export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => adminsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('Admin created successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create admin.');
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────
export function useUpdateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminPayload }) =>
      adminsService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('Admin updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update admin.');
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────
export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('Admin deleted.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete admin.');
    },
  });
}
