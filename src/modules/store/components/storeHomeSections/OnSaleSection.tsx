import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Tag } from 'lucide-react';
import { ROUTES } from '@/core/constants';
import type { Product } from '@/core/types';
import toast from 'react-hot-toast';

const ON_SALE_COUNT = 4;

function discountPercent(p: Product): number {
  if (!p.comparePrice || p.comparePrice <= p.price) return 0;
  return Math.round((1 - p.price / p.comparePrice) * 100);
}

function isOnSaleProduct(p: Product): boolean {
  return Boolean(p.comparePrice && p.comparePrice > p.price);
}

function pickOnSaleGrid(products: Product[]): Product[] {
  if (products.length === 0) return [];
  const withSale = products.filter(isOnSaleProduct);
  const saleIds = new Set(withSale.map((p) => p.id));
  const rest = products.filter((p) => !saleIds.has(p.id));
  return [...withSale, ...rest].slice(0, ON_SALE_COUNT);
}

interface OnSaleSectionProps {
  storeSlug: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const OnSaleSection: React.FC<OnSaleSectionProps> = ({ storeSlug, products, onAddToCart }) => {
  const { t } = useTranslation();
  const grid = useMemo(() => pickOnSaleGrid(products), [products]);

  if (grid.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 border-t border-slate-100">
      <div className="flex items-center justify-start gap-2 mb-10">
        <Tag className="text-red-500 shrink-0" size={22} strokeWidth={2} aria-hidden />
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{t('home.onSale.title')}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {grid.map((product) => {
          const pct = discountPercent(product);
          const hasCompare = Boolean(product.comparePrice && product.comparePrice > product.price);
          return (
            <article
              key={product.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link to={ROUTES.storeProduct(storeSlug, product.id)} className="block relative aspect-[4/3] bg-slate-50">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                {pct > 0 && (
                  <span className="absolute top-3 end-3 w-12 h-12 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    -{pct}%
                  </span>
                )}
              </Link>
              <div className="p-4 text-start">
                <Link to={ROUTES.storeProduct(storeSlug, product.id)}>
                  <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                  <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                  {hasCompare && (
                    <span className="text-sm text-slate-400 line-through">${product.comparePrice!.toFixed(2)}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product);
                    toast.success(t('common.toastAddedToCart'));
                  }}
                  disabled={product.stock === 0}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium py-2.5 disabled:opacity-40 transition-colors"
                >
                  <ShoppingCart size={16} className="text-slate-600" />
                  {product.stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
