// Forgot Password Types
export interface ForgotPasswordStep1Data {
  email: string;
}

export interface ForgotPasswordStep2Data {
  email: string;
  code: string;
}

export interface ForgotPasswordStep3Data {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordState {
  step: 1 | 2 | 3;
  email: string;
  code: string;
  isLoading: boolean;
  countdown: number;
  canResend: boolean;
}

export interface ForgotPasswordErrors {
  email?: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}