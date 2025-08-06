import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/PolicyPage.css';

const PaymentGuidePage: React.FC = () => {
  return (
    <div className="policy-page">
      <Navigation />
      
      <div className="breadcrumb">
        <span>Trang chủ</span> &gt; <span>Hướng dẫn</span>
      </div>
      
      <div className="policy-content">
        <div className="policy-card">
          <h1>Hướng dẫn đăng ký khóa học có tính phí trên cybercity.io</h1>
          
          <div className="policy-section">
            <p>
              CyberCity cung cấp các khóa học chất lượng cao về an toàn thông tin và lập trình. 
              Dưới đây là hướng dẫn chi tiết để đăng ký và thanh toán khóa học.
            </p>
          </div>
          
          <div className="policy-section">
            <h2>1. Khóa học nổi bật</h2>
            <div className="course-card">
              <div className="course-info">
                <h3>Hacker Đạo Đức</h3>
                <p>Khóa học toàn diện về bảo mật thông tin, từ cơ bản đến nâng cao. Học viên sẽ được trang bị kiến thức và kỹ năng thực hành trong lĩnh vực an toàn thông tin.</p>
                <div className="course-features">
                  <div className="feature">
                    <span>🛡️</span>
                    <span>Bảo mật nâng cao</span>
                  </div>
                  <div className="feature">
                    <span>⏰</span>
                    <span>40 giờ học</span>
                  </div>
                  <div className="feature">
                    <span>📜</span>
                    <span>Chứng chỉ</span>
                  </div>
                  <div className="feature">
                    <span>👥</span>
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
                <button className="register-btn">Đăng ký ngay</button>
              </div>
              <div className="course-image">
                <img src="https://via.placeholder.com/300x200/1a1a2e/00d4ff?text=Hacker+Course" alt="Hacker Đạo Đức" />
              </div>
            </div>
          </div>
          
          <div className="policy-section">
            <h2>2. Nâng tầm kỹ năng với Premium</h2>
            <div className="pricing-grid">
              <div className="pricing-card">
                <h3>Basic</h3>
                <div className="price">299,000₫</div>
                <ul>
                  <li>✓ Truy cập khóa học cơ bản</li>
                  <li>✓ Tài liệu học tập</li>
                  <li>✓ Hỗ trợ qua email</li>
                  <li>✓ Chứng chỉ hoàn thành</li>
                </ul>
                <button className="pricing-btn">Chọn gói</button>
              </div>
              
              <div className="pricing-card">
                <h3>Standard</h3>
                <div className="price">599,000₫</div>
                <ul>
                  <li>✓ Tất cả tính năng Basic</li>
                  <li>✓ Khóa học nâng cao</li>
                  <li>✓ Hỗ trợ qua chat</li>
                  <li>✓ Thực hành lab</li>
                </ul>
                <button className="pricing-btn">Chọn gói</button>
              </div>
              
              <div className="pricing-card featured">
                <div className="featured-badge">⭐ Khuyến nghị</div>
                <h3>Pro</h3>
                <div className="price">1,199,000₫</div>
                <ul>
                  <li>✓ Tất cả tính năng Standard</li>
                  <li>✓ Khóa học chuyên sâu</li>
                  <li>✓ Hỗ trợ 24/7</li>
                  <li>✓ Mentoring 1-1</li>
                  <li>✓ Dự án thực tế</li>
                </ul>
                <button className="pricing-btn featured">Chọn gói</button>
              </div>
              
              <div className="pricing-card">
                <h3>Enterprise</h3>
                <div className="price">2,390,000₫</div>
                <ul>
                  <li>✓ Tất cả tính năng Pro</li>
                  <li>✓ Khóa học tùy chỉnh</li>
                  <li>✓ Hỗ trợ doanh nghiệp</li>
                  <li>✓ API tích hợp</li>
                  <li>✓ Báo cáo chi tiết</li>
                </ul>
                <button className="pricing-btn">Chọn gói</button>
              </div>
            </div>
          </div>
          
          <div className="policy-section">
            <h2>3. Thông tin thanh toán</h2>
            <div className="payment-container">
              <div className="payment-form">
                <h3>Thông tin cá nhân</h3>
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input type="text" placeholder="Nhập họ và tên đầy đủ" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="example@email.com" />
                </div>
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input type="tel" placeholder="0123456789" />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input type="text" placeholder="Nhập địa chỉ của bạn" />
                </div>
                <button className="payment-btn">Thanh toán ngay</button>
              </div>
              
              <div className="order-summary">
                <h3>Đơn hàng của bạn</h3>
                <div className="total-price">2,390,000₫</div>
                <div className="order-items">
                  <div className="order-item">
                    <span>✓</span>
                    <span>Khóa học Hacker Đạo Đức</span>
                  </div>
                  <div className="order-item">
                    <span>✓</span>
                    <span>Tài liệu học tập</span>
                  </div>
                  <div className="order-item">
                    <span>✓</span>
                    <span>Hỗ trợ 24/7</span>
                  </div>
                  <div className="order-item">
                    <span>✓</span>
                    <span>Chứng chỉ hoàn thành</span>
                  </div>
                  <div className="order-item">
                    <span>✓</span>
                    <span>Mentoring 1-1</span>
                  </div>
                </div>
                <p className="payment-note">
                  * Thanh toán an toàn qua cổng thanh toán được bảo mật SSL
                </p>
              </div>
            </div>
          </div>
          
          <div className="policy-section">
            <h2>4. Phương thức thanh toán</h2>
            <div className="payment-methods">
              <div className="payment-method">
                <span>💳</span>
                <span>Thẻ tín dụng/ghi nợ</span>
              </div>
              <div className="payment-method">
                <span>🏦</span>
                <span>Chuyển khoản ngân hàng</span>
              </div>
              <div className="payment-method">
                <span>📱</span>
                <span>Ví điện tử</span>
              </div>
              <div className="payment-method">
                <span>🏪</span>
                <span>Tiền mặt tại văn phòng</span>
              </div>
            </div>
          </div>
          
          <div className="policy-section">
            <h2>5. Lưu ý quan trọng</h2>
            <ul>
              <li>Đảm bảo thông tin thanh toán chính xác</li>
              <li>Kiểm tra email xác nhận sau khi thanh toán</li>
              <li>Liên hệ hỗ trợ nếu gặp vấn đề trong quá trình thanh toán</li>
              <li>Thời gian kích hoạt khóa học: 5-10 phút sau khi thanh toán thành công</li>
              <li>Chính sách hoàn trả áp dụng trong vòng 7 ngày</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentGuidePage; 