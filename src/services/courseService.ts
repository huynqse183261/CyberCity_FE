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
      
      // Xử lý nhiều dạng response phổ biến từ backend
      // 1) Mảng trực tiếp: [ ... ]
      if (Array.isArray(raw)) {
        return {
          success: true,
          data: {
            items: raw,
            totalCount: raw.length,
            pageNumber: params?.pageNumber || 1,
            pageSize: params?.pageSize || raw.length || 10,
            totalPages: 1,
          },
          message: 'Lấy danh sách khóa học thành công',
        };
      }

      if (raw && typeof raw === 'object') {
        // 2) Dạng trực tiếp có items: { items, pageNumber, pageSize, totalItems, totalPages }
        if (Array.isArray(raw.items)) {
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

        // 3) Dạng bọc: { isSuccess/success, data: { items, ... } } hoặc { isSuccess/success, data: [ ... ] }
        if ((raw.isSuccess === true || raw.success === true) && raw.data) {
          const d = raw.data;
          if (Array.isArray(d)) {
            return {
              success: true,
              data: {
                items: d,
                totalCount: d.length,
                pageNumber: params?.pageNumber || 1,
                pageSize: params?.pageSize || d.length || 10,
                totalPages: 1,
              },
              message: raw.message || 'Lấy danh sách khóa học thành công',
            };
          }
          if (d && typeof d === 'object') {
            if (Array.isArray(d.items)) {
              return {
                success: true,
                data: {
                  items: d.items || [],
                  totalCount: d.totalItems || d.totalCount || (d.items ? d.items.length : 0),
                  pageNumber: d.pageNumber || 1,
                  pageSize: d.pageSize || 10,
                  totalPages: d.totalPages || Math.ceil((d.totalItems || d.totalCount || (d.items ? d.items.length : 0)) / (d.pageSize || 10)),
                },
                message: raw.message || 'Lấy danh sách khóa học thành công',
              };
            }
          }
        }

        // 4) Một số biến thể khác: { records: [], total, page, size }
        if (Array.isArray(raw.records)) {
          return {
            success: true,
            data: {
              items: raw.records,
              totalCount: raw.total || raw.records.length,
              pageNumber: raw.page || 1,
              pageSize: raw.size || 10,
              totalPages: raw.pages || Math.ceil((raw.total || raw.records.length) / (raw.size || 10)),
            },
            message: 'Lấy danh sách khóa học thành công',
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