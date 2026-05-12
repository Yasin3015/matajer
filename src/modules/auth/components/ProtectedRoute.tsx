import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/hooks/useAuthStore';
import { ROUTES } from '@/core/constants';

interface ProtectedRouteProps {
  // Real API roles: 'platform_admin' | 'admin'
  // Legacy store roles: 'STORE_ADMIN' | 'STORE_MANAGER'
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, admin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && admin) {
    // Normalize: API returns 'platform_admin', router uses 'PLATFORM_ADMIN'
    const roleNormalized = admin.role?.toLowerCase() ?? '';
    const allowed = allowedRoles.some(
      (r) => r.toLowerCase() === roleNormalized
    );
    if (!allowed) {
      // If they're a platform admin, send to admin; otherwise dashboard
      const isAdmin = roleNormalized === 'platform_admin' || roleNormalized === 'admin';
      return <Navigate to={isAdmin ? ROUTES.ADMIN : ROUTES.DASHBOARD} replace />;
    }
  }

  return <Outlet />;
};
