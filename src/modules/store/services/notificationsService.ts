import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface Notification {
  id: string;
  title: string;
  body: string;
  read_at?: string | null;
  created_at?: string;
  data?: Record<string, any>;
}

export interface PaginatedNotifications {
  data: Notification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const notificationsService = {
  /**
   * GET /notifications?page=N
   */
  getAll: (page = 1) =>
    api.get<ApiResponse<PaginatedNotifications>>('/notifications', {
      params: { page },
    }),

  /**
   * GET /notifications/:id/read  (marks as read)
   */
  markRead: (id: string) =>
    api.get<ApiResponse<Notification>>(`/notifications/${id}/read`),

  /**
   * DELETE /notifications/:id
   */
  remove: (id: string) =>
    api.delete<ApiResponse<null>>(`/notifications/${id}`),
};
