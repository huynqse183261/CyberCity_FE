import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/PolicyPage.css';

const TermsPage: React.FC = () => {
  return (
    <div className="policy-page">
      <Navigation />
      
      <div className="breadcrumb">
        <span>Trang chủ</span> &gt; <span>Chi tiết</span>
      </div>
      
      <div className="policy-content">
        <div className="policy-card">
          <h1>Điều kiện giao dịch chung</h1>
          
          <div className="policy-section">
            <h2>1. Trách nhiệm của CyberCity</h2>
            <ul>
              <li>Đảm bảo thông tin chính xác về dịch vụ, khóa học và giá cả</li>
              <li>Tuân thủ các quy định pháp luật về thanh toán trực tuyến</li>
              <li>Thực hiện đầy đủ nghĩa vụ thuế theo quy định</li>
              <li>Cung cấp hỗ trợ kỹ thuật và chăm sóc khách hàng</li>
              <li>Bảo vệ thông tin cá nhân của người dùng</li>
              <li>Đảm bảo tính ổn định và bảo mật của hệ thống</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>2. Trách nhiệm của người mua</h2>
            <ul>
              <li>Tuân thủ các quy định sử dụng dịch vụ của CyberCity</li>
              <li>Thanh toán đầy đủ và đúng hạn theo thỏa thuận</li>
              <li>Cung cấp thông tin chính xác khi đăng ký tài khoản</li>
              <li>Không chia sẻ tài khoản cho người khác sử dụng</li>
              <li>Báo cáo kịp thời các vấn đề kỹ thuật gặp phải</li>
              <li>Tuân thủ các quy định về bản quyền và sở hữu trí tuệ</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>3. Điều khoản chung</h2>
            <ul>
              <li>Mọi giao dịch đều được thực hiện thông qua website chính thức</li>
              <li>CyberCity có quyền từ chối giao dịch nếu phát hiện gian lận</li>
              <li>Người dùng có trách nhiệm bảo mật thông tin đăng nhập</li>
              <li>CyberCity không chịu trách nhiệm về việc mất mát do lỗi người dùng</li>
              <li>Các điều khoản có thể được cập nhật và thông báo trước</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsPage; 