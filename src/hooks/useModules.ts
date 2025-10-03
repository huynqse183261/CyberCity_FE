import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moduleService from '../services/moduleService';
import type { 
  CreateModuleRequest, 
  UpdateModuleRequest
} from '../models/ModuleTypes';
import type { ApiResponse } from '../models';
import { message } from 'antd';

export const MODULE_QUERY_KEYS = {
  allModules: (params?: { pageNumber?: number; pageSize?: number }) => ['modules', 'all', params] as const,
  module: (id: string) => ['modules', id] as const,
} as const;

export const useAllModules = (params?: { pageNumber?: number; pageSize?: number }) => useQuery({
  queryKey: MODULE_QUERY_KEYS.allModules(params),
  queryFn: () => moduleService.getAllModules(params),
  staleTime: 5 * 60 * 1000,
});

export const useModule = (id: string) => useQuery({
  queryKey: MODULE_QUERY_KEYS.module(id),
  queryFn: () => moduleService.getModuleById(id),
  enabled: !!id,
});

export const useCreateModule = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  return useMutation({
    mutationFn: (data: CreateModuleRequest) => moduleService.createModule(data),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || 'Tạo module thành công');
        options?.onSuccess?.();
      } else {
        message.error(data.message || 'Tạo module thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      message.error('Lỗi khi tạo module');
      options?.onError?.(error);
    },
  });
};

export const useUpdateModule = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModuleRequest }) => moduleService.updateModule(id, data),
    onSuccess: (data) => {
      console.log('useUpdateModule onSuccess called with data:', data);
      if (data.success) {
        message.success(data.message || 'Cập nhật module thành công');
        console.log('About to call options.onSuccess callback');
        options?.onSuccess?.();
        console.log('options.onSuccess callback completed');
      } else {
        // API returned error, but HTTP was successful
        console.log('API returned error, calling onError callback');
        message.error(data.message || 'Cập nhật module thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      console.error('useUpdateModule onError called with error:', error);
      message.error('Lỗi khi cập nhật module');
      options?.onError?.(error);
    },
  });
};

export const useDeleteModule = (options?: { onSuccess?: () => void; onError?: (error: any) => void; }) => {
  return useMutation({
    mutationFn: (id: string) => moduleService.deleteModule(id),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message || 'Xóa module thành công');
        options?.onSuccess?.();
      } else {
        message.error(data.message || 'Xóa module thất bại');
        options?.onError?.(new Error(data.message));
      }
    },
    onError: (error: any) => {
      message.error('Lỗi khi xóa module');
      options?.onError?.(error);
    },
  });
};

// Placeholder hooks for features not yet implemented in API
export const usePublishModule = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('usePublishModule: Publish not implemented yet, module:', id);
      // Mock success for now
      return Promise.resolve({
        success: true,
        data: true,
        message: 'Publish module thành công (mock)'
      } as ApiResponse<boolean>);
    },
    onSuccess: () => {
      message.success('Publish module thành công');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      console.error('usePublishModule: Error:', error);
      message.error('Lỗi khi publish module');
      options?.onError?.(error);
    },
  });
};

export const useUnpublishModule = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('useUnpublishModule: Unpublish not implemented yet, module:', id);
      // Mock success for now
      return Promise.resolve({
        success: true,
        data: true,
        message: 'Unpublish module thành công (mock)'
      } as ApiResponse<boolean>);
    },
    onSuccess: () => {
      message.success('Unpublish module thành công');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      console.error('useUnpublishModule: Error:', error);
      message.error('Lỗi khi unpublish module');
      options?.onError?.(error);
    },
  });
};

export const useDuplicateModule = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, newCourseId }: { id: string; newCourseId: string }) => {
      console.log('useDuplicateModule: Duplicate not implemented yet, module:', id, 'to course:', newCourseId);
      // Mock success for now
      return Promise.resolve({
        success: true,
        data: true,
        message: 'Duplicate module thành công (mock)'
      } as ApiResponse<boolean>);
    },
    onSuccess: () => {
      message.success('Duplicate module thành công');
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      console.error('useDuplicateModule: Error:', error);
      message.error('Lỗi khi duplicate module');
      options?.onError?.(error);
    },
  });
};