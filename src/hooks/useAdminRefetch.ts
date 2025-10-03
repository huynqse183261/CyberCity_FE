import { useGlobalRefetch } from './useGlobalRefetch';

/**
 * Custom hook for Admin pages to use consistent refetch patterns
 * Provides both global and entity-specific refetch methods
 */
export const useAdminRefetch = () => {
  const globalRefetch = useGlobalRefetch();

  return {
    // Global methods
    ...globalRefetch,
    
    // Convenience methods for common admin operations
    refetchAllData: () => globalRefetch.refetchAll(),
    
    // Refresh current page data (usually called after CRUD operations)
    refreshCurrentPage: (entity: 'courses' | 'modules' | 'lessons' | 'products' | 'team') => {
      globalRefetch.refetchByEntity(entity);
    },
    
    // Refresh related data (e.g., after creating a module, refresh both modules and courses)
    refreshRelatedData: (entities: Array<'courses' | 'modules' | 'lessons' | 'products' | 'team'>) => {
      globalRefetch.refetchMultiple(entities);
    },
    
    // Force refresh with loading states (useful for manual refresh buttons)
    forceRefresh: async (entity?: 'courses' | 'modules' | 'lessons' | 'products' | 'team') => {
      await globalRefetch.refetchWithRefresh(entity);
    }
  };
};