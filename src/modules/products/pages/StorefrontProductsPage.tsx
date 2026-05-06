import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Star, Search, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { ROUTES } from '@/core/constants';
import { Spinner, EmptyState } from '@/shared/ui/Feedback';
import { Input } from '@/shared/ui/Input';
import toast from 'react-hot-toast';

const StorefrontProductsPage: React.FC = () => {
  const { storeSlug = '' } = useParams<{ storeSlug: string }>();
  const { data: products = [], isLoading } = useProducts(storeSlug);
  const addToCart = useCartStore((s) => s.addToCart);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">All Products</h1>
        <p className="text-slate-400 text-sm">{filtered.length} products</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={14} className="text-slate-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-card border border-surface-border text-slate-400 hover:text-white hover:border-brand-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No products found" description="Try a different search or category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="card !p-0 overflow-hidden group hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-900/20 transition-all duration-300 animate-fade-in"
            >
              <Link to={ROUTES.storeProduct(storeSlug, product.id)}>
                <div className="aspect-square overflow-hidden bg-surface-hover relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.comparePrice && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      SALE
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <p className="text-[10px] text-brand-400 font-medium uppercase tracking-wider mb-1">{product.category}</p>
                <Link to={ROUTES.storeProduct(storeSlug, product.id)}>
                  <h3 className="font-semibold text-white text-sm hover:text-brand-300 transition-colors line-clamp-2">{product.name}</h3>
                </Link>
                {product.rating && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < Math.floor(product.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
                    ))}
                    <span className="text-[10px] text-slate-500 ml-1">({product.reviewCount})</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="font-bold text-white">${product.price.toFixed(2)}</span>
                    {product.comparePrice && (
                      <span className="ml-1.5 text-xs text-slate-500 line-through">${product.comparePrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => { addToCart(storeSlug, product, 1); toast.success('Added!'); }}
                    disabled={product.stock === 0}
                    className="p-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorefrontProductsPage;
