import React, { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import clsx from 'clsx';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout/DashboardLayout';
import { StoreLayout } from '@/layouts/StoreLayout/StoreLayout';
import { Spinner } from '@/shared/ui/Feedback';

// ── Lazy imports ─────────────────────────────────────────────────────────────
const PlatformLandingPage      = lazy(() => import('@/modules/store/pages/PlatformLandingPage'));
const LoginPage                = lazy(() => import('@/modules/auth/pages/LoginPage'));
const VendorRegisterPage       = lazy(() => import('@/modules/auth/pages/VendorRegisterPage'));

// Admin
const AdminDashboardPage       = lazy(() => import('@/modules/admin/pages/AdminDashboardPage'));
const StoresPage               = lazy(() => import('@/modules/admin/pages/StoresPage'));
const UsersPage                = lazy(() => import('@/modules/admin/pages/UsersPage'));
const PlansPage                = lazy(() => import('@/modules/admin/pages/PlansPage'));

// Store Dashboard
const StoreDashboardPage       = lazy(() => import('@/modules/store/pages/StoreDashboardPage'));
const ProductsPage             = lazy(() => import('@/modules/products/pages/ProductsPage'));
const OrdersPage               = lazy(() => import('@/modules/orders/pages/OrdersPage'));
const CustomersPage            = lazy(() => import('@/modules/customers/pages/CustomersPage'));
const TeamPage                 = lazy(() => import('@/modules/store/pages/TeamPage'));
const SettingsPage             = lazy(() => import('@/modules/store/pages/SettingsPage'));

// Storefront
const StoreHomePage            = lazy(() => import('@/modules/store/pages/StoreHomePage'));
const StorefrontProductsPage   = lazy(() => import('@/modules/products/pages/StorefrontProductsPage'));
const StorefrontProductDetail  = lazy(() => import('@/modules/products/pages/StorefrontProductDetailPage'));
const CartPage                 = lazy(() => import('@/modules/cart/pages/CartPage'));
const CheckoutPage             = lazy(() => import('@/modules/checkout/pages/CheckoutPage'));

const PageLoader: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => (
  <div
    className={clsx(
      'flex-1 w-full flex flex-col items-center justify-center',
      variant === 'light' && 'min-h-[50vh] bg-white text-slate-900',
      variant === 'dark' && 'min-h-screen bg-surface text-slate-100',
    )}
  >
    <Spinner size="lg" tone={variant === 'light' ? 'onLight' : 'default'} />
  </div>
);

const SuspenseWrapper: React.FC<{ children: React.ReactNode; loaderVariant?: 'light' | 'dark' }> = ({
  children,
  loaderVariant = 'light',
}) => <Suspense fallback={<PageLoader variant={loaderVariant} />}>{children}</Suspense>;

const storefrontChildRoutes: RouteObject[] = [
  { index: true,                               element: <SuspenseWrapper><StoreHomePage /></SuspenseWrapper> },
  { path: 'products',                          element: <SuspenseWrapper><StorefrontProductsPage /></SuspenseWrapper> },
  { path: 'products/:productId',               element: <SuspenseWrapper><StorefrontProductDetail /></SuspenseWrapper> },
  { path: 'cart',                              element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
  { path: 'checkout',                          element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper> },
];

const router = createBrowserRouter([
  // ── Default storefront at `/` (Yallamatgar) ─────────────────────────────────
  {
    path: '/',
    element: <StoreLayout />,
    children: storefrontChildRoutes,
  },

  // ── Platform marketing landing ────────────────────────────────────────────
  {
    path: '/platform',
    element: <SuspenseWrapper loaderVariant="dark"><PlatformLandingPage /></SuspenseWrapper>,
  },

  {
    path: '/login',
    element: <SuspenseWrapper loaderVariant="dark"><LoginPage /></SuspenseWrapper>,
  },
  {
    path: '/vendor/register',
    element: <SuspenseWrapper><VendorRegisterPage /></SuspenseWrapper>,
  },

  // ── Platform Admin ─────────────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin',        element: <SuspenseWrapper loaderVariant="dark"><AdminDashboardPage /></SuspenseWrapper> },
          { path: '/admin/stores', element: <SuspenseWrapper loaderVariant="dark"><StoresPage /></SuspenseWrapper> },
          { path: '/admin/users',  element: <SuspenseWrapper loaderVariant="dark"><UsersPage /></SuspenseWrapper> },
          { path: '/admin/plans',  element: <SuspenseWrapper loaderVariant="dark"><PlansPage /></SuspenseWrapper> },
          { path: '/admin/settings', element: <SuspenseWrapper loaderVariant="dark"><SettingsPage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // ── Store Dashboard ────────────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['STORE_ADMIN', 'STORE_MANAGER']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard',            element: <SuspenseWrapper loaderVariant="dark"><StoreDashboardPage /></SuspenseWrapper> },
          { path: '/dashboard/products',   element: <SuspenseWrapper loaderVariant="dark"><ProductsPage /></SuspenseWrapper> },
          { path: '/dashboard/orders',     element: <SuspenseWrapper loaderVariant="dark"><OrdersPage /></SuspenseWrapper> },
          { path: '/dashboard/customers',  element: <SuspenseWrapper loaderVariant="dark"><CustomersPage /></SuspenseWrapper> },
          { path: '/dashboard/team',       element: <SuspenseWrapper loaderVariant="dark"><TeamPage /></SuspenseWrapper> },
          { path: '/dashboard/settings',   element: <SuspenseWrapper loaderVariant="dark"><SettingsPage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // ── Named storefront URLs (`/store/:storeSlug`) ───────────────────────────
  {
    path: '/store/:storeSlug',
    element: <StoreLayout />,
    children: storefrontChildRoutes,
  },

  // ── Catch-all ──────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
