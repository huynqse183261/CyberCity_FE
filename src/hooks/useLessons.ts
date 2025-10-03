import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import lessonService from '../services/lessonService';
import type { 
  Lesson,
  CreateLessonRequest, 
  UpdateLessonRequest,
  LessonListParams,
  LessonListResponse
} from '../services/lessonService';
import type { ApiResponse } from '../models';
import { message } from 'antd';

// Query keys for lessons
export const LESSON_QUERY_KEYS = {
  lessons: ['lessons'] as const,
  allLessons: (params?: LessonListParams) => ['lessons', 'all', params] as const,
  lesson: (id: string) => ['lessons', id] as const,
} as const;

// Get all lessons với pagination
export const useAllLessons = (params?: LessonListParams) => {
  return useQuery({
    queryKey: LESSON_QUERY_KEYS.allLessons(params),
    queryFn: () => lessonService.getAllLessons(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single lesson
export const useLesson = (id: string) => {
  return useQuery({
    queryKey: LESSON_QUERY_KEYS.lesson(id),
    queryFn: () => lessonService.getLessonById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks for CRUD operations
export const useCreateLesson = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLessonRequest) => lessonService.createLesson(data),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || 'Tạo lesson thành công');
        // Invalidate all lesson queries
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'lessons' 
        });
        options?.onSuccess?.();
      } else {
        message.error(data.message || 'Tạo lesson thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      message.error('Lỗi khi tạo lesson');
      options?.onError?.(error);
    },
  });
};

export const useUpdateLesson = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonRequest }) => 
      lessonService.updateLesson(id, data),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || 'Cập nhật lesson thành công');
        // Invalidate all lesson queries
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'lessons' 
        });
        options?.onSuccess?.();
      } else {
        message.error(data.message || 'Cập nhật lesson thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      message.error('Lỗi khi cập nhật lesson');
      options?.onError?.(error);
    },
  });
};

export const useDeleteLesson = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => lessonService.deleteLesson(id),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || 'Xóa lesson thành công');
        // Invalidate all lesson queries
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'lessons' 
        });
        options?.onSuccess?.();
      } else {
        message.error(data.message || 'Xóa lesson thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      message.error('Lỗi khi xóa lesson');
      options?.onError?.(error);
    },
  });
};