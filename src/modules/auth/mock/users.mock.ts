import { User } from '@/core/types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'admin@matajer.com',
    role: 'PLATFORM_ADMIN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'u2',
    name: 'Sarah Connor',
    email: 'sarah@demo-store.com',
    role: 'STORE_ADMIN',
    storeSlug: 'demo-store',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2024-02-15T10:30:00Z',
  },
  {
    id: 'u3',
    name: 'Mark Tech',
    email: 'mark@tech-store.com',
    role: 'STORE_ADMIN',
    storeSlug: 'tech-store',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
    createdAt: '2024-03-01T08:00:00Z',
  },
  {
    id: 'u4',
    name: 'Lila Fashion',
    email: 'lila@fashion-store.com',
    role: 'STORE_ADMIN',
    storeSlug: 'fashion-store',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lila',
    createdAt: '2024-03-20T14:00:00Z',
  },
  {
    id: 'u5',
    name: 'Tom Manager',
    email: 'tom@demo-store.com',
    role: 'STORE_MANAGER',
    storeSlug: 'demo-store',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    createdAt: '2024-04-01T11:00:00Z',
  },
];

// Mock credentials map  (email → password)
export const mockCredentials: Record<string, string> = {
  'admin@matajer.com':       'admin123',
  'sarah@demo-store.com':    'store123',
  'mark@tech-store.com':     'store123',
  'lila@fashion-store.com':  'store123',
  'tom@demo-store.com':      'store123',
};
