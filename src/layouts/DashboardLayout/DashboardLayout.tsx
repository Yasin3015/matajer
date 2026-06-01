import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Shield, Settings, LogOut, Menu,
  ChevronDown, Store, Tag,
} from 'lucide-react';
import { ROUTES } from '@/core/constants';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { useUIStore } from '@/shared/hooks/useUIStore';
import { ROLES } from '@/core/config';
import { NotificationsPanel } from '@/shared/components/NotificationsPanel';
import clsx from 'clsx';

const navItems = [
  { to: ROUTES.DASHBOARD, icon: <LayoutDashboard size={18} />, label: 'Overview', end: true, minRole: 'any' },
  { to: ROUTES.DASHBOARD_PRODUCTS, icon: <Package size={18} />, label: 'Products', minRole: 'any' },
  { to: ROUTES.DASHBOARD_CATEGORIES, icon: <Tag size={18} />, label: 'Categories', minRole: 'any' },
  { to: ROUTES.DASHBOARD_ORDERS, icon: <ShoppingCart size={18} />, label: 'Orders', minRole: 'any' },
  { to: ROUTES.DASHBOARD_CUSTOMERS, icon: <Users size={18} />, label: 'Customers', minRole: 'any' },
  { to: ROUTES.DASHBOARD_TEAM, icon: <Shield size={18} />, label: 'Team', minRole: ROLES.STORE_ADMIN },
  { to: ROUTES.DASHBOARD_SETTINGS, icon: <Settings size={18} />, label: 'Settings', minRole: ROLES.STORE_ADMIN },
];

export const DashboardLayout: React.FC = () => {
  const { vendorUser, storeSlug, logout } = useVendorAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const visibleItems = navItems.filter((item) => {
    if (item.minRole === 'any') return true;
    const r = (vendorUser as any)?.role?.toLowerCase() ?? '';
    return r === 'platform_admin' || r === 'admin' || r === item.minRole?.toLowerCase() || !r;
  });

  const handleLogout = () => {
    logout();
    navigate(ROUTES.VENDOR_LOGIN);
  };

  return (
    <div className="flex h-screen bg-appBg overflow-hidden">
      {/* Sidebar */}
      <aside
        className={clsx(
          'flex flex-col bg-white border-r border-border transition-all duration-300 z-20 flex-shrink-0',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primaryHover flex items-center justify-center flex-shrink-0 shadow-sm">
            <Store size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in overflow-hidden">
              <p className="font-bold text-textPrimary text-sm leading-tight capitalize">
                {(storeSlug || 'Vendor').replace('-', ' ')}
              </p>
              <p className="text-[10px] text-primary font-semibold">Store Dashboard</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx('sidebar-link', isActive && 'active', !sidebarOpen && 'justify-center px-2 border-l-0 rounded-xl')
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="animate-fade-in">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Store preview link */}
        {sidebarOpen && (
          <div className="px-3 pb-2">
            <NavLink
              to={ROUTES.store(storeSlug ?? '')}
              className="flex items-center gap-2 text-xs text-textSecondary hover:text-primary px-3 py-2 rounded-xl hover:bg-primaryLight transition-colors"
            >
              <Store size={14} />
              View Storefront ↗
            </NavLink>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className={clsx(
              'sidebar-link w-full text-danger hover:text-danger hover:bg-dangerLight border-l-0 rounded-xl',
              !sidebarOpen && 'justify-center px-2'
            )}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="text-textSecondary hover:text-textPrimary hover:bg-gray-100 p-2 rounded-xl transition-colors"
            >
              <Menu size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsPanel />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-xl transition-colors">
              <div className="w-7 h-7 rounded-full bg-primaryLight flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-xs font-bold uppercase">
                  {vendorUser?.name?.charAt(0) ?? 'V'}
                </span>
              </div>
              {sidebarOpen && (
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-textPrimary leading-tight">{vendorUser?.name ?? 'Manager'}</p>
                  <p className="text-[10px] text-textSecondary capitalize">{storeSlug}</p>
                </div>
              )}
              <ChevronDown size={14} className="text-textSecondary" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
