import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import '../styles/LinuxLabPage.css';

const HomeLogin: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Transform AuthContext user to component user format
  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };


  return (
    <div className="linux-lab-page">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎓 Chào mừng đến với CyberCity</h1>
          <p className="hero-subtitle">
            Nền tảng học tập An toàn thông tin dành cho sinh viên
            <br />
            Thực hành Linux & Pentesting với môi trường ảo hóa và AI hỗ trợ 24/7
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">50+</div>
              <div className="stat-label">Bài Lab</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">100+</div>
              <div className="stat-label">Tools</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="main-features-section">
        <div className="features-container">
          <h2 className="section-title">Chọn lộ trình học của bạn</h2>
          
          <div className="main-features-grid">
            {/* Linux Learning Card */}
            <div className="main-feature-card linux-card">
              <div className="feature-icon-large">🐧</div>
              <h3 className="feature-title">Học Linux</h3>
              <p className="feature-description">
                Thành thạo Linux từ cơ bản đến nâng cao với 6 module học tập đầy đủ
              </p>
              <ul className="feature-highlights">
                <li>✓ Terminal & Command Line mastery</li>
                <li>✓ System Administration</li>
                <li>✓ Shell Scripting & Automation</li>
                <li>✓ Linux Security & Hardening</li>
                <li>✓ DevOps & Cloud Deployment</li>
              </ul>
              <div className="feature-stats-row">
                <div className="mini-stat">
                  <span className="mini-stat-value">6</span>
                  <span className="mini-stat-label">Modules</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">30+</span>
                  <span className="mini-stat-label">Labs</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">40h</span>
                  <span className="mini-stat-label">Duration</span>
                </div>
              </div>
              <button 
                className="feature-btn linux-btn"
                onClick={() => navigate('/linux')}
              >
                Bắt đầu học Linux →
              </button>
            </div>

            {/* Penetration Testing Card */}
            <div className="main-feature-card pentest-card">
              <div className="feature-icon-large">🔐</div>
              <h3 className="feature-title">Penetration Testing</h3>
              <p className="feature-description">
                Học kỹ thuật pentest thực chiến với môi trường lab an toàn
              </p>
              <ul className="feature-highlights">
                <li>✓ Reconnaissance & Information Gathering</li>
                <li>✓ Vulnerability Assessment & Scanning</li>
                <li>✓ Web Application Penetration Testing</li>
                <li>✓ Network & System Exploitation</li>
                <li>✓ Post-Exploitation & Reporting</li>
              </ul>
              <div className="feature-stats-row">
                <div className="mini-stat">
                  <span className="mini-stat-value">5</span>
                  <span className="mini-stat-label">Phases</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">20+</span>
                  <span className="mini-stat-label">Targets</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">50+</span>
                  <span className="mini-stat-label">Tools</span>
                </div>
              </div>
              <button 
                className="feature-btn pentest-btn"
                onClick={() => navigate('/pentest-lab')}
              >
                Bắt đầu Pentest →
              </button>
            </div>

            {/* AI Assistant Card */}
            <div className="main-feature-card ai-card">
              <div className="feature-icon-large">🤖</div>
              <h3 className="feature-title">AI Assistant</h3>
              <p className="feature-description">
                Trợ lý AI thông minh hỗ trợ học tập và giải đáp thắc mắc 24/7
              </p>
              <ul className="feature-highlights">
                <li>✓ Giải thích lệnh Linux chi tiết</li>
                <li>✓ Hướng dẫn sử dụng công cụ Pentest</li>
                <li>✓ Debug & Troubleshooting</li>
                <li>✓ Gợi ý giải pháp bảo mật</li>
                <li>✓ Hỗ trợ tiếng Việt tự nhiên</li>
              </ul>
              <div className="feature-stats-row">
                <div className="mini-stat">
                  <span className="mini-stat-value">AI</span>
                  <span className="mini-stat-label">Powered</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">24/7</span>
                  <span className="mini-stat-label">Available</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">∞</span>
                  <span className="mini-stat-label">Questions</span>
                </div>
              </div>
              <button 
                className="feature-btn ai-btn"
                onClick={() => navigate('/ai-assistant')}   
              >
                Trò chuyện với AI →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="learning-path-section">
        <div className="features-container">
          <h2 className="section-title">Lộ trình học tập</h2>
          <div className="learning-path">
            <div className="path-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Làm quen với Linux</h4>
                <p>Học các lệnh cơ bản và làm quen với Terminal</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Thực hành Lab</h4>
                <p>Áp dụng kiến thức vào các bài lab thực tế</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Học Pentesting</h4>
                <p>Khám phá kỹ thuật tấn công và phòng thủ</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Nhận chứng chỉ</h4>
                <p>Hoàn thành khóa học và nhận chứng nhận</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access-section">
        <div className="features-container">
          <h2 className="section-title">Truy cập nhanh</h2>
          <div className="quick-access-grid">
            <div className="quick-access-card" onClick={() => navigate('/inbox')}>
              <div className="quick-icon">💬</div>
              <h4>Hộp thư</h4>
              <p>Tin nhắn và thông báo</p>
            </div>
            <div className="quick-access-card" onClick={() => navigate('/student/settings')}>
              <div className="quick-icon">⚙️</div>
              <h4>Cài đặt</h4>
              <p>Quản lý tài khoản</p>
            </div>
            <div className="quick-access-card" onClick={() => alert('Đang phát triển')}>
              <div className="quick-icon">📊</div>
              <h4>Tiến độ</h4>
              <p>Xem kết quả học tập</p>
            </div>
            <div className="quick-access-card" onClick={() => alert('Đang phát triển')}>
              <div className="quick-icon">🏆</div>
              <h4>Thành tích</h4>
              <p>Huy chương và chứng chỉ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeLogin;