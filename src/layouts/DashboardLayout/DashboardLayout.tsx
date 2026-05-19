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

  const visibleItems = navItems.filter(
    (item) => {
      if (item.minRole === 'any') return true;
      const r = (vendorUser as any)?.role?.toLowerCase() ?? '';
      return r === 'platform_admin' || r === 'admin' || r === item.minRole?.toLowerCase() || !r;
    }
  );

  const handleLogout = () => {
    logout();
    navigate(ROUTES.VENDOR_LOGIN);
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <aside
        className={clsx(
          'flex flex-col bg-surface-card border-r border-surface-border transition-all duration-300 z-20 flex-shrink-0',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
            <Store size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in overflow-hidden">
              <p className="font-bold text-white text-sm leading-tight capitalize">{(storeSlug || 'Vendor').replace('-', ' ')}</p>
              <p className="text-[10px] text-brand-400 font-medium">Store Dashboard</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => clsx('sidebar-link', isActive && 'active', !sidebarOpen && 'justify-center px-2')}
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
              to={ROUTES.store(storeSlug)}
              className="flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <Store size={14} />
              View Storefront ↗
            </NavLink>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-surface-border">
          <button
            onClick={handleLogout}
            className={clsx('sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/20', !sidebarOpen && 'justify-center px-2')}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-surface-card border-b border-surface-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="text-slate-400 hover:text-white hover:bg-surface-hover p-2 rounded-lg transition-colors">
              <Menu size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <NotificationsPanel />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors">
              <div className="w-7 h-7 rounded-full bg-brand-600/40 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-300 text-xs font-bold uppercase">
                  {vendorUser?.name?.charAt(0) ?? 'V'}
                </span>
              </div>
              {sidebarOpen && (
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-white leading-tight">{vendorUser?.name ?? 'Manager'}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{storeSlug}</p>
                </div>
              )}
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
