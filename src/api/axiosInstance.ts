import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
// 🧩 Helper: Load environment variables từ utility (đảm bảo validation và ổn định)
import { API_BASE_URL, API_TIMEOUT, DEBUG_MODE } from '../utils/env';

// 🧩 Tạo Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

if (DEBUG_MODE) {
  console.log('🚀 Axios Config:', {
    baseURL: axiosInstance.defaults.baseURL,
    timeout: axiosInstance.defaults.timeout,
  });
}

// 🧱 Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (DEBUG_MODE) {
      console.log('📡 API Request:', {
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

// 🧱 Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (DEBUG_MODE) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          break;

        case 403:
          console.error('❌ Access denied');
          break;

        case 404:
          console.error('❌ Resource not found');
          break;

        case 422:
          console.error('❌ Validation error:', data);
          break;

        case 500:
          console.error('❌ Server error');
          break;

        default:
          console.error(`❌ HTTP Error ${status}:`, data);
      }
    } else if (error.request) {
      console.error('❌ Network Error:', error.message);
    } else {
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
