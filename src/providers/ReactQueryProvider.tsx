import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Thời gian data được coi là "fresh" - tăng lên để giảm API calls
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time: Thời gian data được giữ trong cache sau khi không dùng - tăng lên
      gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime in v4) - tăng từ 10 phút
      
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Không retry với lỗi 401, 403, 404
        if (error?.response?.status === 401 || 
            error?.response?.status === 403 || 
            error?.response?.status === 404) {
          return false;
        }
        // Retry tối đa 2 lần cho các lỗi khác (giảm từ 3 để tăng tốc độ)
        return failureCount < 2;
      },
      
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

const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Chỉ hiển thị DevTools trong development */}
      {import.meta.env.VITE_NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;

// Export query client để sử dụng ở nơi khác nếu cần
export { queryClient };