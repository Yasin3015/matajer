/** Default tenant served at `/` without `/store/:slug` prefix. */
export const DEFAULT_STORE_SLUG = 'Yallamatgar';

export const ROUTES = {
  /** Platform marketing landing. */
  HOME: '/',
  PLATFORM: '/platform',
  LOGIN: '/login',
  VENDOR_REGISTER: '/vendor/register',

  // Platform Admin
  ADMIN: '/admin',
  ADMIN_STORES: '/admin/stores',
  ADMIN_USERS: '/admin/users',
  ADMIN_PLANS: '/admin/plans',

  // Store Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_PRODUCTS: '/dashboard/products',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_CUSTOMERS: '/dashboard/customers',
  DASHBOARD_TEAM: '/dashboard/team',
  DASHBOARD_SETTINGS: '/dashboard/settings',

  // Storefront helpers
  store: (slug: string) => `/store/${slug}`,
  storeProducts: (slug: string) => `/store/${slug}/products`,
  storeProduct: (slug: string, id: string) => `/store/${slug}/products/${id}`,
  storeCart: (slug: string) => `/store/${slug}/cart`,
  storeCheckout: (slug: string) => `/store/${slug}/checkout`,
} as const;
