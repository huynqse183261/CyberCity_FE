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
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react({
        // Tối ưu React với Fast Refresh
        jsxImportSource: 'react'
      })
    ],
    // Đảm bảo env variables được expose đúng cách
    define: {
      // Có thể define thêm các giá trị mặc định nếu cần
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },
    // Tối ưu CSS
    css: {
      devSourcemap: !isProduction
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
      // Tối ưu build performance
      target: 'es2020',
      minify: isProduction ? 'esbuild' : false, // Sử dụng esbuild cho minification nhanh
      cssMinify: isProduction, // Minify CSS
      cssCodeSplit: true, // Tách CSS thành chunks nhỏ
      sourcemap: !isProduction, // Không tạo sourcemap ở production để giảm kích thước
      reportCompressedSize: false, // Tắt để build nhanh hơn
      chunkSizeWarningLimit: 1000, // Giảm warning limit để phát hiện chunks lớn
      
      // Tối ưu tree shaking và dead code elimination
      rollupOptions: {
        treeshake: {
          moduleSideEffects: 'no-external', // Loại bỏ side effects không cần thiết
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        },
        output: {
          manualChunks(id) {
            // Vendor chunks - tách các thư viện lớn
            if (id.includes('node_modules')) {
              // React core
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              // Ant Design và icons
              if (id.includes('antd') || id.includes('@ant-design')) {
                return 'antd-vendor';
              }
              // Router
              if (id.includes('react-router')) {
                return 'router-vendor';
              }
              // React Query
              if (id.includes('@tanstack/react-query')) {
                return 'query-vendor';
              }
              // Utils (axios, dayjs)
              if (id.includes('axios') || id.includes('dayjs')) {
                return 'utils';
              }
              // Three.js nếu có
              if (id.includes('three')) {
                return 'three-vendor';
              }
              // Google libs nếu có
              if (id.includes('@google') || id.includes('@react-oauth')) {
                return 'google-vendor';
              }
              // Các vendor khác
              return 'vendor';
            }
            
            // Feature-based splitting cho pages
            if (id.includes('/src/pages/Admin')) {
              return 'admin-pages';
            }
            if (id.includes('/src/pages/Student') || 
                id.includes('/src/pages/Linux') ||
                id.includes('/src/pages/PenTest') ||
                id.includes('/src/pages/Course') ||
                id.includes('/src/pages/Module') ||
                id.includes('/src/pages/MySubscription') ||
                id.includes('/src/pages/AIAssistant')) {
              return 'student-pages';
            }
            if (id.includes('/src/pages/Login') || 
                id.includes('/src/pages/Register') ||
                id.includes('/src/pages/HomeLogin') ||
                id.includes('/src/pages/ForgotPassword')) {
              return 'auth-pages';
            }
            if (id.includes('/src/pages/Home') ||
                id.includes('/src/pages/About') ||
                id.includes('/src/pages/Contact') ||
                id.includes('/src/pages/Service') ||
                id.includes('/src/pages/Payment') ||
                id.includes('/src/pages/Privacy') ||
                id.includes('/src/pages/Terms') ||
                id.includes('/src/pages/Warranty') ||
                id.includes('/src/pages/Checkout') ||
                id.includes('/src/pages/Download')) {
              return 'public-pages';
            }
          },
          // Đổi tên chunks để dễ debug
          chunkFileNames: (chunkInfo) => {
            return `js/${chunkInfo.name}-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
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
  // Tối ưu deps - pre-bundle dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'antd', 
      'react-router-dom',
      '@tanstack/react-query',
      '@ant-design/icons',
      'axios',
      'dayjs',
      'lucide-react'
    ],
    // Force exclude các package không cần pre-bundle
    exclude: ['@tanstack/react-query-devtools']
  },
  // Performance hints
  esbuild: {
    // Tối ưu esbuild để build nhanh hơn
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Drop console và debugger trong production
    ...(isProduction && {
      drop: ['console', 'debugger'],
      pure: ['console.log', 'console.info']
    })
  },
  }
})
