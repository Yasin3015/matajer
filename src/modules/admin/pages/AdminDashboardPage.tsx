import React from 'react';
import { Store, Users, ShoppingBag, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/shared/ui/Card';
import { useVendors } from '@/modules/admin/hooks/useVendors';
import { Badge } from '@/shared/ui/Badge';
import { ROUTES } from '@/core/constants';
import { Spinner } from '@/shared/ui/Feedback';
import { statusBadge } from '@/shared/ui/Badge';

const AdminDashboardPage: React.FC = () => {
  const { data: vendors, isLoading } = useVendors();

  const activeCount  = vendors?.filter((v) => v.is_active).length ?? 0;
  const pendingCount = vendors?.filter((v) => !v.is_active).length ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Platform Overview</h1>
        <p className="text-textSecondary text-sm mt-1">Monitor all vendors and activity across the platform.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Vendors"  value={vendors?.length ?? 0}  icon={<Store size={22} />}       color="primary"  />
        <StatCard title="Active Stores"  value={activeCount}            icon={<TrendingUp size={22} />}  color="success"  />
        <StatCard title="Pending"        value={pendingCount}           icon={<ShoppingBag size={22} />} color="warning"  />
        <StatCard title="Admins"         value="—"                      icon={<Users size={22} />}       color="primary"  />
      </div>

      {/* Vendors table card */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-textPrimary">Recent Vendors</h2>
          <Link to={ROUTES.ADMIN_STORES} className="text-xs text-primary hover:text-primaryHover font-semibold transition-colors">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="divide-y divide-border/50">
            {vendors?.slice(0, 8).map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between px-6 py-4 hover:bg-primaryLight transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primaryLight flex items-center justify-center">
                    <Store size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-textPrimary text-sm">{vendor.name}</p>
                    <p className="text-xs text-textSecondary">/{vendor.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={vendor.is_active ? 'green' : 'slate'}>
                    {vendor.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Link
                    to={ROUTES.store(vendor.slug)}
                    className="text-textSecondary hover:text-primary transition-colors"
                    title="Visit storefront"
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            ))}
            {(!vendors || vendors.length === 0) && (
              <p className="text-textSecondary text-sm text-center py-8">No vendors found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
