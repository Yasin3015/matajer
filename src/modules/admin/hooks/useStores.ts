import { useQuery } from '@tanstack/react-query';
import { mockStores } from '@/modules/admin/mock/stores.mock';

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockStores;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useStore(slug: string) {
  return useQuery({
    queryKey: ['store', slug],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockStores.find((s) => s.slug === slug) ?? null;
    },
    enabled: !!slug,
  });
}
