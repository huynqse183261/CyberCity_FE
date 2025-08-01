import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="logo">CyberLearn VN</Link>
        <ul className="nav-links">
          <li><a href="#home">Trang chủ</a></li>
          <li><a href="#linux">Linux</a></li>
          <li><a href="#pentest-tools">Pentesting</a></li>
          <li><a href="#source">Khóa học</a></li>
          <li><a href="#contact">Liên hệ</a></li>
        </ul>
        <div className="nav-buttons">
          <Link to="/login" className="cta-button">Đăng nhập</Link>
          <Link to="/register" className="cta-button">Đăng ký ngay</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
