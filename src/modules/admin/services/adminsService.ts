import api from '@/core/axios';
import { Admin, ApiResponse } from '@/core/types';

export interface CreateAdminPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
}

export interface UpdateAdminPayload {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
}

export const adminsService = {
  /**
   * GET /platform/admins
   */
  getAll: () =>
    api.get<ApiResponse<Admin[]>>('/platform/admins'),

  /**
   * GET /platform/admins/:id
   */
  getOne: (id: string) =>
    api.get<ApiResponse<Admin>>(`/platform/admins/${id}`),

  /**
   * POST /platform/admins
   */
  create: (payload: CreateAdminPayload) =>
    api.post<ApiResponse<Admin>>('/platform/admins', payload),

  /**
   * PUT /platform/admins/:id
   */
  update: (id: string, payload: UpdateAdminPayload) =>
    api.put<ApiResponse<Admin>>(`/platform/admins/${id}`, payload),

  /**
   * DELETE /platform/admins/:id
   */
  remove: (id: string) =>
    api.delete<ApiResponse<null>>(`/platform/admins/${id}`),
};
