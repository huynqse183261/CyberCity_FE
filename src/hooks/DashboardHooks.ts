import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import dashboardService, { type DashboardStats, type SalesData, type RecentOrder, type DashboardData } from './../services/DashboardService';

// Hook for dashboard statistics
export const useDashboardStats = (): UseQueryResult<DashboardStats, Error> => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await dashboardService.getDashboardStats();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook for sales data
export const useSalesData = (): UseQueryResult<SalesData[], Error> => {
  return useQuery({ 
    queryKey: ['salesData'],
    queryFn: async () => {
      const response = await dashboardService.getSalesData();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data!;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime)
  });
};

// Hook for recent orders
export const useRecentOrders = (): UseQueryResult<RecentOrder[], Error> => {
  return useQuery({
    queryKey: ['recentOrders'],
    queryFn: async () => {
      const response = await dashboardService.getRecentOrders();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data!;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime)
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook for all dashboard data
export const useDashboardData = (): UseQueryResult<DashboardData, Error> => {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const response = await dashboardService.getDashboardData();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};