import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import courseService from '../services/courseService';
import type { Course, ApiResponse } from '../models';
import type { CourseListParams } from '../models/CourseTypes';

// Define CourseFormData interface if not available
interface CourseFormData {
  title: string;
  description: string;
  level: string;
}
import { message } from 'antd';

// Query keys for courses
export const COURSE_QUERY_KEYS = {
  courses: ['courses'] as const,
  allCourses: (params?: CourseListParams) => ['courses', 'all', params] as const,
  course: (id: string) => ['courses', id] as const,
} as const;

// Get all courses với pagination
export const useAllCourses = (
  params?: CourseListParams,
  options?: Omit<UseQueryOptions<ApiResponse<any>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.allCourses(params),
    queryFn: async () => {
      const response = await courseService.getCourses(params || { pageSize: 1000 });
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Get single course
export const useCourse = (
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<Course>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.course(id),
    queryFn: async () => {
      // TODO: Implement getCourseById in courseService
      throw new Error('getCourseById not implemented yet');
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

// Mutation hooks for CRUD operations
export const useCreateCourse = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseFormData) => courseService.createCourse(data),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || 'Tạo khóa học thành công');
        // Invalidate all course queries
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'courses' 
        });
        options?.onSuccess?.();
      } else {
        message.error(data.message || 'Tạo khóa học thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      message.error('Lỗi khi tạo khóa học');
      options?.onError?.(error);
    },
  });
};

export const useUpdateCourse = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uid, ...data }: CourseFormData & { uid: string }) => 
      courseService.updateCourse({ uid, ...data }),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || 'Cập nhật khóa học thành công');
        // Invalidate all course queries
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'courses' 
        });
        options?.onSuccess?.();
      } else {
        message.error(data.message || 'Cập nhật khóa học thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      message.error('Lỗi khi cập nhật khóa học');
      options?.onError?.(error);
    },
  });
};

export const useDeleteCourse = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || 'Xóa khóa học thành công');
        // Invalidate all course queries
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'courses' 
        });
        options?.onSuccess?.();
      } else {
        message.error(data.message || 'Xóa khóa học thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      message.error('Lỗi khi xóa khóa học');
      options?.onError?.(error);
    },
  });
};