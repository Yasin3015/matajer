import React from 'react';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { useOrders } from '../hooks/useOrders';
import { Table, Column } from '@/shared/components/Table';
import { Order } from '@/core/types';
import { Badge } from '@/shared/ui/Badge';
import { statusBadge } from '@/shared/ui/Badge';

const OrdersPage: React.FC = () => {
  const { storeSlug } = useVendorAuthStore();
  const slug = storeSlug || 'Yallamatgar';
  const { data: orders = [], isLoading } = useOrders(slug);

  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Order #', sortable: true, render: (o) => <span className="font-mono font-medium text-white">{o.orderNumber}</span> },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (o) => (
        <div>
          <p className="text-white text-sm font-medium">{o.customerName}</p>
          <p className="text-xs text-slate-500">{o.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (o) => <span className="text-slate-400 text-sm">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>,
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (o) => <span className="font-semibold text-green-400">${o.total.toFixed(2)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (o) => <Badge variant={statusBadge(o.status)}>{o.status}</Badge>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (o) => <span className="text-slate-400 text-sm">{new Date(o.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 text-sm mt-1">{orders.length} orders in your store.</p>
      </div>
      <Table data={orders} columns={columns} loading={isLoading} emptyMessage="No orders yet." />
    </div>
  );
};

export default OrdersPage;
