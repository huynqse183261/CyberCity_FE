import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import '../styles/ContactPage.css';

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <Navigation />
      <div className="contact-content">
        <div className="contact-info">
          <h2>Liên Hệ Với Chúng Tôi</h2>
          <p>Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc cần hỗ trợ kỹ thuật, đừng ngần ngại liên hệ với chúng tôi. Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng phản hồi nhanh chóng và chuyên nghiệp mọi vấn đề liên quan đến dịch vụ hoặc giải pháp mà chúng tôi cung cấp.</p>
          <ul>
            <li><span role="img" aria-label="location">📍</span> <b>Địa Chỉ:</b> Quận Bình Thạnh, Hồ Chí Minh, Việt Nam</li>
            <li><span role="img" aria-label="phone">📞</span> <b>Số Điện Thoại:</b> 0987654321</li>
            <li><span role="img" aria-label="email">✉️</span> <b>Email:</b> support@cyberCity.io</li>
          </ul>
        </div>
        <div className="contact-form-container">
          <form className="contact-form">
            <h3>Gửi Thông Tin</h3>
            <input type="text" placeholder="Họ và tên" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Nội dung liên hệ" required></textarea>
            <button type="submit">Gửi</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;