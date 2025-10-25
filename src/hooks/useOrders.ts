import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import orderService, { 
  type OrderDto, 
  type OrderListResponse, 
  type OrderStatsResponse,
  type OrderSearchParams,
  type CreateOrderRequest,
  type UpdateOrderRequest
} from '../services/orderService';

// ==========================================
// ORDERS HOOK
// ==========================================

interface UseOrdersReturn {
  // State
  loading: boolean;
  orders: OrderDto[];
  selectedOrder: OrderDto | null;
  stats: OrderStatsResponse | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  
  // Search & Filter
  searchText: string;
  filters: {
    paymentStatus: string;
    approvalStatus: string;
    orgUid: string;
    planUid: string;
    dateFrom: string;
    dateTo: string;
  };
  
  // Actions
  loadOrders: (params?: OrderSearchParams) => Promise<void>;
  loadOrderById: (uid: string) => Promise<OrderDto | null>;
  createOrder: (orderData: CreateOrderRequest) => Promise<OrderDto | null>;
  updateOrder: (uid: string, orderData: UpdateOrderRequest) => Promise<OrderDto | null>;
  deleteOrder: (uid: string) => Promise<boolean>;
  approveOrder: (uid: string, notes?: string) => Promise<OrderDto | null>;
  rejectOrder: (uid: string, notes: string) => Promise<OrderDto | null>;
  processPayment: (uid: string, paymentData: any) => Promise<boolean>;
  
  // Utilities
  handleSearch: (searchText: string) => void;
  handleFilter: (filterName: string, value: string) => void;
  handlePageChange: (page: number, pageSize?: number) => void;
  resetFilters: () => void;
  refreshOrders: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Export & Reports
  exportOrders: (format?: 'excel' | 'csv' | 'pdf') => Promise<string | null>;
  getPendingApprovals: () => Promise<OrderDto[]>;
}

export const useOrders = (): UseOrdersReturn => {
  // State management
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [stats, setStats] = useState<OrderStatsResponse | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Search & Filter state
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    paymentStatus: 'all',
    approvalStatus: 'all',
    orgUid: '',
    planUid: '',
    dateFrom: '',
    dateTo: ''
  });

  /**
   * Load orders with pagination and filtering
   */
  const loadOrders = useCallback(async (params: OrderSearchParams = {}) => {
    try {
      setLoading(true);
      
      const searchParams: OrderSearchParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchText || undefined,
        ...filters,
        ...params
      };
      
      // Clean up empty filter values
      Object.keys(searchParams).forEach(key => {
        const value = searchParams[key as keyof OrderSearchParams];
        if (!value || value === 'all' || value === '') {
          delete searchParams[key as keyof OrderSearchParams];
        }
      });

      const response: OrderListResponse = await orderService.getOrders(searchParams);
      
      setOrders(response.orders);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
      setItemsPerPage(response.pagination.itemsPerPage);
      setHasNext(response.pagination.hasNext);
      setHasPrevious(response.pagination.hasPrevious);
      
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchText, filters]);

  /**
   * Load order by ID
   */
  const loadOrderById = useCallback(async (uid: string): Promise<OrderDto | null> => {
    try {
      setLoading(true);
      const order = await orderService.getOrderById(uid);
      setSelectedOrder(order);
      return order;
    } catch (error: any) {
      console.error('Failed to load order:', error);
      message.error('Không thể tải thông tin đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new order
   */
  const createOrder = useCallback(async (orderData: CreateOrderRequest): Promise<OrderDto | null> => {
    try {
      setLoading(true);
      const newOrder = await orderService.createOrder(orderData);
      
      message.success('Tạo đơn hàng thành công!');
      await refreshOrders();
      return newOrder;
      
    } catch (error: any) {
      console.error('Failed to create order:', error);
      message.error(error.response?.data?.error?.message || 'Không thể tạo đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update existing order
   */
  const updateOrder = useCallback(async (uid: string, orderData: UpdateOrderRequest): Promise<OrderDto | null> => {
    try {
      setLoading(true);
      const updatedOrder = await orderService.updateOrder(uid, orderData);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.uid === uid ? updatedOrder : order
      ));
      
      if (selectedOrder?.uid === uid) {
        setSelectedOrder(updatedOrder);
      }
      
      message.success('Cập nhật đơn hàng thành công!');
      return updatedOrder;
      
    } catch (error: any) {
      console.error('Failed to update order:', error);
      message.error(error.response?.data?.error?.message || 'Không thể cập nhật đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  /**
   * Delete order
   */
  const deleteOrder = useCallback(async (uid: string): Promise<boolean> => {
    try {
      setLoading(true);
      await orderService.deleteOrder(uid);
      
      // Remove from local state
      setOrders(prev => prev.filter(order => order.uid !== uid));
      
      if (selectedOrder?.uid === uid) {
        setSelectedOrder(null);
      }
      
      message.success('Xóa đơn hàng thành công!');
      return true;
      
    } catch (error: any) {
      console.error('Failed to delete order:', error);
      message.error(error.response?.data?.error?.message || 'Không thể xóa đơn hàng');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  /**
   * Approve order
   */
  const approveOrder = useCallback(async (uid: string, notes?: string): Promise<OrderDto | null> => {
    try {
      setLoading(true);
      const approvedOrder = await orderService.approveOrder(uid, { notes });
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.uid === uid ? approvedOrder : order
      ));
      
      if (selectedOrder?.uid === uid) {
        setSelectedOrder(approvedOrder);
      }
      
      message.success('Phê duyệt đơn hàng thành công!');
      await refreshStats();
      return approvedOrder;
      
    } catch (error: any) {
      console.error('Failed to approve order:', error);
      message.error(error.response?.data?.error?.message || 'Không thể phê duyệt đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  /**
   * Reject order
   */
  const rejectOrder = useCallback(async (uid: string, notes: string): Promise<OrderDto | null> => {
    try {
      setLoading(true);
      const rejectedOrder = await orderService.rejectOrder(uid, { notes });
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.uid === uid ? rejectedOrder : order
      ));
      
      if (selectedOrder?.uid === uid) {
        setSelectedOrder(rejectedOrder);
      }
      
      message.success('Từ chối đơn hàng thành công!');
      await refreshStats();
      return rejectedOrder;
      
    } catch (error: any) {
      console.error('Failed to reject order:', error);
      message.error(error.response?.data?.error?.message || 'Không thể từ chối đơn hàng');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  /**
   * Process payment for order
   */
  const processPayment = useCallback(async (uid: string, paymentData: any): Promise<boolean> => {
    try {
      setLoading(true);
      await orderService.processPayment(uid, paymentData);
      
      // Reload order to get updated payment status
      await loadOrderById(uid);
      await refreshOrders();
      await refreshStats();
      
      message.success('Xử lý thanh toán thành công!');
      return true;
      
    } catch (error: any) {
      console.error('Failed to process payment:', error);
      message.error(error.response?.data?.error?.message || 'Không thể xử lý thanh toán');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle search
   */
  const handleSearch = useCallback((newSearchText: string) => {
    setSearchText(newSearchText);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  /**
   * Handle filter change
   */
  const handleFilter = useCallback((filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize && pageSize !== itemsPerPage) {
      setItemsPerPage(pageSize);
    }
  }, [itemsPerPage]);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setSearchText('');
    setFilters({
      paymentStatus: 'all',
      approvalStatus: 'all',
      orgUid: '',
      planUid: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  }, []);

  /**
   * Refresh orders list
   */
  const refreshOrders = useCallback(async () => {
    await loadOrders();
  }, [loadOrders]);

  /**
   * Load and refresh stats
   */
  const refreshStats = useCallback(async () => {
    try {
      const statsData = await orderService.getOrderStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Failed to load order stats:', error);
      message.error('Không thể tải thống kê đơn hàng');
    }
  }, []);

  /**
   * Export orders
   */
  const exportOrders = useCallback(async (format: 'excel' | 'csv' | 'pdf' = 'excel'): Promise<string | null> => {
    try {
      const exportParams = {
        format,
        ...filters,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined
      };
      
      const result = await orderService.exportOrders(exportParams);
      message.success(`Xuất file ${format.toUpperCase()} thành công!`);
      return result.downloadUrl;
      
    } catch (error: any) {
      console.error('Failed to export orders:', error);
      message.error('Không thể xuất dữ liệu đơn hàng');
      return null;
    }
  }, [filters]);

  /**
   * Get pending approvals
   */
  const getPendingApprovals = useCallback(async (): Promise<OrderDto[]> => {
    try {
      const result = await orderService.getPendingApprovals();
      return result.orders;
    } catch (error: any) {
      console.error('Failed to get pending approvals:', error);
      message.error('Không thể tải danh sách đơn hàng chờ phê duyệt');
      return [];
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadOrders();
    refreshStats();
  }, [currentPage, itemsPerPage]);

  // Reload when search or filters change
  useEffect(() => {
    loadOrders();
  }, [searchText, filters]);

  return {
    // State
    loading,
    orders,
    selectedOrder,
    stats,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNext,
    hasPrevious,
    
    // Search & Filter
    searchText,
    filters,
    
    // Actions
    loadOrders,
    loadOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    approveOrder,
    rejectOrder,
    processPayment,
    
    // Utilities
    handleSearch,
    handleFilter,
    handlePageChange,
    resetFilters,
    refreshOrders,
    refreshStats,
    
    // Export & Reports
    exportOrders,
    getPendingApprovals
  };
};

export default useOrders;