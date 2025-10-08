import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import authService from '../services/authService';
import type { 
  ForgotPasswordState, 
  ForgotPasswordErrors
} from '../models/ForgotPasswordTypes';
import '../styles/ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  
  const [state, setState] = useState<ForgotPasswordState>({
    step: 1,
    email: '',
    code: '',
    isLoading: false,
    countdown: 0,
    canResend: true,
  });

  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.countdown > 0) {
      timer = setTimeout(() => {
        setState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    } else if (state.countdown === 0 && !state.canResend) {
      setState(prev => ({ ...prev, canResend: true }));
    }
    return () => clearTimeout(timer);
  }, [state.countdown]);

  // Step 1: Send verification code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.email) {
      setErrors({ email: 'Vui lòng nhập email' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.email)) {
      setErrors({ email: 'Email không đúng định dạng' });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    setErrors({});

    try {
      const result = await authService.sendForgotPasswordCode(state.email);
      
      if (result.success) {
        message.success(result.message || 'Mã xác thực đã được gửi đến email của bạn');
        setState(prev => ({ 
          ...prev, 
          step: 2, 
          isLoading: false,
          countdown: 60,
          canResend: false 
        }));
      } else {
        setErrors({ general: result.message || 'Không thể gửi mã xác thực' });
      }
    } catch (error) {
      setErrors({ general: 'Lỗi kết nối server' });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.code) {
      setErrors({ code: 'Vui lòng nhập mã xác thực' });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    setErrors({});

    try {
      const result = await authService.verifyForgotPasswordCode(state.email, state.code);
      
      if (result.success) {
        message.success(result.message || 'Mã xác thực hợp lệ');
        setState(prev => ({ ...prev, step: 3, isLoading: false }));
      } else {
        setErrors({ code: result.message || 'Mã xác thực không hợp lệ' });
      }
    } catch (error) {
      setErrors({ code: 'Lỗi kết nối server' });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: ForgotPasswordErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    setErrors({});

    try {
      const result = await authService.resetForgotPassword(state.email, state.code, newPassword);
      
      if (result.success) {
        message.success(result.message || 'Mật khẩu đã được đặt lại thành công');
        navigate('/login');
      } else {
        setErrors({ general: result.message || 'Không thể đặt lại mật khẩu' });
      }
    } catch (error) {
      setErrors({ general: 'Lỗi kết nối server' });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (!state.canResend) return;

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await authService.sendForgotPasswordCode(state.email);
      
      if (result.success) {
        message.success('Mã xác thực mới đã được gửi');
        setState(prev => ({ 
          ...prev, 
          countdown: 60,
          canResend: false,
          isLoading: false 
        }));
      } else {
        message.error(result.message || 'Không thể gửi lại mã xác thực');
      }
    } catch (error) {
      message.error('Lỗi kết nối server');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleSendCode}>
      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email đăng ký
        </label>
        <input 
          type="email" 
          id="email" 
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Nhập email đăng ký của bạn"
          value={state.email}
          onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
          disabled={state.isLoading}
          required
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      {errors.general && <div className="error-message">{errors.general}</div>}

      <button 
        type="submit" 
        className="submit-button"
        disabled={state.isLoading}
      >
        {state.isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleVerifyCode}>
      <div className="info-text">
        Mã xác thực đã được gửi đến <strong>{state.email}</strong>
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="code">
          Mã xác thực (6 số)
        </label>
        <input 
          type="text" 
          id="code" 
          className={`form-input code-input ${errors.code ? 'error' : ''}`}
          placeholder="000000"
          value={state.code}
          onChange={(e) => setState(prev => ({ ...prev, code: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
          disabled={state.isLoading}
          maxLength={6}
          required
        />
        {errors.code && <span className="error-text">{errors.code}</span>}
      </div>

      <div className="resend-section">
        {state.countdown > 0 ? (
          <span className="countdown-text">Gửi lại sau {state.countdown}s</span>
        ) : (
          <button 
            type="button" 
            className="resend-button"
            onClick={handleResendCode}
            disabled={state.isLoading || !state.canResend}
          >
            Gửi lại mã
          </button>
        )}
      </div>

      {errors.general && <div className="error-message">{errors.general}</div>}

      <button 
        type="submit" 
        className="submit-button"
        disabled={state.isLoading || state.code.length !== 6}
      >
        {state.isLoading ? 'Đang xác thực...' : 'Xác thực'}
      </button>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleResetPassword}>
      <div className="form-group">
        <label className="form-label" htmlFor="newPassword">
          Mật khẩu mới
        </label>
        <div className="password-input-wrapper">
          <input 
            type={showPassword ? 'text' : 'password'}
            id="newPassword" 
            className={`form-input ${errors.newPassword ? 'error' : ''}`}
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={state.isLoading}
            required
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="confirmPassword">
          Xác nhận mật khẩu mới
        </label>
        <input 
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword" 
          className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={state.isLoading}
          required
        />
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
      </div>

      {errors.general && <div className="error-message">{errors.general}</div>}

      <button 
        type="submit" 
        className="submit-button"
        disabled={state.isLoading}
      >
        {state.isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
      </button>
    </form>
  );

  const getStepTitle = () => {
    switch (state.step) {
      case 1: return 'Quên mật khẩu';
      case 2: return 'Xác thực email';
      case 3: return 'Đặt lại mật khẩu';
      default: return 'Quên mật khẩu';
    }
  };

  const getStepDescription = () => {
    switch (state.step) {
      case 1: return 'Nhập email để nhận mã xác thực';
      case 2: return 'Nhập mã xác thực từ email';
      case 3: return 'Tạo mật khẩu mới cho tài khoản';
      default: return '';
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="particles"></div>
      
      <div className="forgot-password-container">
        <div className="logo-section">
          <Link to="/" className="logo">CyberLearn VN</Link>
          <h1 className="title">{getStepTitle()}</h1>
          <p className="description">{getStepDescription()}</p>
        </div>

        <div className="step-indicator">
          <div className={`step ${state.step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${state.step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${state.step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <div className="form-section">
          {state.step === 1 && renderStep1()}
          {state.step === 2 && renderStep2()}
          {state.step === 3 && renderStep3()}
        </div>

        <div className="back-to-login">
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;