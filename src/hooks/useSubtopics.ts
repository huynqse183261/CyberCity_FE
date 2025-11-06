import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import subtopicService from '../services/subtopicService';
import type { 
  Subtopic,
  CreateSubtopicRequest,
  UpdateSubtopicRequest,
  SubtopicListParams,
} from '../services/subtopicService';
import type { ApiResponse } from '../models';

// Query keys
export const SUBTOPIC_QUERY_KEYS = {
  all: ['subtopics'] as const,
  lists: () => [...SUBTOPIC_QUERY_KEYS.all, 'list'] as const,
  list: (params: SubtopicListParams) => [...SUBTOPIC_QUERY_KEYS.lists(), params] as const,
  details: () => [...SUBTOPIC_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUBTOPIC_QUERY_KEYS.details(), id] as const,
};

// Hook to get all subtopics
export const useAllSubtopics = (params: SubtopicListParams = {}) => {
  return useQuery({
    queryKey: SUBTOPIC_QUERY_KEYS.list(params),
    queryFn: () => subtopicService.getAllSubtopics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get subtopic by ID
export const useSubtopicById = (id: string) => {
  return useQuery({
    queryKey: SUBTOPIC_QUERY_KEYS.detail(id),
    queryFn: () => subtopicService.getSubtopicById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to create subtopic
export const useCreateSubtopic = (options?: {
  onSuccess?: (data: ApiResponse<Subtopic>) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubtopicRequest) => subtopicService.createSubtopic(data),
    onSuccess: (data) => {
      // Invalidate and refetch subtopics list
      queryClient.invalidateQueries({ queryKey: SUBTOPIC_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SUBTOPIC_QUERY_KEYS.all });
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

// Hook to update subtopic
export const useUpdateSubtopic = (options?: {
  onSuccess?: (data: ApiResponse<Subtopic>) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubtopicRequest }) =>
      subtopicService.updateSubtopic(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch subtopics list
      queryClient.invalidateQueries({ queryKey: SUBTOPIC_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SUBTOPIC_QUERY_KEYS.all });
      
      // Update specific subtopic cache
      queryClient.invalidateQueries({ 
        queryKey: SUBTOPIC_QUERY_KEYS.detail(variables.id) 
      });
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

// Hook to delete subtopic
export const useDeleteSubtopic = (options?: {
  onSuccess?: (data: ApiResponse<null>) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subtopicService.deleteSubtopic(id),
    onSuccess: (data, id) => {
      // Invalidate and refetch subtopics list
      queryClient.invalidateQueries({ queryKey: SUBTOPIC_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SUBTOPIC_QUERY_KEYS.all });
      
      // Remove specific subtopic from cache
      queryClient.removeQueries({ 
        queryKey: SUBTOPIC_QUERY_KEYS.detail(id) 
      });
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};