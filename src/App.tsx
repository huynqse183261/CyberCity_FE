import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ReactQueryProvider from './providers/ReactQueryProvider';

// Import components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import HomeLogin from './pages/HomeLogin';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import ServiceProcessPage from './pages/ServiceProcessPage';
import WarrantyPage from './pages/WarrantyPage';
import PrivacyPage from './pages/PrivacyPage';
import PaymentGuidePage from './pages/PaymentGuidePage';

// Import protected route components
import { AdminRoute, TeacherRoute, StudentRoute } from './components/ProtectedRoute';

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
                    <HomeLogin />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/linux" 
                element={
                  <StudentRoute>
                    <HomeLogin />
                  </StudentRoute>
                } 
              />
              <Route 
                path="/linux/module-1" 
                element={
                  <StudentRoute>
                    <HomeLogin />
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
                path="/admin/products" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
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
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/messages" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/pricing" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
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
                path="/teacher/settings" 
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
                    <TeacherDashboard />
                  </TeacherRoute>
                } 
              />

              {/* Other Pages */}
              <Route path="/lien-he" element={<ContactPage />} />
              <Route path="/gioi-thieu" element={<AboutPage />} />
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
