import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contentService from '../services/contentService';
import quizService from '../services/quizService';
import subscriptionService from '../services/subscriptionService';

// Query keys
export const courseContentKeys = {
  all: ['course-content'] as const,
  outlines: () => [...courseContentKeys.all, 'outlines'] as const,
  outlineBySlug: (slug: string) => [...courseContentKeys.outlines(), 'slug', slug] as const,
  outlineByUid: (uid: string) => [...courseContentKeys.outlines(), 'uid', uid] as const,
  subtopics: () => [...courseContentKeys.all, 'subtopics'] as const,
  subtopic: (uid: string) => [...courseContentKeys.subtopics(), uid] as const,
  quizzes: () => [...courseContentKeys.all, 'quizzes'] as const,
  quizzesByModule: (moduleUid: string) => [...courseContentKeys.quizzes(), 'module', moduleUid] as const,
  quiz: (uid: string) => [...courseContentKeys.quizzes(), uid] as const,
  moduleAccess: (courseUid: string, moduleIndex: number) => 
    [...courseContentKeys.all, 'access', courseUid, moduleIndex] as const,
};

// Hook để fetch course outline by slug
export const useCourseOutlineBySlug = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: courseContentKeys.outlineBySlug(slug),
    queryFn: () => contentService.getCourseOutlineBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes - cache lâu hơn vì course outline ít thay đổi
    gcTime: 30 * 60 * 1000, // 30 minutes - giữ cache lâu hơn
    retry: 2,
  });
};

// Hook để fetch course outline by UID
export const useCourseOutlineByUid = (courseUid: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: courseContentKeys.outlineByUid(courseUid || ''),
    queryFn: () => contentService.getCourseOutlineByUid(courseUid!),
    enabled: enabled && !!courseUid,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};

// Hook để prefetch course outline (dùng khi hover vào module)
export const usePrefetchCourseOutline = () => {
  const queryClient = useQueryClient();
  
  return {
    prefetchBySlug: (slug: string) => {
      queryClient.prefetchQuery({
        queryKey: courseContentKeys.outlineBySlug(slug),
        queryFn: () => contentService.getCourseOutlineBySlug(slug),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchByUid: (courseUid: string) => {
      queryClient.prefetchQuery({
        queryKey: courseContentKeys.outlineByUid(courseUid),
        queryFn: () => contentService.getCourseOutlineByUid(courseUid),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
};

// Hook để fetch subtopic với lazy loading
export const useSubtopic = (subtopicUid: string | null, enabled = false) => {
  return useQuery({
    queryKey: courseContentKeys.subtopic(subtopicUid || ''),
    queryFn: () => contentService.getSubtopic(subtopicUid!),
    enabled: enabled && !!subtopicUid,
    staleTime: 10 * 60 * 1000, // 10 minutes - subtopic content ít thay đổi
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};

// Hook để prefetch subtopic (dùng khi hover)
export const usePrefetchSubtopic = () => {
  const queryClient = useQueryClient();
  
  return (subtopicUid: string) => {
    queryClient.prefetchQuery({
      queryKey: courseContentKeys.subtopic(subtopicUid),
      queryFn: () => contentService.getSubtopic(subtopicUid),
      staleTime: 10 * 60 * 1000,
    });
  };
};

// Hook để update subtopic progress
export const useUpdateSubtopicProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ subtopicUid, progress }: { subtopicUid: string; progress: number }) =>
      contentService.updateSubtopicProgress(subtopicUid, progress),
    onSuccess: (_, variables) => {
      // Invalidate subtopic query để refetch với progress mới
      queryClient.invalidateQueries({ 
        queryKey: courseContentKeys.subtopic(variables.subtopicUid) 
      });
    },
  });
};

// Hook để fetch quizzes by module
export const useQuizzesByModule = (moduleUid: string | undefined, courseSlug: string, enabled = true) => {
  return useQuery({
    queryKey: courseContentKeys.quizzesByModule(moduleUid || ''),
    queryFn: () => quizService.listQuizzes({ courseSlug, moduleUid: moduleUid! }),
    enabled: enabled && !!moduleUid,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Hook để fetch quiz detail
export const useQuiz = (quizUid: string | null, enabled = false) => {
  return useQuery({
    queryKey: courseContentKeys.quiz(quizUid || ''),
    queryFn: () => quizService.getQuiz(quizUid!),
    enabled: enabled && !!quizUid,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};

// Hook để prefetch quiz (dùng khi hover)
export const usePrefetchQuiz = () => {
  const queryClient = useQueryClient();
  
  return (quizUid: string) => {
    queryClient.prefetchQuery({
      queryKey: courseContentKeys.quiz(quizUid),
      queryFn: () => quizService.getQuiz(quizUid),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// Hook để check module access
export const useModuleAccess = (courseUid: string | undefined, moduleIndex: number, enabled = true) => {
  return useQuery({
    queryKey: courseContentKeys.moduleAccess(courseUid || '', moduleIndex),
    queryFn: () => subscriptionService.checkModuleAccess(courseUid!, moduleIndex),
    enabled: enabled && !!courseUid && moduleIndex >= 0,
    staleTime: 1 * 60 * 1000, // 1 minute - access check có thể thay đổi
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

