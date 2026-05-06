import { useQuery } from '@tanstack/react-query';
import { getOrdersByStore } from '../mock/orders.mock';

export function useOrders(storeSlug: string) {
  return useQuery({
    queryKey: ['orders', storeSlug],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return getOrdersByStore(storeSlug);
    },
    staleTime: 1000 * 60 * 2,
  });
}
