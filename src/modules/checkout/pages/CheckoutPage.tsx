import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { ROUTES } from '@/core/constants';
import { Input, Select } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import clsx from 'clsx';
import toast from 'react-hot-toast';

type Step = 'address' | 'payment' | 'review';

const STEPS: { id: Step; label: string }[] = [
  { id: 'address', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

const CheckoutPage: React.FC = () => {
  const { storeSlug = '' } = useParams<{ storeSlug: string }>();
  const getCart = useCartStore((s) => s.getCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  const cart = getCart(storeSlug);
  const subtotal = getTotal(storeSlug);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [step, setStep] = useState<Step>('address');
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: 'US', zip: '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', cardName: '' });

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    clearCart(storeSlug);
    toast.success('Order placed successfully! 🎉', { duration: 5000 });
    navigate(ROUTES.store(storeSlug));
  };

  if (cart.length === 0 && !placing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg mb-4">Your cart is empty.</p>
        <Link to={ROUTES.storeProducts(storeSlug)}><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  idx < stepIndex ? 'bg-green-500 text-white' : idx === stepIndex ? 'bg-brand-600 text-white ring-4 ring-brand-600/20' : 'bg-surface-hover text-slate-400'
                )}
              >
                {idx < stepIndex ? <Check size={14} /> : idx + 1}
              </div>
              <span className={clsx('text-sm font-medium', idx === stepIndex ? 'text-white' : 'text-slate-400')}>
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={clsx('flex-1 h-px mx-4', idx < stepIndex ? 'bg-green-500/50' : 'bg-surface-border')} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'address' && (
            <Card>
              <h2 className="font-semibold text-white mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} />
                <Input label="Last Name" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} />
                <div className="col-span-2"><Input label="Email" type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} /></div>
                <div className="col-span-2"><Input label="Address" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} /></div>
                <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <Input label="ZIP / Postal Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                <Select label="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  options={[{ label: 'United States', value: 'US' }, { label: 'United Kingdom', value: 'GB' }, { label: 'Canada', value: 'CA' }, { label: 'Germany', value: 'DE' }]} />
              </div>
              <div className="mt-6 flex justify-end">
                <Button icon={<ChevronRight size={16} />} onClick={() => setStep('payment')}>Continue to Payment</Button>
              </div>
            </Card>
          )}

          {step === 'payment' && (
            <Card>
              <h2 className="font-semibold text-white mb-4">Payment Details</h2>
              <div className="space-y-4">
                <Input label="Card Number" placeholder="1234 5678 9012 3456" value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} hint="This is a demo — no real payment processed." />
                <Input label="Cardholder Name" placeholder="John Smith" value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Expiry Date" placeholder="MM / YY" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} />
                  <Input label="CVV" placeholder="123" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setStep('address')}>← Back</Button>
                <Button icon={<ChevronRight size={16} />} onClick={() => setStep('review')}>Review Order</Button>
              </div>
            </Card>
          )}

          {step === 'review' && (
            <Card>
              <h2 className="font-semibold text-white mb-4">Order Review</h2>
              <div className="space-y-3 mb-6">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-surface-hover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <p className="text-xs text-slate-500">Qty: {quantity}</p>
                    </div>
                    <p className="font-semibold text-white text-sm">${(product.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-surface-border pt-4 space-y-2 text-sm mb-6">
                <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-400"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-slate-400"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-white text-base border-t border-surface-border pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep('payment')}>← Back</Button>
                <Button loading={placing} onClick={handlePlaceOrder} icon={<Check size={16} />}>
                  Place Order
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Cart summary sidebar */}
        <div className="card h-fit space-y-3">
          <h3 className="font-semibold text-white text-sm">{cart.length} items in cart</h3>
          {cart.slice(0, 3).map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-2">
              <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-surface-hover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{product.name}</p>
                <p className="text-[10px] text-slate-500">×{quantity}</p>
              </div>
              <p className="text-xs font-semibold text-white">${(product.price * quantity).toFixed(2)}</p>
            </div>
          ))}
          {cart.length > 3 && <p className="text-xs text-slate-500">+{cart.length - 3} more items</p>}
          <div className="border-t border-surface-border pt-3 flex justify-between font-bold text-white">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
