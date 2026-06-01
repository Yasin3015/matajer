import React from 'react';
import { Link, NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Search, User, ArrowLeft, Facebook, Instagram, Twitter, Heart } from 'lucide-react';
import { ROUTES, DEFAULT_STORE_SLUG } from '@/core/constants';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { useFavoritesStore } from '@/modules/favorites/hooks/useFavoritesStore';
import { useStore } from '@/modules/admin/hooks/useStores';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-primary font-semibold'
    : 'text-textSecondary hover:text-primary transition-colors';

export const StoreLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { storeSlug: storeSlugParam } = useParams<{ storeSlug?: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;
  const { data: store } = useStore(storeSlug);
  const carts = useCartStore((s) => s.carts);
  const itemCount = (carts[storeSlug] ?? []).reduce((sum, item) => sum + item.quantity, 0);
  const favoritesMap = useFavoritesStore((s) => s.favorites);
  const favCount = (favoritesMap[storeSlug] ?? []).length;
  const navigate = useNavigate();
  const brand = store?.name ?? storeSlug;
  const year = new Date().getFullYear();
  const rtl = i18n.language === 'ar';

  return (
    <div
      className="min-h-screen bg-white text-textPrimary flex flex-col"
      dir={rtl ? 'rtl' : 'ltr'}
      lang={i18n.language}
    >
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 flex-wrap order-3 ms-auto lg:ms-0 lg:order-3">
              {/* <button
                type="button"
                onClick={() => navigate(ROUTES.PLATFORM)}
                className="text-textSecondary hover:text-textPrimary p-2 rounded-xl hover:bg-appBg transition-colors"
                aria-label={t('common.backToPlatform')}
              >
                <ArrowLeft size={18} className={rtl ? 'rotate-180' : undefined} />
              </button> */}
              {/* <Link
                to="/login"
                className="text-textSecondary hover:text-textPrimary p-2 rounded-xl hover:bg-appBg transition-colors"
                aria-label={t('common.account')}
              >
                <User size={18} />
              </Link> */}
              <Link
                to={ROUTES.storeFavorites(storeSlug)}
                className="relative text-textSecondary hover:text-rose-500 p-2 rounded-xl hover:bg-appBg transition-colors"
                aria-label={t('nav.favorites')}
              >
                <Heart size={18} />
                {favCount > 0 && (
                  <span className="absolute top-0.5 end-0.5 min-w-[1.125rem] h-[1.125rem] px-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favCount > 9 ? '9+' : favCount}
                  </span>
                )}
              </Link>
              <Link
                to={ROUTES.storeCart(storeSlug)}
                className="relative text-textSecondary hover:text-textPrimary p-2 rounded-xl hover:bg-appBg transition-colors"
                aria-label={`${t('nav.cart')} (${itemCount})`}
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 end-0.5 min-w-[1.125rem] h-[1.125rem] px-0.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
              <LanguageSwitcher />
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center min-w-0 order-2 lg:order-2">
              <div className="relative w-full max-w-xl">
                <Search
                  className="absolute top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none start-3"
                  size={18}
                />
                <input
                  type="search"
                  placeholder={t('common.search')}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-inputBorder bg-appBg text-sm text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
                  aria-label={t('common.search')}
                />
              </div>
            </div>

            {/* Brand + Nav */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-between order-1 lg:order-1 lg:justify-start lg:gap-8 min-w-0">
              <Link
                to={ROUTES.store(storeSlug)}
                className="font-bold text-lg sm:text-xl text-textPrimary tracking-tight hover:text-primary transition-colors shrink-0"
              >
                {brand}
              </Link>
              <nav className="flex items-center gap-5 text-sm font-medium">
                <NavLink to={ROUTES.store(storeSlug)} end className={navLinkClass}>
                  {t('nav.home')}
                </NavLink>
                <Link to={ROUTES.storeProducts(storeSlug)} className="text-textSecondary hover:text-primary transition-colors">
                  {t('nav.newArrivals')}
                </Link>
                <Link to={ROUTES.storeCategories(storeSlug)} className="text-textSecondary hover:text-primary transition-colors">
                  {t('nav.collections')}
                </Link>
                <NavLink to={ROUTES.storeFavorites(storeSlug)} className={navLinkClass}>
                  {t('nav.favorites')}
                </NavLink>
                <NavLink to={ROUTES.storeCart(storeSlug)} className={navLinkClass}>
                  {t('nav.cart')}
                </NavLink>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <p className="font-bold text-xl text-textPrimary tracking-tight mb-3">{brand}</p>
            <p className="text-sm text-textSecondary leading-relaxed mb-5">{store?.description ?? t('layout.tagline')}</p>
            <div className="flex items-center gap-3 text-textSecondary">
              <a href="#" className="p-2 rounded-xl hover:bg-primaryLight hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-xl hover:bg-primaryLight hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-xl hover:bg-primaryLight hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.15em] text-textPrimary uppercase mb-4">{t('layout.shop')}</h3>
            <ul className="space-y-3 text-sm text-textSecondary">
              <li><Link to={ROUTES.storeProducts(storeSlug)} className="hover:text-primary transition-colors">{t('nav.newArrivals')}</Link></li>
              <li><Link to={ROUTES.storeProducts(storeSlug)} className="hover:text-primary transition-colors">{t('layout.bestSellers')}</Link></li>
              <li><Link to={ROUTES.storeCategories(storeSlug)} className="hover:text-primary transition-colors">{t('nav.collections')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.15em] text-textPrimary uppercase mb-4">{t('layout.company')}</h3>
            <ul className="space-y-3 text-sm text-textSecondary">
              <li><span className="hover:text-primary cursor-default">{t('layout.aboutUs')}</span></li>
              <li><span className="hover:text-primary cursor-default">{t('layout.shippingPolicy')}</span></li>
              <li><span className="hover:text-primary cursor-default">{t('layout.privacyPolicy')}</span></li>
              <li><span className="hover:text-primary cursor-default">{t('layout.contactSupport')}</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.15em] text-textPrimary uppercase mb-4">{t('layout.newsletter')}</h3>
            <p className="text-sm text-textSecondary leading-relaxed mb-4">{t('layout.newsletterHint')}</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder={t('layout.emailPlaceholder')}
                className="rounded-xl border border-inputBorder bg-appBg px-3 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary hover:bg-primaryHover text-white text-sm font-semibold py-2.5 transition-colors"
              >
                {t('layout.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-textSecondary">
            <p className="text-center sm:text-start">{t('layout.copyright', { year, brand })}</p>
            <span className="flex items-center gap-2 text-center sm:text-end">
              <span className="font-medium text-textPrimary">{t('layout.secureCheckout')}</span>
              <span aria-hidden>·</span>
              <span>{t('layout.sslEncrypted')}</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
