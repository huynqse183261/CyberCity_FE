import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ReactQueryProvider from './providers/ReactQueryProvider';

// Import components directly (not lazy loaded as requested)
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import InboxPage from './pages/InboxPage';
import HomeLogin from './pages/HomeLogin';
import LinuxPage from './pages/LinuxPage';
import LinuxModule1 from './pages/LinuxModule1';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseManagement from './pages/AdminCourseManagement';
import AdminModuleManagement from './pages/AdminModuleManagement';
import AdminLessonManagement from './pages/AdminLessonManagement';
import AdminTopicManagement from './pages/AdminTopicManagement';
import AdminSubtopicManagement from './pages/AdminSubtopicManagement';
import AdminPricingManagement from './pages/AdminPricingManagement';
import AdminTeamManagement from './pages/AdminTeamManagement';
import AccessDenied from './pages/AccessDenied';

import TeacherDashboard from './pages/TeacherDashboard';
import TeacherMessages from './pages/TeacherMessages';
import TeacherStudents from './pages/TeacherStudents';
import TeacherStudentDetail from './pages/TeacherStudentDetail';
import TeacherStudentProgress from './pages/TeacherStudentProgress';
import TeacherSettings from './pages/TeacherSettings';
import StudentSettings from './pages/StudentSettings';
import AdminSettings from './pages/AdminSettings';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServiceProcessPage from './pages/ServiceProcessPage';
import PaymentGuidePage from './pages/PaymentGuidePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import WarrantyPage from './pages/WarrantyPage';
import PricingPage from './pages/PricingPage';

// Import protected route components
import { AdminRoute, TeacherRoute, StudentRoute, AllUserRoute } from './components/ProtectedRoute';
import AdminMessages from './pages/AdminMessages';

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

              {/* Shared Protected Routes - Available for all authenticated users */}
              <Route 
                path="/inbox" 
                element={
                  <AllUserRoute>
                    <InboxPage />
                  </AllUserRoute>
                } 
              />
                
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
                path="/linux" 
                element={
                  <StudentRoute>
                    <LinuxPage />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/linux/module-1" 
                element={
                  <StudentRoute>
                    <LinuxModule1 />
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
                    <AdminDashboard />
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
                path="/admin/messages" 
                element={
                  <AdminRoute>
                    <AdminMessages />
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
                path="/admin/invoices" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />

              {/* Teacher Protected Routes */}
              <Route 
                path="/teacher" 
                element={
                  <TeacherRoute>
                    <TeacherDashboard />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/classes" 
                element={
                  <TeacherRoute>
                    <TeacherDashboard />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/assignments" 
                element={
                  <TeacherRoute>
                    <TeacherDashboard />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/grading" 
                element={
                  <TeacherRoute>
                    <TeacherDashboard />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/reports" 
                element={
                  <TeacherRoute>
                    <TeacherDashboard />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/students" 
                element={
                  <TeacherRoute>
                    <TeacherStudents />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/students/:studentUid" 
                element={
                  <TeacherRoute>
                    <TeacherStudentDetail />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/students/:studentUid/progress" 
                element={
                  <TeacherRoute>
                    <TeacherStudentProgress />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/messages" 
                element={
                  <TeacherRoute>
                    <TeacherMessages />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/settings" 
                element={
                  <TeacherRoute>
                    <TeacherSettings />
                  </TeacherRoute>
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

              {/* Student Settings */}
              <Route 
                path="/student/settings" 
                element={
                  <StudentRoute>
                    <StudentSettings />
                  </StudentRoute>
                } 
              />

              {/* Other Pages */}
              <Route path="/lien-he" element={<ContactPage />} />
              <Route path="/gioi-thieu" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
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
