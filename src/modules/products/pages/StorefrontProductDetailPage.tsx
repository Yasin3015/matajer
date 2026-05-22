import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Star, ArrowLeft, Package, Shield, Truck } from 'lucide-react';
import { useStorefrontProduct } from '@/modules/store/hooks/useStorefrontData';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { ROUTES, DEFAULT_STORE_SLUG } from '@/core/constants';
import { Button } from '@/shared/ui/Button';
import { Spinner } from '@/shared/ui/Feedback';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const StorefrontProductDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { storeSlug: storeSlugParam, productId = '' } = useParams<{ storeSlug?: string; productId: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;
  const { data: product, isLoading } = useStorefrontProduct(storeSlug, productId);
  const addToCart = useCartStore((s) => s.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const rtl = i18n.language === 'ar';

  if (isLoading)
    return (
      <div className="py-20">
        <Spinner size="lg" />
      </div>
    );

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <Package size={48} className="text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">{t('product.notFound')}</p>
        <Link to={ROUTES.storeProducts(storeSlug)} className="btn-primary mt-4 inline-flex">
          {t('product.backToProducts')}
        </Link>
      </div>
    );
  }

  const images = product.images.length ? product.images : [];
  const mainSrc = images[activeImage] ?? images[0];

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(storeSlug, product, quantity);
    toast.success(t('product.addedToCart', { qty: quantity, name: product.name }));
  };

  const handleBuyNow = () => {
    addToCart(storeSlug, product, quantity);
    toast.success(t('product.addedToCart', { qty: quantity, name: product.name }));
    navigate(ROUTES.storeCheckout(storeSlug));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
        <Link to={ROUTES.store(storeSlug)} className="hover:text-blue-600 transition-colors">
          {t('product.breadcrumbHome')}
        </Link>
        <span>/</span>
        <Link to={ROUTES.storeProducts(storeSlug)} className="hover:text-blue-600 transition-colors">
          {t('product.breadcrumbProducts')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 group">
            <img
              src={mainSrc}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discount > 0 && (
              <div className="absolute top-4 start-4 bg-emerald-600 text-white font-bold text-sm px-3 py-1 rounded-full">
                %{discount}
              </div>
            )}
          </div>
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={clsx(
                    'w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all',
                    activeImage === i ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent opacity-80 hover:opacity-100',
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">{t('product.premiumBadge')}</p>
            {product.category && (
              <p className="text-sm text-blue-600 font-medium uppercase tracking-wider mb-1">{product.category}</p>
            )}
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            {product.rating && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating!) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  {t('product.reviews', { rating: product.rating, count: product.reviewCount ?? 0 })}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-xl text-slate-400 line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {product.stock > 0 ? t('product.inStock', { count: product.stock }) : t('product.outOfStock')}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div>
                <p className="text-sm font-medium text-slate-800 mb-2">{t('product.quantity')}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-slate-900 font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  icon={<ShoppingCart size={18} />}
                  size="lg"
                  className="flex-1 justify-center !bg-blue-600 hover:!bg-blue-700"
                  onClick={handleAddToCart}
                >
                  {t('product.addToCart')}
                </Button>
                <Button variant="secondary" size="lg" className="flex-1 justify-center border-slate-200" onClick={handleBuyNow}>
                  {t('product.buyNow')}
                </Button>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200">
            {[
              { icon: <Truck size={18} />, text: t('product.shippingBadge') },
              { icon: <Shield size={18} />, text: t('product.warrantyBadge') },
              { icon: <Package size={18} />, text: t('product.returnsBadge') },
            ].map((b) => (
              <div
                key={b.text}
                className="flex flex-col items-center gap-1.5 text-center p-3 rounded-xl bg-slate-50 border border-slate-200"
              >
                <span className="text-blue-600">{b.icon}</span>
                <span className="text-xs text-slate-600 leading-snug">{b.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500">{t('product.sku', { sku: product.id })}</p>
        </div>
      </div>

      <section className="mt-16 max-w-4xl mx-auto space-y-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900 text-center mb-4">{t('product.descriptionTitle')}</h2>
          <p className="text-slate-600 leading-relaxed text-center">{product.description}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">{t('product.specsTitle')}</h3>
            <ul className="text-sm text-slate-600 space-y-2 list-disc ps-5">
              <li>{t('product.specMaterial')}</li>
              <li>{t('product.specMovement')}</li>
              <li>{t('product.sku', { sku: product.id })}</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">{t('product.careTitle')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('product.careBody')}</p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <Link
          to={ROUTES.storeProducts(storeSlug)}
          className={`inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors ${rtl ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft size={14} className={rtl ? 'rotate-180' : undefined} />
          {t('product.backToAll')}
        </Link>
      </div>
    </div>
  );
};

export default StorefrontProductDetailPage;
