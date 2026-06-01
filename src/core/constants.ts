/** Default tenant served at `/` without `/store/:slug` prefix. */
export const DEFAULT_STORE_SLUG = 'Yallamatgar';

/** Demo storefront — fallback/demo categories are shown only for this slug. */
export function isDemoStore(storeSlug: string): boolean {
  return storeSlug === DEFAULT_STORE_SLUG;
}

export const ROUTES = {
  /** Platform marketing landing. */
  HOME: '/',
  PLATFORM: '/platform',
  LOGIN: '/vendor/login',
  VENDOR_LOGIN: '/vendor/login',
  VENDOR_REGISTER: '/vendor/register',

  // Platform Admin
  ADMIN: '/admin',
  ADMIN_STORES: '/admin/stores',
  ADMIN_USERS: '/admin/users',
  ADMIN_PLANS: '/admin/plans',

  // Store Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_PRODUCTS: '/dashboard/products',
  DASHBOARD_CATEGORIES: '/dashboard/categories',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_CUSTOMERS: '/dashboard/customers',
  DASHBOARD_TEAM: '/dashboard/team',
  DASHBOARD_SETTINGS: '/dashboard/settings',

  // Storefront helpers
  store: (slug: string) => `/store/${slug}`,
  storeProducts: (slug: string) => `/store/${slug}/products`,
  storeCategories: (slug: string) => `/store/${slug}/categories`,
  storeProduct: (slug: string, id: string) => `/store/${slug}/products/${id}`,
  storeCart: (slug: string) => `/store/${slug}/cart`,
  storeCheckout: (slug: string) => `/store/${slug}/checkout`,
  storeFavorites: (slug: string) => `/store/${slug}/favorites`,
} as const;
