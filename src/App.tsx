import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import HomeLogin from './pages/LinuxLabPage'
import LinuxPage from './pages/LinuxPage'
import LinuxModule1 from './pages/LinuxModule1'

// Admin pages
import AdminDashboard from './pages/AdminDashboard'
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import TeamManagement from './pages/TeamManagement'
import MessagesManagement from './pages/MessagesManagement'
import PricingManagement from './pages/PricingManagement'
import InvoiceManagement from './pages/InvoiceManagement'

// Teacher pages
// Nếu có nhiều trang cho giáo viên, tách riêng từng trang:
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherClasses from './pages/TeacherClasses'
import TeacherAssignments from './pages/TeacherAssignments'
import TeacherGrading from './pages/TeacherGrading'
import TeacherSettings from './pages/TeacherSettings'
import TeacherReports from './pages/TeacherReports'
import TeacherStudents from './pages/TeacherStudents'
//User pages
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
      <Router>
        <Routes>
          {/* Luồng học sinh */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/linux-lab" element={<HomeLogin />} />
          <Route path="/linux" element={<LinuxPage />} />
          <Route path="/linux/module-1" element={<LinuxModule1 />} />

          {/* Luồng admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />

          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/team" element={<TeamManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />
          <Route path="/admin/pricing" element={<PricingManagement />} />
          <Route path="/admin/invoices" element={<InvoiceManagement />} />

          {/* Luồng giáo viên */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/classes" element={<TeacherClasses />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/grading" element={<TeacherGrading />} />
          <Route path="/teacher/reports" element={<TeacherReports />} />
          <Route path="/teacher/settings" element={<TeacherSettings />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />

          {/* Nếu bạn chỉ có 1 trang tổng cho giáo viên thì dùng: */}
          {/* <Route path="/teacher" element={<TeacherAdmin />} /> */}

          {/* Các trang thông tin */}
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/dieu-kien-giao-dich" element={<TermsPage />} />
          <Route path="/quy-trinh-su-dung" element={<ServiceProcessPage />} />
          <Route path="/chinh-sach-bao-hanh" element={<WarrantyPage />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
          <Route path="/huong-dan-thanh-toan" element={<PaymentGuidePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
