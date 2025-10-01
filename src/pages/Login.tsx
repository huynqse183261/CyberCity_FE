import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { message } from 'antd';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, redirecting...', user);
      const roleRoutes = {
        'admin': '/admin',
        'teacher': '/teacher', 
        'student': '/student'
      };
      const redirectPath = roleRoutes[user.role as keyof typeof roleRoutes];
      console.log('Redirecting to:', redirectPath, 'for role:', user.role);
      if (redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, user, navigate]);

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

  const handleGoogleLogin = () => {
    // Placeholder for Google login integration
    console.log('Đăng nhập với Google...');
    alert('Tính năng đăng nhập Google sẽ được tích hợp sau!');
    
    // In a real app, you would integrate with Google OAuth
    // Example with Google Identity Services:
    // window.google.accounts.id.prompt();
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
        message.success('Đăng nhập thành công!');
        
        // Get current user immediately after successful login
        const currentUser = authService.getCurrentUser();
        console.log('Login successful, current user:', currentUser);
        
        if (currentUser) {
          // Immediate redirect based on role
          const roleRoutes = {
            'admin': '/admin',
            'teacher': '/teacher', 
            'student': '/student'
          };
          
          const redirectPath = roleRoutes[currentUser.role as keyof typeof roleRoutes];
          console.log('Redirecting to:', redirectPath, 'for role:', currentUser.role);
          navigate(redirectPath);
        } else {
          console.warn('User data not available after login');
          navigate('/');
        }
      } else {
        message.error(result.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Đăng nhập thất bại. Vui lòng thử lại!');
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
            <a href="#" className="forgot-link">Quên mật khẩu?</a>
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
          <button 
            type="button"
            className="social-button google-button"
            onClick={handleGoogleLogin}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </g>
            </svg>
            Đăng nhập với Google
          </button>
        </div>

        <div className="signup-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
