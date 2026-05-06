import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Search } from 'lucide-react';
import { useStores } from '../hooks/useStores';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/components/Modal';
import { Table, Column } from '@/shared/components/Table';
import { Store } from '@/core/types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { statusBadge } from '@/shared/ui/Badge';
import toast from 'react-hot-toast';

const StoresPage: React.FC = () => {
  const { data: stores = [], isLoading } = useStores();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Store>[] = [
    {
      key: 'name',
      header: 'Store',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600/20 to-brand-800/10 flex items-center justify-center">
            <span className="text-brand-400 font-bold text-xs uppercase">{s.name[0]}</span>
          </div>
          <div>
            <p className="font-medium text-white text-sm">{s.name}</p>
            <p className="text-xs text-slate-500">/{s.slug}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortable: true },
    {
      key: 'status',
      header: 'Status',
      render: (s) => <Badge variant={statusBadge(s.status)}>{s.status}</Badge>,
    },
    {
      key: 'revenue',
      header: 'Revenue',
      sortable: true,
      render: (s) => <span className="font-medium text-green-400">${s.revenue.toLocaleString()}</span>,
    },
    { key: 'orderCount', header: 'Orders', sortable: true, render: (s) => s.orderCount.toString() },
    { key: 'productCount', header: 'Products', sortable: true, render: (s) => s.productCount.toString() },
    {
      key: 'actions',
      header: '',
      render: (s) => (
        <div className="flex items-center gap-2">
          <Link to={ROUTES.store(s.slug)} className="p-1.5 text-slate-400 hover:text-brand-400 transition-colors" title="Visit storefront">
            <ExternalLink size={15} />
          </Link>
          <button
            onClick={() => { toast.success(`Store "${s.name}" deleted (mock).`); }}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            title="Delete store"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stores</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all platform stores.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          New Store
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      <Table data={filtered} columns={columns} loading={isLoading} emptyMessage="No stores found." />

      {/* Add Store Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Store"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Store created (mock)!'); setAddOpen(false); }}>
              Create Store
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Store Name" placeholder="My Awesome Store" />
          <Input label="Store Slug" placeholder="my-awesome-store" hint="Used in the store URL" />
          <Input label="Category" placeholder="Electronics, Fashion, etc." />
        </div>
      </Modal>
    </div>
  );
};

export default StoresPage;
