import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import type { AxiosError } from 'axios';
import { message } from 'antd';

export const USERS_QUERY_KEYS = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
} as const;

export const useUsers = (params?: { pageNumber?: number; pageSize?: number; descending?: boolean }) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.users,
    queryFn: async () => {
      const data = await userService.getUsers(params || { pageNumber: 1, pageSize: 1000, descending: true });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      message.success('Xóa người dùng thành công');
      qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'users' });
    },
    onError: (err: AxiosError) => {
      message.error('Xóa người dùng thất bại');
      throw err;
    }
  });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => 
      userService.updateUserRole(id, role),
    onSuccess: () => {
      message.success('Cập nhật vai trò thành công');
      qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'users' });
    },
    onError: (err: AxiosError) => {
      message.error('Cập nhật vai trò thất bại');
      throw err;
    }
  });
};

export const useUpdateUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'Active' | 'Inactive' }) => 
      userService.updateUserStatus(id, status),
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công');
      qc.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'users' });
    },
    onError: (err: AxiosError) => {
      message.error('Cập nhật trạng thái thất bại');
      throw err;
    }
  });
};
