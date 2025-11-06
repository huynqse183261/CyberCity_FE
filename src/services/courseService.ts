import axiosInstance from '../api/axiosInstance';
import type { 
  Course, 
  CourseListParams, 
  CourseListResponse, 
  CreateCourseRequest, 
  UpdateCourseRequest
} from '../models/CourseTypes';
import type { ApiResponse } from '../models';
import type { BackendApiResponse } from './authService';

class CourseService {
  private readonly endpoints = {
    COURSES: '/api/courses',
    COURSE_DETAIL: (id: string) => `/api/courses/${id}`,
  };

  // Lấy danh sách courses với pagination và filter
  async getCourses(params?: CourseListParams): Promise<ApiResponse<CourseListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.pageNumber) {
        queryParams.append('pageNumber', params.pageNumber.toString());
      }
      if (params?.pageSize) {
        queryParams.append('pageSize', params.pageSize.toString());
      }
      if (params?.level) {
        queryParams.append('level', params.level);
      }
      if (params?.descending !== undefined) {
        queryParams.append('descending', params.descending.toString());
      }

      const url = `${this.endpoints.COURSES}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await axiosInstance.get(url);
      
      const raw = response.data as any;
      
      // Xử lý response từ backend
      if (raw && typeof raw === 'object') {
        // Direct response format từ API
        if (raw.items && Array.isArray(raw.items)) {
          return {
            success: true,
            data: {
              items: raw.items,
              totalCount: raw.totalItems || raw.totalCount || raw.items.length,
              pageNumber: raw.pageNumber || 1,
              pageSize: raw.pageSize || 10,
              totalPages: raw.totalPages || Math.ceil((raw.totalItems || raw.totalCount || raw.items.length) / (raw.pageSize || 10)),
            },
            message: 'Lấy danh sách khóa học thành công',
          };
        }
        
        // Wrapped response format
        if (raw.isSuccess && raw.data) {
          const data = raw.data;
          return {
            success: true,
            data: {
              items: data.items || [],
              totalCount: data.totalItems || data.totalCount || (data.items ? data.items.length : 0),
              pageNumber: data.pageNumber || 1,
              pageSize: data.pageSize || 10,
              totalPages: data.totalPages || Math.ceil((data.totalItems || data.totalCount || (data.items ? data.items.length : 0)) / (data.pageSize || 10)),
            },
            message: raw.message || 'Lấy danh sách khóa học thành công',
          };
        }
      }

      // Return empty result if no data
      return {
        success: false,
        data: {
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 0,
        },
        message: 'Không thể lấy danh sách khóa học',
      };
    } catch (error: any) {
      // Return empty data on error
      return {
        success: false,
        data: {
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 0,
        },
        message: 'Lỗi khi lấy danh sách khóa học',
      };
    }
  }

  // Lấy chi tiết course theo ID
  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    try {
      const response = await axiosInstance.get<BackendApiResponse<Course>>(
        this.endpoints.COURSE_DETAIL(id)
      );
      
      const backendData = response.data;
      
      if (backendData.isSuccess && backendData.data) {
        return {
          success: true,
          data: backendData.data,
          message: backendData.message || 'Lấy chi tiết khóa học thành công',
        };
      }
      
      return {
        success: false,
        message: backendData.message || 'Không tìm thấy khóa học',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Lỗi kết nối server',
      };
    }
  }

  // Tạo course mới  
  async createCourse(data: CreateCourseRequest): Promise<ApiResponse<Course>> {
    try {
      // Theo API docs, chỉ gửi title, description, level
      const requestBody = {
        title: data.title,
        description: data.description,
        level: data.level
      };
      
      const response = await axiosInstance.post(this.endpoints.COURSES, requestBody);
      
      const raw = response.data as any;
      
      // Xử lý response format từ backend
      if (raw && typeof raw === 'object' && 'isSuccess' in raw) {
        if (raw.isSuccess && raw.data) {
          return {
            success: true,
            data: raw.data,
            message: raw.message || 'Tạo khóa học thành công',
          };
        }
        return {
          success: false,
          message: raw.message || 'Tạo khóa học thất bại',
        };
      }
      
      // Direct response
      return {
        success: true,
        data: raw,
        message: 'Tạo khóa học thành công',
      };
    } catch (error: any) {
      throw error;
    }
  }

  // Cập nhật course
  async updateCourse(data: UpdateCourseRequest): Promise<ApiResponse<Course>> {
    try {
      // Theo API docs, chỉ gửi title, description, level
      const requestBody = {
        title: data.title,
        description: data.description, 
        level: data.level
      };
      
      const response = await axiosInstance.put(
        this.endpoints.COURSE_DETAIL(data.uid),
        requestBody
      );
      
      const raw = response.data as any;
      
      // Xử lý response format từ backend
      if (raw && typeof raw === 'object' && 'isSuccess' in raw) {
        if (raw.isSuccess && raw.data) {
          return {
            success: true,
            data: raw.data,
            message: raw.message || 'Cập nhật khóa học thành công',
          };
        }
        return {
          success: false,
          message: raw.message || 'Cập nhật khóa học thất bại',
        };
      }
      
      // Direct response
      return {
        success: true,
        data: raw,
        message: 'Cập nhật khóa học thành công',
      };
    } catch (error: any) {
      throw error;
    }
  }

  // Xóa course
  async deleteCourse(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axiosInstance.delete(this.endpoints.COURSE_DETAIL(id));
      
      const raw = response.data as any;
      
      // Xử lý response format từ backend
      if (raw && typeof raw === 'object' && 'isSuccess' in raw) {
        if (raw.isSuccess) {
          return {
            success: true,
            data: true,
            message: raw.message || 'Xóa khóa học thành công',
          };
        }
        return {
          success: false,
          message: raw.message || 'Xóa khóa học thất bại',
        };
      }
      
      // Nếu status 200 nhưng không có isSuccess flag
      if (response.status === 200) {
        return {
          success: true,
          data: true,
          message: 'Xóa khóa học thành công',
        };
      }
      
      // Direct response hoặc success
      return {
        success: true,
        data: true,
        message: 'Xóa khóa học thành công',
      };
    } catch (error: any) {
      throw error;
    }
  }
}

const courseService = new CourseService();
export default courseService;