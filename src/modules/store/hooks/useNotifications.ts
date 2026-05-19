import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notificationsService';
import toast from 'react-hot-toast';

export const notificationKeys = {
  all: (page: number) => ['notifications', page] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useNotifications(page = 1) {
  return useQuery({
    queryKey: notificationKeys.all(page),
    queryFn: async () => {
      const res = await notificationsService.getAll(page);
      return res.data.data;
    },
    staleTime: 1000 * 30, // refresh every 30s
  });
}

// ── Mark Read ────────────────────────────────────────────────────────────────
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────
export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted.');
    },
    onError: () => {
      toast.error('Failed to delete notification.');
    },
  });
}
