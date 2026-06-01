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
          'w-full rounded-2xl overflow-hidden border border-border bg-appBg transition-all',
          'group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/10',
          isLarge ? 'aspect-[4/3]' : 'aspect-square max-w-[140px] mx-auto',
        )}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center block group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-textSecondary/40 select-none" aria-hidden>
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <span
        className={clsx(
          'font-medium text-textSecondary group-hover:text-primary transition-colors line-clamp-2',
          isLarge ? 'mt-4 text-base' : 'mt-3 text-sm',
        )}
      >
        {name}
      </span>
    </Link>
  );
};
