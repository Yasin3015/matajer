import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Truck, CreditCard, Shield, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { ROUTES, DEFAULT_STORE_SLUG } from '@/core/constants';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { storefrontService } from '@/modules/store/services/storefrontService';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const TAX_PCT = 8;

type PaymentMethod = 'cod' | 'card';

const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { storeSlug: storeSlugParam } = useParams<{ storeSlug?: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;
  const getCart = useCartStore((s) => s.getCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();
  const rtl = i18n.language === 'ar';

  const cart = getCart(storeSlug);
  const subtotal = getTotal(storeSlug);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * (TAX_PCT / 100);
  const total = subtotal + shipping + tax;

  const [placing, setPlacing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', cardName: '' });

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !shippingAddress.trim()) {
      toast.error(t('checkout.fillCustomer'));
      return;
    }
    if (paymentMethod === 'card') {
      if (!payment.cardNumber.trim() || !payment.cardName.trim() || !payment.expiry.trim() || !payment.cvv.trim()) {
        toast.error(t('checkout.fillCustomer'));
        return;
      }
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setPlacing(true);
    try {
      const products = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));
      
      const payload = {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() ? email.trim() : undefined,
        city: city.trim() ? city.trim() : undefined,
        address: shippingAddress.trim(),
        notes: notes.trim() ? notes.trim() : undefined,
        // Backend may expect integer — round to avoid float validation errors
        extra_fees: Math.round(shipping),
        products
      };

      await storefrontService.checkout(storeSlug, payload);
      
      clearCart(storeSlug);
      toast.success(t('checkout.orderSuccess'), { duration: 5000 });
      navigate(ROUTES.store(storeSlug));
    } catch (error: any) {
      // Show detailed validation errors if available
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors && typeof apiErrors === 'object') {
        const messages = Object.values(apiErrors).flat().join(' | ');
        toast.error(messages || 'Failed to place order. Please try again.');
      } else {
        toast.error(error?.response?.data?.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0 && !placing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 text-lg mb-4">{t('checkout.emptyTitle')}</p>
        <Link to={ROUTES.storeProducts(storeSlug)}>
          <Button className="!bg-blue-600 hover:!bg-blue-700">{t('checkout.continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to={ROUTES.storeCart(storeSlug)}
        className={`inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-6 ${rtl ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft size={16} className={rtl ? 'rotate-180' : undefined} />
        {t('common.backToStore')}
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <aside className="lg:col-span-1 space-y-4 order-2 lg:order-1">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900 text-lg">{t('checkout.orderSummary')}</h2>
            <div className="space-y-4">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 leading-snug">{product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t('checkout.qty', { count: quantity })}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">${(product.price * quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4 text-slate-600">
                <span>{t('cart.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-600">
                <span>{t('cart.shipping')}</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                  {shipping === 0 ? t('common.free') : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-slate-600">
                <span>{t('cart.tax', { pct: TAX_PCT })}</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4 font-bold text-slate-900 text-base border-t border-slate-200 pt-2">
                <span>{t('checkout.finalTotal')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          <div className="card space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <span className="text-blue-600">●</span>
              {t('checkout.customerTitle')}
            </div>
            <Input
              label={t('checkout.fullName')}
              placeholder={t('checkout.fullNamePlaceholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('checkout.phone')}
                placeholder={t('checkout.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Input
              label="City"
              placeholder="Cairo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <div className="w-full">
              <label htmlFor="ship-addr" className="label">
                {t('checkout.shippingAddress')}
              </label>
              <textarea
                id="ship-addr"
                rows={4}
                className="input resize-none"
                placeholder={t('checkout.shippingPlaceholder')}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>
            <Input
              label="Delivery Notes (optional)"
              placeholder="Call before delivery, leave with concierge, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="card space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <span className="text-blue-600">●</span>
              {t('checkout.paymentTitle')}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={clsx(
                  'rounded-xl border-2 p-4 text-start transition-all',
                  paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300',
                )}
              >
                <Truck className="text-blue-600 mb-2" size={22} />
                <p className="font-semibold text-slate-900">{t('checkout.codTitle')}</p>
                <p className="text-xs text-slate-600 mt-1">{t('checkout.codHint')}</p>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={clsx(
                  'rounded-xl border-2 p-4 text-start transition-all',
                  paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300',
                )}
              >
                <CreditCard className="text-blue-600 mb-2" size={22} />
                <p className="font-semibold text-slate-900">{t('checkout.cardTitle')}</p>
                <p className="text-xs text-slate-600 mt-1">{t('checkout.cardHint')}</p>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <Input
                  label={t('checkout.cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                />
                <Input
                  label={t('checkout.cardName')}
                  placeholder=""
                  value={payment.cardName}
                  onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('checkout.expiry')}
                    placeholder="MM / YY"
                    value={payment.expiry}
                    onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                  />
                  <Input label={t('checkout.cvv')} placeholder="123" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} />
                </div>
              </div>
            )}
          </div>

          <Button
            loading={placing}
            className="w-full justify-center !bg-blue-600 hover:!bg-blue-700 !py-3.5 text-base"
            size="lg"
            onClick={() => void handlePlaceOrder()}
          >
            {t('checkout.confirmOrder')}
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield size={14} className="text-emerald-600 shrink-0" />
            {t('checkout.secureNote')}
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
        <span className="cursor-default hover:text-blue-600">{t('checkout.footerPrivacy')}</span>
        <span className="cursor-default hover:text-blue-600">{t('checkout.footerTerms')}</span>
      </div>
    </div>
  );
};

export default CheckoutPage;
