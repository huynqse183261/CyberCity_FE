import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess';
import '../styles/LinuxLabPage.css';

const MySubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { 
    hasSubscription, 
    canViewAllModules, 
    subscriptionInfo, 
    loading, 
    error, 
    refresh 
  } = useSubscriptionAccess();

  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Không giới hạn';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const calculateDaysRemaining = (endAt: string | null): number | null => {
    if (!endAt) return null;
    try {
      const end = new Date(endAt);
      const now = new Date();
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="linux-lab-page">
        <ParticleBackground />
        <nav className="navigation">
          <div className="nav-container">
            <LinuxLabNavigation />
            <UserDropdown user={user} />
          </div>
        </nav>
        <div className="loading-container">
          <p>Đang tải thông tin gói đăng ký...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="linux-lab-page">
      <ParticleBackground />

      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Gói Đăng Ký Của Tôi</h1>
          <p className="hero-subtitle">Xem thông tin chi tiết gói học của bạn</p>
        </div>
      </section>

      <section className="main-features-section">
        <div className="features-container" style={{ maxWidth: 900 }}>
          {error && (
            <div style={{ 
              padding: '1.5rem', 
              background: 'rgba(255, 68, 68, 0.1)', 
              border: '2px solid rgba(255, 68, 68, 0.3)', 
              borderRadius: '12px',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#ff4444', marginBottom: '1rem' }}>❌ {error}</p>
              <button 
                className="btn pentest-btn" 
                onClick={refresh}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Thử lại
              </button>
            </div>
          )}

          {hasSubscription && subscriptionInfo ? (
            <div className="main-features-grid">
              {/* Subscription Info Card */}
              <div className="main-feature-card linux-card" style={{ gridColumn: '1 / -1' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginBottom: '1.5rem' 
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                  <div>
                    <h2 className="feature-title" style={{ margin: 0 }}>
                      {subscriptionInfo.planName}
                    </h2>
                    <p style={{ color: '#00d4ff', margin: 0, fontSize: '0.9rem' }}>
                      Gói đang hoạt động
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1.5rem',
                  marginTop: '1.5rem'
                }}>
                  <div>
                    <p style={{ color: '#b8c5d1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      Ngày bắt đầu
                    </p>
                    <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
                      {formatDate(subscriptionInfo.startAt)}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: '#b8c5d1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      Ngày kết thúc
                    </p>
                    <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
                      {formatDate(subscriptionInfo.endAt)}
                    </p>
                  </div>

                  {subscriptionInfo.daysRemaining !== null && subscriptionInfo.daysRemaining !== undefined && (
                    <div>
                      <p style={{ color: '#b8c5d1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Số ngày còn lại
                      </p>
                      <p style={{ 
                        color: subscriptionInfo.daysRemaining > 7 ? '#00d4ff' : '#ff4444', 
                        fontSize: '1.1rem', 
                        fontWeight: 600 
                      }}>
                        {subscriptionInfo.daysRemaining} ngày
                      </p>
                    </div>
                  )}

                  <div>
                    <p style={{ color: '#b8c5d1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      Trạng thái
                    </p>
                    <p style={{ 
                      color: subscriptionInfo.active ? '#00d4ff' : '#ff4444', 
                      fontSize: '1.1rem', 
                      fontWeight: 600 
                    }}>
                      {subscriptionInfo.active ? '✓ Đang hoạt động' : '✗ Hết hạn'}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  background: 'rgba(0, 212, 255, 0.1)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 212, 255, 0.3)'
                }}>
                  <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>🎉 Quyền lợi của bạn</h3>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0,
                    color: '#b8c5d1'
                  }}>
                    <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#00d4ff' }}>✓</span>
                      Truy cập toàn bộ modules của tất cả khóa học
                    </li>
                    <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#00d4ff' }}>✓</span>
                      Không giới hạn số lượng bài học
                    </li>
                    <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#00d4ff' }}>✓</span>
                      Hỗ trợ 24/7 từ đội ngũ CyberCity
                    </li>
                  </ul>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  marginTop: '2rem',
                  flexWrap: 'wrap'
                }}>
                  {subscriptionInfo.daysRemaining !== null && subscriptionInfo.daysRemaining <= 7 && (
                    <button 
                      className="feature-btn pentest-btn" 
                      onClick={() => navigate('/student/pricing')}
                      style={{ flex: 1, minWidth: '200px' }}
                    >
                      Gia hạn gói ngay →
                    </button>
                  )}
                  <button 
                    className="feature-btn ai-btn" 
                    onClick={() => navigate('/student/pricing')}
                    style={{ flex: 1, minWidth: '200px' }}
                  >
                    Xem các gói khác →
                  </button>
                  <button 
                    className="feature-btn linux-btn" 
                    onClick={() => navigate('/student')}
                    style={{ flex: 1, minWidth: '200px' }}
                  >
                    Về trang học viên
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="main-feature-card pentest-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 68, 68, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2.5rem'
              }}>
                🔒
              </div>
              <h2 className="feature-title" style={{ marginBottom: '1rem' }}>
                Bạn chưa có gói đăng ký
              </h2>
              <p style={{ color: '#b8c5d1', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Đăng ký gói học ngay để truy cập toàn bộ nội dung khóa học và tận hưởng các quyền lợi độc quyền!
              </p>
              <div style={{ 
                background: 'rgba(255, 68, 68, 0.1)', 
                border: '1px solid rgba(255, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Quyền lợi khi đăng ký:</h3>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  color: '#b8c5d1'
                }}>
                  <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#ff4444' }}>•</span>
                    Truy cập toàn bộ modules thay vì chỉ 2 module đầu tiên
                  </li>
                  <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#ff4444' }}>•</span>
                    Không giới hạn số lượng bài học và khóa học
                  </li>
                  <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#ff4444' }}>•</span>
                    Hỗ trợ 24/7 từ đội ngũ CyberCity
                  </li>
                  <li style={{ padding: '0.5rem 0', paddingLeft: '1.5rem', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#ff4444' }}>•</span>
                    Cập nhật nội dung mới nhất
                  </li>
                </ul>
              </div>
              <button 
                className="feature-btn pentest-btn" 
                onClick={() => navigate('/student/pricing')}
                style={{ 
                  padding: '1rem 2rem', 
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                Xem các gói và đăng ký ngay →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MySubscriptionPage;

