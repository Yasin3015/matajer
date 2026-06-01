import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES, isDemoStore } from '@/core/constants';
import { useStorefrontCategories } from '@/modules/store/hooks/useStorefrontData';
import { StorefrontCategoryCard } from '@/shared/components/StorefrontCategoryCard';

type FallbackId = 'sports' | 'accessories' | 'beauty' | 'homeDecor' | 'fashion' | 'electronics';

const DEMO_FALLBACK_TILES: { id: FallbackId; image: string }[] = [
  { id: 'sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
  { id: 'accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80' },
  { id: 'beauty', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80' },
  { id: 'homeDecor', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80' },
  { id: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
  { id: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
];

interface ShopByCategorySectionProps {
  storeSlug: string;
}

export const ShopByCategorySection: React.FC<ShopByCategorySectionProps> = ({ storeSlug }) => {
  const { t } = useTranslation();
  const { data: apiCategories = [] } = useStorefrontCategories(storeSlug);
  const demo = isDemoStore(storeSlug);

  const apiTiles = useMemo(
    () =>
      apiCategories.slice(0, 6).map((cat) => ({
        key: cat.id,
        name: cat.name,
        slug: cat.slug || cat.id,
        image: cat.image,
        to: undefined as string | undefined,
      })),
    [apiCategories],
  );

  const demoFallbackTiles = useMemo(() => {
    if (!demo) return [];
    const remaining = Math.max(0, 6 - apiTiles.length);
    return DEMO_FALLBACK_TILES.slice(0, remaining).map((tile) => ({
      key: tile.id,
      name: t(`home.category.fallback.${tile.id}`),
      slug: tile.id,
      image: tile.image,
      to: ROUTES.storeProducts(storeSlug),
    }));
  }, [demo, apiTiles.length, storeSlug, t]);

  const tiles = [...apiTiles, ...demoFallbackTiles];

  if (tiles.length === 0) return null;

  return (
    <section className="py-14 sm:py-16">
      <div className="flex items-end justify-between gap-4 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary tracking-tight text-start">
          {t('home.category.title')}
        </h2>
        <Link
          to={ROUTES.storeCategories(storeSlug)}
          className="text-sm font-medium text-textSecondary hover:text-primary transition-colors shrink-0"
        >
          {t('home.category.viewAll')}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {tiles.map((tile) => (
          <StorefrontCategoryCard
            key={tile.key}
            storeSlug={storeSlug}
            name={tile.name}
            slug={tile.slug}
            image={tile.image}
            to={tile.to}
          />
        ))}
      </div>
    </section>
  );
};
