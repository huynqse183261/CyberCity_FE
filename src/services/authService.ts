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
  status?: 'Active' | 'Inactive' | string;
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
    GOOGLE_LOGIN: '/auth/google-login',
    FORGOT_PASSWORD_SEND: '/auth/forgot-password/send-code',
    FORGOT_PASSWORD_VERIFY: '/auth/forgot-password/verify-code',
    FORGOT_PASSWORD_RESET: '/auth/forgot-password/reset',
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
          status: (userData as any).status || 'Active',
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
          status: userData.status || 'Active',
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
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
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
        message: error.response?.status === 401 
          ? 'Thông tin đăng nhập không chính xác' 
          : 'Lỗi kết nối server',
      };
    }
  }

  // Đăng ký
  async register(data: RegisterFormData): Promise<ApiResponse<any>> {
    try {
      // Validate input data trước khi gửi
      if (!data.email || !data.username || !data.password || !data.fullName) {
        return {
          success: false,
          message: 'Thiếu thông tin bắt buộc',
        };
      }

      // Clean và validate dữ liệu
      const requestData = {
        email: data.email.trim().toLowerCase(),
        username: data.username.trim(),
        password: data.password,
        fullName: data.fullName.trim(),
        role: 'student'  // Mặc định role là student nếu không có
      };

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(requestData.email)) {
        return {
          success: false,
          message: 'Email không đúng định dạng',
        };
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(requestData.username)) {
        return {
          success: false,
          message: 'Username chỉ chứa chữ, số và dấu gạch dưới (3-20 ký tự)',
        };
      }

      // Validate password length
      if (requestData.password.length < 6) {
        return {
          success: false,
          message: 'Mật khẩu phải có ít nhất 6 ký tự',
        };
      }

      console.log('=== Register Debug ===');
      console.log('1. Input data:', data);
      console.log('2. Cleaned request data:', requestData);
      console.log('3. Endpoint:', this.endpoints.REGISTER);

      const response = await axiosInstance.post<BackendApiResponse<any>>(
        this.endpoints.REGISTER,
        requestData
      );
      
      console.log('4. Raw response status:', response.status);
      console.log('5. Raw response data:', response.data);
      
      const backendData = response.data;
      
      // Handle cả 2 format: isSuccess và success
      const isSuccessful = backendData.isSuccess || (backendData as any).success;
      console.log('6. Backend isSuccess:', backendData.isSuccess);
      console.log('6a. Backend success:', (backendData as any).success);
      console.log('7. Final isSuccessful:', isSuccessful);
      
      return {
        success: isSuccessful,
        data: backendData.data,
        message: backendData.message || 'Đăng ký thành công',
      };
    } catch (error: any) {
      console.error('=== Register Error ===');
      console.error('Error object:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        console.log('Backend error data:', errorData);
        
        // Xử lý specific error messages
        let errorMessage = errorData.message || 'Đăng ký thất bại';
        
        if (error.response.status === 400) {
          if (errorMessage.includes('Email') || errorMessage.includes('email')) {
            errorMessage = 'Email đã được sử dụng hoặc không hợp lệ';
          } else if (errorMessage.includes('Username') || errorMessage.includes('username')) {
            errorMessage = 'Tên đăng nhập đã được sử dụng hoặc không hợp lệ';
          } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin';
          }
        }
        
        return {
          success: false,
          message: errorMessage,
          errors: errorData.errors,
        };
      }
      
      return {
        success: false,
        message: error.response?.status === 409 
          ? 'Email hoặc tên đăng nhập đã tồn tại' 
          : 'Lỗi kết nối server',
      };
    }
  }

  // Google Login
  async googleLogin(idToken: string): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log('=== Google Login Debug ===');
      console.log('1. Input idToken:', idToken?.substring(0, 50) + '...');
      console.log('2. Endpoint:', this.endpoints.GOOGLE_LOGIN);
      console.log('3. Request payload:', { idToken: idToken?.substring(0, 50) + '...' });
      
      const response = await axiosInstance.post<BackendApiResponse<LoginResponse>>(
        this.endpoints.GOOGLE_LOGIN,
        { idToken }
      );
      
      console.log('4. Raw response status:', response.status);
      console.log('5. Raw response data:', response.data);
      
      // Xử lý response từ backend
      const backendData = response.data;
      console.log('6. Backend isSuccess:', backendData.isSuccess);
      console.log('6a. Backend success:', (backendData as any).success);
      console.log('7. Backend data exists:', !!backendData.data);
      console.log('8. Backend message:', backendData.message);
      
      // Handle cả 2 format: isSuccess và success
      const isSuccessful = backendData.isSuccess || (backendData as any).success;
      
      if (isSuccessful && backendData.data) {
        const userData = backendData.data;
        console.log('9. User data from backend:', userData);
        
        // Handle cả 2 format: userId và uid
        const userId = userData.userId || (userData as any).uid;
        const token = userData.token || (userData as any).access_token;
        
        if (!userId || !token) {
          console.error('Missing required fields:', { userId, token });
          return {
            success: false,
            message: 'Dữ liệu từ server không đầy đủ',
          };
        }
        
        // Lưu token vào localStorage
        localStorage.setItem('access_token', token);
        if (userData.refreshToken) {
          localStorage.setItem('refresh_token', userData.refreshToken);
        }
        
        // Lưu thông tin user
        const userInfo: UserInfo = {
          id: userId,
          email: userData.email,
          username: userData.username,
          fullName: userData.fullName,
          role: userData.role,
          avatar: userData.avatar,
          isVerified: userData.isVerified,
          status: (userData as any).status || 'Active',
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        console.log('10. Saved user info:', userInfo);
        console.log('11. Token saved:', !!localStorage.getItem('access_token'));
        
        return {
          success: true,
          data: userData,
          message: backendData.message || 'Đăng nhập Google thành công!',
        };
      } else {
        console.log('12. Backend response not successful');
        console.log('    - isSuccess:', backendData.isSuccess);
        console.log('    - success:', (backendData as any).success);
        console.log('    - data:', backendData.data);
        return {
          success: false,
          message: backendData.message || 'Đăng nhập Google thất bại',
        };
      }
    } catch (error: any) {
      console.error('=== Google Login Error ===');
      console.error('Error object:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData.message || 'Đăng nhập Google thất bại',
          errors: errorData.errors,
        };
      }
      
      return {
        success: false,
        message: 'Lỗi kết nối server khi đăng nhập Google',
      };
    }
  }

  // Đăng xuất
  async logout(): Promise<ApiResponse<null>> {
    try {
      console.log('Logout: Starting logout...');
      
      const response = await axiosInstance.post<BackendApiResponse<null>>(
        this.endpoints.LOGOUT
      );
      
      console.log('Logout response:', response.data);
      
      // Xóa tokens khỏi localStorage
      this.clearAuthData();
      
      return {
        success: response.data.isSuccess,
        message: response.data.message || 'Đăng xuất thành công',
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      console.error('Logout error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
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
          status: (userData as any).status || 'Active',
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
      // Nếu refresh token thất bại, xóa auth data
      this.clearAuthData();
      // Chỉ redirect nếu không ở trang login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
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

  // Forgot Password - Gửi mã xác thực
  async sendForgotPasswordCode(email: string): Promise<ApiResponse<any>> {
    try {
      console.log('Sending forgot password code to:', email);
      
      const response = await axiosInstance.post<BackendApiResponse<any>>(
        this.endpoints.FORGOT_PASSWORD_SEND,
        { email }
      );
      
      console.log('Send code response:', response.data);
      const backendData = response.data;
      
      // Handle cả 2 format: isSuccess và success
      const isSuccessful = backendData.isSuccess || (backendData as any).success;
      
      return {
        success: isSuccessful,
        data: backendData.data,
        message: backendData.message || 'Mã xác thực đã được gửi đến email của bạn',
      };
    } catch (error: any) {
      console.error('Send forgot password code error:', error);
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData.message || 'Không thể gửi mã xác thực',
          errors: errorData.errors,
        };
      }
      
      return {
        success: false,
        message: 'Lỗi kết nối server',
      };
    }
  }

  // Forgot Password - Xác thực mã
  async verifyForgotPasswordCode(email: string, code: string): Promise<ApiResponse<any>> {
    try {
      console.log('Verifying forgot password code for:', email);
      
      const response = await axiosInstance.post<BackendApiResponse<any>>(
        this.endpoints.FORGOT_PASSWORD_VERIFY,
        { email, code }
      );
      
      console.log('Verify code response:', response.data);
      const backendData = response.data;
      
      // Handle cả 2 format: isSuccess và success
      const isSuccessful = backendData.isSuccess || (backendData as any).success;
      
      return {
        success: isSuccessful,
        data: backendData.data,
        message: backendData.message || 'Mã xác thực hợp lệ',
      };
    } catch (error: any) {
      console.error('Verify forgot password code error:', error);
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData.message || 'Mã xác thực không hợp lệ',
          errors: errorData.errors,
        };
      }
      
      return {
        success: false,
        message: 'Lỗi kết nối server',
      };
    }
  }

  // Forgot Password - Đặt lại mật khẩu
  async resetForgotPassword(email: string, code: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      console.log('Resetting password for:', email);
      
      const response = await axiosInstance.post<BackendApiResponse<any>>(
        this.endpoints.FORGOT_PASSWORD_RESET,
        { email, code, newPassword }
      );
      
      console.log('Reset password response:', response.data);
      const backendData = response.data;
      
      // Handle cả 2 format: isSuccess và success
      const isSuccessful = backendData.isSuccess || (backendData as any).success;
      
      return {
        success: isSuccessful,
        data: backendData.data,
        message: backendData.message || 'Mật khẩu đã được đặt lại thành công',
      };
    } catch (error: any) {
      console.error('Reset forgot password error:', error);
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData.message || 'Không thể đặt lại mật khẩu',
          errors: errorData.errors,
        };
      }
      
      return {
        success: false,
        message: 'Lỗi kết nối server',
      };
    }
  }
}

// Export singleton instance
export default new AuthService();