import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ReactQueryProvider from './providers/ReactQueryProvider';

// Import components directly (not lazy loaded as requested)
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
// import InboxPage from './pages/InboxPage';
import HomeLogin from './pages/HomeLogin';
import LinuxPage from './pages/LinuxPage';
// import LinuxModule1 from './pages/LinuxModule1';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseManagement from './pages/AdminCourseManagement';
import AdminModuleManagement from './pages/AdminModuleManagement';
import AdminLessonManagement from './pages/AdminLessonManagement';
import AdminTopicManagement from './pages/AdminTopicManagement';
import AdminSubtopicManagement from './pages/AdminSubtopicManagement';
import AdminPricingManagement from './pages/AdminPricingManagement';
import AdminTeamManagement from './pages/AdminTeamManagement';
import AccessDenied from './pages/AccessDenied';

import StudentProfile from './pages/StudentProfile';
import AdminSettings from './pages/AdminSettings';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServiceProcessPage from './pages/ServiceProcessPage';
import PaymentGuidePage from './pages/PaymentGuidePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import WarrantyPage from './pages/WarrantyPage';
// import PricingPage from './pages/PricingPage';
import StudentPricingPage from './pages/StudentPricingPage';
import StudentCheckoutPage from './pages/StudentCheckoutPage';
import StudentPaymentHistoryPage from './pages/StudentPaymentHistoryPage';
import StudentConfirmOrderPage from './pages/StudentConfirmOrderPage';
import MySubscriptionPage from './pages/MySubscriptionPage';
import CheckoutPage from './pages/CheckoutPage';
import DownloadVMPage from './pages/DownloadVMPage';

// Import protected route components
import { AdminRoute, StudentRoute, PublicRoute } from './components/ProtectedRoute';
import AdminOrderManagement from './pages/AdminOrderManagement';
import AdminMessages from './pages/AdminMessages';
import InvoiceManagement from './pages/InvoiceManagement';

// Import PenTest Learning Pages
import PenTestPage from './pages/PenTestPage';
// import PenTestModule1 from './pages/PenTestModule1';

// Import Module Detail Page
import ModuleDetailPage from './pages/ModuleDetailPage';
import CourseDetailPage from './pages/CourseDetailPage';

// Import AI Assistant Page
import AIAssistantPage from './pages/AIAssistantPage';

function App() {
  return (
    <div className="App">
      <ReactQueryProvider>
        <AuthProvider>
          <Router>
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
              <Route 
                path="/admin/invoices" 
                element={
                  <AdminRoute>
                    <InvoiceManagement />
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
          </Router>
        </AuthProvider>
      </ReactQueryProvider>
    </div>
  )
}

export default App;
