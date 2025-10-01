import axiosInstance from './../api/axiosInstance';
import type { 
  RegisterFormData, 
  ApiResponse 
} from '../models';

// Login interfaces - cập nhật theo backend API
export interface LoginRequest {
  usernameOrEmail: string;  // Backend sử dụng usernameOrEmail thay vì email
  password: string;
}

export interface LoginResponse {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student';  // Backend trả về lowercase
  avatar?: string;
  isVerified: boolean;
  token: string;  // JWT token từ backend
  refreshToken?: string;
  expiresIn: number;
}

export interface BackendApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student';  // Backend trả về lowercase
  avatar?: string;
  isVerified: boolean;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Auth Service Class
class AuthService {
  // API Endpoints theo backend
  private readonly endpoints = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    PROFILE: '/auth/profile',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
  };

  // Đăng nhập
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await axiosInstance.post<BackendApiResponse<LoginResponse>>(
        this.endpoints.LOGIN,
        data
      );
      
      console.log('Login response:', response.data);
      
      // Xử lý response từ backend
      const backendData = response.data;
      console.log('Backend data:', backendData);
      console.log('Is backendData.isSuccess?', backendData.isSuccess);
      console.log('Does backendData.data exist?', !!backendData.data);
      
      if (backendData.isSuccess && backendData.data) {
        const userData = backendData.data;
        
        // Lưu token vào localStorage
        localStorage.setItem('access_token', userData.token);
        if (userData.refreshToken) {
          localStorage.setItem('refresh_token', userData.refreshToken);
        }
        
        // Lưu thông tin user
        const userInfo: UserInfo = {
          id: userData.userId,
          email: userData.email,
          username: userData.username,
          fullName: userData.fullName,
          role: userData.role,
          avatar: userData.avatar,
          isVerified: userData.isVerified,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        return {
          success: true,
          data: userData,
          message: backendData.message,
        };
      } else if ((backendData as any).uid) {
        // Fallback: Backend có thể trả về format khác
        const userData = backendData as any;
        
        // Lưu token nếu có
        if (userData.token) {
          localStorage.setItem('access_token', userData.token);
        }
        
        // Lưu thông tin user
        const userInfo: UserInfo = {
          id: userData.uid || userData.userId,
          email: userData.email,
          username: userData.username,
          fullName: userData.fullName,
          role: userData.role,
          avatar: userData.avatar,
          isVerified: userData.isVerified || false,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        return {
          success: true,
          data: userData as LoginResponse,
          message: 'Đăng nhập thành công',
        };
      }
      
      return {
        success: false,
        message: backendData.message || 'Đăng nhập thất bại',
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Xử lý lỗi từ backend
      if (error?.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData.message || 'Đăng nhập thất bại',
          errors: errorData.errors,
        };
      }
      
      return {
        success: false,
        message: 'Lỗi kết nối server',
      };
    }
  }

  // Đăng ký
  async register(data: RegisterFormData): Promise<ApiResponse<any>> {
    try {
      const requestData = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await axiosInstance.post<BackendApiResponse<any>>(
        this.endpoints.REGISTER,
        requestData
      );
      
      const backendData = response.data;
      
      return {
        success: backendData.isSuccess,
        data: backendData.data,
        message: backendData.message,
      };
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData.message || 'Đăng ký thất bại',
          errors: errorData.errors,
        };
      }
      
      return {
        success: false,
        message: 'Lỗi kết nối server',
      };
    }
  }

  // Đăng xuất
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.post<BackendApiResponse<null>>(
        this.endpoints.LOGOUT
      );
      
      // Xóa tokens khỏi localStorage
      this.clearAuthData();
      
      return {
        success: response.data.isSuccess,
        message: response.data.message,
      };
    } catch (error) {
      // Vẫn xóa data local dù API lỗi
      this.clearAuthData();
      return {
        success: true,
        message: 'Đăng xuất thành công',
      };
    }
  }

  // Lấy thông tin profile
  async getProfile(): Promise<ApiResponse<UserInfo>> {
    try {
      const response = await axiosInstance.get<BackendApiResponse<LoginResponse>>(
        this.endpoints.PROFILE
      );
      
      const backendData = response.data;
      
      if (backendData.isSuccess && backendData.data) {
        const userData = backendData.data;
        const userInfo: UserInfo = {
          id: userData.userId,
          email: userData.email,
          username: userData.username,
          fullName: userData.fullName,
          role: userData.role,
          avatar: userData.avatar,
          isVerified: userData.isVerified,
        };
        
        // Cập nhật localStorage
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        return {
          success: true,
          data: userInfo,
          message: backendData.message,
        };
      }
      
      return {
        success: false,
        message: backendData.message || 'Không thể lấy thông tin profile',
      };
    } catch (error: any) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Lỗi kết nối server',
      };
    }
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    try {
      const response = await axiosInstance.post<BackendApiResponse<RefreshTokenResponse>>(
        this.endpoints.REFRESH,
        { refreshToken }
      );

      const backendData = response.data;
      
      // Cập nhật tokens mới
      if (backendData.isSuccess && backendData.data) {
        const { accessToken, refreshToken: newRefreshToken } = backendData.data;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        
        return {
          success: true,
          data: backendData.data,
          message: backendData.message,
        };
      }
      
      return {
        success: false,
        message: backendData.message || 'Refresh token thất bại',
      };
    } catch (error: any) {
      console.error('Refresh token error:', error);
      // Nếu refresh token thất bại, xóa auth data và redirect
      this.clearAuthData();
      window.location.href = '/login';
      throw error;
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.post<BackendApiResponse<null>>(
        this.endpoints.RESET_PASSWORD,
        data
      );
      
      const backendData = response.data;
      
      return {
        success: backendData.isSuccess,
        message: backendData.message,
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Lỗi kết nối server',
      };
    }
  }

  // Đổi mật khẩu
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.put<BackendApiResponse<null>>(
        this.endpoints.CHANGE_PASSWORD,
        data
      );
      
      const backendData = response.data;
      
      return {
        success: backendData.isSuccess,
        message: backendData.message,
      };
    } catch (error: any) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Lỗi kết nối server',
      };
    }
  }

  // Xác thực email
  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.post<BackendApiResponse<null>>(
        `${this.endpoints.VERIFY_EMAIL}/${token}`
      );
      
      const backendData = response.data;
      
      return {
        success: backendData.isSuccess,
        message: backendData.message,
      };
    } catch (error: any) {
      console.error('Verify email error:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Lỗi kết nối server',
      };
    }
  }

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Lấy thông tin user từ localStorage
  getCurrentUser(): UserInfo | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as UserInfo;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Lấy access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Lấy role của user hiện tại
  getCurrentUserRole(): 'admin' | 'teacher' | 'student' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Kiểm tra quyền admin
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  // Kiểm tra quyền teacher
  isTeacher(): boolean {
    return this.getCurrentUserRole() === 'teacher';
  }

  // Kiểm tra quyền student  
  isStudent(): boolean {
    return this.getCurrentUserRole() === 'student';
  }  // Kiểm tra có quyền truy cập route không
  hasPermission(allowedRoles: Array<'admin' | 'teacher' | 'student'>): boolean {
    const currentRole = this.getCurrentUserRole();
    return currentRole ? allowedRoles.includes(currentRole) : false;
  }

  // Xóa dữ liệu xác thực
  clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Decode JWT token để lấy thông tin (optional)
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Kiểm tra token có hết hạn không
  isTokenExpired(token?: string): boolean {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) return true;
    
    const decoded = this.decodeToken(accessToken);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }
}

// Export singleton instance
export default new AuthService();