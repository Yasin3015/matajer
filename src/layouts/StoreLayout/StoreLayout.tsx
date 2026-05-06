import React from 'react';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Store, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/core/constants';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { useStore } from '@/modules/admin/hooks/useStores';

export const StoreLayout: React.FC = () => {
  const { storeSlug = '' } = useParams<{ storeSlug: string }>();
  const { data: store } = useStore(storeSlug);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const itemCount = getItemCount(storeSlug);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-surface-card/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Back + Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-surface-hover"
              aria-label="Back to platform"
            >
              <ArrowLeft size={18} />
            </button>
            <Link to={ROUTES.store(storeSlug)} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-bold text-white group-hover:text-brand-300 transition-colors">
                {store?.name ?? storeSlug}
              </span>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to={ROUTES.store(storeSlug)} className="text-sm text-slate-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to={ROUTES.storeProducts(storeSlug)} className="text-sm text-slate-400 hover:text-white transition-colors">
              Products
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-white hover:bg-surface-hover p-2 rounded-lg transition-colors">
              <Search size={18} />
            </button>
            <Link
              to={ROUTES.storeCart(storeSlug)}
              className="relative text-slate-400 hover:text-white hover:bg-surface-hover p-2 rounded-lg transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-card py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Store size={16} className="text-brand-400" />
            <span className="text-sm font-medium text-white">{store?.name ?? storeSlug}</span>
          </div>
          <p className="text-xs text-slate-500">Powered by <span className="text-brand-400 font-medium">Matajer</span></p>
        </div>
      </footer>
    </div>
  );
};
