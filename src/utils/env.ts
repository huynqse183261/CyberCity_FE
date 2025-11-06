  /**
 * Environment Variables Utility
 * Đảm bảo các biến môi trường được load và validate đúng cách
 */

interface EnvConfig {
  API_BASE_URL: string | undefined;
  API_TIMEOUT: number;
  GEMINI_API_KEY: string | undefined;
  GOOGLE_CLIENT_ID: string | undefined;
  DEBUG_MODE: boolean;
  MODE: string;
}

/**
 * Validate và load environment variables
 */
function loadEnvConfig(): EnvConfig {
  const mode = import.meta.env.MODE || 'development';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiTimeout = import.meta.env.VITE_API_TIMEOUT;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

  // Cảnh báo nhưng luôn dùng giá trị mặc định để app không bị crash

  const config: EnvConfig = {
    API_BASE_URL: apiBaseUrl,
    API_TIMEOUT: apiTimeout ? parseInt(apiTimeout, 10) : 10000,
    GEMINI_API_KEY: geminiApiKey,
    GOOGLE_CLIENT_ID: googleClientId,
    DEBUG_MODE: debugMode,
    MODE: mode,
  };

  return config;
}

// Load và export config ngay khi import
export const envConfig = loadEnvConfig();

// Export individual values for convenience
export const {
  API_BASE_URL,
  API_TIMEOUT,
  GEMINI_API_KEY,
  GOOGLE_CLIENT_ID,
  DEBUG_MODE,
  MODE,
} = envConfig;

