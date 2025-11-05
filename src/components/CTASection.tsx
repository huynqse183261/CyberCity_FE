import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { message } from 'antd';
import '../styles/CTASection.css';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleKaliLinuxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      message.info('Vui lòng đăng nhập để bắt đầu với Kali Linux');
      navigate('/login', { state: { from: '/linux' } });
    } else {
      navigate('/linux');
    }
  };

  const handleDownloadVM = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/download-vm');
  };

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
          <button 
            className="btn-primary"
            onClick={handleKaliLinuxClick}
          >
            Bắt đầu với Kali Linux
          </button>
          <button 
            className="btn-secondary"
            onClick={handleDownloadVM}
          >
            Tải máy ảo miễn phí
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
