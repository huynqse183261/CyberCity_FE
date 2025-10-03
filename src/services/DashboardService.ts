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
      const response = await axiosInstance.get('api/admin/overview');
      
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
      // TODO: Replace with actual API call when backend provides real endpoint
      // const response = await axiosInstance.get('/dashboard/sales');
      
      return {
        success: false,
        data: [],
        message: 'Sales data API chưa được implement'
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
      // TODO: Replace with actual API call when backend provides real endpoint
      // const response = await axiosInstance.get('/dashboard/orders');

      return {
        success: false,
        data: [],
        message: 'Recent orders API chưa được implement'
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