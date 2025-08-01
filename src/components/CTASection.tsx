import React from 'react';
import '../styles/CTASection.css';

const CTASection: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Sẵn sàng trở thành Linux Security Expert?</h2>
        <p>
          Tham gia cùng hàng nghìn học viên đã thành thạo Linux và an ninh mạng. 
          Bắt đầu với các lab máy ảo thực tế và AI mentor hỗ trợ 24/7. 
          Từ newbie đến professional!
        </p>
        <div className="hero-buttons">
          <a href="#signup" className="btn-primary">Bắt đầu với Kali Linux</a>
          <a href="#contact" className="btn-secondary">Tải máy ảo miễn phí</a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
