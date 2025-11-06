import type { ApiResponse } from '../models';

// Utility functions for API

// Format error message từ API response
export const formatApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.join(', ');
    }
    if (typeof errors === 'object') {
      return Object.values(errors).flat().join(', ');
    }
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Đã xảy ra lỗi không xác định';
};

// Check if API response is successful
export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } => {
  return response.success === true && response.data !== undefined;
};

// Extract data from API response
export const extractApiData = <T>(response: ApiResponse<T>): T | null => {
  return isApiSuccess(response) ? response.data : null;
};

// Create success API response
export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    success: true,
    data,
    message: message || 'Thành công',
  };
};

// Create error API response  
export const createErrorResponse = <T = null>(message: string, errors?: string[]): ApiResponse<T> => {
  return {
    success: false,
    message,
    errors,
  };
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration in minutes to human readable
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} giờ`;
  }
  
  return `${hours} giờ ${remainingMinutes} phút`;
};

// Get color for status
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Lab session statuses
    'starting': '#1890ff',    // blue
    'running': '#52c41a',     // green  
    'stopping': '#faad14',    // orange
    'stopped': '#d9d9d9',     // gray
    'error': '#ff4d4f',       // red
    
    // Environment statuses
    'available': '#52c41a',   // green
    'building': '#1890ff',    // blue
    'maintenance': '#faad14', // orange
    
    // General statuses
    'active': '#52c41a',      // green
    'inactive': '#d9d9d9',    // gray
    'success': '#52c41a',     // green
    'failed': '#ff4d4f',      // red
    'pending': '#faad14',     // orange
    'completed': '#52c41a',   // green
    'in-progress': '#1890ff', // blue
  };
  
  return statusColors[status] || '#d9d9d9';
};

// Validate environment variable
export const validateEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    return '';
  }
  return value;
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const copy: any = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  return obj;
};

// Check if object is empty
export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Safe JSON parse
export const safeJsonParse = <T>(json: string, defaultValue: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
};

// Get nested object property safely
export const getNestedProperty = (obj: any, path: string, defaultValue: any = null): any => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
};

// Retry function with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, retries - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
};

// URL utilities
export const buildUrlWithParams = (baseUrl: string, params: Record<string, any>): string => {
  const url = new URL(baseUrl, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
};

export const downloadFile = (data: Blob, filename: string, contentType?: string): void => {
  const blob = new Blob([data], { type: contentType || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};