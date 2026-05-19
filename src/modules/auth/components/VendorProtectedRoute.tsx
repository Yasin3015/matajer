import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { ROUTES } from '@/core/constants';

interface VendorProtectedRouteProps {
  allowedRoles?: string[];
}

export const VendorProtectedRoute: React.FC<VendorProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, vendorUser } = useVendorAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.VENDOR_LOGIN} replace />;
  }

  if (allowedRoles && vendorUser) {
    // Basic role check if needed, but usually vendors just need to be authenticated
    const roleNormalized = 'vendor_admin'; // Adjust if vendor sub-users have different roles
    const allowed = allowedRoles.some(
      (r) => r.toLowerCase() === roleNormalized
    );
    if (!allowed) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  return <Outlet />;
};
