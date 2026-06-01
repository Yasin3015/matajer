import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Search, Pencil, Eye } from 'lucide-react';
import { useVendors, useDeleteVendor, useStoreVendor, useUpdateVendor } from '../hooks/useVendors';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/components/Modal';
import { Table, Column } from '@/shared/components/Table';
import { Vendor } from '@/core/types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { useForm } from 'react-hook-form';

interface VendorForm {
  owner_name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  phone?: string;
  vendor_name: string;
  slug: string;
  custom_domain: string;
}

const StoresPage: React.FC = () => {
  const { data: vendors = [], isLoading } = useVendors();
  const deleteVendor = useDeleteVendor();
  const storeVendor = useStoreVendor();
  const updateVendor = useUpdateVendor();

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Vendor | null>(null);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm<VendorForm>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<VendorForm>();

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const onAddSubmit = async (data: VendorForm) => {
    await storeVendor.mutateAsync(data as any);
    resetAdd();
    setAddOpen(false);
  };

  const onEditSubmit = async (data: VendorForm) => {
    if (!editVendor) return;
    await updateVendor.mutateAsync({ id: editVendor.id, payload: data as any });
    setEditVendor(null);
  };

  const openEdit = (v: Vendor) => {
    resetEdit({
      vendor_name: v.name,
      slug: v.slug,
      custom_domain: v.custom_domain || '',
      owner_name: v.owner?.name || '',
      email: v.owner?.email || '',
      phone: v.owner?.phone || '',
    });
    setEditVendor(v);
  };

  const columns: Column<Vendor>[] = [
    {
      key: 'name',
      header: 'Vendor',
      sortable: true,
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primaryLight flex items-center justify-center">
            <span className="text-primary font-bold text-xs uppercase">{v.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-textPrimary text-sm">{v.name}</p>
            <p className="text-xs text-textSecondary">/{v.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (v) => (
        <div>
          <p className="text-sm text-textPrimary">{v.owner?.name ?? '—'}</p>
          <p className="text-xs text-textSecondary">{v.owner?.email}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (v) => (
        <Badge variant={v.is_active ? 'green' : 'slate'}>
          {v.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'start_at',
      header: 'Started',
      sortable: true,
      render: (v) => (
        <span className="text-textSecondary text-sm">
          {v.start_at ? new Date(v.start_at).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'actions' as keyof Vendor,
      header: '',
      render: (v) => (
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.store(v.slug)}
            className="p-1.5 text-textSecondary hover:text-primary transition-colors"
            title="Visit storefront"
          >
            <ExternalLink size={15} />
          </Link>
          <button
            onClick={() => setViewVendor(v)}
            className="p-1.5 text-textSecondary hover:text-success transition-colors"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => openEdit(v)}
            className="p-1.5 text-textSecondary hover:text-primary transition-colors"
            title="Edit vendor"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(v)}
            className="p-1.5 text-textSecondary hover:text-danger transition-colors"
            title="Delete vendor"
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
          <h1 className="text-2xl font-bold text-textPrimary">Stores</h1>
          <p className="text-textSecondary text-sm mt-1">Manage all platform vendors.</p>
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

      {/* Add Vendor Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); resetAdd(); }}
        title="Add New Store"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setAddOpen(false); resetAdd(); }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAdd(onAddSubmit)}
              loading={storeVendor.isPending}
            >
              Create Store
            </Button>
          </>
        }
      >
        <form className="max-h-[70vh] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmitAdd(onAddSubmit)}>
          <Input
            label="Vendor / Store Name"
            placeholder="My Awesome Store"
            {...registerAdd('vendor_name', { required: true })}
            error={errorsAdd.vendor_name ? 'Store name is required' : undefined}
          />
          <Input
            label="Store Slug"
            placeholder="my-awesome-store"
            {...registerAdd('slug', { required: true })}
            error={errorsAdd.slug ? 'Slug is required' : undefined}
          />
          <Input
            label="Owner Name"
            placeholder="John Doe"
            {...registerAdd('owner_name', { required: true })}
            error={errorsAdd.owner_name ? 'Owner name is required' : undefined}
          />
          <Input
            label="Email"
            type="email"
            placeholder="owner@store.com"
            {...registerAdd('email', { required: true })}
            error={errorsAdd.email ? 'Email is required' : undefined}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...registerAdd('password', { required: true })}
            error={errorsAdd.password ? 'Password is required' : undefined}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            {...registerAdd('password_confirmation', { required: true })}
            error={errorsAdd.password_confirmation ? 'Confirmation is required' : undefined}
          />
          <Input
            label="Phone (optional)"
            placeholder="+20 1xx xxx xxxx"
            {...registerAdd('phone')}
          />
          <Input
            label="Custom Domain"
            placeholder="store.com"
            {...registerAdd('custom_domain', { required: true })}
            error={errorsAdd.custom_domain ? 'Custom domain is required' : undefined}
          />
        </form>
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        isOpen={!!editVendor}
        onClose={() => setEditVendor(null)}
        title="Edit Store"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditVendor(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEdit(onEditSubmit)}
              loading={updateVendor.isPending}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <form className="max-h-[70vh] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmitEdit(onEditSubmit)}>
          <Input
            label="Vendor / Store Name"
            placeholder="My Awesome Store"
            {...registerEdit('vendor_name', { required: true })}
            error={errorsEdit.vendor_name ? 'Store name is required' : undefined}
          />
          <Input
            label="Store Slug"
            placeholder="my-awesome-store"
            {...registerEdit('slug', { required: true })}
            error={errorsEdit.slug ? 'Slug is required' : undefined}
          />
          <Input
            label="Owner Name"
            placeholder="John Doe"
            {...registerEdit('owner_name', { required: true })}
            error={errorsEdit.owner_name ? 'Owner name is required' : undefined}
          />
          <Input
            label="Email"
            type="email"
            placeholder="owner@store.com"
            {...registerEdit('email', { required: true })}
            error={errorsEdit.email ? 'Email is required' : undefined}
          />
          <Input
            label="Phone (optional)"
            placeholder="+20 1xx xxx xxxx"
            {...registerEdit('phone')}
          />
          <Input
            label="Custom Domain"
            placeholder="store.com"
            {...registerEdit('custom_domain', { required: true })}
            error={errorsEdit.custom_domain ? 'Custom domain is required' : undefined}
          />
        </form>
      </Modal>

      {/* View Vendor Details Modal */}
      <Modal
        isOpen={!!viewVendor}
        onClose={() => setViewVendor(null)}
        title="Store Details"
        footer={
          <Button variant="secondary" onClick={() => setViewVendor(null)}>
            Close
          </Button>
        }
      >
        {viewVendor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-textSecondary">Vendor ID</p>
                <p className="text-sm text-textPrimary font-mono mt-1">{viewVendor.id}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Store Name</p>
                <p className="text-sm text-textPrimary mt-1">{viewVendor.name}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Slug</p>
                <p className="text-sm text-textPrimary mt-1">{viewVendor.slug}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Custom Domain</p>
                <p className="text-sm text-textPrimary mt-1">{viewVendor.custom_domain || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Status</p>
                <p className="text-sm mt-1">
                  <Badge variant={viewVendor.is_active ? 'green' : 'slate'}>
                    {viewVendor.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Users Count</p>
                <p className="text-sm text-textPrimary mt-1">{viewVendor.users_count ?? '—'}</p>
              </div>
            </div>

            <hr className="border-border" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-textSecondary">Owner Name</p>
                <p className="text-sm text-textPrimary mt-1">{viewVendor.owner?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Owner Email</p>
                <p className="text-sm text-textPrimary mt-1">{viewVendor.owner?.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Owner Phone</p>
                <p className="text-sm text-textPrimary mt-1">{viewVendor.owner?.phone ?? '—'}</p>
              </div>
            </div>

            <hr className="border-border" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-textSecondary">Started At</p>
                <p className="text-sm text-textPrimary mt-1">
                  {viewVendor.start_at ? new Date(viewVendor.start_at).toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Expires At</p>
                <p className="text-sm text-textPrimary mt-1">
                  {viewVendor.expire_at ? new Date(viewVendor.expire_at).toLocaleString() : '—'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Deletion"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (deleteConfirm) {
                  await deleteVendor.mutateAsync(deleteConfirm.id);
                  setDeleteConfirm(null);
                }
              }}
              loading={deleteVendor.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-textSecondary">
          Are you sure you want to delete the store <span className="text-textPrimary font-semibold">{deleteConfirm?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default StoresPage;
