import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import authService, { type UserInfo } from '../services/authService';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
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
      
      return { 
        success: false, 
        message: response.message || 'Đăng nhập thất bại!' 
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Lỗi kết nối server' 
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
    logout,
    refreshUserData,
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