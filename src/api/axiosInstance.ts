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

    // Debug request
    try {
      if (DEBUG_MODE) {
        (config as any)._startTime = Date.now();
        const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
        // Tránh log token/headers
        // eslint-disable-next-line no-console
        console.log('[API Request]', {
          method: (config.method || 'GET').toUpperCase(),
          url: fullUrl,
          params: config.params,
          hasBody: !!config.data,
        });
      }
    } catch {}

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 🧱 Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    try {
      if (DEBUG_MODE) {
        const cfg = response.config as any;
        const startedAt = cfg?._startTime as number | undefined;
        const durationMs = startedAt ? Date.now() - startedAt : undefined;
        const fullUrl = `${response.config.baseURL || ''}${response.config.url || ''}`;
        // eslint-disable-next-line no-console
        console.log('[API Response]', {
          status: response.status,
          method: (response.config.method || 'GET').toUpperCase(),
          url: fullUrl,
          durationMs,
          // chỉ log kích thước sơ bộ để tránh rác console
          dataType: typeof response.data,
          hasItems: Array.isArray((response.data as any)?.items),
          itemsLength: Array.isArray((response.data as any)?.items) ? (response.data as any)?.items?.length : undefined,
        });
      }
    } catch {}
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
      try {
        if (DEBUG_MODE) {
          const cfg = (error.config || {}) as any;
          const fullUrl = `${cfg.baseURL || ''}${cfg.url || ''}`;
          const startedAt = cfg?._startTime as number | undefined;
          const durationMs = startedAt ? Date.now() - startedAt : undefined;
          // eslint-disable-next-line no-console
          console.warn('[API Error Response]', {
            status,
            method: (cfg.method || 'GET').toUpperCase?.() || cfg.method,
            url: fullUrl,
            durationMs,
            message: (data as any)?.message || error.message,
            errorData: data,
          });
        }
      } catch {}
    } else if (error.request) {
      // Network Error
      try {
        if (DEBUG_MODE) {
          // eslint-disable-next-line no-console
          console.error('[API Network Error]', {
            message: error.message,
          });
        }
      } catch {}
    } else {
      // Error
      try {
        if (DEBUG_MODE) {
          // eslint-disable-next-line no-console
          console.error('[API Unknown Error]', {
            message: error.message,
          });
        }
      } catch {}
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
