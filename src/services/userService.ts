import BaseApiService, { API_ENDPOINTS } from './BaseApiService';
import axiosInstance from '../api/axiosInstance';

// ===========================
// PROFILE TYPES
// ===========================

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  fullName: string;
  role: 'teacher' | 'student' | 'admin';
  createdAt?: string;
  image?: string;
  status?: string;
}

export interface UpdateProfileRequest {
  email?: string;
  fullName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface GetProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

class UserService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.USERS);
  }

  // Override to return raw data shape from backend when necessary
  async getUsers(params?: { pageNumber?: number; pageSize?: number; descending?: boolean; }): Promise<any> {
    const resp = await axiosInstance.get(this.endpoint, { params });
    return resp.data;
  }

  async getUserById(id: string) {
    const resp = await axiosInstance.get(`${this.endpoint}/${id}`);
    return resp.data;
  }

  async createUser(data: any) {
    const resp = await axiosInstance.post(this.endpoint, data);
    return resp.data;
  }

  async updateUser(id: string, data: any) {
    const resp = await axiosInstance.put(`${this.endpoint}/${id}`, data);
    return resp.data;
  }

  async deleteUser(id: string) {
    const resp = await axiosInstance.delete(`${this.endpoint}/${id}`);
    return resp.data;
  }

  // Update user role
  async updateUserRole(id: string, role: string) {
    const resp = await axiosInstance.put(`${this.endpoint}/${id}/role`, { role });
    return resp.data;
  }

  // Update user status (Active/Inactive)
  async updateUserStatus(id: string, status: 'Active' | 'Inactive') {
    const resp = await axiosInstance.put(`${this.endpoint}/${id}/status`, { status });
    return resp.data;
  }

  // Update user avatar
  async updateUserAvatar(id: string, avatar: string) {
    const resp = await axiosInstance.put(`${this.endpoint}/${id}/avatar`, { avatar });
    return resp.data;
  }

  // ===========================
  // PROFILE MANAGEMENT (New)
  // ===========================

  /**
   * GET /api/users/me
   * Lấy thông tin cá nhân người dùng đang đăng nhập
   */
  async getMyProfile(): Promise<GetProfileResponse> {
    const resp = await axiosInstance.get(`${this.endpoint}/me`);
    console.log('🔍 Raw API response for /me:', resp.data);
    
    // Handle different response structures
    if (resp.data.success !== undefined) {
      // Response with success wrapper
      return resp.data;
    } else {
      // Direct data response
      return {
        success: true,
        data: resp.data
      };
    }
  }

  /**
   * PUT /api/users/me
   * Cập nhật thông tin cá nhân
   */
  async updateMyProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const resp = await axiosInstance.put(`${this.endpoint}/me`, data);
    return resp.data;
  }

  /**
   * PUT /api/users/me/password
   * Đổi mật khẩu
   */
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const resp = await axiosInstance.put(`${this.endpoint}/me/password`, data);
    return resp.data;
  }

  /**
   * PUT /api/users/{id}/avatar
   * Upload avatar (multipart/form-data)
   */
  async uploadAvatar(userId: string, avatarFile: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const resp = await axiosInstance.put(
      `${this.endpoint}/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return resp.data;
  }
}

export default new UserService();
