import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'

// Load env file dựa trên mode (development/production)
// Vite tự động load .env files, nhưng có thể sử dụng dotenv để load rõ ràng hơn
dotenv.config()

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables từ file .env và system environment
  // Vite tự động merge: system env > .env.production > .env.development > .env
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    // Đảm bảo env variables được expose đúng cách
    define: {
      // Có thể define thêm các giá trị mặc định nếu cần
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },
    server: {
      proxy: {
        // Proxy API trong môi trường dev tới backend
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:7168',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1600, // Giữ warning limit hợp lý
      rollupOptions: {
        output: {
          manualChunks: {
          // Vendor chunks - tách các thư viện lớn
          'react-vendor': ['react', 'react-dom'],
          'antd-vendor': ['antd'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'icons-vendor': ['@ant-design/icons'],
          
          // Utils chunks
          'utils': ['axios', 'dayjs'],
          
          // Feature chunks - tách theo tính năng
          'admin-pages': [
            './src/pages/AdminDashboard.tsx',
            './src/pages/AdminModuleManagement.tsx',
            './src/pages/AdminCourseManagement.tsx',
            './src/pages/AdminLessonManagement.tsx',
            './src/pages/ProductManagement.tsx',
            './src/pages/OrderManagement.tsx',
            './src/pages/InvoiceManagement.tsx',
            './src/pages/TeamManagement.tsx',
            './src/pages/AdminMessages.tsx',
            './src/pages/PricingManagement.tsx'
          ],
          
          'student-pages': [
            './src/pages/LinuxPage.tsx',
            './src/pages/PenTestPage.tsx',
            './src/pages/CourseDetailPage.tsx',
            './src/pages/ModuleDetailPage.tsx',
            './src/pages/StudentPricingPage.tsx',
            './src/pages/StudentCheckoutPage.tsx',
            './src/pages/StudentPaymentHistoryPage.tsx',
            './src/pages/MySubscriptionPage.tsx',
            './src/pages/AIAssistantPage.tsx'
          ],
          
          'auth-pages': [
            './src/pages/Login.tsx',
            './src/pages/Register.tsx',
            './src/pages/HomeLogin.tsx'
          ],
          
          'public-pages': [
            './src/pages/HomePage.tsx',
            './src/pages/AboutPage.tsx',
            './src/pages/ContactPage.tsx',
            './src/pages/ServiceProcessPage.tsx',
            './src/pages/PaymentGuidePage.tsx',
            './src/pages/PrivacyPage.tsx',
            './src/pages/TermsPage.tsx',
            './src/pages/WarrantyPage.tsx'
          ]
        },
        // Tối ưu chunk files
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.split('.')[0] 
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || ['asset'];
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|ico)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    }
  },
  // Tối ưu deps
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'antd', 
      'react-router-dom',
      '@tanstack/react-query',
      '@ant-design/icons',
      'axios'
    ]
  },
  }
})
