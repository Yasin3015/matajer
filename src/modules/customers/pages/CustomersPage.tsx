import React from 'react';
import { useAuthStore } from '@/modules/auth/hooks/useAuthStore';
import { useCustomers } from '../hooks/useCustomers';
import { Table, Column } from '@/shared/components/Table';
import { Customer } from '@/core/types';

const CustomersPage: React.FC = () => {
  const { admin } = useAuthStore();
  const slug = 'Yallamatgar'; // Placeholder for now
  const { data: customers = [], isLoading } = useCustomers(slug);

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600/30 to-brand-800/20 flex items-center justify-center">
            <span className="text-brand-300 font-semibold text-xs">{c.name[0]}</span>
          </div>
          <div>
            <p className="font-medium text-white text-sm">{c.name}</p>
            <p className="text-xs text-slate-500">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (c) => <span className="text-slate-400 text-sm">{c.phone ?? '—'}</span> },
    { key: 'totalOrders', header: 'Orders', sortable: true, render: (c) => <span className="font-medium text-white">{c.totalOrders}</span> },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      render: (c) => <span className="font-semibold text-green-400">${c.totalSpent.toFixed(2)}</span>,
    },
    {
      key: 'createdAt',
      header: 'Customer Since',
      sortable: true,
      render: (c) => <span className="text-slate-400 text-sm">{new Date(c.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-slate-400 text-sm mt-1">{customers.length} customers in your store.</p>
      </div>
      <Table data={customers} columns={columns} loading={isLoading} emptyMessage="No customers yet." />
    </div>
  );
};

export default CustomersPage;
