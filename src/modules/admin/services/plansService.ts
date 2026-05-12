import api from '@/core/axios';
import { Plan, ApiResponse } from '@/core/types';

export interface UpdatePlanPayload {
  name: string;
  price: number;
  duration_days: number;
  features: {
    orders_limit: number | null;
    products_limit: number | null;
    support?: string;
    custom_domain?: boolean;
    [key: string]: any;
  };
  is_active: boolean;
}

export const plansService = {
  /**
   * GET /platform/plans  (admin - all plans)
   */
  getAll: () =>
    api.get<ApiResponse<Plan[]>>('/platform/plans'),

  /**
   * GET /plans  (public listing)
   */
  getPublic: () =>
    api.get<Plan[]>('/plans').then(res => {
      // Sometimes public API might return directly an array or { data: [] }
      return res as unknown as ApiResponse<Plan[]>;
    }).catch(err => {
      throw err;
    }),

  /**
   * GET /platform/plans/:id
   */
  getOne: (id: string | number) =>
    api.get<ApiResponse<Plan>>(`/platform/plans/${id}`),

  /**
   * GET /plans/:id  (public detail)
   */
  getPublicDetail: (id: string | number) =>
    api.get<ApiResponse<Plan>>(`/plans/${id}`),

  /**
   * PUT /platform/plans/:id
   */
  update: (id: string | number, payload: UpdatePlanPayload) =>
    api.put<ApiResponse<Plan>>(`/platform/plans/${id}`, payload),
};
