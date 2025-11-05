import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pricingService from '../services/pricingService';
import type { PricingPlanDTO } from '../models/PricingTypes';
import { message } from 'antd';

export const PRICING_QUERY_KEYS = {
  plans: ['pricing', 'plans'] as const,
  plan: (id: string) => ['pricing', 'plan', id] as const,
} as const;

export const usePricingPlans = (options?: { enabled?: boolean; useStudentEndpoint?: boolean }) => {
  return useQuery({
    queryKey: [...PRICING_QUERY_KEYS.plans, options?.useStudentEndpoint ? 'student' : 'admin'],
    queryFn: async () => {
      const data = await pricingService.getAllPlans(true, options?.useStudentEndpoint ?? false);
      return data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePricing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PricingPlanDTO>) => pricingService.createPlan(data),
    onSuccess: () => {
      message.success('Tạo gói cước thành công');
      qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'pricing' });
    },
    onError: () => message.error('Tạo gói cước thất bại'),
  });
};

export const useUpdatePricing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PricingPlanDTO> }) =>
      pricingService.updatePlan(id, data),
    onSuccess: () => {
      message.success('Cập nhật gói cước thành công');
      qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'pricing' });
    },
    onError: () => message.error('Cập nhật gói cước thất bại'),
  });
};

export const useDeletePricing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pricingService.deletePlan(id),
    onSuccess: () => {
      message.success('Xóa gói cước thành công');
      qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'pricing' });
    },
    onError: () => message.error('Xóa gói cước thất bại'),
  });
};
