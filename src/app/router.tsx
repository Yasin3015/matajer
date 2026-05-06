import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout/DashboardLayout';
import { StoreLayout } from '@/layouts/StoreLayout/StoreLayout';
import { Spinner } from '@/shared/ui/Feedback';

// ── Lazy imports ─────────────────────────────────────────────────────────────
const PlatformLandingPage      = lazy(() => import('@/modules/store/pages/PlatformLandingPage'));
const LoginPage                = lazy(() => import('@/modules/auth/pages/LoginPage'));

// Admin
const AdminDashboardPage       = lazy(() => import('@/modules/admin/pages/AdminDashboardPage'));
const StoresPage               = lazy(() => import('@/modules/admin/pages/StoresPage'));
const UsersPage                = lazy(() => import('@/modules/admin/pages/UsersPage'));

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

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <Spinner size="lg" />
  </div>
);

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const router = createBrowserRouter([
  // ── Platform landing ───────────────────────────────────────────────────────
  {
    path: '/',
    element: <SuspenseWrapper><PlatformLandingPage /></SuspenseWrapper>,
  },
  {
    path: '/login',
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },

  // ── Platform Admin ─────────────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin',        element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper> },
          { path: '/admin/stores', element: <SuspenseWrapper><StoresPage /></SuspenseWrapper> },
          { path: '/admin/users',  element: <SuspenseWrapper><UsersPage /></SuspenseWrapper> },
          { path: '/admin/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
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
          { path: '/dashboard',            element: <SuspenseWrapper><StoreDashboardPage /></SuspenseWrapper> },
          { path: '/dashboard/products',   element: <SuspenseWrapper><ProductsPage /></SuspenseWrapper> },
          { path: '/dashboard/orders',     element: <SuspenseWrapper><OrdersPage /></SuspenseWrapper> },
          { path: '/dashboard/customers',  element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> },
          { path: '/dashboard/team',       element: <SuspenseWrapper><TeamPage /></SuspenseWrapper> },
          { path: '/dashboard/settings',   element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // ── Public Storefront ──────────────────────────────────────────────────────
  {
    path: '/store/:storeSlug',
    element: <StoreLayout />,
    children: [
      { index: true,                               element: <SuspenseWrapper><StoreHomePage /></SuspenseWrapper> },
      { path: 'products',                          element: <SuspenseWrapper><StorefrontProductsPage /></SuspenseWrapper> },
      { path: 'products/:productId',               element: <SuspenseWrapper><StorefrontProductDetail /></SuspenseWrapper> },
      { path: 'cart',                              element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
      { path: 'checkout',                          element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper> },
    ],
  },

  // ── Catch-all ──────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
