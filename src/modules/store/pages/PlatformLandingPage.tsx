import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowRight, ShoppingCart, Users, Package, TrendingUp, Zap, Shield, Globe, Check } from 'lucide-react';
import { mockStores } from '@/modules/admin/mock/stores.mock';
import { ROUTES } from '@/core/constants';
import { Button } from '@/shared/ui/Button';
import { usePublicPlans } from '@/modules/admin/hooks/usePlans';

const features = [
  { icon: <Store size={22} />, title: 'Multi-Tenant', description: 'Each store gets its own branded storefront and admin dashboard.' },
  { icon: <ShoppingCart size={22} />, title: 'Full E-Commerce', description: 'Products, orders, customers, and checkout — all built in.' },
  { icon: <Users size={22} />, title: 'Team Roles', description: 'Store Admin and Manager roles with granular access control.' },
  { icon: <TrendingUp size={22} />, title: 'Analytics', description: 'Revenue, orders, and customer insights at a glance.' },
  { icon: <Zap size={22} />, title: 'Blazing Fast', description: 'Built with Vite + React Query for optimal performance.' },
  { icon: <Shield size={22} />, title: 'Role-Based Auth', description: 'Protected routes and role-based UI rendering.' },
];

const PlatformLandingPage: React.FC = () => {
  const { data: plans = [], isLoading: loadingPlans } = usePublicPlans();

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-surface-card/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Store size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">Matajer</span>
          </div>
          <Link to={ROUTES.LOGIN}>
            <Button variant="secondary" size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-900/30 border border-brand-700/30 text-brand-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Globe size={14} />
            Multi-Tenant SaaS E-Commerce Platform
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-tight mb-6">
            Launch Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600"> Online Store</span>
            <br />In Minutes
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-10">
            Matajer is a scalable multi-tenant SaaS platform. Create stores, manage products, track orders, and grow your business — all from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.VENDOR_REGISTER}>
              <Button size="lg" icon={<ArrowRight size={20} />}>Get Started Free</Button>
            </Link>
            <Link to={ROUTES.store('demo-store')}>
              <Button variant="secondary" size="lg" icon={<Store size={20} />}>View Demo Store</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-900/20 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600/20 to-brand-800/10 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-3">Simple Pricing</h2>
        <p className="text-slate-400 text-center mb-12">Choose the plan that fits your business needs.</p>
        
        {loadingPlans ? (
          <div className="text-center text-slate-400">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.filter(p => p.is_active).map((plan) => (
              <div key={plan.id} className="card relative flex flex-col hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-900/30 transition-all duration-300 hover:-translate-y-2">
                {/* Popular Badge Example if you wanted to add it logic-based */}
                {plan.name.toLowerCase() === 'pro' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2 text-center">{plan.name}</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold text-white">${Number(plan.price).toFixed(2)}</span>
                  <span className="text-slate-400 text-sm block mt-1">/ {plan.duration_days} days</span>
                </div>
                <div className="flex-1 space-y-4 mb-8">
                  <p className="flex items-center gap-3 text-sm text-slate-300">
                    <Check size={18} className="text-brand-400" />
                    {plan.features?.products_limit === null ? 'Unlimited Products' : `${plan.features?.products_limit} Products`}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-slate-300">
                    <Check size={18} className="text-brand-400" />
                    {plan.features?.orders_limit === null ? 'Unlimited Orders' : `${plan.features?.orders_limit} Orders`}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-slate-300">
                    <Check size={18} className="text-brand-400" />
                    {plan.features?.support || 'Standard'} Support
                  </p>
                  {plan.features?.custom_domain && (
                    <p className="flex items-center gap-3 text-sm text-slate-300">
                      <Check size={18} className="text-brand-400" />
                      Custom Domain
                    </p>
                  )}
                </div>
                <Button className="w-full" variant={plan.name.toLowerCase() === 'pro' ? 'primary' : 'secondary'}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Live Stores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-3">Demo Stores</h2>
        <p className="text-slate-400 text-center mb-12">Explore the 3 live demo storefronts on this platform.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockStores.map((store) => (
            <Link key={store.id} to={ROUTES.store(store.slug)} className="group">
              <div className="card hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-900/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600/20 to-brand-800/10 flex items-center justify-center text-brand-400 mb-4">
                  <Store size={24} />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{store.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{store.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Package size={12} /> {store.productCount} products</span>
                    <span className="flex items-center gap-1"><ShoppingCart size={12} /> {store.orderCount} orders</span>
                  </div>
                  <span className="text-brand-400 text-xs font-medium group-hover:translate-x-1 transition-transform">Visit →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto card bg-gradient-to-br from-brand-900/40 to-brand-800/10 border-brand-700/30">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to start selling?</h2>
          <p className="text-slate-400 mb-6">Create your store and start exploring the full dashboard in seconds.</p>
          <Link to={ROUTES.VENDOR_REGISTER}>
            <Button size="lg" icon={<ArrowRight size={20} />}>Create Your Store</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Store size={16} className="text-brand-400" />
          <span className="font-semibold text-white">Matajer</span>
        </div>
        <p className="text-xs text-slate-600">Multi-Tenant SaaS E-Commerce · Frontend Architecture Demo</p>
      </footer>
    </div>
  );
};

export default PlatformLandingPage;
