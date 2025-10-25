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
        <li><Link to="/student">Trang chủ</Link></li>
        <li><Link to="/linux-lab">Linux Lab</Link></li>
        <li><Link to="/pentest-lab">PenTest Lab</Link></li>
        <li><Link to="/ai-assistant">AI Assistant</Link></li>
        <li><Link to="/student/profile">Hồ sơ</Link></li>
      </ul>
    </div>
  );
};

export default LinuxLabNavigation;