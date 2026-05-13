import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { ROUTES, DEFAULT_STORE_SLUG } from '@/core/constants';
import { Button } from '@/shared/ui/Button';
import toast from 'react-hot-toast';

const TAX_PCT = 8;

const CartPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { storeSlug: storeSlugParam } = useParams<{ storeSlug?: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;
  const getCart = useCartStore((s) => s.getCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [discountInput, setDiscountInput] = useState('');

  const cart = getCart(storeSlug);
  const total = getTotal(storeSlug);
  const shipping = total > 0 ? (total > 100 ? 0 : 9.99) : 0;
  const tax = total * (TAX_PCT / 100);

  const applyDiscount = () => {
    if (!discountInput.trim()) return;
    toast(t('cart.discountDemo'));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('cart.title')}</h1>
      {cart.length > 0 && (
        <p className="text-slate-600 text-sm mb-8">{t('cart.subtitle', { count: cart.length })}</p>
      )}

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center rounded-2xl border border-slate-200 bg-slate-50/50">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-slate-900 font-medium">{t('cart.emptyTitle')}</p>
            <p className="text-sm text-slate-600 mt-1 max-w-xs">{t('cart.emptyHint')}</p>
          </div>
          <Link to={ROUTES.storeProducts(storeSlug)}>
            <Button className="!bg-blue-600 hover:!bg-blue-700">{t('cart.browseProducts')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="card flex flex-wrap sm:flex-nowrap items-center gap-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={ROUTES.storeProduct(storeSlug, product.id)}
                    className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block truncate"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{product.category}</p>
                  <p className="text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(storeSlug, product.id, quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-slate-900 text-sm font-medium">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(storeSlug, product.id, quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-end shrink-0 min-w-[4.5rem]">
                  <p className="font-bold text-slate-900">${(product.price * quantity).toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(storeSlug, product.id)}
                    className="mt-1 text-slate-500 hover:text-red-600 transition-colors"
                    aria-label={t('cart.removeItem')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => clearCart(storeSlug)}
                className="text-xs text-slate-500 hover:text-red-600 transition-colors"
              >
                {t('cart.clearCart')}
              </button>
            </div>

            <Link
              to={ROUTES.storeProducts(storeSlug)}
              className={`inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowRight size={16} className={i18n.language === 'ar' ? 'rotate-180' : undefined} />
              {t('cart.continueShopping')}
            </Link>
          </div>

          <div className="space-y-4">
            <div className="card space-y-4">
              <h2 className="font-semibold text-slate-900">{t('cart.summaryTitle')}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4 text-slate-600">
                  <span>{t('cart.subtotal')}</span>
                  <span className="text-slate-900 shrink-0">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-4 text-slate-600">
                  <span>{t('cart.shipping')}</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-medium shrink-0' : 'text-slate-900 shrink-0'}>
                    {shipping === 0 ? t('common.free') : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-slate-600">
                  <span>{t('cart.tax', { pct: TAX_PCT })}</span>
                  <span className="text-slate-900 shrink-0">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between gap-4 font-bold text-slate-900 text-base">
                  <span>{t('cart.total')}</span>
                  <span className="text-blue-600 shrink-0">${(total + shipping + tax).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-700 mb-2">{t('cart.discountCode')}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder={t('cart.discountPlaceholder')}
                    className="input flex-1 min-w-0"
                  />
                  <Button type="button" variant="secondary" className="shrink-0" onClick={applyDiscount}>
                    {t('common.apply')}
                  </Button>
                </div>
              </div>

              <Link to={ROUTES.storeCheckout(storeSlug)}>
                <Button className="w-full justify-center my-4 !bg-blue-600 hover:!bg-blue-700" size="lg" icon={<ArrowRight size={18} className={i18n.language === 'ar' ? 'rotate-180' : undefined} />}>
                  {t('cart.checkout')}
                </Button>
              </Link>
              <p className="text-[10px] text-slate-500 text-center">
                {shipping === 0 && total > 0
                  ? t('cart.freeShippingHint')
                  : t('cart.freeShippingMore', { amount: `$${(100 - total).toFixed(2)}` })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
