import React from 'react';
import '../styles/FeaturesSection.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: "🐧",
      title: "Linux Command Mastery",
      description: "Thành thạo Linux từ cơ bản đến nâng cao: shell scripting, quản trị hệ thống, cấu hình mạng, bảo mật hệ thống và hardening trên các bản phân phối phổ biến như Ubuntu Server, Kali Linux."
    },
    {
      icon: "💻",
      title: "Replit Virtual Lab",
      description: "Thực hành trực tiếp trên hệ điều hành Linux của Replit — không cần cài đặt. Hỗ trợ môi trường Ubuntu, Kali Linux ngay trên trình duyệt."
    },
    {
      icon: "🔍",
      title: "Pentest & CTF Tools",
      description: "Thực hành với Nmap, Metasploit, Burp Suite, Wireshark... Kèm mini-CTF để rèn kỹ năng tấn công và phòng thủ thực tế."
    },
    {
      icon: "🧠",
      title: "AI Linux Mentor",
      description: "AI hỗ trợ tiếng Việt: giải thích lệnh, gợi ý lời giải CTF, hỗ trợ debug và hướng dẫn từng bước khi học."
    },
    {
      icon: "🌐",
      title: "Network Security Labs",
      description: "Mô phỏng mạng với firewall, IDS/IPS, subnet. Thực hành bảo vệ và tấn công trong môi trường giám sát trên Replit."
    },
    {
      icon: "📜",
      title: "Linux Certification Path",
      description: "Lộ trình học chuẩn bị cho các chứng chỉ Linux+, LPIC, OSCP, GCIH. Nội dung thiết kế phù hợp với sinh viên qua môi trường Replit."
    }
  ];

  return (
    <section className="features" id="features">
      <h2 className="section-title">Tính năng nổi bật</h2>
      <p className="section-subtitle">
        Học An toàn Thông tin thực chiến với Linux, máy ảo và AI hỗ trợ chuyên sâu
      </p>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
