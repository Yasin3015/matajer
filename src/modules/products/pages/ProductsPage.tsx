import React, { useState } from 'react';
import { Plus, Trash2, Edit, Search, Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import {
  useVendorProducts,
  useDeleteVendorProduct,
} from '@/modules/store/hooks/useVendorProducts';
import type { ApiProduct } from '@/modules/store/services/vendorProductsService';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/components/Modal';
import { Table, Column } from '@/shared/components/Table';
import { EmptyState } from '@/shared/ui/Feedback';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';

const getProductImage = (product: ApiProduct): string => {
  if (product.images && product.images.length > 0 && product.images[0].url) return product.images[0].url;
  if (product.image && typeof product.image === 'string' && product.image.trim() !== '') return product.image;
  if (product.media && product.media.length > 0 && product.media[0].url) return product.media[0].url;
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.name)}`;
};

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeSlug } = useVendorAuthStore();
  const vendorSlug = storeSlug || 'Yallamatgar';
  
  const { data: products = [], isLoading } = useVendorProducts(vendorSlug);
  const deleteProduct = useDeleteVendorProduct(vendorSlug);

  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<ApiProduct | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<ApiProduct>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={getProductImage(p)}
            alt={p.name}
            className="w-10 h-10 rounded-lg object-cover bg-surface-hover"
          />
          <div>
            <p className="font-medium text-white text-sm">{p.name}</p>
            <p className="text-xs text-slate-500">{p.slug || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (p) => (
        <span className="text-slate-400 text-sm">{p.category?.name || '—'}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-semibold text-white">${Number(p.price).toFixed(2)}</span>
          {p.price_before && (
            <span className="ms-1.5 text-xs text-slate-500 line-through">
              ${Number(p.price_before).toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (p) => (
        <span className={p.stock === 0 ? 'text-red-400 font-medium' : 'text-slate-300'}>
          {p.stock === 0 ? 'Out of stock' : p.stock}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (p) => (
        <Badge variant={p.is_active !== false ? 'green' : 'slate'}>
          {p.is_active !== false ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions' as keyof ApiProduct,
      header: '',
      render: (p) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/products/${p.id}`)}
            className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
            title="View product"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => navigate(`/dashboard/products/${p.id}/edit`)}
            className="p-1.5 text-slate-400 hover:text-brand-400 transition-colors"
            title="Edit product"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(p)}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            title="Delete product"
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
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} products in your store.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => navigate('/dashboard/products/new')}>
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to start selling."
          icon={<Package size={24} />}
          action={
            <Button icon={<Plus size={16} />} onClick={() => navigate('/dashboard/products/new')}>
              Add Product
            </Button>
          }
        />
      ) : (
        <Table data={filtered} columns={columns} loading={isLoading} pageSize={10} />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Product"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (deleteConfirm) {
                  await deleteProduct.mutateAsync(deleteConfirm.id);
                  setDeleteConfirm(null);
                }
              }}
              loading={deleteProduct.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-slate-300">
          Are you sure you want to delete{' '}
          <span className="text-white font-semibold">"{deleteConfirm?.name}"</span>? This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ProductsPage;
