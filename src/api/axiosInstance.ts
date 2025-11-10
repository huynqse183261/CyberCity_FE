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

// 🧱 Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    // Không gắn Authorization cho các endpoint xác thực công khai
    const url = (config.url || '').toString();
    const isAuthPublicEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/google-login') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password') ||
      url.includes('/auth/verify-email') ||
      url.includes('/auth/refresh-token');

    if (token && config.headers && !isAuthPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 🧱 Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
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
          // Access denied
          break;

        case 404:
          // Resource not found
          break;

        case 422:
          // Validation error
          break;

        case 500:
          // Server error
          break;

        default:
          // HTTP Error
      }
    } else if (error.request) {
      // Network Error
    } else {
      // Error
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
