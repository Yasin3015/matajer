import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Eye, UserCheck, Shield, Search } from 'lucide-react';
import { Table, Column } from '@/shared/components/Table';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/ui/Input';
import { EmptyState } from '@/shared/ui/Feedback';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { useForm } from 'react-hook-form';
import {
  useVendorUsers,
  useCreateVendorUser,
  useUpdateVendorUser,
  useDeleteVendorUser,
} from '@/modules/store/hooks/useVendorUsers';
import type { VendorUser } from '@/modules/store/services/vendorUsersService';

interface UserForm {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  is_active?: boolean;
}

const TeamPage: React.FC = () => {
  const { storeSlug } = useVendorAuthStore();
  const vendorSlug = storeSlug || 'Yallamatgar';
  const { data: users = [], isLoading } = useVendorUsers(vendorSlug);
  const createUser = useCreateVendorUser(vendorSlug);
  const updateUser = useUpdateVendorUser(vendorSlug);
  const deleteUser = useDeleteVendorUser(vendorSlug);

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<VendorUser | null>(null);
  const [viewUser, setViewUser] = useState<VendorUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<VendorUser | null>(null);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<UserForm>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<UserForm>();

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const onAddSubmit = async (data: UserForm) => {
    await createUser.mutateAsync({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password || '123456',
      is_active: true,
    });
    resetAdd();
    setAddOpen(false);
  };

  const onEditSubmit = async (data: UserForm) => {
    if (!editUser) return;
    const payload: Record<string, any> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    if (data.password) payload.password = data.password;
    await updateUser.mutateAsync({ id: editUser.id, payload });
    setEditUser(null);
  };

  const openEdit = (u: VendorUser) => {
    resetEdit({ name: u.name, email: u.email, phone: u.phone || '' });
    setEditUser(u);
  };

  const columns: Column<VendorUser>[] = [
    {
      key: 'name',
      header: 'Member',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primaryLight flex items-center justify-center">
            <span className="text-primary font-semibold text-xs">{u.name[0]}</span>
          </div>
          <div>
            <p className="font-medium text-textPrimary text-sm">{u.name}</p>
            <p className="text-xs text-textSecondary">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (u) => <span className="text-textSecondary text-sm">{u.phone || '—'}</span>,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (u) => (
        <Badge variant={u.is_active ? 'green' : 'slate'}>
          {u.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      sortable: true,
      render: (u) => (
        <span className="text-textSecondary text-sm">
          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'actions' as keyof VendorUser,
      header: '',
      render: (u) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewUser(u)}
            className="p-1.5 text-textSecondary hover:text-success transition-colors"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => openEdit(u)}
            className="p-1.5 text-textSecondary hover:text-primary transition-colors"
            title="Edit member"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(u)}
            className="p-1.5 text-textSecondary hover:text-danger transition-colors"
            title="Remove member"
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
          <h1 className="text-2xl font-bold text-textPrimary">Team</h1>
          <p className="text-textSecondary text-sm mt-1">Manage your store team members.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Add Member
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No team members yet"
          description="Add staff members to help manage your store."
          icon={<UserCheck size={24} />}
          action={<Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>Add Member</Button>}
        />
      ) : (
        <Table
          data={filtered}
          columns={columns}
          loading={isLoading}
          emptyMessage="No team members found."
        />
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); resetAdd(); }}
        title="Add Team Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setAddOpen(false); resetAdd(); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd(onAddSubmit)} loading={createUser.isPending}>
              Add Member
            </Button>
          </>
        }
      >
        <form
          className="max-h-[70vh] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmitAdd(onAddSubmit)}
        >
          <Input
            label="Name"
            placeholder="Team Member Name"
            {...registerAdd('name', { required: true })}
            error={errorsAdd.name ? 'Name is required' : undefined}
          />
          <Input
            label="Email"
            type="email"
            placeholder="member@store.com"
            {...registerAdd('email', { required: true })}
            error={errorsAdd.email ? 'Email is required' : undefined}
          />
          <Input
            label="Phone (optional)"
            placeholder="0123456789"
            {...registerAdd('phone')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...registerAdd('password', { required: true, minLength: 6 })}
            error={errorsAdd.password ? 'Password must be at least 6 characters' : undefined}
          />
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit Team Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit(onEditSubmit)} loading={updateUser.isPending}>
              Save Changes
            </Button>
          </>
        }
      >
        <form
          className="max-h-[70vh] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmitEdit(onEditSubmit)}
        >
          <Input
            label="Name"
            placeholder="Team Member Name"
            {...registerEdit('name', { required: true })}
            error={errorsEdit.name ? 'Name is required' : undefined}
          />
          <Input
            label="Email"
            type="email"
            placeholder="member@store.com"
            {...registerEdit('email', { required: true })}
            error={errorsEdit.email ? 'Email is required' : undefined}
          />
          <Input
            label="Phone (optional)"
            placeholder="0123456789"
            {...registerEdit('phone')}
          />
          <Input
            label="New Password (optional)"
            type="password"
            placeholder="Leave blank to keep unchanged"
            {...registerEdit('password')}
          />
        </form>
      </Modal>

      {/* View Member Details Modal */}
      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title="Member Details"
        footer={
          <Button variant="secondary" onClick={() => setViewUser(null)}>
            Close
          </Button>
        }
      >
        {viewUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-textSecondary">ID</p>
                <p className="text-sm text-textPrimary font-mono mt-1">{viewUser.id}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Name</p>
                <p className="text-sm text-textPrimary mt-1">{viewUser.name}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Email</p>
                <p className="text-sm text-textPrimary mt-1">{viewUser.email}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Phone</p>
                <p className="text-sm text-textPrimary mt-1">{viewUser.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Status</p>
                <p className="text-sm mt-1">
                  <Badge variant={viewUser.is_active ? 'green' : 'slate'}>
                    {viewUser.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Joined</p>
                <p className="text-sm text-textPrimary mt-1">
                  {viewUser.created_at ? new Date(viewUser.created_at).toLocaleString() : '—'}
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
        title="Remove Team Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (deleteConfirm) {
                  await deleteUser.mutateAsync(deleteConfirm.id);
                  setDeleteConfirm(null);
                }
              }}
              loading={deleteUser.isPending}
            >
              Remove
            </Button>
          </>
        }
      >
        <p className="text-textSecondary">
          Are you sure you want to remove{' '}
          <span className="text-textPrimary font-semibold">{deleteConfirm?.name}</span> from the team?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default TeamPage;
