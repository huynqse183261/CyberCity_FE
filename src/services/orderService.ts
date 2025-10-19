import axiosInstance from '../api/axiosInstance';

// ==========================================
// ORDER TYPES based on existing DB schema
// ==========================================

export interface OrderDto {
  uid: string;
  orderNumber?: string;
  userUid: string;
  orgUid?: string;
  planUid: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  startAt?: string;
  endAt?: string;
  createdAt: string;
  updatedAt?: string;
  
  // Joined data
  customer?: {
    uid: string;
    fullName: string;
    email: string;
    username: string;
    role: string;
  };
  organization?: {
    uid: string;
    orgName: string;
    orgType: string;
    contactEmail?: string;
  };
  pricingPlan?: {
    uid: string;
    planName: string;
    price: number;
    durationDays: number;
    features: string;
  };
  payments?: PaymentDto[];
}

export interface PaymentDto {
  uid: string;
  orderUid: string;
  paymentMethod?: string;
  transactionCode?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  paidAt?: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  userUid: string;
  orgUid?: string;
  planUid: string;
  paymentMethod?: string;
  transactionCode?: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  paymentStatus?: 'pending' | 'paid' | 'failed';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  startAt?: string;
  endAt?: string;
  notes?: string;
}

export interface OrderStatsResponse {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
  paymentStats: {
    pendingPayments: number;
    paidPayments: number;
    failedPayments: number;
  };
  organizationStats: Array<{
    orgUid: string;
    orgName: string;
    orderCount: number;
    totalRevenue: number;
  }>;
  monthlyStats: Array<{
    month: number;
    year: number;
    orderCount: number;
    revenue: number;
  }>;
}

export interface OrderSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: string;
  approvalStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  orgUid?: string;
  planUid?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderListResponse {
  orders: OrderDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ==========================================
// ORDER SERVICE
// ==========================================

class OrderService {
  private readonly baseUrl = '/api/v1/orders';

  /**
   * Get orders with pagination and filtering
   */
  async getOrders(params: OrderSearchParams = {}): Promise<OrderListResponse> {
    const response = await axiosInstance.get(this.baseUrl, { params });
    return response.data.data;
  }

  /**
   * Get order by ID with full details
   */
  async getOrderById(uid: string): Promise<OrderDto> {
    const response = await axiosInstance.get(`${this.baseUrl}/${uid}`);
    return response.data.data;
  }

  /**
   * Create new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderDto> {
    const response = await axiosInstance.post(this.baseUrl, orderData);
    return response.data.data;
  }

  /**
   * Update existing order
   */
  async updateOrder(uid: string, orderData: UpdateOrderRequest): Promise<OrderDto> {
    const response = await axiosInstance.put(`${this.baseUrl}/${uid}`, orderData);
    return response.data.data;
  }

  /**
   * Update order status (payment and approval)
   */
  async updateOrderStatus(
    uid: string, 
    statusData: {
      paymentStatus?: 'pending' | 'paid' | 'failed';
      approvalStatus?: 'pending' | 'approved' | 'rejected';
      notes?: string;
    }
  ): Promise<OrderDto> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${uid}/status`, statusData);
    return response.data.data;
  }

  /**
   * Delete order
   */
  async deleteOrder(uid: string): Promise<{ uid: string; deletedAt: string }> {
    const response = await axiosInstance.delete(`${this.baseUrl}/${uid}`);
    return response.data.data;
  }

  /**
   * Get order statistics
   */
  async getOrderStats(params: {
    period?: 'day' | 'week' | 'month' | 'year';
    dateFrom?: string;
    dateTo?: string;
    orgUid?: string;
  } = {}): Promise<OrderStatsResponse> {
    const response = await axiosInstance.get(`${this.baseUrl}/stats`, { params });
    return response.data.data;
  }

  /**
   * Search orders
   */
  async searchOrders(query: string, options: {
    fields?: string;
    limit?: number;
  } = {}): Promise<{
    orders: OrderDto[];
    totalResults: number;
    searchTime: number;
  }> {
    const params = { q: query, ...options };
    const response = await axiosInstance.get(`${this.baseUrl}/search`, { params });
    return response.data.data;
  }

  /**
   * Export orders
   */
  async exportOrders(params: {
    format?: 'excel' | 'csv' | 'pdf';
    dateFrom?: string;
    dateTo?: string;
    paymentStatus?: string;
    approvalStatus?: string;
    orgUid?: string;
  } = {}): Promise<{
    downloadUrl: string;
    filename: string;
    fileSize: number;
    expiresAt: string;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/export`, { params });
    return response.data.data;
  }

  /**
   * Approve order
   */
  async approveOrder(uid: string, approvalData: {
    notes?: string;
    startAt?: string;
    endAt?: string;
  } = {}): Promise<OrderDto> {
    const response = await axiosInstance.post(`${this.baseUrl}/${uid}/approve`, approvalData);
    return response.data.data;
  }

  /**
   * Reject order
   */
  async rejectOrder(uid: string, rejectionData: {
    notes: string;
    reason?: string;
  }): Promise<OrderDto> {
    const response = await axiosInstance.post(`${this.baseUrl}/${uid}/reject`, rejectionData);
    return response.data.data;
  }

  /**
   * Get pending approvals
   */
  async getPendingApprovals(params: {
    orgUid?: string;
    limit?: number;
  } = {}): Promise<{
    orders: OrderDto[];
    totalPending: number;
  }> {
    const response = await axiosInstance.get(`${this.baseUrl}/pending-approvals`, { params });
    return response.data.data;
  }

  /**
   * Process payment for order
   */
  async processPayment(uid: string, paymentData: {
    paymentMethod: string;
    transactionCode?: string;
    amount?: number;
    currency?: string;
    gatewayResponse?: any;
  }): Promise<PaymentDto> {
    const response = await axiosInstance.post(`${this.baseUrl}/${uid}/payment`, paymentData);
    return response.data.data;
  }

  /**
   * Get order payments
   */
  async getOrderPayments(uid: string): Promise<PaymentDto[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/${uid}/payments`);
    return response.data.data;
  }
}

// Export singleton instance
export const orderService = new OrderService();
export default orderService;