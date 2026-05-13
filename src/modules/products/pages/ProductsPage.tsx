import React, { useState } from 'react';
import { Plus, Trash2, Edit, Search, Package } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/hooks/useAuthStore';
import { useProducts, useProductsMutation } from '../hooks/useProducts';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input, Select, Textarea } from '@/shared/ui/Input';
import { Modal } from '@/shared/components/Modal';
import { Table, Column } from '@/shared/components/Table';
import { Product } from '@/core/types';
import { statusBadge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/Feedback';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Wearables', 'Audio', 'Accessories', 'Peripherals', 'Laptops', 'Cameras', 'Monitors', 'Components', 'Tablets', 'Outerwear', 'Footwear', 'Dresses', 'Bags', 'Bottoms', 'Knitwear', 'General'];

const ProductsPage: React.FC = () => {
  const { admin } = useAuthStore();
  const slug = 'Yallamatgar'; // admin?.storeSlug ?? 'Yallamatgar';
  const { data: products = [], isLoading } = useProducts(slug);
  const { addProduct, deleteProduct } = useProductsMutation(slug);

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'Electronics', stock: '', sku: '',
  });

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required.'); return; }
    await addProduct.mutateAsync({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      images: [`https://api.dicebear.com/7.x/shapes/svg?seed=${form.name}`],
      category: form.category,
      stock: parseInt(form.stock) || 0,
      sku: form.sku || `SKU-${Date.now()}`,
      status: 'active',
      storeSlug: slug,
    });
    setForm({ name: '', description: '', price: '', category: 'Electronics', stock: '', sku: '' });
    setAddOpen(false);
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-surface-hover" />
          <div>
            <p className="font-medium text-white text-sm">{p.name}</p>
            <p className="text-xs text-slate-500">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortable: true },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (p) => <span className="font-semibold text-white">${p.price.toFixed(2)}</span>,
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
      key: 'status',
      header: 'Status',
      render: (p) => <Badge variant={statusBadge(p.status)}>{p.status}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <div className="flex items-center gap-2">
          <button onClick={() => toast('Edit (mock) — product: ' + p.name)} className="p-1.5 text-slate-400 hover:text-brand-400 transition-colors">
            <Edit size={15} />
          </button>
          <button
            onClick={() => deleteProduct.mutate(p.id)}
            disabled={deleteProduct.isPending}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
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
        <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
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
          action={<Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>Add Product</Button>}
        />
      ) : (
        <Table data={filtered} columns={columns} loading={isLoading} pageSize={8} />
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Product"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} loading={addProduct.isPending}>Add Product</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Product Name" placeholder="Wireless Headphones" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <Input label="Price ($)" type="number" placeholder="99.99" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Stock" type="number" placeholder="50" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <Input label="SKU" placeholder="WH-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={CATEGORIES.map((c) => ({ label: c, value: c }))}
            />
            <div className="col-span-2">
              <Textarea label="Description" placeholder="Product description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsPage;
