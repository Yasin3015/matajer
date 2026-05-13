/** Default tenant served at `/` without `/store/:slug` prefix. */
export const DEFAULT_STORE_SLUG = 'demo-store';

export const ROUTES = {
  /** Default public storefront (root). */
  HOME: '/',
  /** SaaS marketing / platform landing. */
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

  // Storefront helpers (default store uses short URLs: /, /products, …)
  store: (slug: string) =>
    slug === DEFAULT_STORE_SLUG ? '/' : `/store/${slug}`,
  storeProducts: (slug: string) =>
    slug === DEFAULT_STORE_SLUG ? '/products' : `/store/${slug}/products`,
  storeProduct: (slug: string, id: string) =>
    slug === DEFAULT_STORE_SLUG ? `/products/${id}` : `/store/${slug}/products/${id}`,
  storeCart: (slug: string) =>
    slug === DEFAULT_STORE_SLUG ? '/cart' : `/store/${slug}/cart`,
  storeCheckout: (slug: string) =>
    slug === DEFAULT_STORE_SLUG ? '/checkout' : `/store/${slug}/checkout`,
} as const;
