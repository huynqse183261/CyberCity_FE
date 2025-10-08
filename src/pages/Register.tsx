import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { message } from 'antd';
import type { RegisterFormData, FormErrors, PasswordStrength } from '../models/RegisterTypes';
import '../styles/Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    terms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    level: 0,
    feedback: 'Độ mạnh mật khẩu',
    className: ''
  });

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

    // Add floating animation to register container
    const handleMouseMove = (e: MouseEvent) => {
      const registerContainer = document.querySelector('.register-container') as HTMLElement;
      if (registerContainer) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        registerContainer.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 3}deg) rotateX(${(y - 0.5) * -3}deg)`;
      }
    };

    // Add smooth focus effects
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('form-input') && target.parentElement) {
        target.parentElement.style.transform = 'translateY(-1px)';
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

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    let strength = 0;
    let feedback = '';
    let className: 'weak' | 'medium' | 'strong' | '' = '';

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength === 0) {
      feedback = 'Độ mạnh mật khẩu';
      className = '';
    } else if (strength <= 2) {
      feedback = 'Yếu - Cần cải thiện';
      className = 'weak';
    } else if (strength <= 3) {
      feedback = 'Trung bình - Khá tốt';
      className = 'medium';
    } else {
      feedback = 'Mạnh - Rất tốt!';
      className = 'strong';
    }

    return { level: strength, feedback, className };
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
  };

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Real-time password strength check
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Real-time password match check
    if (name === 'confirmPassword' || name === 'password') {
      const passwordToCheck = name === 'password' ? value : formData.password;
      const confirmPasswordToCheck = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPasswordToCheck && passwordToCheck !== confirmPasswordToCheck) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Mật khẩu không khớp'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: undefined
        }));
      }
    }
  };

  // Handle field blur for validation
  const handleFieldBlur = (field: keyof RegisterFormData) => {
    const value = formData[field];
    let error = '';

    switch (field) {
      case 'email':
        if (value && !validateEmail(value as string)) {
          error = 'Email không hợp lệ';
        }
        break;
      case 'username':
        if (value && !validateUsername(value as string)) {
          error = 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới (3-20 ký tự)';
        }
        break;
      case 'fullName':
        if (value && (value as string).trim().length < 2) {
          error = 'Họ và tên phải có ít nhất 2 ký tự';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.username) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới (3-20 ký tự)';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (passwordStrength.level < 3) {
      newErrors.password = 'Vui lòng tạo mật khẩu mạnh hơn';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.terms) {
      newErrors.terms = 'Vui lòng đồng ý với điều khoản sử dụng';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting registration process...');
      
      // Sử dụng register function từ AuthContext
      const registrationResult = await register(formData);
      
      console.log('Registration result:', registrationResult);
      
      if (registrationResult.success) {
        message.success(registrationResult.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        // Hiển thị lỗi chi tiết từ server
        console.error('Registration failed:', registrationResult.message);
        message.error(registrationResult.message || 'Đăng ký thất bại!');
        
        // Nếu có lỗi validation chi tiết, hiển thị chúng
        if (registrationResult.errors) {
          const serverErrors: FormErrors = {};
          Object.entries(registrationResult.errors).forEach(([key, value]) => {
            if (key in formData) { // Chỉ áp dụng lỗi cho các field có trong form
              (serverErrors as any)[key] = Array.isArray(value) ? value[0] : value;
            }
          });
          setErrors(serverErrors);
        }
        
        // Không reload trang, giữ nguyên form để user có thể sửa lỗi
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Xử lý lỗi chi tiết hơn
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại!';
      
      if (error.response) {
        // Lỗi từ server
        const { status, data } = error.response;
        if (status === 409) {
          errorMessage = 'Email hoặc tên đăng nhập đã tồn tại!';
        } else if (status === 422) {
          errorMessage = 'Thông tin đăng ký không hợp lệ!';
          // Hiển thị lỗi validation nếu có
          if (data && data.errors) {
            const serverErrors: FormErrors = {};
            Object.entries(data.errors).forEach(([key, value]) => {
              if (key in formData) { // Chỉ áp dụng lỗi cho các field có trong form
                (serverErrors as any)[key] = Array.isArray(value) ? value[0] : value;
              }
            });
            setErrors(serverErrors);
          }
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

  // Render password strength bars
  const renderPasswordStrengthBars = () => {
    const bars = [];
    for (let i = 0; i < 4; i++) {
      const isActive = i < passwordStrength.level;
      bars.push(
        <div 
          key={i}
          className={`strength-bar ${isActive ? `active ${passwordStrength.className}` : ''}`}
        />
      );
    }
    return bars;
  };

  return (
    <div className="register-page">
      {/* Animated background particles */}
      <div className="particles"></div>

      <div className="register-container">
        <div className="logo-section">
          <Link to="/" className="logo">CyberLearn VN</Link>
          <h1 className="welcome-text">Tạo tài khoản mới</h1>
          <p className="subtitle">Bắt đầu hành trình học tập an ninh mạng</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="Nhập địa chỉ email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur('email')}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Tên đăng nhập</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className={`form-input ${errors.username ? 'input-error' : ''}`}
              placeholder="Chọn tên đăng nhập"
              value={formData.username}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur('username')}
              required
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Họ và tên</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              placeholder="Nhập họ và tên đầy đủ"
              value={formData.fullName}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur('fullName')}
              required
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password" 
                name="password" 
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Tạo mật khẩu mạnh"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="password-strength">
              {renderPasswordStrengthBars()}
            </div>
            <div className="strength-text">{passwordStrength.feedback}</div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword" 
                name="confirmPassword" 
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="terms-group">
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="terms" 
                name="terms" 
                className="checkbox"
                checked={formData.terms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="terms" className="checkbox-label">
                Tôi đồng ý với <a href="#" target="_blank">Điều khoản sử dụng</a> và{' '}
                <a href="#" target="_blank">Chính sách bảo mật</a>
              </label>
            </div>
            {errors.terms && <div className="error-message">{errors.terms}</div>}
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="login-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
