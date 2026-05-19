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

// ─── Platform Admin (from API) ───────────────────────────────────────────────
export interface Admin {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_platform_owner?: boolean;
  is_active?: boolean;
  role?: 'platform_admin' | 'admin' | string;
  storeSlug?: string;
  created_at?: string;
  updated_at?: string;
}

// ─── Plan (from API) ─────────────────────────────────────────────────────────
export interface Plan {
  id: string | number;
  name: string;
  description?: string;
  price: string | number;
  duration_days: number;
  features: {
    orders_limit: number | null;
    products_limit: number | null;
    support?: string;
    custom_domain?: boolean;
    [key: string]: any;
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Vendor (= Store from API) ───────────────────────────────────────────────
export interface Vendor {
  id: string;
  name: string;
  slug: string;
  custom_domain?: string | null;
  description?: string;
  is_active: boolean;
  start_at?: string;
  expire_at?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  users_count?: number;
}

// ─── API wrappers (matching real backend shape) ───────────────────────────────
export interface ApiResponse<T> {
  message: string;
  data: T;
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

// ─── Vendor Sub-User (from /vendor/users API) ─────────────────────────────────
export interface VendorUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Vendor Category (from /vendor/categories API) ────────────────────────────
export interface VendorCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

// ─── Notification (from /notifications API) ───────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  body: string;
  read_at?: string | null;
  created_at?: string;
  data?: Record<string, any>;
}
