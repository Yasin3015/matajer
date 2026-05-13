export const APP_NAME = 'Matajer';
export const APP_VERSION = '1.0.0';

export const TENANT_MODE = 'path' as const; // 'path' | 'subdomain'

export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_CURRENCY = 'USD';

export const MOCK_STORES = ['Yallamatgar', 'tech-store', 'fashion-store'] as const;

export const ROLES = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  STORE_ADMIN: 'STORE_ADMIN',
  STORE_MANAGER: 'STORE_MANAGER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
