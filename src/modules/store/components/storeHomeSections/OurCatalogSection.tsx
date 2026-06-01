import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { ROUTES } from '@/core/constants';
import type { Product } from '@/core/types';
import { useStorefrontCategories } from '@/modules/store/hooks/useStorefrontData';
import { useFavoritesStore } from '@/modules/favorites/hooks/useFavoritesStore';
import { ProductPrice } from '@/shared/components/ProductPrice';
import toast from 'react-hot-toast';
import { Spinner } from '@/shared/ui/Feedback';
import clsx from 'clsx';

interface OurCatalogSectionProps {
  storeSlug: string;
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export const OurCatalogSection: React.FC<OurCatalogSectionProps> = ({
  storeSlug,
  products,
  isLoading,
  onAddToCart,
}) => {
  const { t } = useTranslation();
  const { data: apiCategories = [] } = useStorefrontCategories(storeSlug);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const favoritesMap = useFavoritesStore((s) => s.favorites);
  const favorites = favoritesMap[storeSlug] ?? [];

  // Filter products by selected category
  const catalog = useMemo(() => {
    const base = products.slice(0, 8);
    if (selectedCategory === 'all') return base;
    return products.filter((p) => p.category === selectedCategory).slice(0, 8);
  }, [products, selectedCategory]);

  // Use real API categories for the dropdown
  const categoryOptions = useMemo(() => apiCategories.map((c) => c.name), [apiCategories]);

  return (
    <section className="py-14 sm:py-16 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
        <div className="max-w-md text-start">
          <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary tracking-tight">{t('home.catalog.title')}</h2>
          <p className="text-sm text-textSecondary mt-1">{t('home.catalog.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <label className="sr-only" htmlFor="catalog-sort">
            {t('home.catalog.sortBy')}
          </label>
          <select
            id="catalog-sort"
            className="rounded-xl border border-border bg-white text-textPrimary text-sm font-medium py-2.5 ps-3 pe-8 focus:outline-none focus:ring-2 focus:ring-primary/30"
            defaultValue="featured"
          >
            <option value="featured">{t('home.catalog.sortFeatured')}</option>
            <option value="price-asc">{t('home.catalog.sortPriceAsc')}</option>
            <option value="price-desc">{t('home.catalog.sortPriceDesc')}</option>
            <option value="name">{t('home.catalog.sortName')}</option>
          </select>
          <label className="sr-only" htmlFor="catalog-filter">
            {t('home.catalog.filter')}
          </label>
          <select
            id="catalog-filter"
            className="rounded-xl border border-border bg-white text-textPrimary text-sm font-medium py-2.5 ps-3 pe-8 focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">{t('home.catalog.filterAll')}</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : catalog.length === 0 ? (
        <p className="text-center text-textSecondary py-12">{t('home.catalog.empty')}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalog.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl bg-white border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <Link to={ROUTES.storeProduct(storeSlug, product.id)} className="block relative overflow-hidden" style={{ height: '220px' }}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center block group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-4 flex flex-col flex-1 text-start">
                  {product.category && product.category !== 'Uncategorized' && (
                    <p className="text-[11px] font-semibold tracking-wider text-primary uppercase mb-1">
                      {product.category}
                    </p>
                  )}
                  <Link to={ROUTES.storeProduct(storeSlug, product.id)}>
                    <h3 className="font-semibold text-textPrimary hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <ProductPrice price={product.price} comparePrice={product.comparePrice} size="sm" className="mt-2" />
                  <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product);
                        toast.success(t('common.toastAddedToCart'));
                      }}
                      disabled={product.stock === 0}
                      className="text-sm font-semibold text-primary hover:text-primaryHover disabled:text-textSecondary/50 disabled:cursor-not-allowed"
                    >
                      {product.stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleFavorite(storeSlug, product);
                        const isSaved = favorites.some((p) => p.id === product.id);
                        toast(isSaved ? t('productDetail.wishlistRemoved') : t('productDetail.wishlistAdded'));
                      }}
                      className={clsx(
                        'p-1.5 rounded-lg border transition-all shrink-0',
                        favorites.some((p) => p.id === product.id)
                          ? 'border-rose-300 bg-rose-50 text-rose-500 hover:bg-rose-100'
                          : 'border-border text-textSecondary hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50'
                      )}
                      aria-label={t('productDetail.wishlist')}
                    >
                      <Heart
                        size={14}
                        fill={favorites.some((p) => p.id === product.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link
              to={ROUTES.storeProducts(storeSlug)}
              className="inline-flex items-center justify-center rounded-xl bg-appBg hover:bg-border text-textPrimary font-semibold text-sm px-10 py-3 transition-colors"
            >
              {t('home.catalog.loadMore')}
            </Link>
          </div>
        </>
      )}
    </section>
  );
};
