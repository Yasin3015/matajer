import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, Users, Settings, LogOut, Menu, Bell, ChevronDown, CreditCard } from 'lucide-react';
import { ROUTES } from '@/core/constants';
import { useAuthStore } from '@/modules/auth/hooks/useAuthStore';
import { useUIStore } from '@/shared/hooks/useUIStore';
import clsx from 'clsx';

const navItems = [
  { to: ROUTES.ADMIN, icon: <LayoutDashboard size={18} />, label: 'Overview', end: true },
  { to: ROUTES.ADMIN_STORES, icon: <Store size={18} />, label: 'Stores' },
  { to: ROUTES.ADMIN_USERS, icon: <Users size={18} />, label: 'Users' },
  { to: ROUTES.ADMIN_PLANS, icon: <CreditCard size={18} />, label: 'Plans' },
  { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
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
              <p className="font-bold text-white text-sm leading-tight">Matajer</p>
              <p className="text-[10px] text-brand-400 font-medium uppercase tracking-wider">Platform Admin</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
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

        {/* User */}
        <div className="p-3 border-t border-surface-border">
          <button
            onClick={handleLogout}
            className={clsx('sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/20', !sidebarOpen && 'justify-center px-2')}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-surface-card border-b border-surface-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="text-slate-400 hover:text-white hover:bg-surface-hover p-2 rounded-lg transition-colors"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-sm font-medium text-slate-300">Platform Administration</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-slate-400 hover:text-white hover:bg-surface-hover p-2 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors">
              <div className="w-7 h-7 rounded-full bg-brand-600/40 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-300 text-xs font-bold uppercase">
                  {admin?.name?.charAt(0) ?? 'A'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white leading-tight">{admin?.name ?? 'Admin'}</p>
                <p className="text-[10px] text-slate-500">{admin?.role?.replace('_', ' ') ?? 'Platform Admin'}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
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
