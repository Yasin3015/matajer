import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Star, Search, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { ROUTES, DEFAULT_STORE_SLUG } from '@/core/constants';
import { Spinner } from '@/shared/ui/Feedback';
import { Input } from '@/shared/ui/Input';
import toast from 'react-hot-toast';

const FILTER_ALL = '__all__';

const StorefrontProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { storeSlug: storeSlugParam } = useParams<{ storeSlug?: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;
  const { data: products = [], isLoading } = useProducts(storeSlug);
  const addToCart = useCartStore((s) => s.addToCart);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL);

  const categories = useMemo(
    () => [FILTER_ALL, ...new Set(products.map((p) => p.category))],
    [products],
  );

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === FILTER_ALL || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categoryLabel = (cat: string) => (cat === FILTER_ALL ? t('products.filterAll') : cat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{t('products.title')}</h1>
        <p className="text-slate-600 text-sm">{t('products.count', { count: filtered.length })}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder={t('products.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={14} className="text-slate-500 shrink-0" aria-hidden />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-2xl border border-slate-200 bg-slate-50/50">
          <p className="text-slate-900 font-medium">{t('products.emptyTitle')}</p>
          <p className="text-sm text-slate-600 max-w-xs">{t('products.emptyHint')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="card !p-0 overflow-hidden group hover:border-blue-200 hover:shadow-lg transition-all duration-300 animate-fade-in"
            >
              <Link to={ROUTES.storeProduct(storeSlug, product.id)}>
                <div className="aspect-square overflow-hidden bg-slate-50 relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.comparePrice && (
                    <span className="absolute top-2 start-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {t('products.saleBadge')}
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{t('products.outOfStock')}</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <p className="text-[10px] text-blue-600 font-medium uppercase tracking-wider mb-1">{product.category}</p>
                <Link to={ROUTES.storeProduct(storeSlug, product.id)}>
                  <h3 className="font-semibold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                {product.rating && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={i < Math.floor(product.rating!) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                      />
                    ))}
                    <span className="text-[10px] text-slate-500 ms-1">({product.reviewCount})</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                    {product.comparePrice && (
                      <span className="ms-1.5 text-xs text-slate-400 line-through">${product.comparePrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(storeSlug, product, 1);
                      toast.success(t('products.addedShort'));
                    }}
                    disabled={product.stock === 0}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={t('products.addToCartAria', { name: product.name })}
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StorefrontProductsPage;
