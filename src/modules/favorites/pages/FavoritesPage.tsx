import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Trash2, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { useFavoritesStore } from '../hooks/useFavoritesStore';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { ROUTES, DEFAULT_STORE_SLUG } from '@/core/constants';
import { Button } from '@/shared/ui/Button';
import toast from 'react-hot-toast';

const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const { storeSlug: storeSlugParam } = useParams<{ storeSlug?: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;

  // Favorites store — subscribe to raw data for reactivity
  const favoritesMap = useFavoritesStore((s) => s.favorites);
  const removeFromFavorites = useFavoritesStore((s) => s.removeFromFavorites);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  // Cart store — to allow "add to cart" from this page
  const addToCart = useCartStore((s) => s.addToCart);

  const favorites = favoritesMap[storeSlug] ?? [];

  const handleAddToCart = (product: (typeof favorites)[number]) => {
    addToCart(storeSlug, product, 1);
    toast.success(t('favorites.addedToCart', { name: product.name }));
  };

  const handleRemove = (productId: string) => {
    removeFromFavorites(storeSlug, productId);
    toast(t('favorites.removed'));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <Heart size={20} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-textPrimary">{t('favorites.title')}</h1>
        </div>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={() => clearFavorites(storeSlug)}
            className="text-xs text-textSecondary hover:text-danger transition-colors"
          >
            {t('favorites.clearAll')}
          </button>
        )}
      </div>
      {favorites.length > 0 && (
        <p className="text-textSecondary text-sm mb-8">
          {t('favorites.subtitle', { count: favorites.length })}
        </p>
      )}

      {/* Empty state */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-5 text-center rounded-3xl border border-border bg-appBg/50">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-white border border-border flex items-center justify-center text-rose-300 shadow-sm">
              <Heart size={36} />
            </div>
            <Sparkles
              size={16}
              className="absolute -top-1 -end-1 text-amber-400"
            />
          </div>
          <div>
            <p className="text-textPrimary font-semibold text-lg">{t('favorites.emptyTitle')}</p>
            <p className="text-sm text-textSecondary mt-1 max-w-xs leading-relaxed">
              {t('favorites.emptyHint')}
            </p>
          </div>
          <Link to={ROUTES.storeProducts(storeSlug)}>
            <Button className="!bg-primary hover:!bg-primaryHover gap-2" icon={<ArrowRight size={16} />}>
              {t('favorites.browseProducts')}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Favorites grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Product image */}
                <Link
                  to={ROUTES.storeProduct(storeSlug, product.id)}
                  className="block relative overflow-hidden"
                  style={{ height: '200px' }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center block group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Remove heart button overlay */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(product.id);
                    }}
                    aria-label={t('favorites.removeAria')}
                    className="absolute top-3 end-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-border flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                </Link>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={ROUTES.storeProduct(storeSlug, product.id)}
                      className="font-semibold text-textPrimary hover:text-primary transition-colors block truncate text-sm"
                    >
                      {product.name}
                    </Link>
                    {product.category && product.category !== 'Uncategorized' && (
                      <p className="text-xs text-textSecondary mt-0.5">{product.category}</p>
                    )}
                    <p className="text-primary font-bold mt-1">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.stock === 0 && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-danger bg-danger/10 rounded-full px-2 py-0.5">
                        {t('products.outOfStock')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primaryHover disabled:bg-border disabled:text-textSecondary disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 transition-colors"
                    >
                      <ShoppingCart size={15} />
                      {t('product.addToCart')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id)}
                      aria-label={t('favorites.removeAria')}
                      className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-textSecondary hover:text-danger hover:border-danger transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
            <Link
              to={ROUTES.storeProducts(storeSlug)}
              className="inline-flex items-center gap-2 text-sm text-textSecondary hover:text-primary transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              {t('cart.continueShopping')}
            </Link>
            <Link to={ROUTES.storeCart(storeSlug)}>
              <Button className="!bg-primary hover:!bg-primaryHover gap-2" icon={<ShoppingCart size={16} />}>
                {t('favorites.goToCart')}
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
