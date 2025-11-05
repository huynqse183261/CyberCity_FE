import React, { useEffect, useMemo, useState } from 'react';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import paymentService from '../services/paymentService';
import '../styles/LinuxLabPage.css';

const StudentPaymentHistoryPage: React.FC = () => {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const user: User = useMemo(() => ({
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  }), [currentUser]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      // Chờ auth sẵn sàng
      if (authLoading) return;
      const userUid = (currentUser as any)?.uid || (currentUser as any)?.userUid || (currentUser as any)?.id || (currentUser as any)?.userId;
      if (!userUid) {
        setError('Không tìm thấy mã người dùng. Vui lòng đăng xuất và đăng nhập lại.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await paymentService.getPaymentHistory(userUid);
        const list = Array.isArray(res?.data) ? res.data : [];
        // Sắp xếp mới nhất trước theo createdAt nếu có
        list.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setItems(list);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Không thể tải lịch sử thanh toán.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authLoading, currentUser]);

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
          <h1 className="hero-title">Lịch sử thanh toán</h1>
          <p className="hero-subtitle">Theo dõi các giao dịch mua gói học của bạn</p>
        </div>
      </section>

      <section className="main-features-section">
        <div className="features-container" style={{ maxWidth: 1000 }}>
          {(loading || authLoading) && <div style={{ textAlign: 'center', padding: 24 }}>Đang tải...</div>}
          {error && <div style={{ textAlign: 'center', padding: 24, color: '#ff6b6b' }}>{error}</div>}

          {!loading && !error && (
            <div className="quiz-cards">
              {items.length === 0 && (
                <p style={{ textAlign: 'center', opacity: 0.9 }}>Không có lịch sử thanh toán.</p>
              )}
              {items.map((p: any) => (
                <div key={p.uid} className="quiz-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{new Date(p.createdAt).toLocaleString('vi-VN')}</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>Mã: {p.uid}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0 }}>Số tiền</p>
                    <h3 style={{ margin: 0 }}>{Number(p.amount || 0).toLocaleString('vi-VN')} {p.currency || 'VND'}</h3>
                  </div>
                  <div>
                    <p style={{ margin: 0 }}>Trạng thái</p>
                    <h3 style={{ margin: 0 }}>{(p.status || '').toString()}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {p.uid && (
                      <a className="feature-btn linux-btn" href={`/api/payment/invoice/${encodeURIComponent(p.uid)}`} target="_blank" rel="noreferrer">Xem hóa đơn</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentPaymentHistoryPage;


