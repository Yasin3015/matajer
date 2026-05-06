import { ROLES } from './config';

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  storeSlug?: string; // for STORE_ADMIN / STORE_MANAGER
  createdAt: string;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  category: string;
  status: 'active' | 'suspended' | 'pending';
  ownerId: string;
  createdAt: string;
  productCount: number;
  orderCount: number;
  revenue: number;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  stock: number;
  sku: string;
  status: 'active' | 'draft' | 'archived';
  storeSlug: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  storeSlug: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// ─── Customer ────────────────────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  storeSlug: string;
  createdAt: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── API wrappers (structure only) ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Team ────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Extract<Role, 'STORE_ADMIN' | 'STORE_MANAGER'>;
  status: 'active' | 'invited';
  joinedAt: string;
}
