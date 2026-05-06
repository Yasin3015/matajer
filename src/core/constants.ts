export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  // Platform Admin
  ADMIN: '/admin',
  ADMIN_STORES: '/admin/stores',
  ADMIN_USERS: '/admin/users',

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
