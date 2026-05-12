import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, Package } from 'lucide-react';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { useStore } from '@/modules/admin/hooks/useStores';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { ROUTES } from '@/core/constants';
import { Spinner } from '@/shared/ui/Feedback';
import { Button } from '@/shared/ui/Button';
import toast from 'react-hot-toast';

const StoreHomePage: React.FC = () => {
  const { storeSlug = '' } = useParams<{ storeSlug: string }>();
  const { data: store } = useStore(storeSlug);
  const { data: products = [], isLoading } = useProducts(storeSlug);
  const addToCart = useCartStore((s) => s.addToCart);

  const featured = products.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-900/60 to-surface-card border border-brand-800/30 p-10 sm:p-16 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-800/20 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">{store?.name ?? storeSlug}</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
            {store?.custom_domain ?? 'Discover our curated collection of premium products.'}
          </p>
          <Link to={ROUTES.storeProducts(storeSlug)}>
            <Button size="lg" icon={<ArrowRight size={18} />}>
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Products</h2>
          <Link to={ROUTES.storeProducts(storeSlug)} className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <div key={product.id} className="card !p-0 overflow-hidden group hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-900/20 transition-all duration-300">
                <Link to={ROUTES.storeProduct(storeSlug, product.id)}>
                  <div className="aspect-video overflow-hidden bg-surface-hover">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={ROUTES.storeProduct(storeSlug, product.id)}>
                    <h3 className="font-semibold text-white hover:text-brand-300 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{product.category}</p>
                  {product.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-slate-400">{product.rating} ({product.reviewCount})</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="font-bold text-white text-lg">${product.price.toFixed(2)}</span>
                      {product.comparePrice && (
                        <span className="ml-2 text-sm text-slate-500 line-through">${product.comparePrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => { addToCart(storeSlug, product, 1); toast.success('Added to cart!'); }}
                      disabled={product.stock === 0}
                      className="btn-primary !px-3 !py-1.5 text-xs disabled:opacity-40"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart size={14} />
                      {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Category badges */}
      {!isLoading && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <Link
                key={cat}
                to={ROUTES.storeProducts(storeSlug)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-surface-border text-sm text-slate-300 hover:text-white hover:border-brand-500/50 transition-all"
              >
                <Package size={14} className="text-brand-400" />
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StoreHomePage;
