import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Query client configuration với tối ưu performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Thời gian data được coi là "fresh" - tăng lên để giảm API calls
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time: Thời gian data được giữ trong cache sau khi không dùng
      gcTime: 30 * 60 * 1000, // 30 minutes (tối ưu hơn 1000 phút - quá lớn)
      
      // Network mode - tối ưu cho slow/offline networks
      networkMode: 'online',
      
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Không retry với lỗi 401, 403, 404
        if (error?.response?.status === 401 || 
            error?.response?.status === 403 || 
            error?.response?.status === 404) {
          return false;
        }
        // Retry tối đa 1 lần cho các lỗi khác (giảm để tăng tốc độ)
        return failureCount < 1;
      },
      
      // Retry delay - exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
      
      // Refetch configuration - tối ưu để giảm API calls
      refetchOnWindowFocus: false, // Không refetch khi focus window - tiết kiệm bandwidth
      refetchOnMount: false,        // Không refetch khi mount nếu data còn fresh - dùng cache
      refetchOnReconnect: true,     // Vẫn refetch khi reconnect network
      
      // Background refetch
      refetchInterval: false,       // Không auto refetch theo interval (trừ khi set riêng)
    },
    mutations: {
      // Retry configuration cho mutations
      retry: (failureCount, error: any) => {
        // Không retry với lỗi client (4xx)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry 1 lần cho server errors (5xx)
        return failureCount < 1;
      },
    },
  },
});

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

// Component wrapper để setup prefetching
const PrefetchWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Setup prefetch cho critical data khi app load
  useEffect(() => {
    // Có thể thêm prefetch logic tại đây nếu cần
    // Ví dụ: prefetch user profile, settings, etc.
  }, []);

  return <>{children}</>;
};

const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PrefetchWrapper>
        {children}
      </PrefetchWrapper>
      {/* Chỉ hiển thị DevTools trong development */}
      {/* Tạm thời comment để fix lỗi jsx runtime
      {import.meta.env.VITE_NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-left"
        />
      )}
      */}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;

// Export query client để sử dụng ở nơi khác nếu cần
export { queryClient };