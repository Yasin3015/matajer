import React, { useState } from 'react';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { useOrders, useUpdateVendorOrder, useDeleteVendorOrder } from '../hooks/useOrders';
import { Table, Column } from '@/shared/components/Table';
import { Badge, statusBadge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input, Select, Textarea } from '@/shared/ui/Input';
import { Modal } from '@/shared/components/Modal';
import { EmptyState } from '@/shared/ui/Feedback';
import { Eye, Pencil, Trash2, Search, ShoppingBag, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { VendorOrder } from '../services/vendorOrdersService';

interface UpdateOrderForm {
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
  extra_fees: number;
  notes: string;
}

/* ─── View Order Details Modal ────────────────────────────────────────────────── */
interface ViewOrderModalProps {
  order: VendorOrder | null;
  onClose: () => void;
  onEdit: (o: VendorOrder) => void;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ order, onClose, onEdit }) => {
  if (!order) return null;

  // Calculate items count and subtotal
  const items = order.products || [];
  const subtotal = items.reduce((acc, item) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);
  const extraFees = order.extra_fees || 0;
  const grandTotal = subtotal + extraFees;

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title={`Order Details: ${order.orderNumber || order.id.slice(0, 8)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button icon={<Pencil size={14} />} onClick={() => { onClose(); onEdit(order); }}>
            Update Status
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Order Header / Status Banner */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs text-textSecondary">Status</p>
            <div className="mt-1">
              <Badge variant={statusBadge(order.status)}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-textSecondary">Order Date</p>
            <p className="text-textPrimary text-sm font-medium mt-1">
              {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
            </p>
          </div>
        </div>

        {/* Customer Details Section */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.5px]">Customer details</h4>
          <div className="bg-appBg p-4 rounded-xl border border-border space-y-2.5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-textSecondary">Name</p>
                <p className="text-textPrimary font-medium mt-0.5">{order.customerName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">Phone</p>
                <p className="text-textPrimary font-medium mt-0.5">{order.customerPhone || '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-border/50">
              <div>
                <p className="text-xs text-textSecondary">Email</p>
                <p className="text-textPrimary font-medium mt-0.5 break-all">{order.customerEmail || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-textSecondary">City</p>
                <p className="text-textPrimary font-medium mt-0.5">{order.city || '—'}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border/50 text-sm">
              <p className="text-xs text-textSecondary">Shipping Address</p>
              <p className="text-textPrimary mt-0.5">{order.address || '—'}</p>
            </div>
            {order.notes && (
              <div className="pt-2 border-t border-border/50 text-sm">
                <p className="text-xs text-textSecondary">Customer Notes</p>
                <p className="text-textPrimary italic mt-0.5">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.5px]">Order items</h4>
          <div className="overflow-x-auto max-h-48 border border-border rounded-xl">
            <table className="w-full text-left text-sm text-textPrimary">
              <thead className="bg-appBg text-textPrimary text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-border">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2 text-center">Qty</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-textSecondary">No items in this order.</td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const price = item.price || item.product?.price || 0;
                    const name = item.name || item.product?.name || `Product ID: ${item.product_id}`;
                    return (
                      <tr key={idx} className="hover:bg-primaryLight">
                        <td className="px-4 py-2.5 font-medium">{name}</td>
                        <td className="px-4 py-2.5 text-center text-textSecondary">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-textSecondary">${price.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right font-medium">${(price * item.quantity).toFixed(2)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="pt-3 border-t border-border flex flex-col items-end gap-1.5 text-sm text-textSecondary">
          <div className="flex justify-between w-full max-w-[240px]">
            <span>Subtotal:</span>
            <span className="text-textPrimary font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-[240px]">
            <span>Extra Fees:</span>
            <span className="text-textPrimary font-medium">${extraFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-[240px] text-base font-bold text-textPrimary border-t border-border pt-1.5">
            <span>Grand Total:</span>
            <span className="text-success">${(order.total || grandTotal).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
const OrdersPage: React.FC = () => {
  const { storeSlug } = useVendorAuthStore();
  const vendorSlug = storeSlug || 'Yallamatgar';
  const { data: orders = [], isLoading } = useOrders(vendorSlug);
  const updateOrder = useUpdateVendorOrder(vendorSlug);
  const deleteOrder = useDeleteVendorOrder(vendorSlug);

  const [search, setSearch] = useState('');
  const [viewOrder, setViewOrder] = useState<VendorOrder | null>(null);
  const [editOrder, setEditOrder] = useState<VendorOrder | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<VendorOrder | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateOrderForm>();

  const filtered = orders.filter((o) =>
    (o.orderNumber && o.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase())) ||
    (o.customerEmail && o.customerEmail.toLowerCase().includes(search.toLowerCase())) ||
    o.status.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (o: VendorOrder) => {
    reset({
      status: o.status as any,
      extra_fees: o.extra_fees || 0,
      notes: o.notes || '',
    });
    setEditOrder(o);
  };

  const onEditSubmit = async (data: UpdateOrderForm) => {
    if (!editOrder) return;
    await updateOrder.mutateAsync({
      id: editOrder.id,
      payload: {
        status: data.status,
        extra_fees: Number(data.extra_fees),
        notes: data.notes,
      },
    });
    setEditOrder(null);
  };

  const columns: Column<VendorOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      sortable: true,
      render: (o) => (
        <span className="font-mono font-medium text-textPrimary">
          {o.orderNumber || o.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (o) => (
        <div>
          <p className="text-textPrimary text-sm font-medium">{o.customerName || 'Anonymous Customer'}</p>
          <p className="text-xs text-textSecondary">{o.customerEmail || 'No email'}</p>
        </div>
      ),
    },
    {
      key: 'products' as keyof VendorOrder,
      header: 'Items',
      render: (o) => {
        const count = o.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        return <span className="text-textSecondary text-sm">{count} item{count !== 1 ? 's' : ''}</span>;
      },
    },
    {
      key: 'total',
      header: 'Total Amount',
      sortable: true,
      render: (o) => <span className="font-semibold text-success">${o.total.toFixed(2)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (o) => (
        <Badge variant={statusBadge(o.status)}>
          {o.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: (o) => (
        <span className="text-textSecondary text-sm">
          {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'actions' as keyof VendorOrder,
      header: '',
      render: (o) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewOrder(o)}
            className="p-1.5 text-textSecondary hover:text-primary transition-colors"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => openEdit(o)}
            className="p-1.5 text-textSecondary hover:text-primary transition-colors"
            title="Update order status"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(o)}
            className="p-1.5 text-textSecondary hover:text-danger transition-colors"
            title="Terminate / Cancel order"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Orders</h1>
          <p className="text-textSecondary text-sm mt-1">
            {orders.length} order invoices placed in your storefront catalog.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search orders by number, status or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Fulfill order invoices and check out carts from the customer-facing eCommerce catalog."
          icon={<ShoppingBag size={24} />}
        />
      ) : (
        <Table
          data={filtered}
          columns={columns}
          loading={isLoading}
          emptyMessage="No orders found."
        />
      )}

      {/* View Order Modal */}
      <ViewOrderModal
        order={viewOrder}
        onClose={() => setViewOrder(null)}
        onEdit={openEdit}
      />

      {/* Update Order Status & Fees Modal */}
      <Modal
        isOpen={!!editOrder}
        onClose={() => setEditOrder(null)}
        title={`Update Order: ${editOrder?.orderNumber || editOrder?.id.slice(0, 8)}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditOrder(null)}>Cancel</Button>
            <Button onClick={handleSubmit(onEditSubmit)} loading={updateOrder.isPending}>
              Save Fulfillment Changes
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onEditSubmit)}>
          <Select
            label="Fulfillment Status *"
            options={[
              { label: 'PENDING', value: 'pending' },
              { label: 'CONFIRMED', value: 'confirmed' },
              { label: 'SHIPPED', value: 'shipped' },
              { label: 'CANCELLED', value: 'cancelled' },
            ]}
            {...register('status', { required: true })}
          />

          <Input
            label="Extra Shipping / Handling Fees ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('extra_fees')}
          />

          <Textarea
            label="Order Notes / Action Remarks"
            placeholder="e.g. Customer confirmed shipping details via call."
            {...register('notes')}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Cancel & Terminate Order"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>No, Keep Order</Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (deleteConfirm) {
                  await deleteOrder.mutateAsync(deleteConfirm.id);
                  setDeleteConfirm(null);
                }
              }}
              loading={deleteOrder.isPending}
            >
              Cancel Order
            </Button>
          </>
        }
      >
        <p className="text-textSecondary">
          Are you sure you want to terminate order{' '}
          <span className="text-textPrimary font-semibold">"#{deleteConfirm?.orderNumber || deleteConfirm?.id.slice(0, 8)}"</span>?
          This action represents canceling/deleting the record in fulfillment.
        </p>
      </Modal>
    </div>
  );
};

export default OrdersPage;
