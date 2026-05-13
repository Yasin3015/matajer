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
  multiTenant: <Store size={22} />,
  fullCommerce: <ShoppingCart size={22} />,
  teamRoles: <Users size={22} />,
  analytics: <TrendingUp size={22} />,
  blazing: <Zap size={22} />,
  rbac: <Shield size={22} />,
};

const PlatformLandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const rtl = i18n.language === 'ar';
  const { data: plans = [], isLoading: loadingPlans } = usePublicPlans();

  return (
    <div className="min-h-screen bg-surface" dir={rtl ? 'rtl' : 'ltr'} lang={i18n.language}>
      <header className="sticky top-0 z-30 bg-surface-card/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to={ROUTES.PLATFORM} className="flex items-center gap-3 group min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center group-hover:opacity-90 transition-opacity shrink-0">
              <Store size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg truncate">Matajer</span>
          </Link>
          <div className="flex items-center gap-3 shrink-0">
            <LanguageSwitcher variant="dark" />
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" size="sm">
                {t('platform.signIn')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-900/30 border border-brand-700/30 text-brand-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Globe size={14} aria-hidden />
            {t('platform.badge')}
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-tight mb-6">
            {t('platform.heroBefore')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
              {t('platform.heroHighlight')}
            </span>
            <br />
            {t('platform.heroAfter')}
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-10">{t('platform.heroSub')}</p>
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">{t('platform.featuresTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURE_IDS.map((id) => (
            <div
              key={id}
              className="card hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-900/20 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600/20 to-brand-800/10 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                {featureIcons[id]}
              </div>
              <h3 className="font-semibold text-white mb-1">{t(`platform.features.${id}.title`)}</h3>
              <p className="text-sm text-slate-400">{t(`platform.features.${id}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-3">{t('platform.pricingTitle')}</h2>
        <p className="text-slate-400 text-center mb-12">{t('platform.pricingSub')}</p>

        {loadingPlans ? (
          <div className="text-center text-slate-400">{t('platform.pricingLoading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans
              .filter((p) => p.is_active)
              .map((plan) => (
                <div
                  key={plan.id}
                  className="card relative flex flex-col hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-900/30 transition-all duration-300 hover:-translate-y-2"
                >
                  {plan.name.toLowerCase() === 'pro' && (
                    <div className="absolute top-0 start-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {t('platform.pricingPopular')}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2 text-center">{plan.name}</h3>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-extrabold text-white">${Number(plan.price).toFixed(2)}</span>
                    <span className="text-slate-400 text-sm block mt-1">
                      {t('platform.pricingDuration', { days: plan.duration_days })}
                    </span>
                  </div>
                  <div className="flex-1 space-y-4 mb-8">
                    <p className="flex items-center gap-3 text-sm text-slate-300">
                      <Check size={18} className="text-brand-400 shrink-0" />
                      {plan.features?.products_limit == null
                        ? t('platform.pricingUnlimitedProducts')
                        : t('platform.pricingProductsLimit', { count: plan.features?.products_limit })}
                    </p>
                    <p className="flex items-center gap-3 text-sm text-slate-300">
                      <Check size={18} className="text-brand-400 shrink-0" />
                      {plan.features?.orders_limit == null
                        ? t('platform.pricingUnlimitedOrders')
                        : t('platform.pricingOrdersLimit', { count: plan.features?.orders_limit })}
                    </p>
                    <p className="flex items-center gap-3 text-sm text-slate-300">
                      <Check size={18} className="text-brand-400 shrink-0" />
                      {t('platform.pricingSupport', {
                        level: plan.features?.support ?? t('platform.pricingSupportStandard'),
                      })}
                    </p>
                    {plan.features?.custom_domain && (
                      <p className="flex items-center gap-3 text-sm text-slate-300">
                        <Check size={18} className="text-brand-400 shrink-0" />
                        {t('platform.pricingCustomDomain')}
                      </p>
                    )}
                  </div>
                  <Link to={ROUTES.VENDOR_REGISTER} className="mt-auto">
                    <Button className="w-full" variant={plan.name.toLowerCase() === 'pro' ? 'primary' : 'secondary'}>
                      {t('platform.pricingGetStarted')}
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-3">{t('platform.storesTitle')}</h2>
        <p className="text-slate-400 text-center mb-12">{t('platform.storesSub')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockStores.map((store) => (
            <Link key={store.id} to={ROUTES.store(store.slug)} className="group">
              <div className="card hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-900/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600/20 to-brand-800/10 flex items-center justify-center text-brand-400 mb-4">
                  <Store size={24} />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{store.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{store.description}</p>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Package size={12} aria-hidden /> {t('platform.productCount', { count: store.productCount })}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingCart size={12} aria-hidden /> {t('platform.orderCount', { count: store.orderCount })}
                    </span>
                  </div>
                  <span className="text-brand-400 text-xs font-medium group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    {t('platform.visit')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto card bg-gradient-to-br from-brand-900/40 to-brand-800/10 border-brand-700/30">
          <h2 className="text-3xl font-bold text-white mb-3">{t('platform.ctaEndTitle')}</h2>
          <p className="text-slate-400 mb-6">{t('platform.ctaEndHint')}</p>
          <Link to={ROUTES.LOGIN}>
            <Button size="lg" icon={<ArrowRight size={20} className={rtl ? 'rotate-180' : undefined} />}>
              {t('platform.ctaEndButton')}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-surface-border py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Store size={16} className="text-brand-400" aria-hidden />
          <span className="font-semibold text-white">Matajer</span>
        </div>
        <p className="text-xs text-slate-600">{t('platform.footerTag')}</p>
      </footer>
    </div>
  );
};

export default PlatformLandingPage;
