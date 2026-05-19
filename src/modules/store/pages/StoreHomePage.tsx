import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DEFAULT_STORE_SLUG } from '@/core/constants';
import { useStorefrontProducts } from '@/modules/store/hooks/useStorefrontData';
import { useStore } from '@/modules/admin/hooks/useStores';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import type { Product } from '@/core/types';
import {
  StoreHomeHero,
  ShopByCategorySection,
  OnSaleSection,
  OurCatalogSection,
} from '@/modules/store/components/storeHomeSections';

const StoreHomePage: React.FC = () => {
  const { storeSlug: storeSlugParam } = useParams<{ storeSlug?: string }>();
  const storeSlug = storeSlugParam ?? DEFAULT_STORE_SLUG;
  const { data: store } = useStore(storeSlug);
  const { data: products = [], isLoading } = useStorefrontProducts(storeSlug);
  const addToCart = useCartStore((s) => s.addToCart);

  const handleAdd = useCallback(
    (product: Product) => {
      addToCart(storeSlug, product, 1);
    },
    [addToCart, storeSlug],
  );

  const storeName = store?.name ?? storeSlug;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 pt-8 sm:pt-10 space-y-0">
      <StoreHomeHero storeSlug={storeSlug} storeName={storeName} />
      <ShopByCategorySection storeSlug={storeSlug} products={products} />
      <OnSaleSection storeSlug={storeSlug} products={products} onAddToCart={handleAdd} />
      <OurCatalogSection
        storeSlug={storeSlug}
        products={products}
        isLoading={isLoading}
        onAddToCart={handleAdd}
      />
    </div>
  );
};

export default StoreHomePage;
