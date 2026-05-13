import { Customer } from '@/core/types';

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Emma Wilson',   email: 'emma@example.com',   phone: '+1 555-0101', totalOrders: 5,  totalSpent: 389.95, storeSlug: 'Yallamatgar',    createdAt: '2024-01-15T09:00:00Z' },
  { id: 'c2', name: 'James Brown',   email: 'james@example.com',  phone: '+1 555-0102', totalOrders: 3,  totalSpent: 219.97, storeSlug: 'Yallamatgar',    createdAt: '2024-02-01T10:00:00Z' },
  { id: 'c3', name: 'Olivia Davis',  email: 'olivia@example.com', phone: '+1 555-0103', totalOrders: 8,  totalSpent: 672.40, storeSlug: 'Yallamatgar',    createdAt: '2024-02-14T11:00:00Z' },
  { id: 'c4', name: 'Noah Miller',   email: 'noah@example.com',   phone: '+1 555-0201', totalOrders: 2,  totalSpent: 2199.98, storeSlug: 'tech-store',   createdAt: '2024-03-01T09:00:00Z' },
  { id: 'c5', name: 'Ava Garcia',    email: 'ava@example.com',    phone: '+1 555-0202', totalOrders: 4,  totalSpent: 1799.96, storeSlug: 'tech-store',   createdAt: '2024-03-10T14:00:00Z' },
  { id: 'c6', name: 'Liam Taylor',   email: 'liam@example.com',   phone: '+1 555-0301', totalOrders: 12, totalSpent: 1428.76, storeSlug: 'fashion-store', createdAt: '2024-01-20T08:00:00Z' },
  { id: 'c7', name: 'Sophia Lee',    email: 'sophia@example.com', phone: '+1 555-0302', totalOrders: 7,  totalSpent: 893.43, storeSlug: 'fashion-store', createdAt: '2024-02-28T12:00:00Z' },
];

export const getCustomersByStore = (slug: string): Customer[] =>
  mockCustomers.filter((c) => c.storeSlug === slug);
