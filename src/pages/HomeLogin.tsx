import React from 'react';
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
            Học lý thuyết Linux & Pentesting kèm quiz kiểm tra kiến thức và AI hỗ trợ 24/7
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">100+</div>
              <div className="stat-label">Bài Lý Thuyết</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">50+</div>
              <div className="stat-label">Quiz Kiểm Tra</div>
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
                Học lý thuyết Linux từ cơ bản đến nâng cao và làm quiz kiểm tra kiến thức qua các module học tập đầy đủ
              </p>
              <ul className="feature-highlights">
                <li>✓ Học lý thuyết từng bài chi tiết</li>
                <li>✓ Làm quiz kiểm tra sau mỗi bài</li>
                <li>✓ Terminal & Dòng lệnh chủ đạo</li>
                <li>✓ Quản trị hệ thống & Bảo mật</li>
                <li>✓ Shell Scripting & Quản lý DevOps</li>
              </ul>
              <div className="feature-stats-row">
                <div className="mini-stat">
                  <span className="mini-stat-value">6</span>
                  <span className="mini-stat-label">Module</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">50+</span>
                  <span className="mini-stat-label">Bài lý thuyết</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">20+</span>
                  <span className="mini-stat-label">Bài kiểm tra</span>
                </div>
              </div>
              <button 
                className="feature-btn linux-btn"
                onClick={() => navigate('/linux')}
              >
                Vào khóa Linux →
              </button>
            </div>

            {/* Penetration Testing Card */}
            <div className="main-feature-card pentest-card">
              <div className="feature-icon-large">🔐</div>
              <h3 className="feature-title">Penetration Testing</h3>
              <p className="feature-description">
                Học lý thuyết Pentesting từ cơ bản đến nâng cao và làm quiz kiểm tra kiến thức qua các module thực chiến
              </p>
              <ul className="feature-highlights">
                <li>✓ Học lý thuyết từng bài chi tiết</li>
                <li>✓ Làm quiz kiểm tra sau mỗi bài</li>
                <li>✓ Trinh sát & Thu thập thông tin</li>
                <li>✓ Đánh giá lỗ hổng & Khai thác</li>
                <li>✓ Kiểm thử ứng dụng web & mạng</li>
              </ul>
              <div className="feature-stats-row">
                <div className="mini-stat">
                  <span className="mini-stat-value">6</span>
                  <span className="mini-stat-label">Module</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">50+</span>
                  <span className="mini-stat-label">Bài lý thuyết</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">20+</span>
                  <span className="mini-stat-label">Bài kiểm tra</span>
                </div>
              </div>
              <button 
                className="feature-btn pentest-btn"
                onClick={() => navigate('/pentest-lab')}
              >
                Vào khóa Pentest →
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
                  <span className="mini-stat-label">Công nghệ</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">24/7</span>
                  <span className="mini-stat-label">Sẵn sàng</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">∞</span>
                  <span className="mini-stat-label">Câu hỏi</span>
                </div>
              </div>
              <button 
                className="feature-btn ai-btn"
                onClick={() => navigate('/ai-assistant')}   
              >
                Trò chuyện với AI →
              </button>
            </div>

            {/* Pricing Card */}
            <div className="main-feature-card pricing-card">
              <div className="feature-icon-large">💳</div>
              <h3 className="feature-title">Mua gói học</h3>
              <p className="feature-description">
                Chọn gói học phù hợp để mở khóa toàn bộ nội dung và tính năng nâng cao
              </p>
              <ul className="feature-highlights">
                <li>✓ Truy cập đầy đủ khóa Linux & Pentest</li>
                <li>✓ Làm quiz không giới hạn</li>
                <li>✓ Theo dõi tiến độ và chứng chỉ</li>
                <li>✓ Hỗ trợ ưu tiên</li>
              </ul>
              <div className="feature-stats-row">
                <div className="mini-stat">
                  <span className="mini-stat-value">Pro</span>
                  <span className="mini-stat-label">Gói đề xuất</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">-10%</span>
                  <span className="mini-stat-label">Ưu đãi</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-value">24/7</span>
                  <span className="mini-stat-label">Hỗ trợ</span>
                </div>
              </div>
              <button 
                className="feature-btn pricing-btn"
                onClick={() => navigate('/student/pricing')}
              >
                Xem bảng giá →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section - Linux */}
      <section className="learning-path-section">
        <div className="features-container">
          <h2 className="section-title">Lộ trình học Linux</h2>
          <div className="learning-path">
            <div className="path-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Học Lý Thuyết</h4>
                <p>Đọc và nắm vững kiến thức từng bài học</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Làm Quiz</h4>
                <p>Kiểm tra kiến thức qua các câu hỏi quiz</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Hoàn Thành Module</h4>
                <p>Tiếp tục với các module tiếp theo</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Nhận Chứng Chỉ</h4>
                <p>Hoàn thành khóa học và nhận chứng nhận</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section - Pentest */}
      <section className="learning-path-section">
        <div className="features-container">
          <h2 className="section-title">Lộ trình học Pentest</h2>
          <div className="learning-path">
            <div className="path-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Học Lý Thuyết</h4>
                <p>Đọc và nắm vững kiến thức Pentesting từng bài</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Làm Quiz</h4>
                <p>Kiểm tra kiến thức qua các câu hỏi quiz</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Hoàn Thành Module</h4>
                <p>Tiếp tục với các module tiếp theo</p>
              </div>
            </div>
            <div className="path-arrow">→</div>
            <div className="path-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Nhận Chứng Chỉ</h4>
                <p>Hoàn thành khóa học và nhận chứng nhận</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeLogin;