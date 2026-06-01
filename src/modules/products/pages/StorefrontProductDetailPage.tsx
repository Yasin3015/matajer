import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  Star,
  Package,
  ShieldCheck,
  Truck,
  Heart
} from 'lucide-react';
import { useStorefrontProduct } from '@/modules/store/hooks/useStorefrontData';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { useFavoritesStore } from '@/modules/favorites/hooks/useFavoritesStore';
import { ROUTES, DEFAULT_STORE_SLUG } from '@/core/constants';
import { Spinner } from '@/shared/ui/Feedback';
import { ProductPrice } from '@/shared/components/ProductPrice';
import { hasSalePrice } from '@/shared/utils/productPrice';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const StorefrontProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { storeSlug: storeSlugParam, productId } = useParams<{ storeSlug?: string; productId: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useStorefrontProduct(storeSlug, productId || '');
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const favoritesMap = useFavoritesStore((s) => s.favorites);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) return <Spinner size="lg" />;

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">{t('productDetail.notFound')}</h2>
        <p className="text-textSecondary mb-6">{t('productDetail.notFoundHint')}</p>
        <button
          onClick={() => navigate(ROUTES.storeProducts(storeSlug))}
          className="text-primary hover:text-primaryHover font-medium inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} /> {t('productDetail.backToCatalog')}
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(storeSlug, product, quantity);
    toast.success(t('productDetail.addedMsg', { qty: quantity }));
  };

  const handleToggleFavorite = () => {
    toggleFavorite(storeSlug, product);
    const isSaved = (favoritesMap[storeSlug] ?? []).some((p) => p.id === product.id);
    // isSaved reflects the state BEFORE toggle, so invert for message
    toast(isSaved ? t('productDetail.wishlistRemoved') : t('productDetail.wishlistAdded'));
  };

  const images = product.images?.length ? product.images : ['https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image'];
  const inStock = product.stock > 0;
  const maxQty = product.stock;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="text-textSecondary hover:text-primary transition-colors inline-flex items-center gap-2 text-sm font-medium mb-6"
      >
        <ArrowLeft size={16} /> {t('common.back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-appBg rounded-3xl overflow-hidden border border-border relative flex items-center justify-center p-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full w-auto h-auto object-contain animate-fade-in"
              key={selectedImage}
            />
            {hasSalePrice(product) && (
              <span className="absolute top-4 start-4 bg-danger text-white text-xs font-bold px-3 py-1 rounded-full">
                {t('products.saleBadge')}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={clsx(
                    'w-20 h-20 shrink-0 rounded-2xl border-2 overflow-hidden bg-appBg flex items-center justify-center p-1 transition-colors',
                    selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-border'
                  )}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.category && (
            <p className="text-xs font-bold text-primary uppercase tracking-[0.1em] mb-2">
              {product.category}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-textPrimary leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <ProductPrice price={product.price} comparePrice={product.comparePrice} size="lg" />
            {(product.rating != null && product.rating > 0) && (
              <div className="flex items-center gap-1.5 border-l border-border pl-4">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="font-semibold text-textPrimary">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-textSecondary underline cursor-pointer">
                  ({t('productDetail.reviews', { count: product.reviewCount })})
                </span>
              </div>
            )}
          </div>

          <div className="prose prose-sm sm:prose-base text-textSecondary mb-8 max-w-none">
            <p>{product.description || t('productDetail.noDescription')}</p>
          </div>

          <hr className="border-border mb-8" />

          {/* Add to Cart Section */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-textPrimary">{t('productDetail.quantity')}</span>
              <span className={clsx('text-sm font-medium', inStock ? 'text-success' : 'text-danger')}>
                {inStock
                  ? t('productDetail.stockCount', { count: product.stock })
                  : t('products.outOfStock')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-appBg border border-border rounded-xl h-12">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!inStock || quantity <= 1}
                  className="w-12 h-full flex items-center justify-center text-textSecondary hover:text-textPrimary disabled:opacity-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="w-12 h-full flex items-center justify-center font-semibold text-textPrimary border-x border-border">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={!inStock || quantity >= maxQty}
                  className="w-12 h-full flex items-center justify-center text-textSecondary hover:text-textPrimary disabled:opacity-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-primary hover:bg-primaryHover text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <ShoppingCart size={18} />
                {t('productDetail.addToCart')}
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                className={clsx(
                  'w-12 h-12 rounded-xl border flex items-center justify-center transition-all shrink-0',
                  (favoritesMap[storeSlug] ?? []).some((p) => p.id === product.id)
                    ? 'border-rose-300 bg-rose-50 text-rose-500 hover:bg-rose-100'
                    : 'border-border text-textSecondary hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50'
                )}
                aria-label={t('productDetail.wishlist')}
              >
                <Heart
                  size={20}
                  fill={(favoritesMap[storeSlug] ?? []).some((p) => p.id === product.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-appBg">
              <Truck size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-textPrimary">{t('productDetail.featureShipping')}</p>
                <p className="text-xs text-textSecondary mt-0.5">{t('productDetail.featureShippingDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-appBg">
              <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-textPrimary">{t('productDetail.featureWarranty')}</p>
                <p className="text-xs text-textSecondary mt-0.5">{t('productDetail.featureWarrantyDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorefrontProductDetailPage;
