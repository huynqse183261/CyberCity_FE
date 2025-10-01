import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/PolicyPage.css';

const ServiceProcessPage: React.FC = () => {
  return (
    <div className="policy-page">
      <Navigation />
      
      <div className="breadcrumb">
        <span>Trang chủ</span> &gt; <span>Chi tiết</span>
      </div>
      
      <div className="policy-content">
        <div className="policy-card">
          <h1>Quy trình sử dụng dịch vụ</h1>
          
          <div className="policy-section">
            <h2>1. Hướng dẫn chung - Đăng ký / Đăng nhập</h2>
            
            <div className="sub-section">
              <h3>1.1 Đăng ký tài khoản website CyberCity</h3>
              <p>Để sử dụng các dịch vụ của CyberCity, bạn cần tạo tài khoản theo các bước sau:</p>
              
              <div className="step-list">
                <div className="step">
                  <h4>Bước 1: Truy cập trang đăng ký</h4>
                  <p>Vào trang chủ CyberCity và click vào nút "Đăng ký ngay"</p>
                </div>
                
                <div className="step">
                  <h4>Bước 2: Điền thông tin cá nhân</h4>
                  <ul>
                    <li>Họ và tên đầy đủ</li>
                    <li>Email hợp lệ</li>
                    <li>Số điện thoại</li>
                    <li>Mật khẩu mạnh (ít nhất 8 ký tự)</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Bước 3: Xác thực tài khoản</h4>
                  <p>Kiểm tra email và click vào link xác thực để kích hoạt tài khoản</p>
                </div>
              </div>
            </div>
            
            <div className="sub-section">
              <h3>1.2 Đăng nhập tài khoản trên website CyberCity</h3>
              <div className="step-list">
                <div className="step">
                  <h4>Bước 1: Truy cập trang đăng nhập</h4>
                  <p>Click vào nút "Đăng nhập" trên trang chủ</p>
                </div>
                
                <div className="step">
                  <h4>Bước 2: Nhập thông tin đăng nhập</h4>
                  <ul>
                    <li>Email đã đăng ký</li>
                    <li>Mật khẩu</li>
                  </ul>
                </div>
                
                <div className="step">
                  <h4>Bước 3: Xác thực bảo mật (nếu có)</h4>
                  <p>Nhập mã OTP nếu hệ thống yêu cầu xác thực 2 lớp</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="policy-section">
            <h2>2. Sử dụng dịch vụ</h2>
            
            <div className="sub-section">
              <h3>2.1 Khóa học miễn phí</h3>
              <ul>
                <li>Truy cập vào mục "Khóa học"</li>
                <li>Chọn khóa học miễn phí</li>
                <li>Click "Bắt đầu học" để truy cập nội dung</li>
                <li>Theo dõi tiến độ học tập trong dashboard</li>
              </ul>
            </div>
            
            <div className="sub-section">
              <h3>2.2 Khóa học có phí</h3>
              <ul>
                <li>Chọn khóa học mong muốn</li>
                <li>Xem thông tin chi tiết và giá cả</li>
                <li>Click "Đăng ký ngay" để thanh toán</li>
                <li>Hoàn tất thanh toán theo hướng dẫn</li>
                <li>Truy cập khóa học sau khi thanh toán thành công</li>
              </ul>
            </div>
          </div>
          
          <div className="policy-section">
            <h2>3. Lưu ý quan trọng</h2>
            <ul>
              <li>Đảm bảo thông tin đăng ký chính xác và cập nhật</li>
              <li>Không chia sẻ tài khoản với người khác</li>
              <li>Liên hệ hỗ trợ nếu gặp vấn đề kỹ thuật</li>
              <li>Tuân thủ các quy định sử dụng dịch vụ</li>
              <li>Backup dữ liệu quan trọng thường xuyên</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceProcessPage; 