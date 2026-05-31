import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DEFAULT_STORE_SLUG, ROUTES } from '@/core/constants';
import { useStorefrontCategories } from '@/modules/store/hooks/useStorefrontData';
import { StorefrontCategoryCard } from '@/shared/components/StorefrontCategoryCard';
import { Spinner } from '@/shared/ui/Feedback';

const StorefrontCategoriesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { storeSlug: storeSlugParam } = useParams<{ storeSlug?: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;
  const { data: categories = [], isLoading } = useStorefrontCategories(storeSlug);
  const rtl = i18n.language === 'ar';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
        <Link to={ROUTES.store(storeSlug)} className="hover:text-blue-600 transition-colors">
          {t('product.breadcrumbHome')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{t('categories.title')}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{t('categories.title')}</h1>
        <p className="text-slate-600 text-sm">{t('categories.subtitle')}</p>
        {!isLoading && categories.length > 0 && (
          <p className="text-slate-500 text-sm mt-1">{t('categories.count', { count: categories.length })}</p>
        )}
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-2xl border border-slate-200 bg-slate-50/50">
          <p className="text-slate-900 font-medium">{t('categories.emptyTitle')}</p>
          <p className="text-sm text-slate-600 max-w-xs">{t('categories.emptyHint')}</p>
          <Link
            to={ROUTES.storeProducts(storeSlug)}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {t('categories.browseProducts')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <StorefrontCategoryCard
              key={cat.id}
              storeSlug={storeSlug}
              name={cat.name}
              slug={cat.slug || cat.id}
              image={cat.image}
              size="large"
            />
          ))}
        </div>
      )}

      <div className="mt-12">
        <Link
          to={ROUTES.store(storeSlug)}
          className={`inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors ${rtl ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft size={14} className={rtl ? 'rotate-180' : undefined} />
          {t('categories.backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default StorefrontCategoriesPage;
