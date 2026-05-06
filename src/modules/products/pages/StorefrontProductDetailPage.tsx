import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, Package, Shield, Truck } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { ROUTES } from '@/core/constants';
import { Button } from '@/shared/ui/Button';
import { Spinner } from '@/shared/ui/Feedback';
import toast from 'react-hot-toast';

const StorefrontProductDetailPage: React.FC = () => {
  const { storeSlug = '', productId = '' } = useParams<{ storeSlug: string; productId: string }>();
  const { data: products = [], isLoading } = useProducts(storeSlug);
  const product = products.find((p) => p.id === productId);
  const addToCart = useCartStore((s) => s.addToCart);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <div className="py-20"><Spinner size="lg" /></div>;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <Package size={48} className="text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg">Product not found.</p>
        <Link to={ROUTES.storeProducts(storeSlug)} className="btn-primary mt-4 inline-flex">
          Back to Products
        </Link>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link to={ROUTES.store(storeSlug)} className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to={ROUTES.storeProducts(storeSlug)} className="hover:text-white transition-colors">Products</Link>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-card border border-surface-border group">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full">
              -{discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-brand-400 font-medium uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            {product.rating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
                  ))}
                </div>
                <span className="text-sm text-slate-400">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-white">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-xl text-slate-500 line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity + Add to cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-lg p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-hover rounded transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-hover rounded transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                icon={<ShoppingCart size={18} />}
                size="lg"
                className="flex-1 justify-center"
                onClick={() => { addToCart(storeSlug, product, quantity); toast.success(`${quantity}× ${product.name} added to cart!`); }}
              >
                Add to Cart
              </Button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-border">
            {[
              { icon: <Truck size={18} />, text: 'Free Shipping' },
              { icon: <Shield size={18} />, text: '2-Year Warranty' },
              { icon: <Package size={18} />, text: 'Easy Returns' },
            ].map((b) => (
              <div key={b.text} className="flex flex-col items-center gap-1.5 text-center p-3 rounded-xl bg-surface-card border border-surface-border">
                <span className="text-brand-400">{b.icon}</span>
                <span className="text-xs text-slate-400">{b.text}</span>
              </div>
            ))}
          </div>

          {/* SKU */}
          <p className="text-xs text-slate-600">SKU: {product.sku}</p>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-12">
        <Link to={ROUTES.storeProducts(storeSlug)} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back to all products
        </Link>
      </div>
    </div>
  );
};

export default StorefrontProductDetailPage;
