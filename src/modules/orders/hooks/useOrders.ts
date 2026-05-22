import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  vendorOrdersService,
  VendorOrder,
  UpdateOrderPayload,
} from '../services/vendorOrdersService';
import toast from 'react-hot-toast';

export const orderKeys = {
  all: (slug: string) => ['orders', slug] as const,
};

const mapOrder = (o: any): VendorOrder => {
  const extraFees = o.extra_fees ? Number(o.extra_fees) : 0;
  
  // Calculate total, ensuring string numerical properties are converted to actual Numbers
  const total = o.total ? Number(o.total) : (o.grand_total ? Number(o.grand_total) : (() => {
    const items: any[] = o.products ?? o.items ?? [];
    const sub = items.reduce((acc: number, item: any) => acc + (Number(item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1)), 0);
    return sub + extraFees;
  })());

  return {
    id: o.id,
    orderNumber: o.order_number ?? o.orderNumber ?? undefined,
    customerName: o.client?.name ?? o.customerName ?? o.name ?? o.customer_name ?? undefined,
    customerEmail: o.client?.email ?? o.customerEmail ?? o.email ?? o.customer_email ?? undefined,
    customerPhone: o.client?.phone ?? o.customerPhone ?? o.phone ?? o.customer_phone ?? undefined,
    city: o.city ?? undefined,
    address: o.address ?? undefined,
    status: o.status ?? 'pending',
    extra_fees: extraFees,
    notes: o.notes ?? undefined,
    total,
    products: (o.products ?? o.items ?? []).map((item: any) => ({
      product_id: item.product_id ?? item.id ?? '',
      name: item.name ?? item.product?.name ?? undefined,
      quantity: item.quantity ?? 1,
      price: Number(item.price ?? item.product?.price ?? 0),
      product: item.product ? {
        ...item.product,
        price: Number(item.product.price)
      } : undefined,
    })),
    created_at: o.created_at ?? undefined,
    updated_at: o.updated_at ?? undefined,
  };
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useOrders(vendorSlug: string) {
  return useQuery({
    queryKey: orderKeys.all(vendorSlug),
    queryFn: async () => {
      const res = await vendorOrdersService.getAll(vendorSlug);
      const raw: any[] = res.data.data ?? [];
      return raw.map(mapOrder);
    },
    enabled: !!vendorSlug,
    staleTime: 1000 * 60 * 2,
  });
}

// ── Update ────────────────────────────────────────────────────────────────────
export function useUpdateVendorOrder(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderPayload }) =>
      vendorOrdersService.update(vendorSlug, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all(vendorSlug) });
      toast.success('Order status updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update order.');
    },
  });
}

// ── Delete / Cancel ───────────────────────────────────────────────────────────
export function useDeleteVendorOrder(vendorSlug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorOrdersService.remove(vendorSlug, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all(vendorSlug) });
      toast.success('Order cancelled and terminated.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to cancel order.');
    },
  });
}
