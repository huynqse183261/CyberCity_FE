import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  // Handle smooth scroll for hash links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (location.pathname !== '/') {
        // If not on homepage, navigate to homepage first
        window.location.href = `/${href}`;
      }
    }
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="logo">CyberCity</Link>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              onClick={(e) => handleNavClick(e, '#home')}
              className={location.pathname === '/' ? 'active' : ''}
            >
              Trang chủ
            </Link>
          </li>
          <li>
            <Link 
              to="/linux" 
              className={location.pathname.startsWith('/linux') ? 'active' : ''}
            >
              Linux
            </Link>
          </li>
          <li>
            <Link 
              to="/pentest" 
              className={location.pathname.startsWith('/pentest') ? 'active' : ''}
            >
              Pentesting
            </Link>
          </li>
          <li>
            <Link 
              to="/gioi-thieu" 
              className={location.pathname === '/gioi-thieu' ? 'active' : ''}
            >
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link 
              to="/lien-he" 
              className={location.pathname === '/lien-he' ? 'active' : ''}
            >
              Liên hệ
            </Link>
          </li>
        </ul>
        <div className="nav-buttons">
          <Link to="/login" className="cta-button login-btn">Đăng nhập</Link>
          <Link to="/register" className="cta-button register-btn">Đăng ký</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
