import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ROUTES } from '@/core/constants';

const HERO_BG =
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80';

interface StoreHomeHeroProps {
  storeSlug: string;
  storeName: string;
}

export const StoreHomeHero: React.FC<StoreHomeHeroProps> = ({ storeSlug, storeName }) => {
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'ar';

  return (
    <section className="relative overflow-hidden rounded-2xl min-h-[420px] sm:min-h-[480px] flex items-stretch">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden
      />
      <div
        className={clsx(
          'absolute inset-0 pointer-events-none',
          rtl ? 'bg-gradient-to-l from-black/50 via-black/25 to-transparent' : 'bg-gradient-to-r from-black/50 via-black/25 to-transparent',
        )}
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 items-center justify-start px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-lg me-auto text-start">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-white/90 uppercase mb-3">
            {t('home.hero.kicker')}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg text-white/90 mb-2">{t('home.hero.subtitle')}</p>
          <p className="text-sm text-white/75 mb-8 max-w-sm text-start">{t('home.hero.body', { store: storeName })}</p>
          <Link
            to={ROUTES.storeProducts(storeSlug)}
            className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primaryHover text-white font-semibold text-sm px-8 py-3.5 shadow-lg shadow-primary/20 transition-colors"
          >
            {t('home.hero.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
};
