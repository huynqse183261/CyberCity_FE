import axiosInstance from './../api/axiosInstance';
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../models';

// Base API Service Class
export class BaseApiService {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // GET request với pagination
  async getAll<T>(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    [key: string]: any;
  }): Promise<ApiResponse<T[]>> {
    const response: AxiosResponse<ApiResponse<T[]>> = await axiosInstance.get(
      this.endpoint,
      { params }
    );
    return response.data;
  }

  // GET request by ID
  async getById<T>(id: string | number): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  // POST request - tạo mới
  async create<T, K = any>(data: K): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.post(
      this.endpoint,
      data
    );
    return response.data;
  }

  // PUT request - cập nhật toàn bộ
  async update<T, K = any>(id: string | number, data: K): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data;
  }

  // PATCH request - cập nhật một phần
  async patch<T, K = any>(id: string | number, data: Partial<K>): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.patch(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data;
  }

  // DELETE request
  async delete<T>(id: string | number): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.delete(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  // Bulk operations
  async bulkCreate<T, K = any>(data: K[]): Promise<ApiResponse<T[]>> {
    const response: AxiosResponse<ApiResponse<T[]>> = await axiosInstance.post(
      `${this.endpoint}/bulk`,
      data
    );
    return response.data;
  }

  async bulkDelete<T>(ids: (string | number)[]): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.delete(
      `${this.endpoint}/bulk`,
      { data: { ids } }
    );
    return response.data;
  }

  // Search với filters nâng cao
  async search<T>(params: {
    q?: string;
    filters?: Record<string, any>;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<ApiResponse<T[]>> {
    const response: AxiosResponse<ApiResponse<T[]>> = await axiosInstance.get(
      `${this.endpoint}/search`,
      { params }
    );
    return response.data;
  }
}

// API Endpoints constants
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    LOGOUT: 'auth/logout',
    REFRESH: 'auth/refresh',
    PROFILE: 'auth/profile',
    RESET_PASSWORD: 'auth/reset-password',
    CHANGE_PASSWORD: 'auth/change-password',
    VERIFY_EMAIL: 'auth/verify-email',
  },
  
  // User Management
  USERS: 'api/users',
  ROLES: 'api/roles',
  PERMISSIONS: 'api/permissions',
  
  // Course & Learning
  COURSES: 'api/courses',
  MODULES: 'api/modules',
  LESSONS: 'api/lessons',
  ASSIGNMENTS: 'api/assignments',
  SUBMISSIONS: 'api/submissions',
  GRADES: 'api/grades',
  
  // Linux Lab
  LAB_ENVIRONMENTS: 'api/lab-environments',
  VIRTUAL_MACHINES: 'api/virtual-machines',
  LAB_SESSIONS: 'api/lab-sessions',
  TERMINALS: 'api/terminals',
  
  // Content Management
  PRODUCTS: 'api/products',
  CATEGORIES: 'api/categories',
  ORDERS: 'api/orders',
  PAYMENTS: 'api/payments',
  INVOICES: 'api/invoices',
  
  // Communication
  MESSAGES: 'api/messages',
  NOTIFICATIONS: 'api/notifications',
  ANNOUNCEMENTS: 'api/announcements',
  
  // Analytics & Reports
  ANALYTICS: 'api/analytics',
  REPORTS: 'api/reports',
  STATISTICS: 'api/statistics',
  
  // AI Assistant
  AI_CHAT: 'api/ai/chat',
  AI_HELP: 'api/ai/help',
  AI_SUGGESTIONS: 'api/ai/suggestions',
  
  // File Management
  UPLOADS: 'api/uploads',
  FILES: 'api/files',
  MEDIA: 'api/media',
  
  // System
  HEALTH: 'api/health',
  SETTINGS: 'api/settings',
  LOGS: 'api/logs',
} as const;

export default BaseApiService;