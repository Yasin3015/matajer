import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Plus,
  Settings,
  Tag,
  ExternalLink,
  LayoutGrid,
} from 'lucide-react';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { useOrders } from '@/modules/orders/hooks/useOrders';
import { useVendorProducts } from '@/modules/store/hooks/useVendorProducts';
import { ROUTES } from '@/core/constants';

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);

const formatRelativeTime = (dateStr?: string) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString();
};

const getInitials = (name?: string) =>
  (name ?? 'U')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

/* ─────────────────────────────────────────────────────────────────────────────
   Status Badge
───────────────────────────────────────────────────────────────────────────── */

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#FFF7ED', color: '#C2410C', label: 'Pending' },
  confirmed: { bg: '#EFF6FF', color: '#0051D5', label: 'Confirmed' },
  shipped:   { bg: '#EFF6FF', color: '#0051D5', label: 'Shipped' },
  delivered: { bg: '#DCFCE7', color: '#006947', label: 'Delivered' },
  cancelled: { bg: '#FEF2F2', color: '#BA1A1A', label: 'Cancelled' },
};

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const style = STATUS_STYLES[status] ?? { bg: '#F1F5F9', color: '#64748B', label: status };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   KPI Card
───────────────────────────────────────────────────────────────────────────── */

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  subtitle?: string;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, badge, subtitle, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-[20px] border border-[#E5E7EB] p-5 flex flex-col gap-3 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-[#0051D5]/20' : ''}`}
    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
  >
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#0051D5]">
        {icon}
      </div>
      {badge}
    </div>
    <div>
      <p className="text-sm text-[#424754] font-medium">{title}</p>
      <p className="text-2xl font-bold text-[#191C1E] mt-0.5 leading-tight">{value}</p>
      {subtitle && <p className="text-xs text-[#424754] mt-1">{subtitle}</p>}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────────────────────────────────────────── */

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-6 py-4 border-b border-[#F1F5F9] animate-pulse">
    <div className="w-16 h-4 bg-slate-100 rounded" />
    <div className="flex items-center gap-2 flex-1">
      <div className="w-8 h-8 rounded-full bg-slate-100" />
      <div className="w-24 h-4 bg-slate-100 rounded" />
    </div>
    <div className="w-20 h-6 bg-slate-100 rounded-full" />
    <div className="w-16 h-4 bg-slate-100 rounded" />
    <div className="w-14 h-4 bg-slate-100 rounded" />
  </div>
);

const SkeletonKpi = () => (
  <div
    className="bg-white rounded-[20px] border border-[#E5E7EB] p-5 animate-pulse"
    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl bg-slate-100" />
      <div className="w-14 h-5 bg-slate-100 rounded" />
    </div>
    <div className="w-20 h-4 bg-slate-100 rounded mb-2" />
    <div className="w-28 h-7 bg-slate-100 rounded" />
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */

const StoreDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeSlug, vendorUser } = useVendorAuthStore();
  const slug = storeSlug || '';

  const { data: orders = [], isLoading: ordersLoading } = useOrders(slug);
  const { data: products = [], isLoading: productsLoading } = useVendorProducts(slug);

  /* ── Derived metrics from real data ── */
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + (o.total ?? 0), 0), [orders]);

  // Current month revenue
  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    return orders
      .filter((o) => {
        if (!o.created_at) return false;
        const d = new Date(o.created_at);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, o) => sum + (o.total ?? 0), 0);
  }, [orders]);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'pending' || o.status === 'confirmed'),
    [orders]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
        .slice(0, 6),
    [orders]
  );

  // Top products: sort by stock descending (highest = most available = likely best sellers)
  const topProducts = useMemo(
    () =>
      [...products]
        .filter((p) => p.is_active !== false)
        .sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0))
        .slice(0, 5),
    [products]
  );

  const storeName =
    vendorUser?.name
      ? vendorUser.name
      : slug
      ? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Your Store';

  const isLoading = ordersLoading || productsLoading;

  /* ── Quick Actions ── */
  const quickActions = [
    { label: 'Add Product', icon: <Plus size={16} />, route: '/dashboard/products/new', color: '#0051D5' },
    { label: 'View Orders', icon: <ShoppingCart size={16} />, route: ROUTES.DASHBOARD_ORDERS, color: '#006947' },
    { label: 'Manage Categories', icon: <Tag size={16} />, route: ROUTES.DASHBOARD_CATEGORIES, color: '#7C3AED' },
    { label: 'Store Settings', icon: <Settings size={16} />, route: ROUTES.DASHBOARD_SETTINGS, color: '#B45309' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* ── Section 1: Welcome Hero ─────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: 'linear-gradient(135deg, #0051D5 0%, #316BF3 100%)' }}
      >
        {/* Decorative shape */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-8 opacity-20"
          aria-hidden="true"
        >
          <div className="w-64 h-64 rounded-full border-[40px] border-white/30 translate-x-16 -translate-y-8" />
          <div className="absolute w-40 h-40 rounded-full border-[28px] border-white/20 right-8 bottom-4" />
        </div>

        <div className="relative z-10 max-w-xl">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">
            Vendor Dashboard
          </p>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Welcome back, {storeName}
          </h1>
          <p className="text-white/75 mt-2 text-sm leading-relaxed">
            Track your store performance, orders, products, and revenue in one place.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD_PRODUCTS)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0051D5] font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              <Package size={16} />
              Manage Products
            </button>
            <button
              onClick={() => navigate(ROUTES.DASHBOARD_ORDERS)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-sm border border-white/30 hover:bg-white/25 transition-colors"
            >
              <LayoutGrid size={16} />
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 2: KPI Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <SkeletonKpi /><SkeletonKpi /><SkeletonKpi /><SkeletonKpi />
          </>
        ) : (
          <>
            <KpiCard
              title="Total Products"
              value={products.length}
              icon={<Package size={20} />}
              badge={
                products.length > 0 ? (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-[#006947]">
                    <ArrowUpRight size={14} />
                    {products.filter(p => p.is_active !== false).length} active
                  </span>
                ) : undefined
              }
              subtitle="Total listed products"
              onClick={() => navigate(ROUTES.DASHBOARD_PRODUCTS)}
            />

            <KpiCard
              title="Total Orders"
              value={orders.length}
              icon={<ShoppingCart size={20} />}
              badge={
                orders.length > 0 ? (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-[#006947]">
                    <ArrowUpRight size={14} />
                    All time
                  </span>
                ) : undefined
              }
              subtitle="Cumulative store orders"
              onClick={() => navigate(ROUTES.DASHBOARD_ORDERS)}
            />

            <KpiCard
              title="Pending Orders"
              value={pendingOrders.length}
              icon={<AlertCircle size={20} />}
              badge={
                pendingOrders.length > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#BA1A1A]">
                    <ArrowDownRight size={14} />
                    Action Required
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[#006947]">All clear</span>
                )
              }
              subtitle={pendingOrders.length > 0 ? 'Need your attention' : 'No pending orders'}
              onClick={() => navigate(ROUTES.DASHBOARD_ORDERS)}
            />

            <KpiCard
              title="Monthly Revenue"
              value={monthlyRevenue > 0 ? formatCurrency(monthlyRevenue) : formatCurrency(totalRevenue)}
              icon={<DollarSign size={20} />}
              badge={
                totalRevenue > 0 ? (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-[#006947]">
                    <ArrowUpRight size={14} />
                    {monthlyRevenue > 0 ? 'This month' : 'All time'}
                  </span>
                ) : undefined
              }
              subtitle={monthlyRevenue > 0 ? `Total all-time: ${formatCurrency(totalRevenue)}` : 'No revenue recorded yet'}
            />
          </>
        )}
      </div>

      {/* ── Sections 3 + 4 + 5: Two-column layout ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Recent Orders ─────────────────────────────── */}
        <div className="lg:col-span-2">
          <div
            className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-base font-bold text-[#191C1E]">Recent Orders</h2>
                <p className="text-xs text-[#424754] mt-0.5">Review your latest sales activity</p>
              </div>
              <button
                onClick={() => navigate(ROUTES.DASHBOARD_ORDERS)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#0051D5] hover:text-[#316BF3] transition-colors"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            {/* Table Header */}
            {!ordersLoading && recentOrders.length > 0 && (
              <div className="grid grid-cols-[1fr_1.5fr_1fr_0.8fr_0.8fr] gap-2 px-6 py-3 bg-[#F8FAFC] border-b border-[#F1F5F9]">
                {['ORDER ID', 'CUSTOMER', 'STATUS', 'AMOUNT', 'DATE'].map((h) => (
                  <span key={h} className="text-[10px] font-bold text-[#424754] tracking-wider uppercase">{h}</span>
                ))}
              </div>
            )}

            {/* Table Rows */}
            {ordersLoading ? (
              <>
                <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
              </>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-4">
                  <ShoppingCart size={24} className="text-[#0051D5]" />
                </div>
                <p className="text-[#191C1E] font-semibold text-sm">No orders yet</p>
                <p className="text-[#424754] text-xs mt-1 text-center max-w-xs">
                  Your orders will appear here once customers start placing them.
                </p>
              </div>
            ) : (
              <div>
                {recentOrders.map((order, i) => (
                  <div
                    key={order.id}
                    onClick={() => navigate(ROUTES.DASHBOARD_ORDERS)}
                    className="grid grid-cols-[1fr_1.5fr_1fr_0.8fr_0.8fr] gap-2 items-center px-6 py-4 cursor-pointer transition-colors hover:bg-[#EFF6FF] border-b border-[#F1F5F9] last:border-b-0"
                  >
                    {/* Order ID */}
                    <span className="text-sm font-bold text-[#0051D5] truncate">
                      {order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(0, 6).toUpperCase()}`}
                    </span>

                    {/* Customer */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#0051D5] flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {getInitials(order.customerName)}
                      </div>
                      <span className="text-sm text-[#191C1E] truncate font-medium">{order.customerName ?? 'Customer'}</span>
                    </div>

                    {/* Status */}
                    <div><OrderStatusBadge status={order.status} /></div>

                    {/* Amount */}
                    <span className="text-sm font-bold text-[#191C1E]">{formatCurrency(order.total)}</span>

                    {/* Date */}
                    <span className="text-xs text-[#424754]">{formatRelativeTime(order.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Top Products + Quick Actions ─────────────── */}
        <div className="flex flex-col gap-6">

          {/* Top Products */}
          <div
            className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-sm font-bold text-[#191C1E]">Top Products</h2>
                <p className="text-xs text-[#424754] mt-0.5">Best performing items</p>
              </div>
              <button
                onClick={() => navigate(ROUTES.DASHBOARD_PRODUCTS)}
                className="text-xs font-semibold text-[#0051D5] hover:text-[#316BF3] flex items-center gap-1 transition-colors"
              >
                View All <ExternalLink size={12} />
              </button>
            </div>

            {productsLoading ? (
              <div className="p-5 space-y-4">
                {[1, 2, 3, 4].map((k) => (
                  <div key={k} className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                    <div className="h-4 bg-slate-100 rounded w-12" />
                  </div>
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-5">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                  <Package size={20} className="text-[#0051D5]" />
                </div>
                <p className="text-[#191C1E] font-semibold text-xs">No products listed</p>
                <button
                  onClick={() => navigate('/dashboard/products/new')}
                  className="mt-3 text-xs font-semibold text-[#0051D5] hover:text-[#316BF3] transition-colors"
                >
                  + Add your first product
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {topProducts.map((product, idx) => {
                  const imageUrl =
                    product.images?.[0]?.url ||
                    (typeof product.image === 'string' ? product.image : null) ||
                    null;
                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/dashboard/products/${product.id}`)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                    >
                      {/* Rank */}
                      <span className="text-[10px] font-bold text-[#424754] w-4 text-center">{idx + 1}</span>

                      {/* Image */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F1F5F9] flex-shrink-0 border border-[#E5E7EB]">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Package size={18} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#191C1E] truncate group-hover:text-[#0051D5] transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#424754] mt-0.5">
                          {product.stock != null ? `${product.stock} in stock` : 'Stock N/A'}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[#191C1E]">
                          {formatCurrency(Number(product.price))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div
            className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          >
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-sm font-bold text-[#191C1E]">Quick Actions</h2>
              <p className="text-xs text-[#424754] mt-0.5">Shortcuts to common tasks</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.route)}
                  className="flex flex-col items-start gap-2 p-3 rounded-xl border border-[#E5E7EB] hover:border-transparent transition-all duration-200 hover:shadow-md text-left group"
                  style={{ '--hover-color': action.color } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = action.color + '0D';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = action.color + '33';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: action.color + '1A', color: action.color }}
                  >
                    {action.icon}
                  </div>
                  <span className="text-xs font-semibold text-[#191C1E] leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default StoreDashboardPage;
