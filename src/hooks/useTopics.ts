import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import topicService from '../services/topicService';
import type {
  CreateTopicRequest,
  UpdateTopicRequest,
  TopicListParams
} from '../services/topicService';

// Query keys
export const topicKeys = {
  all: ['topics'] as const,
  lists: () => [...topicKeys.all, 'list'] as const,
  list: (params: TopicListParams) => [...topicKeys.lists(), params] as const,
  details: () => [...topicKeys.all, 'detail'] as const,
  detail: (id: string) => [...topicKeys.details(), id] as const,
};

// Get all topics with pagination and filters
export const useAllTopics = (params: TopicListParams = {}) => {
  return useQuery({
    queryKey: topicKeys.list(params),
    queryFn: () => topicService.getAllTopics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get topic by ID
export const useTopicById = (id: string) => {
  return useQuery({
    queryKey: topicKeys.detail(id),
    queryFn: () => topicService.getTopicById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create topic mutation
export const useCreateTopic = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTopicRequest) => topicService.createTopic(data),
    onSuccess: (data) => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

// Update topic mutation
export const useUpdateTopic = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTopicRequest }) => 
      topicService.updateTopic(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
      // Invalidate specific topic detail
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(variables.id) });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

// Delete topic mutation
export const useDeleteTopic = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => topicService.deleteTopic(id),
    onSuccess: (data) => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};