// Interface cho form đăng ký
export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

// Interface cho validation errors
export interface FormErrors {
  email?: string;
  username?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

// Interface cho password strength
export interface PasswordStrength {
  level: number; // 0-4
  feedback: string;
  className: 'weak' | 'medium' | 'strong' | '';
}

// Interface cho user registration API
export interface RegisterRequest {
  email: string;
  username: string;
  phone: string;
  password: string;
}

// Interface cho API response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  username: string;
  requiresVerification: boolean;
}
