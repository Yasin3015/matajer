import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ROUTES } from '@/core/constants';

interface StorefrontCategoryCardProps {
  storeSlug: string;
  name: string;
  /** Category slug or id used in the products page filter query param. */
  slug: string;
  image?: string;
  to?: string;
  className?: string;
  /** Larger image container for the dedicated categories page. */
  size?: 'compact' | 'large';
}

export const StorefrontCategoryCard: React.FC<StorefrontCategoryCardProps> = ({
  storeSlug,
  name,
  slug,
  image,
  to,
  className,
  size = 'compact',
}) => {
  const href = to ?? `${ROUTES.storeProducts(storeSlug)}?category=${encodeURIComponent(slug)}`;
  const isLarge = size === 'large';

  return (
    <Link
      to={href}
      className={clsx('group flex flex-col items-center text-center', className)}
    >
      <div
        className={clsx(
          'w-full rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-sm bg-slate-50 flex items-center justify-center transition-all',
          'group-hover:ring-blue-400/50 group-hover:shadow-md',
          isLarge ? 'aspect-[4/3] max-w-none p-4 sm:p-6' : 'aspect-square max-w-[140px] mx-auto p-3',
        )}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-2xl sm:text-3xl font-bold text-slate-300 select-none" aria-hidden>
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span
        className={clsx(
          'font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2',
          isLarge ? 'mt-4 text-base' : 'mt-3 text-sm',
        )}
      >
        {name}
      </span>
    </Link>
  );
};
