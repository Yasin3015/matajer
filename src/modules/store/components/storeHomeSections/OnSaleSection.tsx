import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Tag } from 'lucide-react';
import { ROUTES } from '@/core/constants';
import type { Product } from '@/core/types';
import { ProductPrice } from '@/shared/components/ProductPrice';
import { hasSalePrice, saleDiscountPercent } from '@/shared/utils/productPrice';
import toast from 'react-hot-toast';

const ON_SALE_COUNT = 4;

function pickOnSaleGrid(products: Product[]): Product[] {
  if (products.length === 0) return [];
  const withSale = products.filter(hasSalePrice);
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
          const pct = saleDiscountPercent(product);
          return (
            <article
              key={product.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                to={ROUTES.storeProduct(storeSlug, product.id)}
                className="block relative aspect-[4/3] bg-slate-50 flex items-center justify-center p-3"
              >
                <img
                  src={product.images[0]}
                  alt=""
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
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
                <div className="mt-2">
                  <ProductPrice
                    price={product.price}
                    comparePrice={product.comparePrice}
                    size="sm"
                    highlightSale
                  />
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
