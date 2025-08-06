import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import TeamManagement from './pages/TeamManagement'
import MessagesManagement from './pages/MessagesManagement'
import PricingManagement from './pages/PricingManagement'
import InvoiceManagement from './pages/InvoiceManagement'
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import ServiceProcessPage from './pages/ServiceProcessPage';
import WarrantyPage from './pages/WarrantyPage';
import PrivacyPage from './pages/PrivacyPage';
import PaymentGuidePage from './pages/PaymentGuidePage';
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/team" element={<TeamManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />
          <Route path="/admin/pricing" element={<PricingManagement />} />
          <Route path="/admin/invoices" element={<InvoiceManagement />} />
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
