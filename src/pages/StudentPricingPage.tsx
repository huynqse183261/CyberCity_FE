import React from 'react';
import { useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import '../styles/LinuxLabPage.css';
import { usePricingPlans } from '../hooks/usePricing';

const StudentPricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  const { data, isLoading, error } = usePricingPlans();

  const plans = React.useMemo(() => {
    const raw = Array.isArray(data) ? data : (data as any)?.items || [];
    return raw.map((plan: any) => ({
      uid: plan.uid,
      planName: plan.planName,
      price: plan.price || 0,
      durationDays: plan.durationDays || 30,
      features: typeof plan.features === 'string' && plan.features.startsWith('[')
        ? JSON.parse(plan.features)
        : plan.features?.split?.('\n') || [],
      isFeatured: plan.planName?.toLowerCase?.().includes('premium') || plan.planName?.toLowerCase?.().includes('pro')
    }));
  }, [data]);

  return (
    <div className="linux-lab-page">
      <ParticleBackground />

      {/* Navigation (Student layout) */}
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">💳 Bảng giá dành cho học viên</h1>
          <p className="hero-subtitle">Chọn gói phù hợp để mở khóa toàn bộ nội dung Linux & Pentest</p>
        </div>
      </section>

      <section className="main-features-section">
        <div className="features-container">
          <h2 className="section-title">Chọn gói của bạn</h2>

          {isLoading && (
            <div style={{ textAlign: 'center', padding: 24 }}>Đang tải gói giá...</div>
          )}
          {error && (
            <div style={{ textAlign: 'center', padding: 24, color: '#ff6b6b' }}>Không thể tải gói giá. Vui lòng thử lại.</div>
          )}

          {!isLoading && !error && (
            <div className="main-features-grid">
              {plans.map((p: any) => (
                <div key={p.uid} className={`main-feature-card ${p.isFeatured ? 'pentest-card' : 'linux-card'}`}>
                  <div className="feature-icon-large">{p.isFeatured ? '🚀' : '🎓'}</div>
                  <h3 className="feature-title">{p.planName}</h3>
                  <p className="feature-description">Thời hạn {p.durationDays} ngày</p>
                  <ul className="feature-highlights">
                    {(p.features || []).map((f: string, idx: number) => (
                      <li key={idx}>✓ {f}</li>
                    ))}
                  </ul>
                  <div className="feature-stats-row">
                    <div className="mini-stat">
                    <span className="mini-stat-label">Giá</span>
                      <span className="mini-stat-value">{p.price?.toLocaleString?.('vi-VN')}đ</span>
                    </div>
                    <div className="mini-stat">
                      <span className="mini-stat-label">Ngày</span>
                      <span className="mini-stat-value">{p.durationDays}</span>
                    </div>
                    <div className="mini-stat">
                      <span className="mini-stat-label">Gợi ý</span>
                      <span className="mini-stat-value">{p.isFeatured ? 'Pro' : 'Basic'}</span>
                    </div>
                  </div>
                  <button className={`feature-btn ${p.isFeatured ? 'pentest-btn' : 'linux-btn'}`} onClick={() => navigate(`/student/confirm?planUid=${encodeURIComponent(p.uid)}`)}>
                    Chọn {p.planName} →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentPricingPage;


