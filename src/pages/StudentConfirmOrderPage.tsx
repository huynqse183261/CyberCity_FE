import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import { usePricingPlans } from '../hooks/usePricing';
import '../styles/LinuxLabPage.css';
import '../styles/StudentConfirmOrderPage.css';

const useQuery = () => new URLSearchParams(useLocation().search);

const StudentConfirmOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const planUid = query.get('planUid') || '';
  const { user: currentUser } = useAuth();

  const user: User = useMemo(() => ({
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  }), [currentUser]);

  const { data, isLoading, error } = usePricingPlans({ useStudentEndpoint: false });
  const plan = useMemo(() => {
    if (!data) return null;
    const raw = Array.isArray(data) ? data : (data as any)?.items || (data as any)?.data || [];
    const found = raw.find((p: any) => p.uid === planUid || p.id === planUid);
    return found;
  }, [data, planUid]);

  const features: string[] = React.useMemo(() => {
    if (!plan) return [];
    return typeof plan.features === 'string' && plan.features.startsWith('[')
      ? JSON.parse(plan.features)
      : plan.features?.split?.('\n') || [];
  }, [plan]);

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
        <div className="hero-content" style={{ textAlign: 'center' }}>
          <h1 className="hero-title" style={{ marginBottom: '0.5rem' }}>Xác nhận mua gói</h1>
          <p className="hero-subtitle" style={{ marginTop: 0 }}>Kiểm tra thông tin trước khi tạo đơn thanh toán</p>
        </div>
      </section>

      <section className="main-features-section">
        <div className="features-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {(!planUid || isLoading) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#fff' }}>Đang tải...</div>
          )}
          {error && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#ff6b6b' }}>
              Không thể tải gói dịch vụ.
            </div>
          )}
          {!isLoading && !error && plan && (
            <div className="confirm-order-container">
              {/* Left: Package Details */}
              <div className="confirm-order-card-left">
                <h2 className="confirm-order-plan-title">
                  {plan.planName || 'Gói học'}
                </h2>
                
                <div className="confirm-order-section">
                  <p className="confirm-order-duration">
                    Thời hạn: <strong className="confirm-order-duration-value">{plan.durationDays || 30} ngày</strong>
                  </p>
                  <p className="confirm-order-price">
                    Giá: <strong className="confirm-order-price-value">
                      {Number(plan.price || 0).toLocaleString('vi-VN')}đ
                    </strong>
                  </p>
                </div>

                <div>
                  <h3 className="confirm-order-features-title">
                    Tính năng gói:
                  </h3>
                  <ul className="confirm-order-features-list">
                    {features.map((f, i) => (
                      <li key={i} className="confirm-order-feature-item">
                        <span className="confirm-order-feature-check">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Account Info & Actions */}
              <div className="confirm-order-card-right">
                <div>
                  <h2 className="confirm-order-account-title">
                    Thông tin tài khoản
                  </h2>
                  
                  <div className="confirm-order-section">
                    <div className="confirm-order-info-group">
                      <span className="confirm-order-info-label">Họ tên:</span>
                      <strong className="confirm-order-info-value">
                        {currentUser?.fullName || '-'}
                      </strong>
                    </div>
                    <div className="confirm-order-info-group">
                      <span className="confirm-order-info-label">Email:</span>
                      <strong className="confirm-order-info-value">
                        {currentUser?.email || '-'}
                      </strong>
                    </div>
                    <div className="confirm-order-info-group">
                      <span className="confirm-order-info-label">Tài khoản:</span>
                      <strong className="confirm-order-info-value">
                        {currentUser?.username || currentUser?.email || '-'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="confirm-order-actions">
                  <button 
                    className="feature-btn pentest-btn confirm-order-btn-primary" 
                    onClick={() => navigate(`/student/checkout?planUid=${encodeURIComponent(planUid)}`)}
                  >
                    Xác nhận & tạo thanh toán →
                  </button>
                  <button 
                    className="feature-btn ai-btn confirm-order-btn-secondary" 
                    onClick={() => navigate('/student/pricing')}
                  >
                    ← Chọn gói khác
                  </button>
                </div>
              </div>
            </div>
          )}
          {!isLoading && !error && !plan && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: '#fff',
              background: 'rgba(255, 68, 68, 0.1)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              borderRadius: '12px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Không tìm thấy gói dịch vụ.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentConfirmOrderPage;


