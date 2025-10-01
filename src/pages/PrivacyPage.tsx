import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/PolicyPage.css';

const PrivacyPage: React.FC = () => {
  return (
    <div className="policy-page">
      <Navigation />
      
      <div className="breadcrumb">
      </div>
      
      <div className="policy-content">
        <div className="policy-card">
          <h1>Chính sách bảo mật cá nhân của Cybercity</h1>
          
          <div className="policy-section">
            <p>
              Chính sách bảo mật này mô tả cách CyberCity thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn 
              khi sử dụng các dịch vụ của chúng tôi. Việc sử dụng dịch vụ của CyberCity đồng nghĩa với việc 
              bạn đồng ý với các điều khoản trong chính sách này.
            </p>
          </div>
          
          <div className="policy-section">
            <h2>1. Giải thích từ ngữ</h2>
            <ul>
              <li><strong>CyberCity:</strong> Dự án thuộc môn học EXE101, cung cấp nền tảng học tập trực tuyến</li>
              <li><strong>Dữ liệu cá nhân:</strong> Thông tin liên quan đến danh tính của cá nhân</li>
              <li><strong>Xử lý dữ liệu:</strong> Hoạt động thu thập, ghi, lưu trữ, điều chỉnh, tiết lộ, sử dụng dữ liệu</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>2. Các loại dữ liệu cá nhân được xử lý</h2>
            
            <h3>2.1 Thông tin bắt buộc</h3>
            <ul>
              <li>Họ và tên</li>
              <li>Số điện thoại</li>
              <li>Địa chỉ email</li>
              <li>Địa chỉ</li>
              <li>Nơi làm việc</li>
            </ul>
            
            <h3>2.2 Dữ liệu hệ thống</h3>
            <ul>
              <li>Địa chỉ IP</li>
              <li>Log truy cập</li>
              <li>Thời gian hoạt động</li>
              <li>Thiết bị sử dụng</li>
              <li>Trình duyệt web</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>3. Mục đích xử lý dữ liệu cá nhân</h2>
            <ul>
              <li>Quản lý tài khoản người dùng</li>
              <li>Cung cấp quyền truy cập khóa học</li>
              <li>Gửi thông tin khuyến mãi và cập nhật</li>
              <li>Hỗ trợ khách hàng</li>
              <li>Tuân thủ pháp luật</li>
              <li>Phát hiện và ngăn chặn gian lận</li>
              <li>Cải thiện chất lượng dịch vụ</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>4. Cách thức xử lý dữ liệu</h2>
            
            <h3>4.1 Thu thập trực tiếp</h3>
            <ul>
              <li>Khi đăng ký tài khoản</li>
              <li>Khi sử dụng dịch vụ</li>
              <li>Khi liên hệ hỗ trợ</li>
              <li>Khi tham gia khảo sát</li>
            </ul>
            
            <h3>4.2 Thu thập gián tiếp</h3>
            <ul>
              <li>Từ đối tác thứ ba</li>
              <li>Từ công cụ phân tích</li>
              <li>Từ cookie và công nghệ tương tự</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>5. Biện pháp bảo mật</h2>
            <ul>
              <li>Mật khẩu do người dùng tự thiết lập</li>
              <li>Tự động đăng xuất khi thay đổi mật khẩu</li>
              <li>Khuyến nghị sử dụng OTP</li>
              <li>Mã hóa dữ liệu truyền tải</li>
              <li>Giới hạn quyền truy cập</li>
              <li>Giám sát hoạt động bất thường</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>6. Thời gian lưu trữ</h2>
            <p>
              Dữ liệu cá nhân sẽ được lưu trữ trong thời gian cần thiết để cung cấp dịch vụ hoặc 
              cho đến khi người dùng yêu cầu xóa. CyberCity cam kết xóa dữ liệu khi không còn cần thiết.
            </p>
          </div>
          
          <div className="policy-section">
            <h2>7. Rủi ro và thiệt hại có thể xảy ra</h2>
            
            <h3>7.1 Từ phía người dùng</h3>
            <ul>
              <li>Tiết lộ mật khẩu</li>
              <li>Truy cập link giả mạo</li>
              <li>Sử dụng thiết bị không an toàn</li>
              <li>Chia sẻ thông tin đăng nhập</li>
            </ul>
            
            <h3>7.2 Từ phía hệ thống</h3>
            <ul>
              <li>Tấn công từ tin tặc</li>
              <li>Lỗi kỹ thuật</li>
              <li>Sự kiện bất khả kháng</li>
              <li>Lỗi phần mềm</li>
            </ul>
            
            <p><strong>Lưu ý:</strong> CyberCity sẽ thông báo ngay khi phát hiện rủi ro bảo mật.</p>
          </div>
          
          <div className="policy-section">
            <h2>8. Thông tin đơn vị quản lý</h2>
            <ul>
              <li><strong>Tên đơn vị:</strong> Cyber City - Dự án thuộc môn học EXE101</li>
              <li><strong>Địa chỉ:</strong> Quận Bình Thạnh, TP. Hồ Chí Minh, Việt Nam</li>
              <li><strong>Email:</strong> supportCybercity@gmail.com</li>
              <li><strong>Hotline:</strong> 0123456789</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>9. Quyền chỉnh sửa thông tin</h2>
            <p>
              Người dùng có quyền cập nhật, chỉnh sửa thông tin cá nhân thông qua tài khoản 
              hoặc liên hệ trực tiếp với CyberCity.
            </p>
          </div>
          
          <div className="policy-section">
            <h2>10. Cam kết bảo mật</h2>
            <ul>
              <li>Không bán dữ liệu người dùng cho mục đích thương mại</li>
              <li>Chỉ chia sẻ thông tin khi có sự đồng ý của người dùng</li>
              <li>Tuân thủ nghiêm ngặt các quy định bảo mật</li>
              <li>Thường xuyên cập nhật biện pháp bảo mật</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>11. Quyền và nghĩa vụ của người dùng</h2>
            
            <h3>11.1 Quyền của người dùng</h3>
            <ul>
              <li>Quyền tiếp cận dữ liệu</li>
              <li>Quyền chỉnh sửa thông tin</li>
              <li>Quyền rút lại sự đồng ý</li>
              <li>Quyền xóa dữ liệu</li>
              <li>Quyền hạn chế xử lý</li>
              <li>Quyền phản đối</li>
              <li>Quyền sao chép dữ liệu</li>
              <li>Quyền khiếu nại</li>
              <li>Quyền yêu cầu bồi thường</li>
            </ul>
            
            <h3>11.2 Nghĩa vụ của người dùng</h3>
            <ul>
              <li>Cung cấp thông tin chính xác</li>
              <li>Bảo vệ thông tin cá nhân</li>
              <li>Cập nhật kiến thức về chính sách</li>
              <li>Báo cáo vi phạm bảo mật</li>
            </ul>
          </div>
          
          <div className="policy-section">
            <h2>12. Điều khoản chung</h2>
            <ul>
              <li>Xác minh danh tính khi yêu cầu thay đổi thông tin</li>
              <li>Dịch vụ có thể bị gián đoạn khi xóa dữ liệu</li>
              <li>Chính sách này tuân theo luật pháp Việt Nam</li>
              <li>Mọi tranh chấp sẽ được giải quyết thông qua thương lượng</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage; 