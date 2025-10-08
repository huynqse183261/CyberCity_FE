import { useQueryClient } from '@tanstack/react-query';

export const useGlobalRefetch = () => {
  const queryClient = useQueryClient();

  const refetchAll = () => {
    queryClient.invalidateQueries();
  };

  const refetchByEntity = (entity: 'courses' | 'modules' | 'lessons' | 'topics' | 'subtopics' | 'products' | 'team') => {
    queryClient.invalidateQueries({ 
      predicate: (query) => query.queryKey[0] === entity 
    });
  };

  const refetchMultiple = (entities: Array<'courses' | 'modules' | 'lessons' | 'topics' | 'subtopics' | 'products' | 'team'>) => {
    entities.forEach(entity => {
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === entity 
      });
    });
  };

  const refetchSpecific = (queryKey: unknown[]) => {
    queryClient.invalidateQueries({ queryKey });
  };

  const refetchWithRefresh = async (entity?: 'courses' | 'modules' | 'lessons' | 'topics' | 'subtopics' | 'products' | 'team') => {
    if (entity) {
      await queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === entity 
      });
      await queryClient.refetchQueries({ 
        predicate: (query) => query.queryKey[0] === entity 
      });
    } else {
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries();
    }
  };

  return {
    refetchAll,
    refetchByEntity,
    refetchMultiple,
    refetchSpecific,
    refetchWithRefresh,
    // Shorthand methods cho từng entity
    refetchCourses: () => refetchByEntity('courses'),
    refetchModules: () => refetchByEntity('modules'),
    refetchLessons: () => refetchByEntity('lessons'),
    refetchTopics: () => refetchByEntity('topics'),
    refetchSubtopics: () => refetchByEntity('subtopics'),
    refetchProducts: () => refetchByEntity('products'),
    refetchTeam: () => refetchByEntity('team'),
  };
};