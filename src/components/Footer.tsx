import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

interface FooterLink {
  text: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const footerSections: FooterSection[] = [
    {
      title: "Chăm sóc khách hàng",
      links: [
        { text: "Hướng dẫn thanh toán", href: "/huong-dan-thanh-toan" },
        { text: "Điều kiện giao dịch chung", href: "/dieu-kien-giao-dich" },
        { text: "Quy trình sử dụng dịch vụ", href: "/quy-trinh-su-dung" },
        { text: "Chính sách bảo hành", href: "/chinh-sach-bao-hanh" },
        { text: "Chính sách hoàn trả hàng", href: "/chinh-sach-bao-hanh" },
        { text: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" }
      ]
    },
    {
      title: "Tính năng",
      links: [
        { text: "Linux", href: "/" },
        { text: "Pentesting", href: "/" }
      ]
    },
    {
      title: "Về chúng tôi",
      links: [
        { text: "Giới thiệu", href: "/gioi-thieu" },
        { text: "Liên hệ", href: "/lien-he" }
      ]
    }
  ];

  const socialLinks = [
    { icon: "📘", href: "#", className: "facebook" },
    { icon: "📺", href: "#", className: "youtube" },
    { icon: "🐦", href: "#", className: "twitter" },
    { icon: "📷", href: "#", className: "instagram" }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo">CyberLearn VN</div>
            <p className="footer-description">
              CyberLearn là nền tảng tương tác trực tuyến hỗ trợ người dùng học tập, 
              thực hành, thi đấu và đánh giá kỹ năng lập trình một cách nhanh chóng và chính xác.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className={`social-link ${social.className}`}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {footerSections.map((section, index) => (
          <div key={index} className="footer-section">
            <h3>{section.title}</h3>
            <ul className="footer-links">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link to={link.href}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-section">
          <h3>Thông tin liên hệ</h3>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>
                Tòa FPT, số 10 Phạm Văn Bach, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội, Việt Nam
              </span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>
                1900.633.331 hoặc 077.567.6116 (8h30-21h thứ 2 - thứ 6, 8h30-11h30 thứ 7)
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
