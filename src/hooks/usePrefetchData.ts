import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook để prefetch các data quan trọng
 * Giúp tăng tốc độ load cho các trang sẽ được truy cập tiếp theo
 */
export const usePrefetchData = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Prefetch data cho student
    if (user.role === 'student') {
      // Prefetch subscription data
      queryClient.prefetchQuery({
        queryKey: ['subscriptions'],
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      // Prefetch pricing data
      queryClient.prefetchQuery({
        queryKey: ['pricing'],
        staleTime: 10 * 60 * 1000, // 10 minutes
      });

      // Prefetch courses overview
      queryClient.prefetchQuery({
        queryKey: ['courses'],
        staleTime: 5 * 60 * 1000,
      });
    }

    // Prefetch data cho admin
    if (user.role === 'admin') {
      // Prefetch dashboard stats
      queryClient.prefetchQuery({
        queryKey: ['dashboard-stats'],
        staleTime: 2 * 60 * 1000, // 2 minutes
      });

      // Prefetch orders
      queryClient.prefetchQuery({
        queryKey: ['orders'],
        staleTime: 1 * 60 * 1000, // 1 minute
      });
    }
  }, [isAuthenticated, user, queryClient]);
};

/**
 * Hook để prefetch data khi hover vào link
 * Sử dụng cho các navigation links
 */
export const usePrefetchOnHover = () => {
  const queryClient = useQueryClient();

  const prefetchOnHover = (queryKey: string[], queryFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchOnHover };
};

