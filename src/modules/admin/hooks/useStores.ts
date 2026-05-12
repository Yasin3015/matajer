// useStores is now a thin wrapper around the real /vendors API.
// Kept the same function signatures so StoresPage & AdminDashboardPage
// don't need to change their imports.
export { useVendors as useStores, useVendors } from './useVendors';

// Single-vendor lookup by slug (used by StoreLayout etc.)
import { useQuery } from '@tanstack/react-query';
import { vendorsService } from '../services/vendorsService';

export function useStore(slug: string) {
  return useQuery({
    queryKey: ['vendors', 'slug', slug],
    queryFn: async () => {
      const res = await vendorsService.getAll();
      return res.data.data.find((v) => v.slug === slug) ?? null;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
