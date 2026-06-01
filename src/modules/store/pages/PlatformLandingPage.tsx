import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Store,
  ArrowRight,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Check,
} from 'lucide-react';
import { mockStores } from '@/modules/admin/mock/stores.mock';
import { ROUTES, DEFAULT_STORE_SLUG } from '@/core/constants';
import { Button } from '@/shared/ui/Button';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { usePublicPlans } from '@/modules/admin/hooks/usePlans';

const FEATURE_IDS = ['multiTenant', 'fullCommerce', 'teamRoles', 'analytics', 'blazing', 'rbac'] as const;

const featureIcons: Record<(typeof FEATURE_IDS)[number], React.ReactNode> = {
  multiTenant:  <Store size={22} />,
  fullCommerce: <ShoppingCart size={22} />,
  teamRoles:    <Users size={22} />,
  analytics:    <TrendingUp size={22} />,
  blazing:      <Zap size={22} />,
  rbac:         <Shield size={22} />,
};

const PlatformLandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'ar';
  const { data: plans = [], isLoading: loadingPlans } = usePublicPlans();

  return (
    <div className="min-h-screen bg-appBg" dir={rtl ? 'rtl' : 'ltr'} lang={i18n.language}>
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to={ROUTES.PLATFORM} className="flex items-center gap-3 group min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primaryHover flex items-center justify-center shadow-sm">
              <Store size={16} className="text-white" />
            </div>
            <span className="font-bold text-textPrimary text-lg truncate">Matajer</span>
          </Link>
          <div className="flex items-center gap-3 shrink-0">
            <LanguageSwitcher />
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" size="sm">{t('platform.signIn')}</Button>
            </Link>
            <Link to={ROUTES.VENDOR_REGISTER}>
              <Button size="sm">{t('platform.ctaPrimary')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center bg-white">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primaryHover/5 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primaryLight border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Globe size={14} aria-hidden />
            {t('platform.badge')}
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-textPrimary leading-tight mb-6">
            {t('platform.heroBefore')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primaryHover">
              {t('platform.heroHighlight')}
            </span>
            <br />
            {t('platform.heroAfter')}
          </h1>
          <p className="text-textSecondary text-xl max-w-2xl mx-auto mb-10">{t('platform.heroSub')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.VENDOR_REGISTER}>
              <Button size="lg" icon={<ArrowRight size={20} className={rtl ? 'rotate-180' : undefined} />}>
                {t('platform.ctaPrimary')}
              </Button>
            </Link>
            <Link to={ROUTES.store(DEFAULT_STORE_SLUG)}>
              <Button variant="secondary" size="lg" icon={<Store size={20} />}>
                {t('platform.ctaDemo')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-textPrimary text-center mb-3">{t('platform.featuresTitle')}</h2>
        <p className="text-textSecondary text-center mb-12">Everything you need to run a successful online store.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURE_IDS.map((id) => (
            <div
              key={id}
              className="bg-white border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <div className="w-11 h-11 rounded-xl bg-primaryLight flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {featureIcons[id]}
              </div>
              <h3 className="font-semibold text-textPrimary mb-1">{t(`platform.features.${id}.title`)}</h3>
              <p className="text-sm text-textSecondary">{t(`platform.features.${id}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 bg-white rounded-3xl mx-4">
        <h2 className="text-3xl font-bold text-textPrimary text-center mb-3">{t('platform.pricingTitle')}</h2>
        <p className="text-textSecondary text-center mb-12">{t('platform.pricingSub')}</p>

        {loadingPlans ? (
          <div className="text-center text-textSecondary">{t('platform.pricingLoading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans
              .filter((p) => p.is_active)
              .map((plan) => {
                const isPro = plan.name.toLowerCase() === 'pro';
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                      isPro
                        ? 'border-2 border-primary bg-white'
                        : 'border border-border bg-white hover:border-primary/30'
                    }`}
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  >
                    {isPro && (
                      <div className="absolute top-0 start-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {t('platform.pricingPopular')}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-textPrimary mb-2 text-center">{plan.name}</h3>
                    <div className="text-center mb-6">
                      <span className="text-4xl font-extrabold text-textPrimary">${Number(plan.price).toFixed(2)}</span>
                      <span className="text-textSecondary text-sm block mt-1">
                        {t('platform.pricingDuration', { days: plan.duration_days })}
                      </span>
                    </div>
                    <div className="flex-1 space-y-3 mb-8">
                      {[
                        plan.features?.products_limit == null
                          ? t('platform.pricingUnlimitedProducts')
                          : t('platform.pricingProductsLimit', { count: plan.features?.products_limit }),
                        plan.features?.orders_limit == null
                          ? t('platform.pricingUnlimitedOrders')
                          : t('platform.pricingOrdersLimit', { count: plan.features?.orders_limit }),
                        t('platform.pricingSupport', { level: plan.features?.support ?? t('platform.pricingSupportStandard') }),
                        ...(plan.features?.custom_domain ? [t('platform.pricingCustomDomain')] : []),
                      ].map((item) => (
                        <p key={item} className="flex items-center gap-3 text-sm text-textSecondary">
                          <Check size={16} className="text-success shrink-0" />
                          {item}
                        </p>
                      ))}
                    </div>
                    <Link to={ROUTES.VENDOR_REGISTER} className="mt-auto">
                      <Button className="w-full justify-center" variant={isPro ? 'primary' : 'secondary'}>
                        {t('platform.pricingGetStarted')}
                      </Button>
                    </Link>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* ── Live Stores ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-textPrimary text-center mb-3">{t('platform.storesTitle')}</h2>
        <p className="text-textSecondary text-center mb-12">{t('platform.storesSub')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockStores.map((store) => (
            <Link key={store.id} to={ROUTES.store(store.slug)} className="group">
              <div
                className="bg-white border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primaryLight flex items-center justify-center text-primary mb-4">
                  <Store size={24} />
                </div>
                <h3 className="font-bold text-textPrimary text-lg mb-1">{store.name}</h3>
                <p className="text-sm text-textSecondary mb-4">{store.description}</p>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex gap-4 text-xs text-textSecondary">
                    <span className="flex items-center gap-1"><Package size={12} aria-hidden /> {t('platform.productCount', { count: store.productCount })}</span>
                    <span className="flex items-center gap-1"><ShoppingCart size={12} aria-hidden /> {t('platform.orderCount', { count: store.orderCount })}</span>
                  </div>
                  <span className="text-primary text-xs font-semibold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    {t('platform.visit')} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 text-center">
        <div
          className="max-w-2xl mx-auto rounded-3xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #0051D5 0%, #316BF3 100%)' }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">{t('platform.ctaEndTitle')}</h2>
          <p className="text-white/80 mb-8">{t('platform.ctaEndHint')}</p>
          <Link to={ROUTES.LOGIN}>
            <button className="inline-flex items-center gap-2 bg-white text-primary hover:bg-primaryLight font-bold text-sm px-8 py-3.5 rounded-xl transition-colors shadow-lg">
              {t('platform.ctaEndButton')}
              <ArrowRight size={18} className={rtl ? 'rotate-180' : undefined} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-white py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Store size={16} className="text-primary" aria-hidden />
          <span className="font-semibold text-textPrimary">Matajer</span>
        </div>
        <p className="text-xs text-textSecondary">{t('platform.footerTag')}</p>
      </footer>
    </div>
  );
};

export default PlatformLandingPage;
