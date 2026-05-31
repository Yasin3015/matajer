import type { Product } from '@/core/types';

export function hasSalePrice(product: Pick<Product, 'price' | 'comparePrice'>): boolean {
  return (
    typeof product.comparePrice === 'number' &&
    product.comparePrice > 0 &&
    product.comparePrice > product.price
  );
}

export function saleDiscountPercent(product: Pick<Product, 'price' | 'comparePrice'>): number {
  if (!hasSalePrice(product)) return 0;
  return Math.round((1 - product.price / product.comparePrice!) * 100);
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
