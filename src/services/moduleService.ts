import axiosInstance from '../api/axiosInstance';
import type { Module, CreateModuleRequest, UpdateModuleRequest } from '../models/ModuleTypes';
import type { ApiResponse } from '../models';

export class ModuleService {
  private readonly endpoints = {
    MODULES: '/api/modules',
    MODULE_DETAIL: (id: string) => `/api/modules/${id}`,
  };

  async getAllModules(params?: { pageNumber?: number; pageSize?: number }): Promise<ApiResponse<Module[]> & { pagination?: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      
      const url = queryParams.toString() ? `${this.endpoints.MODULES}?${queryParams}` : this.endpoints.MODULES;
      const response = await axiosInstance.get(url);
      const raw = response.data as any;
      
      if (raw && typeof raw === 'object' && 'items' in raw) {
        return { 
          success: true, 
          data: raw.items || [], 
          message: 'Lấy danh sách modules thành công',
          pagination: {
            totalItems: raw.totalItems,
            pageNumber: raw.pageNumber,
            pageSize: raw.pageSize,
            totalPages: raw.totalPages
          }
        };
      }
      return { success: false, data: [], message: 'Không thể lấy danh sách modules' };
    } catch (error) {
      return { success: false, data: [], message: 'Lỗi khi lấy modules' };
    }
  }

  async createModule(data: CreateModuleRequest): Promise<ApiResponse<Module>> {
    try {
      const response = await axiosInstance.post(this.endpoints.MODULES, data);
      const raw = response.data as any;
      if (raw && raw.isSuccess && raw.data) {
        return { success: true, data: raw.data, message: raw.message || 'Tạo module thành công' };
      }
      return { success: false, message: raw.message || 'Tạo module thất bại' };
    } catch (error) {
      return { success: false, message: 'Lỗi khi tạo module' };
    }
  }

  async updateModule(id: string, data: UpdateModuleRequest): Promise<ApiResponse<Module>> {
    try {
      const response = await axiosInstance.put(this.endpoints.MODULE_DETAIL(id), data);
      
      const raw = response.data as any;
      
      // Check for successful response status codes (200, 201, 204)
      if (response.status >= 200 && response.status < 300) {
        // If response has data, check isSuccess flag
        if (raw && typeof raw === 'object') {
          if (raw.isSuccess === true || raw.success === true) {
            return { success: true, data: raw.data || raw, message: raw.message || 'Cập nhật module thành công' };
          } else if (raw.isSuccess === false || raw.success === false) {
            return { success: false, message: raw.message || 'Cập nhật module thất bại' };
          } else {
            // No success flag, but HTTP status is OK - assume success
            return { success: true, data: raw.data || raw, message: raw.message || 'Cập nhật module thành công' };
          }
        } else {
          // No response body, but HTTP status is OK - assume success
          return { success: true, data: undefined, message: 'Cập nhật module thành công' };
        }
      } else {
        return { success: false, message: raw?.message || 'Cập nhật module thất bại' };
      }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật module' };
    }
  }

  async deleteModule(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axiosInstance.delete(this.endpoints.MODULE_DETAIL(id));
      const raw = response.data as any;
      
      // Check for successful response status codes (200, 201, 204)
      if (response.status >= 200 && response.status < 300) {
        // If response has data, check success flag
        if (raw && typeof raw === 'object') {
          if (raw.isSuccess === true || raw.success === true) {
            return { success: true, data: true, message: raw.message || 'Xóa module thành công' };
          } else if (raw.isSuccess === false || raw.success === false) {
            return { success: false, message: raw.message || 'Xóa module thất bại' };
          } else {
            // No success flag, but HTTP status is OK - assume success
            return { success: true, data: true, message: raw.message || 'Xóa module thành công' };
          }
        } else {
          // No response body, but HTTP status is OK - assume success (common for DELETE)
          return { success: true, data: true, message: 'Xóa module thành công' };
        }
      } else {
        return { success: false, message: raw?.message || 'Xóa module thất bại' };
      }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa module' };
    }
  }

  async getModuleById(id: string): Promise<ApiResponse<Module>> {
    try {
      const response = await axiosInstance.get(this.endpoints.MODULE_DETAIL(id));
      const raw = response.data as any;
      if (raw && raw.isSuccess && raw.data) {
        return { success: true, data: raw.data, message: raw.message || 'Lấy module thành công' };
      }
      return { success: false, message: raw.message || 'Không tìm thấy module' };
    } catch (error) {
      return { success: false, message: 'Lỗi khi lấy module' };
    }
  }
}

export default new ModuleService();