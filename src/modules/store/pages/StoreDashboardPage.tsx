import React from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { StatCard } from '@/shared/ui/Card';
import { useAuthStore } from '@/modules/auth/hooks/useAuthStore';
import { useOrders } from '@/modules/orders/hooks/useOrders';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { useCustomers } from '@/modules/customers/hooks/useCustomers';
import { Badge } from '@/shared/ui/Badge';
import { statusBadge } from '@/shared/ui/Badge';

const StoreDashboardPage: React.FC = () => {
  const { admin } = useAuthStore();
  const slug = 'demo-store'; // admin does not have storeSlug

  const { data: orders = [] } = useOrders(slug);
  const { data: products = [] } = useProducts(slug);
  const { data: customers = [] } = useCustomers(slug);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white capitalize">
          {slug.replace('-', ' ')} Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Store overview and recent activity.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Revenue" value={`$${revenue.toFixed(2)}`} icon={<TrendingUp size={22} />} color="green" change="+5.2% this week" changeType="positive" />
        <StatCard title="Products" value={products.length} icon={<Package size={22} />} color="brand" />
        <StatCard title="Orders" value={orders.length} icon={<ShoppingCart size={22} />} color="yellow" />
        <StatCard title="Customers" value={customers.length} icon={<Users size={22} />} color="brand" />
      </div>

      {/* Recent Orders */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-border">
          <h2 className="font-semibold text-white">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-center text-slate-500 py-8 text-sm">No orders yet.</p>
        ) : (
          <div className="divide-y divide-surface-border/50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-3 hover:bg-surface-hover/30 transition-colors">
                <div>
                  <p className="font-medium text-white text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-sm text-white">${order.total.toFixed(2)}</span>
                  <Badge variant={statusBadge(order.status)}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDashboardPage;
