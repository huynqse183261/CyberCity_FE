import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ReactQueryProvider from './providers/ReactQueryProvider';

// Import protected route components
import { AdminRoute, StudentRoute, PublicRoute } from './components/ProtectedRoute';

// Lazy load pages để tối ưu code splitting
// Critical pages - load ngay
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeLogin from './pages/HomeLogin';
import AccessDenied from './pages/AccessDenied';

// Student pages - lazy load
const LinuxPage = lazy(() => import('./pages/LinuxPage'));
const PenTestPage = lazy(() => import('./pages/PenTestPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const ModuleDetailPage = lazy(() => import('./pages/ModuleDetailPage'));
const StudentPricingPage = lazy(() => import('./pages/StudentPricingPage'));
const StudentCheckoutPage = lazy(() => import('./pages/StudentCheckoutPage'));
const StudentPaymentHistoryPage = lazy(() => import('./pages/StudentPaymentHistoryPage'));
const StudentConfirmOrderPage = lazy(() => import('./pages/StudentConfirmOrderPage'));
const MySubscriptionPage = lazy(() => import('./pages/MySubscriptionPage'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));

// Admin pages - lazy load
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCourseManagement = lazy(() => import('./pages/AdminCourseManagement'));
const AdminModuleManagement = lazy(() => import('./pages/AdminModuleManagement'));
const AdminLessonManagement = lazy(() => import('./pages/AdminLessonManagement'));
const AdminTopicManagement = lazy(() => import('./pages/AdminTopicManagement'));
const AdminSubtopicManagement = lazy(() => import('./pages/AdminSubtopicManagement'));
const AdminPricingManagement = lazy(() => import('./pages/AdminPricingManagement'));
const AdminTeamManagement = lazy(() => import('./pages/AdminTeamManagement'));
const AdminOrderManagement = lazy(() => import('./pages/AdminOrderManagement'));
const AdminMessages = lazy(() => import('./pages/AdminMessages'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));

// Public pages - lazy load
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServiceProcessPage = lazy(() => import('./pages/ServiceProcessPage'));
const PaymentGuidePage = lazy(() => import('./pages/PaymentGuidePage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const WarrantyPage = lazy(() => import('./pages/WarrantyPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const DownloadVMPage = lazy(() => import('./pages/DownloadVMPage'));

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
    color: '#fff'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        border: '4px solid rgba(0, 212, 255, 0.3)',
        borderTop: '4px solid #00d4ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }}></div>
      <p>Đang tải...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <ReactQueryProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Removed inbox route for students */}
                
                {/* Student Protected Routes */}
                <Route 
                  path="/student" 
                  element={
                  <StudentRoute>
                    <HomeLogin />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/linux-lab" 
                element={
                  <StudentRoute>
                    <LinuxPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/student/pricing" 
                element={
                  <StudentRoute>
                    <StudentPricingPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/student/confirm" 
                element={
                  <StudentRoute>
                    <StudentConfirmOrderPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/student/checkout" 
                element={
                  <StudentRoute>
                    <StudentCheckoutPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/student/payment-history" 
                element={
                  <StudentRoute>
                    <StudentPaymentHistoryPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/student/subscription" 
                element={
                  <StudentRoute>
                    <MySubscriptionPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/linux/course/:courseUid" 
                element={
                  <StudentRoute>
                    <CourseDetailPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/linux/course/:courseUid/module/:moduleIndex" 
                element={
                  <StudentRoute>
                    <ModuleDetailPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/linux/module/:moduleIndex" 
                element={
                  <StudentRoute>
                    <ModuleDetailPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/linux" 
                element={
                  <StudentRoute>
                    <LinuxPage />
                  </StudentRoute>
                } 
              />

              {/* Admin Protected Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/courses" 
                element={
                  <AdminRoute>
                    <AdminCourseManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/modules" 
                element={
                  <AdminRoute>
                    <AdminModuleManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/lessons" 
                element={
                  <AdminRoute>
                    <AdminLessonManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/topics" 
                element={
                  <AdminRoute>
                    <AdminTopicManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/subtopics" 
                element={
                  <AdminRoute>
                    <AdminSubtopicManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <AdminRoute>
                    <AdminOrderManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/team" 
                element={
                  <AdminRoute>
                    <AdminTeamManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/pricing" 
                element={
                  <AdminRoute>
                    <AdminPricingManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/messages" 
                element={
                  <AdminRoute>
                    <AdminMessages />
                  </AdminRoute>
                } 
              />
              


              {/* Admin Settings */}
              <Route 
                path="/admin/settings" 
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                } 
              />
              {/* Student Profile */}
              <Route 
                path="/student/profile" 
                element={
                  <StudentRoute>
                    <StudentProfile />
                  </StudentRoute>
                } 
              />

              {/* PenTest Learning Routes */}
              <Route 
                path="/pentest/course/:courseUid" 
                element={
                  <StudentRoute>
                    <CourseDetailPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/pentest/course/:courseUid/module/:moduleIndex" 
                element={
                  <StudentRoute>
                    <ModuleDetailPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/pentest/module/:moduleIndex" 
                element={
                  <StudentRoute>
                    <ModuleDetailPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/pentest-lab" 
                element={
                  <StudentRoute>
                    <PenTestPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/pentest" 
                element={
                  <StudentRoute>
                    <PenTestPage />
                  </StudentRoute>
                } 
              />

              {/* AI Assistant Route - Public */}
              <Route 
                path="/ai-assistant" 
                element={
                  <PublicRoute>
                    <AIAssistantPage />
                  </PublicRoute>
                } 
              />


              {/* Other Pages */}
              <Route path="/lien-he" element={<ContactPage />} />
              <Route path="/gioi-thieu" element={<AboutPage />} />
              {/* Removed public pricing sample page */}
              <Route 
                path="/checkout" 
                element={
                  <CheckoutPage />
                } 
              />
              <Route path="/download-vm" element={<DownloadVMPage />} />
              <Route path="/dieu-kien-giao-dich" element={<TermsPage />} />
              <Route path="/quy-trinh-su-dung" element={<ServiceProcessPage />} />
              <Route path="/chinh-sach-bao-hanh" element={<WarrantyPage />} />
              <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
              <Route path="/huong-dan-thanh-toan" element={<PaymentGuidePage />} />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ReactQueryProvider>
    </div>
  )
}

export default App;
