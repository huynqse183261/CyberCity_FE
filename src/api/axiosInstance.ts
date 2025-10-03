import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - xử lý trước khi gửi request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Thêm auth token nếu có
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request trong development
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL || ''}${config.url || ''}`,
        data: config.data,
        params: config.params,
        headers: config.headers?.Authorization ? { ...config.headers, Authorization: '[HIDDEN]' } : config.headers,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý response và error
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response trong development
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Xử lý các lỗi HTTP status
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - chỉ xóa token, không redirect để tránh reload trang khi đăng nhập lỗi
          // Chỉ redirect nếu không phải từ trang login/register
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          console.error('❌ Access denied');
          break;
          
        case 404:
          // Not found
          console.error('❌ Resource not found');
          break;
          
        case 422:
          // Validation error
          console.error('❌ Validation error:', data);
          break;
          
        case 500:
          // Server error
          console.error('❌ Server error');
          break;
          
        default:
          console.error(`❌ HTTP Error ${status}:`, data);
      }
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error:', error.message);
    } else {
      // Other error
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
