import React, { useState } from 'react';
import { Trash2, UserPlus, Pencil, Eye, Search } from 'lucide-react';
import { Column, Table } from '@/shared/components/Table';
import { Admin } from '@/core/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/components/Modal';
import { useAdmins, useDeleteAdmin, useCreateAdmin, useUpdateAdmin } from '../hooks/useAdmins';
import { useForm } from 'react-hook-form';

interface AdminForm {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
}

const UsersPage: React.FC = () => {
  const { data: admins = [], isLoading } = useAdmins();
  const deleteAdmin = useDeleteAdmin();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [viewAdmin, setViewAdmin] = useState<Admin | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Admin | null>(null);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm<AdminForm>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<AdminForm>();

  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const onAddSubmit = async (data: AdminForm) => {
    await createAdmin.mutateAsync(data as any);
    resetAdd();
    setAddOpen(false);
  };

  const onEditSubmit = async (data: AdminForm) => {
    if (!editAdmin) return;
    await updateAdmin.mutateAsync({ id: editAdmin.id, payload: data as any });
    setEditAdmin(null);
  };

  const openEdit = (a: Admin) => {
    resetEdit({
      name: a.name,
      email: a.email,
      phone: a.phone || '',
    });
    setEditAdmin(a);
  };

  const columns: Column<Admin>[] = [
    {
      key: 'name',
      header: 'Admin',
      sortable: true,
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center">
            <span className="text-brand-300 font-bold text-xs uppercase">
              {a.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-white text-sm">{a.name}</p>
            <p className="text-xs text-slate-500">{a.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (a) => <span className="text-slate-400 text-sm">{a.phone || '—'}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (a) => (
        <Badge variant={a.is_platform_owner ? 'blue' : 'green'}>
          {a.is_platform_owner ? 'Platform Owner' : (a.role ? a.role.replace('_', ' ') : 'Admin')}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <Badge variant={a.is_active ? 'green' : 'slate'}>
          {a.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      sortable: true,
      render: (a) => (
        <span className="text-slate-400 text-sm">
          {a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'actions' as keyof Admin,
      header: '',
      render: (a) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewAdmin(a)}
            className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => openEdit(a)}
            className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
            title="Edit admin"
          >
            <Pencil size={15} />
          </button>
          {!a.is_platform_owner && (
            <button
              onClick={() => setDeleteConfirm(a)}
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
              title="Delete admin"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admins</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all platform administrators.</p>
        </div>
        <Button icon={<UserPlus size={16} />} onClick={() => setAddOpen(true)}>
          New Admin
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      <Table
        data={filtered}
        columns={columns}
        loading={isLoading}
        emptyMessage="No admins found."
      />

      {/* Add Admin Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); resetAdd(); }}
        title="Add New Admin"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setAddOpen(false); resetAdd(); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd(onAddSubmit)} loading={createAdmin.isPending}>
              Create Admin
            </Button>
          </>
        }
      >
        <form className="max-h-[70vh] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmitAdd(onAddSubmit)}>
          <Input
            label="Name"
            placeholder="Admin Name"
            {...registerAdd('name', { required: true })}
            error={errorsAdd.name ? 'Name is required' : undefined}
          />
          <Input
            label="Email"
            type="email"
            placeholder="admin@system.com"
            {...registerAdd('email', { required: true })}
            error={errorsAdd.email ? 'Email is required' : undefined}
          />
          <Input
            label="Phone (optional)"
            placeholder="0123456789"
            {...registerAdd('phone')}
          />
          <div className="hidden md:block"></div>
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
        </form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal
        isOpen={!!editAdmin}
        onClose={() => setEditAdmin(null)}
        title="Edit Admin"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditAdmin(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit(onEditSubmit)} loading={updateAdmin.isPending}>
              Save Changes
            </Button>
          </>
        }
      >
        <form className="max-h-[70vh] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmitEdit(onEditSubmit)}>
          <Input
            label="Name"
            placeholder="Admin Name"
            {...registerEdit('name', { required: true })}
            error={errorsEdit.name ? 'Name is required' : undefined}
          />
          <Input
            label="Email"
            type="email"
            placeholder="admin@system.com"
            {...registerEdit('email', { required: true })}
            error={errorsEdit.email ? 'Email is required' : undefined}
          />
          <Input
            label="Phone (optional)"
            placeholder="0123456789"
            {...registerEdit('phone')}
          />
          <div className="hidden md:block"></div>
          <Input
            label="Password (optional)"
            type="password"
            placeholder="Leave blank to keep unchanged"
            {...registerEdit('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Leave blank to keep unchanged"
            {...registerEdit('password_confirmation')}
          />
        </form>
      </Modal>

      {/* View Admin Details Modal */}
      <Modal
        isOpen={!!viewAdmin}
        onClose={() => setViewAdmin(null)}
        title="Admin Details"
        footer={
          <Button variant="secondary" onClick={() => setViewAdmin(null)}>
            Close
          </Button>
        }
      >
        {viewAdmin && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">ID</p>
                <p className="text-sm text-white font-mono mt-1">{viewAdmin.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-sm text-white mt-1">{viewAdmin.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-white mt-1">{viewAdmin.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm text-white mt-1">{viewAdmin.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-sm mt-1">
                  <Badge variant={viewAdmin.is_active ? 'green' : 'slate'}>
                    {viewAdmin.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="text-sm mt-1">
                  <Badge variant={viewAdmin.is_platform_owner ? 'blue' : 'green'}>
                    {viewAdmin.is_platform_owner ? 'Platform Owner' : 'Admin'}
                  </Badge>
                </p>
              </div>
            </div>
            <hr className="border-surface-border" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Joined At</p>
                <p className="text-sm text-white mt-1">
                  {viewAdmin.created_at ? new Date(viewAdmin.created_at).toLocaleString() : '—'}
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
                  await deleteAdmin.mutateAsync(deleteConfirm.id);
                  setDeleteConfirm(null);
                }
              }}
              loading={deleteAdmin.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-slate-300">
          Are you sure you want to delete the admin <span className="text-white font-semibold">{deleteConfirm?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default UsersPage;
