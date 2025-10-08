import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import authService, { type UserInfo } from '../services/authService';
import type { RegisterFormData } from '../models';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; message: string; errors?: any }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  googleLogin: (accessToken: string) => Promise<{ success: boolean; message: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      const token = authService.getAccessToken();
      const userData = authService.getCurrentUser();
      
      if (token && userData) {
        // Kiểm tra token có hết hạn không
        if (authService.isTokenExpired(token)) {
          // Try to refresh token
          try {
            await authService.refreshToken();
            const refreshedUser = authService.getCurrentUser();
            setUser(refreshedUser);
            setIsAuthenticated(!!refreshedUser);
          } catch (error) {
            // Refresh failed, clear auth data
            authService.clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // Token still valid
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      console.log('AuthContext: Starting login...');
      const response = await authService.login({ usernameOrEmail, password });
      console.log('AuthContext: Login response:', response);
      
      if (response.success) {
        // AuthService đã xử lý và lưu token + user info
        // Chỉ cần lấy user info từ authService
        const currentUser = authService.getCurrentUser();
        console.log('AuthContext: Current user from authService:', currentUser);
        
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          
          return { 
            success: true, 
            message: response.message || 'Đăng nhập thành công!' 
          };
        }
      }
      
      // Không reset auth state khi login thất bại
      return { 
        success: false, 
        message: response.message || 'Đăng nhập thất bại!' 
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Xử lý lỗi chi tiết hơn
      let errorMessage = 'Lỗi kết nối server';
      
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
        } else if (status === 429) {
          errorMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau';
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Kết nối bị timeout. Vui lòng thử lại';
      } else if (!error.response) {
        errorMessage = 'Không thể kết nối đến server';
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      console.log('AuthContext: Starting registration...');
      const response = await authService.register(data);
      console.log('AuthContext: Register response:', response);
      
      return {
        success: response.success,
        message: response.message || (response.success ? 'Đăng ký thành công!' : 'Đăng ký thất bại'),
        errors: response.errors
      };
    } catch (error: any) {
      console.error('AuthContext: Register error:', error);
      
      // Xử lý lỗi chi tiết hơn
      let errorMessage = 'Lỗi kết nối server';
      let errors = null;
      
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          errorMessage = 'Dữ liệu không hợp lệ';
          errors = data.errors;
        } else if (status === 409) {
          errorMessage = 'Email hoặc tên đăng nhập đã tồn tại';
        } else if (status === 422) {
          errorMessage = 'Dữ liệu không hợp lệ';
          errors = data.errors;
        } else if (data && data.message) {
          errorMessage = data.message;
          errors = data.errors;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Kết nối bị timeout. Vui lòng thử lại';
      } else if (!error.response) {
        errorMessage = 'Không thể kết nối đến server';
      }
      
      return { 
        success: false, 
        message: errorMessage,
        errors
      };
    }
  };

  const googleLogin = async (idToken: string) => {
    try {
      console.log('AuthContext: Starting Google login...');
      const response = await authService.googleLogin(idToken);
      console.log('AuthContext: Google login response:', response);
      
      if (response.success) {
        // AuthService đã lưu token và user info, chỉ cần update state
        const currentUser = authService.getCurrentUser();
        console.log('Google login successful, current user:', currentUser);
        
        // Update state regardless of currentUser availability
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Always return success if authService says so
        return { 
          success: true, 
          message: response.message || 'Đăng nhập Google thành công!' 
        };
      }
      
      return { 
        success: false, 
        message: response.message || 'Đăng nhập Google thất bại!' 
      };
    } catch (error: any) {
      console.error('Google login error:', error);
      
      let errorMessage = 'Lỗi đăng nhập Google';
      
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          errorMessage = 'Token Google không hợp lệ';
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (!error.response) {
        errorMessage = 'Không thể kết nối đến server';
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUserData,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hooks for specific roles
export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  return user?.role === 'admin';
};

export const useIsTeacher = (): boolean => {
  const { user } = useAuth();
  return user?.role === 'teacher';
};

export const useIsStudent = (): boolean => {
  const { user } = useAuth();
  return user?.role === 'student';
};

export const useHasPermission = (allowedRoles: Array<'admin' | 'teacher' | 'student'>): boolean => {
  const { user } = useAuth();
  return user ? allowedRoles.includes(user.role) : false;
};