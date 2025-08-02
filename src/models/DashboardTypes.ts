// Interface cho thống kê dashboard
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  userGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
  pendingGrowth: number;
}

// Interface cho dữ liệu biểu đồ
export interface ChartData {
  month: string;
  value: number;
  label?: string;
}

// Interface cho hoạt động gần đây
export interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'payment' | 'product';
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

// Interface cho thống kê nhanh
export interface QuickStats {
  ordersToday: number;
  revenueToday: number;
  newUsers: number;
  topProduct: string;
}

// Interface cho cấu hình dashboard
export interface DashboardConfig {
  showCharts: boolean;
  showRecentActivities: boolean;
  showQuickStats: boolean;
  refreshInterval: number; // in seconds
  chartType: 'line' | 'bar' | 'area';
}
