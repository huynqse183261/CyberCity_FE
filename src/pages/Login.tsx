import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { message } from 'antd';
import GoogleLoginButton from '../components/GoogleLoginButton';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Nếu đã đăng nhập, điều hướng bằng Navigate để tránh effect gây vòng lặp
  if (isAuthenticated && user) {
    const roleRoutes = {
      'admin': '/admin',
      'teacher': '/teacher', 
      'student': '/student'
    } as const;
    const redirectPath = roleRoutes[user.role as keyof typeof roleRoutes] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const particlesContainer = document.querySelector('.particles');
      if (!particlesContainer) return;
      
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particlesContainer.appendChild(particle);
      }
    };

    // Add floating animation to login container
    const handleMouseMove = (e: MouseEvent) => {
      const loginContainer = document.querySelector('.login-container') as HTMLElement;
      if (loginContainer) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        loginContainer.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 5}deg) rotateX(${(y - 0.5) * -5}deg)`;
      }
    };

    // Add smooth focus effects
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('form-input') && target.parentElement) {
        target.parentElement.style.transform = 'translateY(-2px)';
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('form-input') && target.parentElement) {
        target.parentElement.style.transform = 'translateY(0)';
      }
    };

    createParticles();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      message.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);

    try {
      // Use authentication service to login
      const result = await login(email, password);
      
      if (result.success) {
        message.success(result.message || 'Đăng nhập thành công!');
        
        // Get current user immediately after successful login
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // Nếu tài khoản không Active, đưa sang trang Access Denied (tự quay lại sau 30s)
          const status = (currentUser as any).status as string | undefined;
          if (status && status.toLowerCase() !== 'active') {
            message.warning('Tài khoản của bạn hiện không hoạt động. Vui lòng liên hệ quản trị viên.');
            navigate('/access-denied');
            return;
          }

          // Immediate redirect based on role
          const roleRoutes = {
            'admin': '/admin',
            'teacher': '/teacher', 
            'student': '/student'
          };
          
          const redirectPath = roleRoutes[currentUser.role as keyof typeof roleRoutes];
          navigate(redirectPath, { replace: true });
        } else {
          navigate('/');
        }
      } else {
        // Hiển thị lỗi mà không reload trang
        message.error(result.message || 'Đăng nhập thất bại!');
        // Không reload trang, giữ nguyên form để user có thể thử lại
      }
    } catch (error: any) {
      
      // Xử lý lỗi chi tiết hơn
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại!';
      
      if (error.response) {
        // Lỗi từ server
        const { status, data } = error.response;
        if (status === 401) {
          errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng!';
        } else if (status === 429) {
          errorMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau!';
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Kết nối bị timeout. Vui lòng thử lại!';
      } else if (!error.response) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra internet!';
      }
      
      message.error(errorMessage);
      // Không reload trang, giữ nguyên form để user có thể thử lại
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background particles */}
      <div className="particles"></div>

                <div className="login-container">
        <div className="security-badge">Bảo mật</div>
        
        <div className="logo-section">
          <Link to="/" className="logo">CyberLearn VN</Link>
          <h1 className="welcome-text">Chào mừng trở lại!</h1>
          <p className="subtitle">Đăng nhập để tiếp tục hành trình học tập</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email hoặc Tên đăng nhập
            </label>
            <input 
              type="text" 
              id="email" 
              name="email" 
              className="form-input" 
              placeholder="Nhập email hoặc tên đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password" 
                name="password" 
                className="form-input" 
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={togglePassword}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="remember" 
                name="remember" 
                className="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" className="checkbox-label">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <a href="/forgot-password" className="forgot-link">Quên mật khẩu?</a>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="divider">
          <span>Hoặc đăng nhập với</span>
        </div>

        <div className="social-login">
          <GoogleLoginButton />
        </div>

        <div className="signup-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
