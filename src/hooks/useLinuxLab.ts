import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import linuxLabService, { 
  type CreateLabEnvironmentRequest, 
  type CreateLabSessionRequest 
} from '../api/linuxLabService';
import type { 
  LinuxLabEnvironment, 
  LinuxLabSession
} from '../models/LinuxLabTypes';
import type { ApiResponse } from '../models';

// Query keys
export const LAB_QUERY_KEYS = {
  environments: ['lab', 'environments'] as const,
  environment: (id: string) => ['lab', 'environment', id] as const,
  sessions: ['lab', 'sessions'] as const,
  session: (id: string) => ['lab', 'session', id] as const,
  userSessions: (userId: string) => ['lab', 'sessions', 'user', userId] as const,
  commandHistory: (sessionId: string) => ['lab', 'session', sessionId, 'history'] as const,
  resourceUsage: (sessionId: string) => ['lab', 'session', sessionId, 'resources'] as const,
} as const;

// Hook for getting available lab environments
export const useLabEnvironments = (
  options?: Omit<UseQueryOptions<ApiResponse<LinuxLabEnvironment[]>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: LAB_QUERY_KEYS.environments,
    queryFn: linuxLabService.getAvailableEnvironments,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Hook for getting specific lab environment
export const useLabEnvironment = (
  environmentId: string,
  options?: Omit<UseQueryOptions<ApiResponse<LinuxLabEnvironment>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: LAB_QUERY_KEYS.environment(environmentId),
    queryFn: () => linuxLabService.getById<LinuxLabEnvironment>(environmentId),
    enabled: !!environmentId,
    ...options,
  });
};

// Hook for creating lab environment
export const useCreateLabEnvironment = (
  options?: UseMutationOptions<ApiResponse<LinuxLabEnvironment>, Error, CreateLabEnvironmentRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: linuxLabService.createEnvironment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LAB_QUERY_KEYS.environments });
    },
    ...options,
  });
};

// Hook for creating lab session
export const useCreateLabSession = (
  options?: UseMutationOptions<ApiResponse<LinuxLabSession>, Error, CreateLabSessionRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: linuxLabService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LAB_QUERY_KEYS.sessions });
    },
    ...options,
  });
};

// Hook for getting lab session
export const useLabSession = (
  sessionId: string,
  options?: Omit<UseQueryOptions<ApiResponse<LinuxLabSession>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: LAB_QUERY_KEYS.session(sessionId),
    queryFn: () => linuxLabService.getSession(sessionId),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      // Chỉ refetch khi session đang running
      const session = query.state.data?.data;
      return session?.status === 'running' ? 5000 : false; // 5 seconds
    },
    ...options,
  });
};

// Hook for stopping lab session
export const useStopLabSession = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: linuxLabService.stopSession,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: LAB_QUERY_KEYS.session(sessionId) });
      queryClient.invalidateQueries({ queryKey: LAB_QUERY_KEYS.sessions });
    },
    ...options,
  });
};

// Hook for executing command in lab
export const useExecuteCommand = (
  options?: UseMutationOptions<ApiResponse<{
    output: string;
    exitCode: number;
    executionTime: number;
  }>, Error, { sessionId: string; command: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, command }) => linuxLabService.executeCommand(sessionId, command),
    onSuccess: (_, { sessionId }) => {
      // Invalidate command history
      queryClient.invalidateQueries({ 
        queryKey: LAB_QUERY_KEYS.commandHistory(sessionId) 
      });
    },
    ...options,
  });
};

// Hook for getting command history
export const useCommandHistory = (
  sessionId: string,
  options?: Omit<UseQueryOptions<ApiResponse<any[]>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: LAB_QUERY_KEYS.commandHistory(sessionId),
    queryFn: () => linuxLabService.getCommandHistory(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};

// Hook for getting resource usage
export const useResourceUsage = (
  sessionId: string,
  options?: Omit<UseQueryOptions<ApiResponse<{
    cpu: number;
    memory: number;
    disk: number;
    network: { upload: number; download: number };
    uptime: number;
  }>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: LAB_QUERY_KEYS.resourceUsage(sessionId),
    queryFn: () => linuxLabService.getResourceUsage(sessionId),
    enabled: !!sessionId,
    refetchInterval: 10000, // Refetch every 10 seconds
    ...options,
  });
};

// Hook for uploading file to lab
export const useUploadLabFile = (
  options?: UseMutationOptions<ApiResponse<{
    fileName: string;
    filePath: string;
    fileSize: number;
  }>, Error, { sessionId: string; file: File; path?: string }>
) => {
  return useMutation({
    mutationFn: ({ sessionId, file, path }) => linuxLabService.uploadFile(sessionId, file, path),
    ...options,
  });
};

// Hook for creating snapshot
export const useCreateSnapshot = (
  options?: UseMutationOptions<ApiResponse<{
    snapshotId: string;
    name: string;
    size: number;
    createdAt: Date;
  }>, Error, { sessionId: string; snapshotName: string }>
) => {
  return useMutation({
    mutationFn: ({ sessionId, snapshotName }) => 
      linuxLabService.createSnapshot(sessionId, snapshotName),
    ...options,
  });
};

// Hook for restoring from snapshot
export const useRestoreSnapshot = (
  options?: UseMutationOptions<ApiResponse<null>, Error, { sessionId: string; snapshotId: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sessionId, snapshotId }) => 
      linuxLabService.restoreFromSnapshot(sessionId, snapshotId),
    onSuccess: (_, { sessionId }) => {
      // Invalidate session and related data
      queryClient.invalidateQueries({ queryKey: LAB_QUERY_KEYS.session(sessionId) });
      queryClient.invalidateQueries({ queryKey: LAB_QUERY_KEYS.commandHistory(sessionId) });
    },
    ...options,
  });
};

// Hook for listing directory contents
export const useListDirectory = (
  sessionId: string,
  path: string = '~',
  options?: Omit<UseQueryOptions<ApiResponse<{
    path: string;
    items: Array<{
      name: string;
      type: 'file' | 'directory' | 'symlink';
      size: number;
      permissions: string;
      lastModified: Date;
    }>;
  }>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['lab', 'directory', sessionId, path],
    queryFn: () => linuxLabService.listDirectory(sessionId, path),
    enabled: !!sessionId,
    ...options,
  });
};

// Custom hook for managing terminal WebSocket connection
export const useTerminalConnection = (sessionId: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!sessionId) return;

    const websocket = linuxLabService.connectTerminal(sessionId);
    
    websocket.onopen = () => {
      setIsConnected(true);
    };
    
    websocket.onmessage = (event) => {
      setMessages((prev: string[]) => [...prev, event.data]);
    };
    
    websocket.onclose = () => {
      setIsConnected(false);
    };
    
    websocket.onerror = () => {
      setIsConnected(false);
    };
    
    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [sessionId]);

  const sendMessage = (message: string) => {
    if (ws && isConnected) {
      ws.send(message);
    }
  };

  return {
    isConnected,
    messages,
    sendMessage,
    disconnect: () => ws?.close(),
  };
};