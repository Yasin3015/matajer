import { useQuery } from '@tanstack/react-query';
import { getCustomersByStore } from '../mock/customers.mock';

export function useCustomers(storeSlug: string) {
  return useQuery({
    queryKey: ['customers', storeSlug],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return getCustomersByStore(storeSlug);
    },
    staleTime: 1000 * 60 * 5,
  });
}
