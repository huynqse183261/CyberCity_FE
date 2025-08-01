import { useState } from 'react';
import type { FormErrors } from '../models/RegisterTypes';

// Custom hook for form validation
export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone.replace(/\D/g, ''));
  };

  const validatePassword = (password: string): { isValid: boolean; strength: number } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return {
      isValid: strength >= 3,
      strength
    };
  };

  const setFieldError = (field: keyof FormErrors, error: string | undefined) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    setFieldError,
    clearError,
    clearAllErrors,
    validateEmail,
    validateUsername,
    validatePhone,
    validatePassword
  };
};

export default useFormValidation;
