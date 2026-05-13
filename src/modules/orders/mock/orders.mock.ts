import { Order } from '@/core/types';

export const mockOrders: Order[] = [
  { id: 'o1', orderNumber: '#1001', customerId: 'c1', customerName: 'Emma Wilson', customerEmail: 'emma@example.com', items: [{ productId: 'dp1', productName: 'Wireless Headphones', quantity: 1, price: 79.99 }], total: 79.99, status: 'delivered', storeSlug: 'Yallamatgar', createdAt: '2024-04-01T10:00:00Z' },
  { id: 'o2', orderNumber: '#1002', customerId: 'c2', customerName: 'James Brown', customerEmail: 'james@example.com', items: [{ productId: 'dp2', productName: 'Smart Watch', quantity: 1, price: 149.99 }, { productId: 'dp4', productName: 'USB-C Hub', quantity: 2, price: 34.99 }], total: 219.97, status: 'processing', storeSlug: 'Yallamatgar', createdAt: '2024-04-05T14:00:00Z' },
  { id: 'o3', orderNumber: '#1003', customerId: 'c3', customerName: 'Olivia Davis', customerEmail: 'olivia@example.com', items: [{ productId: 'dp3', productName: 'Portable Speaker', quantity: 1, price: 49.99 }], total: 49.99, status: 'shipped', storeSlug: 'Yallamatgar', createdAt: '2024-04-08T09:00:00Z' },
  { id: 'o4', orderNumber: '#2001', customerId: 'c4', customerName: 'Noah Miller', customerEmail: 'noah@example.com', items: [{ productId: 'tp1', productName: 'MacBook Pro M3', quantity: 1, price: 1999.99 }], total: 1999.99, status: 'delivered', storeSlug: 'tech-store', createdAt: '2024-04-02T11:00:00Z' },
  { id: 'o5', orderNumber: '#2002', customerId: 'c5', customerName: 'Ava Garcia', customerEmail: 'ava@example.com', items: [{ productId: 'tp3', productName: '4K Gaming Monitor', quantity: 1, price: 599.99 }], total: 599.99, status: 'pending', storeSlug: 'tech-store', createdAt: '2024-04-09T16:00:00Z' },
  { id: 'o6', orderNumber: '#3001', customerId: 'c6', customerName: 'Liam Taylor', customerEmail: 'liam@example.com', items: [{ productId: 'fp1', productName: 'Premium Wool Coat', quantity: 1, price: 249.99 }, { productId: 'fp2', productName: 'Classic White Sneakers', quantity: 1, price: 89.99 }], total: 339.98, status: 'delivered', storeSlug: 'fashion-store', createdAt: '2024-04-03T12:00:00Z' },
];

export const getOrdersByStore = (slug: string): Order[] =>
  mockOrders.filter((o) => o.storeSlug === slug);
