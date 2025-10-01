// Interface cho sản phẩm trong đơn hàng
export interface OrderProduct {
  name: string;
  quantity: number;
  price: number;
}

// Interface cho đơn hàng
export interface Order {
  key: string;
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderDate: string;
  shippingAddress: string;
  notes?: string;
}

// Interface cho thống kê đơn hàng
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  totalRevenue: number;
}

// Interface cho filter đơn hàng
export interface OrderFilter {
  searchText: string;
  status: string;
  paymentStatus: string;
  dateRange?: [string, string];
}

// Interface cho form cập nhật đơn hàng
export interface OrderUpdateData {
  status: Order['status'];
  paymentStatus: Order['paymentStatus'];
  notes?: string;
}
