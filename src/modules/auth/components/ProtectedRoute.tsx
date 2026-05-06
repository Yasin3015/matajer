import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/hooks/useAuthStore';
import { ROUTES } from '@/core/constants';
import { Role } from '@/core/types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate area based on actual role
    if (user.role === 'PLATFORM_ADMIN') return <Navigate to={ROUTES.ADMIN} replace />;
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
