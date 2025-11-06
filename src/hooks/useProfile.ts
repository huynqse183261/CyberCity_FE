import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import userService from '../services/userService';
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest
} from '../services/userService';

// ===========================
// USE PROFILE HOOK
// ===========================

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Load user profile
  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getMyProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      const response = await userService.updateMyProfile(data);
      if (response.success) {
        message.success(response.message || 'Cập nhật thông tin thành công');
        setProfile(response.data);
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
      return false;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      const response = await userService.changePassword(data);
      if (response.success) {
        message.success(response.message || 'Đổi mật khẩu thành công');
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể đổi mật khẩu');
      return false;
    }
  }, []);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File) => {
    if (!profile?.uid) {
      message.error('Không tìm thấy thông tin người dùng');
      return false;
    }

    setAvatarUploading(true);
    try {
      const response = await userService.uploadAvatar(profile.uid, file);
      if (response.avatarUrl) {
        message.success('Cập nhật avatar thành công');
        // Update profile with new avatar
        setProfile(prev => prev ? { ...prev, image: response.avatarUrl } : null);
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Không thể tải lên avatar');
      return false;
    } finally {
      setAvatarUploading(false);
    }
  }, [profile?.uid]);

  // Initial load
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    loading,
    profile,
    avatarUploading,
    loadProfile,
    updateProfile,
    changePassword,
    uploadAvatar
  };
};
