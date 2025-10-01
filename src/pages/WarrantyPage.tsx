import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/PolicyPage.css';

const WarrantyPage: React.FC = () => {
  return (
    <div className="policy-page">
      <Navigation />
      <div className="policy-content">
        <div className="policy-card">
          <h1>Chính sách bảo hành và hoàn trả hàng</h1>
          
          <div className="policy-section">
            <h2>1. Chính sách bảo hành</h2>
            <p>CyberCity cam kết cung cấp dịch vụ chất lượng cao và hỗ trợ kỹ thuật toàn diện cho người dùng:</p>
            
            <ul>
              <li><strong>Bảo hành dịch vụ trực tuyến:</strong> Tất cả khóa học và dịch vụ đều được bảo hành trong suốt thời gian sử dụng</li>
              <li><strong>Hỗ trợ kỹ thuật:</strong> Đội ngũ hỗ trợ 24/7 sẵn sàng giải quyết các vấn đề kỹ thuật</li>
              <li><strong>Cập nhật nội dung:</strong> Nội dung khóa học được cập nhật thường xuyên theo xu hướng công nghệ mới</li>
              <li><strong>Bảo mật hệ thống:</strong> Đảm bảo tính bảo mật và ổn định của nền tảng học tập</li>
              <li><strong>Xử lý khiếu nại:</strong> Tiếp nhận và xử lý khiếu nại trong vòng 24 giờ</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>2. Chính sách hoàn trả hàng</h2>
            <p>CyberCity áp dụng chính sách hoàn trả linh hoạt để đảm bảo quyền lợi của người dùng:</p>
            
            <ul>
              <li><strong>Hoàn trả trong 7 ngày:</strong> Người dùng có thể yêu cầu hoàn trả trong vòng 7 ngày kể từ ngày thanh toán</li>
              <li><strong>Điều kiện hoàn trả:</strong>
                <ul>
                  <li>Chưa truy cập quá 20% nội dung khóa học</li>
                  <li>Không vi phạm điều khoản sử dụng</li>
                  <li>Yêu cầu hoàn trả có lý do chính đáng</li>
                </ul>
              </li>
              <li><strong>Thời gian xử lý:</strong> Hoàn trả sẽ được thực hiện trong vòng 3-5 ngày làm việc</li>
              <li><strong>Phương thức hoàn trả:</strong> Hoàn trả qua cùng phương thức thanh toán ban đầu</li>
              <li><strong>Trường hợp không hoàn trả:</strong>
                <ul>
                  <li>Đã hoàn thành hơn 50% khóa học</li>
                  <li>Vi phạm quy định sử dụng dịch vụ</li>
                  <li>Yêu cầu hoàn trả sau 7 ngày</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>3. Quy trình khiếu nại và hoàn trả</h2>
            
            <div className="step-list">
              <div className="step">
                <h4>Bước 1: Liên hệ hỗ trợ</h4>
                <p>Gửi email đến support@cybercity.io hoặc gọi hotline 0123456789</p>
              </div>
              
              <div className="step">
                <h4>Bước 2: Cung cấp thông tin</h4>
                <ul>
                  <li>Thông tin tài khoản</li>
                  <li>Mã giao dịch thanh toán</li>
                  <li>Lý do yêu cầu hoàn trả</li>
                  <li>Bằng chứng (nếu có)</li>
                </ul>
              </div>
              
              <div className="step">
                <h4>Bước 3: Xử lý yêu cầu</h4>
                <p>Đội ngũ hỗ trợ sẽ xem xét và phản hồi trong vòng 24 giờ</p>
              </div>
              
              <div className="step">
                <h4>Bước 4: Thực hiện hoàn trả</h4>
                <p>Nếu được chấp thuận, hoàn trả sẽ được thực hiện trong 3-5 ngày</p>
              </div>
            </div>
          </div>
          
          <div className="policy-section">
            <h2>4. Liên hệ hỗ trợ</h2>
            <p>Để được hỗ trợ về chính sách bảo hành và hoàn trả, vui lòng liên hệ:</p>
            <ul>
              <li><strong>Email:</strong> support@cybercity.io</li>
              <li><strong>Hotline:</strong> 0123456789</li>
              <li><strong>Website:</strong> https://cybercity.io</li>
              <li><strong>Thời gian làm việc:</strong> 8h30-21h thứ 2 - thứ 6, 8h30-11h30 thứ 7</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WarrantyPage; 