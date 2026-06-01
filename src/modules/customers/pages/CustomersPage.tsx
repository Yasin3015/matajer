import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Search, Eye, User as UserIcon } from 'lucide-react';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '../hooks/useCustomers';
import { Table, Column } from '@/shared/components/Table';
import { Button } from '@/shared/ui/Button';
import { Input, Textarea } from '@/shared/ui/Input';
import { Modal } from '@/shared/components/Modal';
import { EmptyState } from '@/shared/ui/Feedback';
import { useForm } from 'react-hook-form';
import type { VendorClient } from '../services/vendorClientsService';

interface CustomerForm {
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  notes?: string;
}

/* ─── View Customer Modal ────────────────────────────────────────────────────── */
interface ViewCustomerModalProps {
  customer: VendorClient | null;
  onClose: () => void;
  onEdit: (c: VendorClient) => void;
}

const ViewCustomerModal: React.FC<ViewCustomerModalProps> = ({ customer, onClose, onEdit }) => {
  if (!customer) return null;
  return (
    <Modal
      isOpen={!!customer}
      onClose={onClose}
      title="Customer Profile Details"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button icon={<Pencil size={14} />} onClick={() => { onClose(); onEdit(customer); }}>
            Edit
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <div className="w-14 h-14 rounded-full bg-primaryLight flex items-center justify-center border border-primary/10 shrink-0">
            <span className="text-primary font-semibold text-lg">{customer.name[0]}</span>
          </div>
          <div>
            <h3 className="text-textPrimary font-bold text-lg">{customer.name}</h3>
            <p className="text-xs text-textSecondary">ID: {customer.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-textSecondary mb-1">Email</p>
            <p className="text-textPrimary text-sm font-medium">{customer.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-textSecondary mb-1">Phone</p>
            <p className="text-textPrimary text-sm font-medium">{customer.phone || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-textSecondary mb-1">City</p>
            <p className="text-textPrimary text-sm font-medium">{customer.city || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-textSecondary mb-1">Address</p>
            <p className="text-textPrimary text-sm font-medium">{customer.address || '—'}</p>
          </div>
        </div>
        {customer.notes && (
          <div className="bg-appBg p-3 rounded-lg border border-border">
            <p className="text-xs font-medium text-textSecondary mb-1">Notes</p>
            <p className="text-textPrimary text-sm">{customer.notes}</p>
          </div>
        )}
        {(customer.totalOrders !== undefined || customer.totalSpent !== undefined) && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border text-center">
            <div className="bg-appBg p-2 rounded-lg border border-border">
              <p className="text-xs text-textSecondary">Total Orders</p>
              <p className="text-textPrimary font-bold text-lg">{customer.totalOrders ?? 0}</p>
            </div>
            <div className="bg-appBg p-2 rounded-lg border border-border">
              <p className="text-xs text-textSecondary">Total Spent</p>
              <p className="text-success font-bold text-lg">${(customer.totalSpent ?? 0).toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
const CustomersPage: React.FC = () => {
  const { storeSlug } = useVendorAuthStore();
  const vendorSlug = storeSlug || 'Yallamatgar';
  const { data: customers = [], isLoading } = useCustomers(vendorSlug);
  const createCustomer = useCreateCustomer(vendorSlug);
  const updateCustomer = useUpdateCustomer(vendorSlug);
  const deleteCustomer = useDeleteCustomer(vendorSlug);

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<VendorClient | null>(null);
  const [viewCustomer, setViewCustomer] = useState<VendorClient | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<VendorClient | null>(null);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<CustomerForm>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<CustomerForm>();

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.includes(search))
  );

  const closeAdd = () => {
    setAddOpen(false);
    resetAdd();
  };

  const onAddSubmit = async (data: CustomerForm) => {
    await createCustomer.mutateAsync(data);
    closeAdd();
  };

  const onEditSubmit = async (data: CustomerForm) => {
    if (!editCustomer) return;
    await updateCustomer.mutateAsync({
      id: editCustomer.id,
      payload: data,
    });
    setEditCustomer(null);
  };

  const openEdit = (c: VendorClient) => {
    resetEdit({
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      city: c.city || '',
      address: c.address || '',
      notes: c.notes || '',
    });
    setEditCustomer(c);
  };

  const columns: Column<VendorClient>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primaryLight flex items-center justify-center shrink-0">
            <span className="text-primary font-semibold text-xs">{c.name[0]}</span>
          </div>
          <div>
            <p className="font-medium text-textPrimary text-sm">{c.name}</p>
            <p className="text-xs text-textSecondary">{c.email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (c) => <span className="text-textSecondary text-sm">{c.phone || '—'}</span> },
    { key: 'city', header: 'City', sortable: true, render: (c) => <span className="text-textSecondary text-sm">{c.city || '—'}</span> },
    { key: 'totalOrders' as keyof VendorClient, header: 'Orders', sortable: true, render: (c) => <span className="font-medium text-textPrimary">{c.totalOrders ?? 0}</span> },
    {
      key: 'totalSpent' as keyof VendorClient,
      header: 'Total Spent',
      sortable: true,
      render: (c) => <span className="font-semibold text-success">${(c.totalSpent ?? 0).toFixed(2)}</span>,
    },
    {
      key: 'actions' as keyof VendorClient,
      header: '',
      render: (c) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewCustomer(c)}
            className="p-1.5 text-textSecondary hover:text-primary transition-colors"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => openEdit(c)}
            className="p-1.5 text-textSecondary hover:text-primary transition-colors"
            title="Edit customer"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(c)}
            className="p-1.5 text-textSecondary hover:text-danger transition-colors"
            title="Delete customer"
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
          <h1 className="text-2xl font-bold text-textPrimary">Customers</h1>
          <p className="text-textSecondary text-sm mt-1">
            {customers.length} customer records registered in your store CRM.
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          New Customer
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Create customer entries manually or wait for automatic checkouts."
          icon={<UserIcon size={24} />}
          action={
            <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
              New Customer
            </Button>
          }
        />
      ) : (
        <Table
          data={filtered}
          columns={columns}
          loading={isLoading}
          emptyMessage="No customers found."
        />
      )}

      {/* View Details Modal */}
      <ViewCustomerModal
        customer={viewCustomer}
        onClose={() => setViewCustomer(null)}
        onEdit={openEdit}
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={addOpen}
        onClose={closeAdd}
        title="Add New Customer Profile"
        footer={
          <>
            <Button variant="secondary" onClick={closeAdd}>Cancel</Button>
            <Button onClick={handleSubmitAdd(onAddSubmit)} loading={createCustomer.isPending}>
              Create Customer
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmitAdd(onAddSubmit)}>
          <Input
            label="Full Name *"
            placeholder="Ahmed Mohamed"
            {...registerAdd('name', { required: true })}
            error={errorsAdd.name ? 'Name is required' : undefined}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="ahmed@gmail.com"
              {...registerAdd('email')}
            />
            <Input
              label="Phone Number"
              placeholder="01012345678"
              {...registerAdd('phone')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="Cairo"
              {...registerAdd('city')}
            />
            <Input
              label="Address"
              placeholder="Nasr City"
              {...registerAdd('address')}
            />
          </div>
          <Textarea
            label="Internal Notes"
            placeholder="VIP customer, calls before delivery"
            {...registerAdd('notes')}
          />
        </form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={!!editCustomer}
        onClose={() => setEditCustomer(null)}
        title="Edit Customer Profile"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditCustomer(null)}>Cancel</Button>
            <Button onClick={handleSubmitEdit(onEditSubmit)} loading={updateCustomer.isPending}>
              Save Changes
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmitEdit(onEditSubmit)}>
          <Input
            label="Full Name *"
            placeholder="Ahmed Mohamed"
            {...registerEdit('name', { required: true })}
            error={errorsEdit.name ? 'Name is required' : undefined}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="ahmed@gmail.com"
              {...registerEdit('email')}
            />
            <Input
              label="Phone Number"
              placeholder="01012345678"
              {...registerEdit('phone')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="Cairo"
              {...registerEdit('city')}
            />
            <Input
              label="Address"
              placeholder="Nasr City"
              {...registerEdit('address')}
            />
          </div>
          <Textarea
            label="Internal Notes"
            placeholder="VIP customer, calls before delivery"
            {...registerEdit('notes')}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Customer Profile"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (deleteConfirm) {
                  await deleteCustomer.mutateAsync(deleteConfirm.id);
                  setDeleteConfirm(null);
                }
              }}
              loading={deleteCustomer.isPending}
            >
              Delete Profile
            </Button>
          </>
        }
      >
        <p className="text-textSecondary">
          Are you sure you want to delete the customer profile{' '}
          <span className="text-textPrimary font-semibold">"{deleteConfirm?.name}"</span>?
          This action will permanently delete their CRM record.
        </p>
      </Modal>
    </div>
  );
};

export default CustomersPage;
