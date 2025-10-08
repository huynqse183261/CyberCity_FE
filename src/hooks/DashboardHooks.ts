import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import dashboardService, { 
  type DashboardStats, 
  type SalesData, 
  type RecentOrder, 
  type RecentActivity,
  type DashboardData 
} from './../services/DashboardService';

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
export const useSalesData = (year?: number): UseQueryResult<SalesData[], Error> => {
  return useQuery({ 
    queryKey: ['salesData', year],
    queryFn: async () => {
      const response = await dashboardService.getSalesData(year);
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
export const useRecentOrders = (count?: number): UseQueryResult<RecentOrder[], Error> => {
  return useQuery({
    queryKey: ['recentOrders', count],
    queryFn: async () => {
      const response = await dashboardService.getRecentOrders(count);
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

// Hook for recent activities
export const useRecentActivities = (count?: number): UseQueryResult<RecentActivity[], Error> => {
  return useQuery({
    queryKey: ['recentActivities', count],
    queryFn: async () => {
      const response = await dashboardService.getRecentActivities(count);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data!;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 30000, // Refetch every 30 seconds
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