import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { ROUTES } from '@/core/constants';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/Feedback';

const CartPage: React.FC = () => {
  const { storeSlug = '' } = useParams<{ storeSlug: string }>();
  const getCart = useCartStore((s) => s.getCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const cart = getCart(storeSlug);
  const total = getTotal(storeSlug);
  const shipping = total > 0 ? (total > 100 ? 0 : 9.99) : 0;
  const tax = total * 0.08;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse products and add items to your cart."
          icon={<ShoppingCart size={28} />}
          action={
            <Link to={ROUTES.storeProducts(storeSlug)}>
              <Button>Browse Products</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="card flex items-center gap-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-surface-hover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={ROUTES.storeProduct(storeSlug, product.id)}
                    className="font-semibold text-white hover:text-brand-300 transition-colors block truncate"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{product.category}</p>
                  <p className="text-brand-400 font-bold mt-1">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 bg-surface border border-surface-border rounded-lg p-1 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(storeSlug, product.id, quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-hover rounded transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-white text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(storeSlug, product.id, quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-hover rounded transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-white">${(product.price * quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(storeSlug, product.id)}
                    className="mt-1 text-slate-500 hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={() => clearCart(storeSlug)}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="card space-y-4">
              <h2 className="font-semibold text-white">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-surface-border pt-2 flex justify-between font-bold text-white text-base">
                  <span>Total</span>
                  <span>${(total + shipping + tax).toFixed(2)}</span>
                </div>
              </div>
              <Link to={ROUTES.storeCheckout(storeSlug)}>
                <Button className="w-full justify-center" size="lg" icon={<ArrowRight size={18} />}>
                  Proceed to Checkout
                </Button>
              </Link>
              <p className="text-[10px] text-slate-600 text-center">
                {shipping === 0 && total > 0 ? '🎉 You qualify for free shipping!' : `Add $${(100 - total).toFixed(2)} more for free shipping`}
              </p>
            </div>
            <Link
              to={ROUTES.storeProducts(storeSlug)}
              className="block text-center text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
