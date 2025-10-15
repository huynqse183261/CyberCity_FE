import React from 'react';
import { Link } from 'react-router-dom';

const LinuxLabNavigation: React.FC = () => {
  return (
    <div className="nav-left-content">
      <div className="logo">
        <div className="logo-icon">🐧</div>
        <span>LinuxLab</span>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Trang chủ</a></li>
        <li><a href="#labs">Phòng lab</a></li>
        <li><a href="#terminal">Terminal</a></li>
        <li><Link to="/inbox">💬 Hộp thư</Link></li>
        <li><a href="#pentesting">Pentesting</a></li>
        <li><a href="#courses">Khóa học</a></li>
      </ul>
    </div>
  );
};

export default LinuxLabNavigation;