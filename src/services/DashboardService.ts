import axiosInstance from './../api/axiosInstance';
import type { ApiResponse } from '../models';

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface SalesData {
  month: string;
  value: number;
}

export interface RecentOrder {
  orderId: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

export interface DashboardData {
  stats: DashboardStats;
  salesData: SalesData[];
  recentOrders: RecentOrder[];
}

class DashboardService {
  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await axiosInstance.get('api/dashboard/overview');
      
      // Map backend response to our interface
      const stats: DashboardStats = {
        totalUsers: response.data.totalUsers || 0,
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: response.data.totalRevenue || 0,
        pendingOrders: response.data.pendingOrders || 0,
      };

      return {
        success: true,
        data: stats,
        message: 'Dashboard stats retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard stats',
        errors: error.response?.data
      };
    }
  }

  // Get sales data for chart
  async getSalesData(): Promise<ApiResponse<SalesData[]>> {
    try {
      // For now, return mock data until backend provides real endpoint
      const salesData: SalesData[] = [
        { month: 'Jan', value: 20 },
        { month: 'Feb', value: 25 },
        { month: 'Mar', value: 30 },
        { month: 'Apr', value: 35 },
        { month: 'May', value: 45 },
        { month: 'Jun', value: 50 },
        { month: 'Jul', value: 65 },
        { month: 'Aug', value: 55 },
        { month: 'Sep', value: 60 },
        { month: 'Oct', value: 70 },
        { month: 'Nov', value: 75 },
        { month: 'Dec', value: 80 },
      ];

      return {
        success: true,
        data: salesData,
        message: 'Sales data retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard sales data',
        errors: error.response?.data
      };
    }
  }

  // Get recent orders
  async getRecentOrders(): Promise<ApiResponse<RecentOrder[]>> {
    try {
      // Mock data until backend provides real endpoint
      const recentOrders: RecentOrder[] = [
        {
          orderId: '#12345',
          customer: 'Nguyễn Văn A',
          product: 'Laptop Gaming',
          amount: 25000000,
          status: 'completed',
          date: '2024-01-15',
        },
        {
          orderId: '#12346',
          customer: 'Trần Thị B',
          product: 'Điện thoại iPhone',
          amount: 15000000,
          status: 'processing',
          date: '2024-01-14',
        },
        {
          orderId: '#12347',
          customer: 'Lê Văn C',
          product: 'Máy tính bảng',
          amount: 8000000,
          status: 'pending',
          date: '2024-01-14',
        },
        {
          orderId: '#12348',
          customer: 'Phạm Thị D',
          product: 'Tai nghe không dây',
          amount: 2000000,
          status: 'completed',
          date: '2024-01-13',
        },
      ];

      return {
        success: true,
        data: recentOrders,
        message: 'Recent orders retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recent orders',
        errors: error.response?.data
      };
    }
  }

  // Get all dashboard data at once
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    try {
      const [statsResponse, salesResponse, ordersResponse] = await Promise.all([
        this.getDashboardStats(),
        this.getSalesData(),
        this.getRecentOrders()
      ]);

      if (!statsResponse.success) {
        return {
          success: false,
          message: 'Failed to fetch dashboard stats',
          errors: statsResponse.errors
        };
      }

      const dashboardData: DashboardData = {
        stats: statsResponse.data!,
        salesData: salesResponse.data || [],
        recentOrders: ordersResponse.data || []
      };

      return {
        success: true,
        data: dashboardData,
        message: 'Dashboard data retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch dashboard data',
        errors: error.response?.data
      };
    }
  }
}

export default new DashboardService();