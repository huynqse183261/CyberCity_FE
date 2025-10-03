import axiosInstance from '../api/axiosInstance';
import type { ApiResponse } from '../models';

// Lesson interfaces
export interface Lesson {
  uid: string;
  moduleUid: string;
  title: string;
  content: string;
  lessonType: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonRequest {
  moduleUid: string;
  title: string;
  content: string;
  lessonType: string;
  orderIndex: number;
}

export interface UpdateLessonRequest {
  moduleUid: string;
  title: string;
  content: string;
  lessonType: string;
  orderIndex: number;
}

export interface LessonListParams {
  pageNumber?: number;
  pageSize?: number;
  moduleUid?: string;
  search?: string;
}

export interface LessonListResponse {
  items: Lesson[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

class LessonService {
  private endpoints = {
    LESSONS: '/api/lessons',
    LESSON_DETAIL: (id: string) => `/api/lessons/${id}`,
  };

  async getAllLessons(params?: LessonListParams): Promise<ApiResponse<LessonListResponse>> {
    try {
      console.log('=== LESSON SERVICE GET ALL ===');
      console.log('Request params:', params);
      
      const response = await axiosInstance.get(this.endpoints.LESSONS, {
        params: {
          pageNumber: params?.pageNumber || 1,
          pageSize: params?.pageSize || 10,
          ...(params?.moduleUid && { moduleUid: params.moduleUid }),
          ...(params?.search && { search: params.search })
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      const raw = response.data as any;
      if (raw && raw.items) {
        return {
          success: true,
          data: {
            items: raw.items || [],
            pageNumber: raw.pageNumber || 1,
            pageSize: raw.pageSize || 10,
            totalItems: raw.totalItems || 0,
            totalPages: raw.totalPages || 0
          },
          message: 'Lấy danh sách lessons thành công'
        };
      }
      
      return { success: false, message: 'Không có dữ liệu lessons' };
    } catch (error: any) {
      console.error('=== LESSON SERVICE GET ALL ERROR ===');
      console.error('Error:', error);
      console.error('Error Response:', error.response?.data);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy danh sách lessons' };
    }
  }

  async createLesson(data: CreateLessonRequest): Promise<ApiResponse<Lesson>> {
    try {
      console.log('=== LESSON SERVICE CREATE ===');
      console.log('Create data:', data);
      
      const response = await axiosInstance.post(this.endpoints.LESSONS, data);
      
      console.log('Create Response Status:', response.status);
      console.log('Create Response Data:', response.data);
      
      // Check for successful response status codes
      if (response.status >= 200 && response.status < 300) {
        const raw = response.data as any;
        if (raw && typeof raw === 'object') {
          if (raw.isSuccess === true || raw.success === true) {
            return { success: true, data: raw.data || raw, message: raw.message || 'Tạo lesson thành công' };
          } else if (raw.isSuccess === false || raw.success === false) {
            return { success: false, message: raw.message || 'Tạo lesson thất bại' };
          } else {
            // No success flag, but HTTP status is OK - assume success
            return { success: true, data: raw.data || raw, message: raw.message || 'Tạo lesson thành công' };
          }
        } else {
          // No response body, but HTTP status is OK - assume success
          return { success: true, data: undefined, message: 'Tạo lesson thành công' };
        }
      } else {
        return { success: false, message: 'Tạo lesson thất bại' };
      }
    } catch (error: any) {
      console.error('=== LESSON SERVICE CREATE ERROR ===');
      console.error('Create Error:', error);
      console.error('Error Response:', error.response?.data);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi tạo lesson' };
    }
  }

  async updateLesson(id: string, data: UpdateLessonRequest): Promise<ApiResponse<Lesson>> {
    try {
      console.log('=== LESSON SERVICE UPDATE ===');
      console.log('Update URL:', this.endpoints.LESSON_DETAIL(id));
      console.log('Update ID:', id);
      console.log('Update Data:', data);
      
      const response = await axiosInstance.put(this.endpoints.LESSON_DETAIL(id), data);
      
      console.log('Update Response Status:', response.status);
      console.log('Update Response Data:', response.data);
      
      // Check for successful response status codes
      if (response.status >= 200 && response.status < 300) {
        const raw = response.data as any;
        if (raw && typeof raw === 'object') {
          if (raw.isSuccess === true || raw.success === true) {
            return { success: true, data: raw.data || raw, message: raw.message || 'Cập nhật lesson thành công' };
          } else if (raw.isSuccess === false || raw.success === false) {
            return { success: false, message: raw.message || 'Cập nhật lesson thất bại' };
          } else {
            // No success flag, but HTTP status is OK - assume success
            return { success: true, data: raw.data || raw, message: raw.message || 'Cập nhật lesson thành công' };
          }
        } else {
          // No response body, but HTTP status is OK - assume success
          return { success: true, data: undefined, message: 'Cập nhật lesson thành công' };
        }
      } else {
        return { success: false, message: 'Cập nhật lesson thất bại' };
      }
    } catch (error: any) {
      console.error('=== LESSON SERVICE UPDATE ERROR ===');
      console.error('Update Error:', error);
      console.error('Error Response:', error.response?.data);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi cập nhật lesson' };
    }
  }

  async deleteLesson(id: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('=== LESSON SERVICE DELETE ===');
      console.log('Delete ID:', id);
      
      const response = await axiosInstance.delete(this.endpoints.LESSON_DETAIL(id));
      
      console.log('Delete Response Status:', response.status);
      console.log('Delete Response Data:', response.data);
      
      // Check for successful response status codes
      if (response.status >= 200 && response.status < 300) {
        const raw = response.data as any;
        if (raw && typeof raw === 'object') {
          if (raw.isSuccess === true || raw.success === true) {
            return { success: true, data: true, message: raw.message || 'Xóa lesson thành công' };
          } else if (raw.isSuccess === false || raw.success === false) {
            return { success: false, message: raw.message || 'Xóa lesson thất bại' };
          } else {
            // No success flag, but HTTP status is OK - assume success
            return { success: true, data: true, message: raw.message || 'Xóa lesson thành công' };
          }
        } else {
          // No response body, but HTTP status is OK - assume success (common for DELETE)
          return { success: true, data: true, message: 'Xóa lesson thành công' };
        }
      } else {
        return { success: false, message: 'Xóa lesson thất bại' };
      }
    } catch (error: any) {
      console.error('=== LESSON SERVICE DELETE ERROR ===');
      console.error('Delete Error:', error);
      console.error('Error Response:', error.response?.data);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi xóa lesson' };
    }
  }

  async getLessonById(id: string): Promise<ApiResponse<Lesson>> {
    try {
      const response = await axiosInstance.get(this.endpoints.LESSON_DETAIL(id));
      const raw = response.data as any;
      
      if (response.status >= 200 && response.status < 300) {
        if (raw && typeof raw === 'object') {
          if (raw.isSuccess === true || raw.success === true) {
            return { success: true, data: raw.data || raw, message: raw.message || 'Lấy lesson thành công' };
          } else if (raw.isSuccess === false || raw.success === false) {
            return { success: false, message: raw.message || 'Không tìm thấy lesson' };
          } else {
            return { success: true, data: raw.data || raw, message: raw.message || 'Lấy lesson thành công' };
          }
        }
      }
      
      return { success: false, message: 'Không tìm thấy lesson' };
    } catch (error: any) {
      console.error('Get lesson by ID error:', error);
      return { success: false, message: error.response?.data?.message || 'Lỗi khi lấy lesson' };
    }
  }
}

const lessonService = new LessonService();
export default lessonService;