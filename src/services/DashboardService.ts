import axiosInstance from './../api/axiosInstance';
import type { ApiResponse } from '../models';

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCourses: number;
  totalEnrollments: number;
  totalApprovedPending: number;
}

export interface SalesData {
  month: string;
  year: number;
  orderCount: number;
}

export interface RecentOrder {
  uid: string;
  orderId: string;
  email: string;
  planName: string;
  amount: number;
  paymentStatus: string;
  approvalStatus: string;
  createdAt: string;
}

export interface RecentActivity {
  type: string;
  title: string;
  detail: string;
  userId: string;
  relatedId: string;
  when: string;
}

export interface DashboardData {
  stats: DashboardStats;
  salesData: SalesData[];
  recentOrders: RecentOrder[];
  recentActivities: RecentActivity[];
}

class DashboardService {
  // Get quick stats (4 main metrics)
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await axiosInstance.get('/api/admin/quick-stats');
      
      console.log('Quick stats response:', response.data);
      
      // Map backend response to our interface
      const stats: DashboardStats = {
        totalUsers: response.data.totalUsers || 0,
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: response.data.totalRevenue || 0,
        pendingOrders: response.data.totalApprovalPending || 0,
        totalCourses: response.data.totalCourses || 0,
        totalEnrollments: response.data.totalEnrollments || 0,
        totalApprovedPending: response.data.totalApprovedPending || 0,
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

  // Get sales data by month/year
  async getSalesData(year: number = 2025): Promise<ApiResponse<SalesData[]>> {
    try {
      const response = await axiosInstance.get(`/api/admin/orders-by-month?year=${year}`);
      
      console.log('Sales data response:', response.data);
      
      // Map backend response to our interface
      const salesData: SalesData[] = response.data.map((item: any) => ({
        month: item.month,
        year: item.year,
        orderCount: item.orderCount
      }));

      return {
        success: true,
        data: salesData,
        message: 'Sales data retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch sales data',
        errors: error.response?.data
      };
    }
  }

  // Get recent orders
  async getRecentOrders(count: number = 10): Promise<ApiResponse<RecentOrder[]>> {
    try {
      const response = await axiosInstance.get(`/api/admin/recent-orders?count=${count}`);
      
      console.log('Recent orders response:', response.data);
      
      // Map backend response to our interface
      const orders: RecentOrder[] = response.data.map((item: any) => ({
        uid: item.uid,
        orderId: item.orderId,
        email: item.email,
        planName: item.planName,
        amount: item.amount,
        paymentStatus: item.paymentStatus,
        approvalStatus: item.approvalStatus,
        createdAt: item.createdAt
      }));

      return {
        success: true,
        data: orders,
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

  // Get recent activities
  async getRecentActivities(count: number = 20): Promise<ApiResponse<RecentActivity[]>> {
    try {
      const response = await axiosInstance.get(`/api/admin/recent-activities?count=${count}`);
      
      console.log('Recent activities response:', response.data);
      
      // Map backend response to our interface
      const activities: RecentActivity[] = response.data.map((item: any) => ({
        type: item.type,
        title: item.title,
        detail: item.detail,
        userId: item.userId,
        relatedId: item.relatedId,
        when: item.when
      }));

      return {
        success: true,
        data: activities,
        message: 'Recent activities retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recent activities',
        errors: error.response?.data
      };
    }
  }

  // Get all dashboard data at once
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    try {
      const [statsResponse, salesResponse, ordersResponse, activitiesResponse] = await Promise.all([
        this.getDashboardStats(),
        this.getSalesData(),
        this.getRecentOrders(),
        this.getRecentActivities()
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
        recentOrders: ordersResponse.data || [],
        recentActivities: activitiesResponse.data || []
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