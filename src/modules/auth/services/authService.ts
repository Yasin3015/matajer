import api from '@/core/axios';
import { ApiResponse } from '@/core/types';

export interface LoginPayload {
  identity: string;
  password: string;
  token?: string;
  device?: string;
}

export interface AuthData {
  token: string;
  admin: {
    id: string;
    name: string;
    role: string;
  };
}

export const authService = {
  /**
   * POST /platform/auth/login
   */
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthData>>('/platform/auth/login', payload),

  /**
   * POST /platform/auth/logout
   */
  logout: () =>
    api.post<ApiResponse<null>>('/platform/auth/logout'),
};
