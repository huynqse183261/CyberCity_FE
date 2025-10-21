import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import userService from '../services/userService';
import type {
  UpdateUserRequestDto,
  UpdatePasswordDto
} from '../services/userService';

// ===========================
// CUSTOM HOOK: useUserProfile
// ===========================

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  // Get current user profile
  const {
    data: profileData,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  const profile = profileData?.data;

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUserRequestDto) => userService.updateProfile(data),
    onSuccess: (response) => {
      message.success(response.message || 'Cập nhật thông tin thành công!');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Không thể cập nhật thông tin!');
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: UpdatePasswordDto) => userService.changePassword(data),
    onSuccess: (response) => {
      message.success(response.message || 'Đổi mật khẩu thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại!');
    }
  });

  // Update avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: ({ userId, avatarFile }: { userId: string; avatarFile: File }) =>
      userService.updateAvatar(userId, avatarFile),
    onSuccess: (response) => {
      message.success('Cập nhật avatar thành công!');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      return response.avatarUrl;
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error || 'Không thể cập nhật avatar!');
    }
  });

  // Helper functions
  const updateProfile = async (data: UpdateUserRequestDto): Promise<boolean> => {
    try {
      await updateProfileMutation.mutateAsync(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const changePassword = async (data: UpdatePasswordDto): Promise<boolean> => {
    try {
      await changePasswordMutation.mutateAsync(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateAvatar = async (userId: string, avatarFile: File): Promise<string | null> => {
    try {
      const result = await updateAvatarMutation.mutateAsync({ userId, avatarFile });
      return result.avatarUrl;
    } catch (error) {
      return null;
    }
  };

  return {
    profile,
    loading,
    error,
    refetch,
    updateProfile,
    changePassword,
    updateAvatar,
    isUpdating: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUpdatingAvatar: updateAvatarMutation.isPending
  };
};

export default useUserProfile;
