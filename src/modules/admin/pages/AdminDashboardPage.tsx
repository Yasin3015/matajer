import React from 'react';
import { Store, Users, ShoppingCart, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/shared/ui/Card';
import { useStores } from '../hooks/useStores';
import { Badge } from '@/shared/ui/Badge';
import { ROUTES } from '@/core/constants';
import { Spinner } from '@/shared/ui/Feedback';

const AdminDashboardPage: React.FC = () => {
  const { data: stores, isLoading } = useStores();

  const totalRevenue = stores?.reduce((sum, s) => sum + s.revenue, 0) ?? 0;
  const totalOrders = stores?.reduce((sum, s) => sum + s.orderCount, 0) ?? 0;
  const totalProducts = stores?.reduce((sum, s) => sum + s.productCount, 0) ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor all stores and activity across the platform.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Stores" value={stores?.length ?? 0} icon={<Store size={22} />} color="brand" change="+1 this month" changeType="positive" />
        <StatCard title="Platform Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<TrendingUp size={22} />} color="green" change="+12.4% vs last month" changeType="positive" />
        <StatCard title="Total Orders" value={totalOrders.toLocaleString()} icon={<ShoppingCart size={22} />} color="yellow" change="+8.2% vs last month" changeType="positive" />
        <StatCard title="Total Products" value={totalProducts.toLocaleString()} icon={<Users size={22} />} color="brand" />
      </div>

      {/* Stores Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <h2 className="font-semibold text-white">Active Stores</h2>
          <Link to={ROUTES.ADMIN_STORES} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="divide-y divide-surface-border/50">
            {stores?.map((store) => (
              <div key={store.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-hover/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/20 to-brand-800/10 flex items-center justify-center">
                    <Store size={18} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{store.name}</p>
                    <p className="text-xs text-slate-500">/{store.slug} · {store.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-white">${store.revenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{store.orderCount} orders</p>
                  </div>
                  <Badge variant={store.status === 'active' ? 'green' : 'yellow'}>
                    {store.status}
                  </Badge>
                  <Link
                    to={ROUTES.store(store.slug)}
                    className="text-slate-400 hover:text-brand-400 transition-colors"
                    title="Visit storefront"
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
