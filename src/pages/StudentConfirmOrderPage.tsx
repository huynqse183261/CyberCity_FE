import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import { usePricingPlans } from '../hooks/usePricing';
import '../styles/LinuxLabPage.css';

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
    console.log('Looking for plan with UID:', planUid, 'in data:', raw);
    const found = raw.find((p: any) => p.uid === planUid || p.id === planUid);
    console.log('Found plan:', found);
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
        <div className="hero-content">
          <h1 className="hero-title">Xác nhận mua gói</h1>
          <p className="hero-subtitle">Kiểm tra thông tin trước khi tạo đơn thanh toán</p>
        </div>
      </section>

      <section className="main-features-section">
        <div className="features-container" style={{ maxWidth: 1280 }}>
          {(!planUid || isLoading) && <div style={{ textAlign: 'center', padding: 24 }}>Đang tải...</div>}
          {error && <div style={{ textAlign: 'center', padding: 24, color: '#ff6b6b' }}>Không thể tải gói dịch vụ.</div>}
          {!isLoading && !error && plan && (
            <div className="quiz-cards" style={{ width: '300px' }}>
              <div className="quiz-card" style={{ width: '300%', maxWidth: '300%', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, padding: 28 }}>
                <div>
                  <h2 style={{ marginTop: 0, fontSize: 28 }}>{plan.planName}</h2>
                  <p style={{ fontSize: 16 }}>Thời hạn: <strong>{plan.durationDays || 30} ngày</strong></p>
                  <p style={{ fontSize: 18 }}>Giá: <strong style={{ color: '#00d4ff' }}>{Number(plan.price || 0).toLocaleString('vi-VN')}đ</strong></p>
                  <ul className="feature-highlights">
                    {features.map((f, i) => (<li key={i}>✓ {f}</li>))}
                  </ul>
                </div>
                <div>
                  <h2 style={{ marginTop: 0, fontSize: 24 }}>Thông tin tài khoản</h2>
                  <p style={{ fontSize: 16 }}>Họ tên: <strong>{currentUser?.fullName || '-'}</strong></p>
                  <p style={{ fontSize: 16 }}>Email: <strong>{currentUser?.email || '-'}</strong></p>
                  <p style={{ fontSize: 16 }}>Tài khoản: <strong>{currentUser?.username || currentUser?.email || '-'}</strong></p>
                  <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
                    <button className="feature-btn pentest-btn" onClick={() => navigate(`/student/checkout?planUid=${encodeURIComponent(planUid)}`)} style={{ height: 60, fontSize: 18, padding: '0 28px' }}>
                      Xác nhận & tạo thanh toán →
                    </button>
                    <button className="feature-btn ai-btn" onClick={() => navigate('/student/pricing')} style={{ height: 56, fontSize: 16, padding: '0 24px' }}>
                      ← Chọn gói khác
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isLoading && !error && !plan && (
            <div style={{ textAlign: 'center', padding: 24 }}>Không tìm thấy gói dịch vụ.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentConfirmOrderPage;


