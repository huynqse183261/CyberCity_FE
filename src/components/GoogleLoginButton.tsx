import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError
}) => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        message.error('Không nhận được thông tin từ Google');
        onError?.();
        return;
      }

      // Gửi ID token (credential) để xác thực
      const result = await googleLogin(credentialResponse.credential);
      
      if (result.success) {
        message.success(result.message || 'Đăng nhập Google thành công!');
        
        // Force immediate redirect using AuthService data
        const isAuth = authService.isAuthenticated();
        const currentUser = authService.getCurrentUser();
        
        if (isAuth && currentUser) {
          // Check account status (case-insensitive)
          const status = currentUser.status as string | undefined;
          if (status && status.toLowerCase() !== 'active') {
            message.warning('Tài khoản của bạn hiện không hoạt động. Vui lòng liên hệ quản trị viên.');
            navigate('/access-denied');
            return;
          }

          // Redirect based on role
          const roleRoutes = {
            'admin': '/admin',
            'student': '/student'
          };
          
          const redirectPath = roleRoutes[currentUser.role as keyof typeof roleRoutes];
          
          if (redirectPath) {
            // Force page reload to ensure ProtectedRoute sees the updated state
            window.location.href = redirectPath;
          } else {
            window.location.href = '/';
          }
        } else {
          message.error('Lỗi xác thực sau khi đăng nhập Google');
        }
        
        onSuccess?.();
      } else {
        message.error(result.message || 'Đăng nhập Google thất bại!');
        onError?.();
      }
    } catch (error: any) {
      message.error('Lỗi đăng nhập Google');
      onError?.();
    }
  };

  const handleGoogleError = () => {
    message.error('Đăng nhập Google thất bại');
    onError?.();
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        logo_alignment="left"
        // GSI không chấp nhận width dạng %, bỏ để tự căn theo container
      />
    </div>
  );
};

export default GoogleLoginButton;