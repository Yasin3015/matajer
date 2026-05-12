import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansService, UpdatePlanPayload } from '../services/plansService';
import { Plan } from '@/core/types';

export const usePlans = () => {
  return useQuery({
    queryKey: ['admin_plans'],
    queryFn: async () => {
      const res = await plansService.getAll();
      return res.data.data;
    },
  });
};

export const usePublicPlans = () => {
  return useQuery({
    queryKey: ['public_plans'],
    queryFn: async (): Promise<Plan[]> => {
      const res = await plansService.getPublic();
      // res.data could be an array or an object with a data property
      const responseData = res.data as any;
      return Array.isArray(responseData) ? responseData : responseData.data;
    },
  });
};

export const usePlan = (id: string | number) => {
  return useQuery({
    queryKey: ['admin_plan', id],
    queryFn: async () => {
      const res = await plansService.getOne(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const usePublicPlan = (id: string | number) => {
  return useQuery({
    queryKey: ['public_plan', id],
    queryFn: async () => {
      const res = await plansService.getPublicDetail(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdatePlanPayload }) =>
      plansService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin_plans'] });
      queryClient.invalidateQueries({ queryKey: ['admin_plan', id] });
      queryClient.invalidateQueries({ queryKey: ['public_plans'] });
    },
  });
};
