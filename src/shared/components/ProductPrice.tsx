import React from 'react';
import clsx from 'clsx';
import { formatPrice, hasSalePrice } from '@/shared/utils/productPrice';

interface ProductPriceProps {
  price: number;
  comparePrice?: number;
  size?: 'sm' | 'md' | 'lg';
  /** Highlight sale price in brand blue (used on promotional sections). */
  highlightSale?: boolean;
  className?: string;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  comparePrice,
  size = 'md',
  highlightSale = false,
  className,
}) => {
  const onSale = hasSalePrice({ price, comparePrice });

  const saleClasses = {
    sm: 'text-sm font-bold',
    md: 'text-base font-bold',
    lg: 'text-4xl font-extrabold',
  };

  const originalClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
  };

  if (!onSale) {
    return (
      <span className={clsx(saleClasses[size], 'text-slate-900', className)}>
        {formatPrice(price)}
      </span>
    );
  }

  return (
    <div className={clsx('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={clsx(originalClasses[size], 'text-slate-400 line-through')}>
        {formatPrice(comparePrice!)}
      </span>
      <span
        className={clsx(
          saleClasses[size],
          highlightSale ? 'text-blue-600' : 'text-slate-900',
        )}
      >
        {formatPrice(price)}
      </span>
    </div>
  );
};
