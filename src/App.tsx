import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AdminRoute, TeacherRoute, StudentRoute } from './components/ProtectedRoute'

// Main pages
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import HomeLogin from './pages/HomeLogin'
import LinuxPage from './pages/LinuxPage'
import LinuxModule1 from './pages/LinuxModule1'

// Dashboard Pages (using existing pages)
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
// Student uses HomeLogin (LinuxLabPage) as dashboard

// Admin pages
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import TeamManagement from './pages/TeamManagement'
import MessagesManagement from './pages/MessagesManagement'
import PricingManagement from './pages/PricingManagement'
import InvoiceManagement from './pages/InvoiceManagement'

// Teacher pages
import TeacherClasses from './pages/TeacherClasses'
import TeacherAssignments from './pages/TeacherAssignments'
import TeacherGrading from './pages/TeacherGrading'
import TeacherSettings from './pages/TeacherSettings'
import TeacherReports from './pages/TeacherReports'
import TeacherStudents from './pages/TeacherStudents'

// User pages
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import TermsPage from './pages/TermsPage'
import ServiceProcessPage from './pages/ServiceProcessPage'
import WarrantyPage from './pages/WarrantyPage'
import PrivacyPage from './pages/PrivacyPage'
import PaymentGuidePage from './pages/PaymentGuidePage'
import './App.css'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Routes */}
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

            {/* Admin Routes - Protected */}
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
                  <ProductManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <AdminRoute>
                  <OrderManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/team" 
              element={
                <AdminRoute>
                  <TeamManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/messages" 
              element={
                <AdminRoute>
                  <MessagesManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/pricing" 
              element={
                <AdminRoute>
                  <PricingManagement />
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

            {/* Teacher Routes - Protected */}
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
                  <TeacherClasses />
                </TeacherRoute>
              } 
            />
            <Route 
              path="/teacher/assignments" 
              element={
                <TeacherRoute>
                  <TeacherAssignments />
                </TeacherRoute>
              } 
            />
            <Route 
              path="/teacher/grading" 
              element={
                <TeacherRoute>
                  <TeacherGrading />
                </TeacherRoute>
              } 
            />
            <Route 
              path="/teacher/reports" 
              element={
                <TeacherRoute>
                  <TeacherReports />
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
            <Route 
              path="/teacher/students" 
              element={
                <TeacherRoute>
                  <TeacherStudents />
                </TeacherRoute>
              } 
            />

            {/* Public Information Pages */}
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
    </div>
  )
}

export default App
