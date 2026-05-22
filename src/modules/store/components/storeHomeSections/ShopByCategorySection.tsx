import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/core/constants';
import { useStorefrontCategories } from '@/modules/store/hooks/useStorefrontData';
import type { Product } from '@/core/types';

type FallbackId = 'sports' | 'accessories' | 'beauty' | 'homeDecor' | 'fashion' | 'electronics';

type CategoryTile =
  | { type: 'category'; name: string; image: string }
  | { type: 'fallback'; id: FallbackId; image: string };

const FALLBACK_TILES: { id: FallbackId; image: string }[] = [
  { id: 'sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
  { id: 'accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80' },
  { id: 'beauty', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80' },
  { id: 'homeDecor', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80' },
  { id: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
  { id: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
];

interface ShopByCategorySectionProps {
  storeSlug: string;
  products: Product[];
}

export const ShopByCategorySection: React.FC<ShopByCategorySectionProps> = ({ storeSlug }) => {
  const { t } = useTranslation();
  const { data: apiCategories = [] } = useStorefrontCategories(storeSlug);

  const tiles = useMemo(() => {
    const list: CategoryTile[] = [];
    const seen = new Set<string>();

    // 1. Add categories created by the vendor from the backend API
    for (const cat of apiCategories) {
      if (seen.has(cat.name)) continue;
      seen.add(cat.name);
      list.push({
        type: 'category',
        name: cat.name,
        // If the category has a saved image, use it; otherwise use a premium Unsplash fallback
        image: cat.image || FALLBACK_TILES[list.length % FALLBACK_TILES.length].image,
      });
      if (list.length >= 6) break;
    }

    // 2. Fill the remaining spots up to 6 tiles with fallback/mock categories
    for (const f of FALLBACK_TILES) {
      if (list.length >= 6) break;
      const key = `fb:${f.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push({ type: 'fallback', id: f.id, image: f.image });
      }
    }
    return list;
  }, [apiCategories]);

  return (
    <section className="py-14 sm:py-16">
      <div className="flex items-end justify-between gap-4 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-start">
          {t('home.category.title')}
        </h2>
        <Link
          to={ROUTES.storeProducts(storeSlug)}
          className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors shrink-0"
        >
          {t('home.category.viewAll')}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {tiles.map((tile) => {
          const label =
            tile.type === 'fallback' ? t(`home.category.fallback.${tile.id}`) : tile.name;
          const key = tile.type === 'fallback' ? tile.id : tile.name;
          return (
            <Link
              key={key}
              to={ROUTES.storeProducts(storeSlug)}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square max-w-[140px] mx-auto rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-sm group-hover:ring-blue-400/50 group-hover:shadow-md transition-all">
                <img
                  src={tile.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="mt-3 text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
