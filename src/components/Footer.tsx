import React from 'react';
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
        { text: "Hướng dẫn thanh toán", href: "#" },
        { text: "Điều kiện giao dịch chung", href: "#" },
        { text: "Quy trình sử dụng dịch vụ", href: "#" },
        { text: "Chính sách bảo hành", href: "#" },
        { text: "Chính sách hoàn trả hàng", href: "#" },
        { text: "Chính sách bảo mật", href: "#" }
      ]
    },
    {
      title: "Tính năng",
      links: [
        { text: "Học tập", href: "#" },
        { text: "Luyện tập", href: "#" },
        { text: "Thi đấu", href: "#" },
        { text: "Thử thách", href: "#" },
        { text: "Xếp hạng", href: "#" },
        { text: "Chia sẻ", href: "#" }
      ]
    },
    {
      title: "Về chúng tôi",
      links: [
        { text: "Giới thiệu", href: "#" },
        { text: "Điều khoản sử dụng", href: "#" },
        { text: "Trợ giúp", href: "#" }
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
                  <a href={link.href}>{link.text}</a>
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
