import React, { useState } from 'react';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import { useOrders, useUpdateVendorOrder, useDeleteVendorOrder } from '../hooks/useOrders';
import { Table, Column } from '@/shared/components/Table';
import { Badge, statusBadge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
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
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <p className="text-xs text-slate-400">Status</p>
            <div className="mt-1">
              <Badge variant={statusBadge(order.status)}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Order Date</p>
            <p className="text-slate-200 text-sm font-medium mt-1">
              {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
            </p>
          </div>
        </div>

        {/* Customer Details Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Customer details</h4>
          <div className="bg-surface p-4 rounded-xl border border-surface-border space-y-2.5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-slate-200 font-medium mt-0.5">{order.customerName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-slate-200 font-medium mt-0.5">{order.customerPhone || '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-surface-border/50">
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-slate-200 font-medium mt-0.5 break-all">{order.customerEmail || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">City</p>
                <p className="text-slate-200 font-medium mt-0.5">{order.city || '—'}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-surface-border/50 text-sm">
              <p className="text-xs text-slate-500">Shipping Address</p>
              <p className="text-slate-300 mt-0.5">{order.address || '—'}</p>
            </div>
            {order.notes && (
              <div className="pt-2 border-t border-surface-border/50 text-sm">
                <p className="text-xs text-slate-500">Customer Notes</p>
                <p className="text-slate-300 italic mt-0.5">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Order items</h4>
          <div className="overflow-x-auto max-h-48 border border-surface-border rounded-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-surface text-slate-400 text-xs uppercase border-b border-surface-border">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2 text-center">Qty</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-slate-500">No items in this order.</td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const price = item.price || item.product?.price || 0;
                    const name = item.name || item.product?.name || `Product ID: ${item.product_id}`;
                    return (
                      <tr key={idx} className="hover:bg-surface/30">
                        <td className="px-4 py-2.5 font-medium text-white">{name}</td>
                        <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right">${price.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right text-white font-medium">${(price * item.quantity).toFixed(2)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="pt-3 border-t border-surface-border flex flex-col items-end gap-1.5 text-sm text-slate-400">
          <div className="flex justify-between w-full max-w-[240px]">
            <span>Subtotal:</span>
            <span className="text-slate-200 font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-[240px]">
            <span>Extra Fees:</span>
            <span className="text-slate-200 font-medium">${extraFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-[240px] text-base font-bold text-white border-t border-surface-border pt-1.5">
            <span>Grand Total:</span>
            <span className="text-green-400">${(order.total || grandTotal).toFixed(2)}</span>
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
      status: o.status,
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
        <span className="font-mono font-medium text-white">
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
          <p className="text-white text-sm font-medium">{o.customerName || 'Anonymous Customer'}</p>
          <p className="text-xs text-slate-500">{o.customerEmail || 'No email'}</p>
        </div>
      ),
    },
    {
      key: 'products' as keyof VendorOrder,
      header: 'Items',
      render: (o) => {
        const count = o.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        return <span className="text-slate-400 text-sm">{count} item{count !== 1 ? 's' : ''}</span>;
      },
    },
    {
      key: 'total',
      header: 'Total Amount',
      sortable: true,
      render: (o) => <span className="font-semibold text-green-400">${o.total.toFixed(2)}</span>,
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
        <span className="text-slate-400 text-sm">
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
            className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => openEdit(o)}
            className="p-1.5 text-slate-400 hover:text-brand-400 transition-colors"
            title="Update order status"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(o)}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
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
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 text-sm mt-1">
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
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Fulfillment Status *
            </label>
            <select
              className="w-full bg-surface border border-surface-border text-white rounded-xl px-3 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm"
              {...register('status', { required: true })}
            >
              <option value="pending">PENDING</option>
              <option value="confirmed">CONFIRMED</option>
              <option value="shipped">SHIPPED</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </div>

          <Input
            label="Extra Shipping / Handling Fees ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('extra_fees')}
          />

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Order Notes / Action Remarks
            </label>
            <textarea
              className="w-full bg-surface border border-surface-border text-white rounded-xl px-3 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm resize-none"
              rows={4}
              placeholder="e.g. Customer confirmed shipping details via call."
              {...register('notes')}
            />
          </div>
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
        <p className="text-slate-300">
          Are you sure you want to terminate order{' '}
          <span className="text-white font-semibold">"#{deleteConfirm?.orderNumber || deleteConfirm?.id.slice(0, 8)}"</span>?
          This action represents canceling/deleting the record in fulfillment.
        </p>
      </Modal>
    </div>
  );
};

export default OrdersPage;
