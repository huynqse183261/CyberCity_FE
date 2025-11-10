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

  const getStatusClass = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid' || s === 'success' || s === 'completed') return 'status-paid';
    if (s === 'pending' || s === 'processing') return 'status-pending';
    if (s === 'failed' || s === 'cancelled') return 'status-failed';
    return 'status-pending';
  };

  const getStatusText = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid' || s === 'success' || s === 'completed') return 'Đã thanh toán';
    if (s === 'pending' || s === 'processing') return 'Đang xử lý';
    if (s === 'failed' || s === 'cancelled') return 'Thất bại';
    return status;
  };

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
        <div className="features-container" style={{ maxWidth: 1200 }}>
          {(loading || authLoading) && (
            <div className="payment-loading">
              <p style={{ color: '#b8c5d1', fontSize: '1.1rem' }}>Đang tải dữ liệu...</p>
            </div>
          )}
          
          {error && (
            <div style={{ 
              textAlign: 'center', 
              padding: 40, 
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 12,
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <p style={{ color: '#ef4444', fontSize: '1.1rem', margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="payment-history-grid">
              {items.length === 0 && (
                <div className="payment-empty-state" style={{ gridColumn: '1 / -1' }}>
                  <p>Không có lịch sử thanh toán nào.</p>
                </div>
              )}
              
              {items.map((p: any) => (
                <div key={p.uid} className="payment-card">
                  <div className="payment-card-header">
                    <h3 className="payment-date">
                      {new Date(p.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </h3>
                    <p className="payment-id">{p.uid}</p>
                  </div>
                  
                  <div className="payment-card-body">
                    <div className="payment-details">
                      <div className="payment-amount-section">
                        <p className="payment-label">Số tiền thanh toán</p>
                        <h3 className="payment-amount">
                          {Number(p.amount || 0).toLocaleString('vi-VN')}
                          <span className="payment-currency">{p.currency || 'VND'}</span>
                        </h3>
                      </div>
                      
                      <div className="payment-status-section">
                        <p className="payment-label">Trạng thái</p>
                        <span className={`payment-status-badge ${getStatusClass(p.status)}`}>
                          {getStatusText(p.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {(p.paymentMethod || p.packageName) && (
                    <div className="payment-card-footer">
                      {p.paymentMethod && (
                        <div className="payment-method">
                          Phương thức: {p.paymentMethod}
                        </div>
                      )}
                      {p.packageName && (
                        <div style={{ opacity: 0.8 }}>
                          Gói: {p.packageName}
                        </div>
                      )}
                    </div>
                  )}
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