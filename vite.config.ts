import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
            './src/pages/MessagesManagement.tsx',
            './src/pages/PricingManagement.tsx'
          ],
          
          'teacher-pages': [
            './src/pages/TeacherDashboard.tsx',
            './src/pages/TeacherClasses.tsx',
            './src/pages/TeacherStudents.tsx',
            './src/pages/TeacherAssignments.tsx',
            './src/pages/TeacherGrading.tsx',
            './src/pages/TeacherReports.tsx',
            './src/pages/TeacherSettings.tsx'
          ],
          
          'linux-pages': [
            './src/pages/LinuxModule1.tsx',
            './src/pages/LinuxPage.tsx'
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
    },
    // Tối ưu terser
    terserOptions: {
      compress: {
        drop_console: true, // Xóa console.log trong production
        drop_debugger: true
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
  }
})
