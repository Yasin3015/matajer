import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsByStore, mockProducts } from '../mock/products.mock';
import { Product } from '@/core/types';
import toast from 'react-hot-toast';

// ── Storefront: list by store ────────────────────────────────────────────────
export function useProducts(storeSlug: string) {
  return useQuery({
    queryKey: ['products', storeSlug],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400)); // simulate latency
      return getProductsByStore(storeSlug);
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ── Dashboard: all products for a store ─────────────────────────────────────
export function useProductsMutation(storeSlug: string) {
  const qc = useQueryClient();

  const addProduct = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'createdAt'>) => {
      await new Promise((r) => setTimeout(r, 600));
      const newProduct: Product = {
        ...product,
        id: `p-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      mockProducts.push(newProduct);
      return newProduct;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products', storeSlug] });
      toast.success('Product added successfully!');
    },
    onError: () => toast.error('Failed to add product.'),
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      await new Promise((r) => setTimeout(r, 400));
      const idx = mockProducts.findIndex((p) => p.id === productId);
      if (idx !== -1) mockProducts.splice(idx, 1);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products', storeSlug] });
      toast.success('Product deleted.');
    },
    onError: () => toast.error('Failed to delete product.'),
  });

  return { addProduct, deleteProduct };
}
