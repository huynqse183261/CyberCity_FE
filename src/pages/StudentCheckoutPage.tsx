import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import paymentService from '../services/paymentService';
import '../styles/LinuxLabPage.css';

const useQuery = () => new URLSearchParams(useLocation().search);

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

const StudentCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const planUid = query.get('planUid') || '';
  const { user: currentUser } = useAuth();

  const user: User = useMemo(() => ({
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  }), [currentUser]);

  const [creating, setCreating] = useState(false);
  const [paymentUid, setPaymentUid] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<number | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'CANCELLED' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState<boolean>(false);

  useEffect(() => {
    if (!planUid) {
      setError('Thiếu planUid. Vui lòng chọn gói ở trang Bảng giá.');
    }
  }, [planUid]);

  // Tự động tạo liên kết thanh toán khi có planUid
  useEffect(() => {
    if (planUid && !paymentUid && !creating) {
      createPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planUid]);

  // Cleanup: Hủy payment khi unmount (khi navigate away hoặc component bị destroy)
  useEffect(() => {
    return () => {
      // Cleanup khi component unmount - hủy payment nếu vẫn đang pending
      if (orderCode && status === 'PENDING') {
        paymentService.cancelPayment(orderCode, 'User navigated away').catch(() => {
          // Ignore errors khi cancel - không block unmount
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode, status]);

  const createPayment = async () => {
    const userUid = (currentUser as any)?.uid || (currentUser as any)?.userUid || (currentUser as any)?.id || (currentUser as any)?.userId;
    if (!userUid || !planUid) {
      setError('Thông tin không hợp lệ.');
      return;
    }
    try {
      setError(null);
      setCreating(true);
      const origin = window.location.origin;
      const res = await paymentService.createPaymentLink({
        userUid,
        planUid,
        returnUrl: `${origin}/student/pricing`,
        cancelUrl: `${origin}/student/pricing`
      });
      if (res?.success && res.data) {
        setPaymentUid(res.data.uid);
        setOrderCode(res.data.orderCode);
        setCheckoutUrl(res.data.checkoutUrl);
        setQrCode(res.data.qrCode);
        setStatus(res.data.status);
        // Mở trang PayOS ở tab mới cho người dùng
        if (res.data.checkoutUrl) {
          try { window.open(res.data.checkoutUrl, '_blank'); } catch {}
        }
      } else {
        setError(res?.message || 'Không thể tạo liên kết thanh toán.');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Lỗi khi tạo liên kết thanh toán.');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (!orderCode) return;
    let stopped = false;
    const startedAt = Date.now();
    const timer = setInterval(async () => {
      if (stopped) return;
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        clearInterval(timer);
        return;
      }
      try {
        const res = await paymentService.getPaymentStatus(orderCode);
        if (res?.success && res.data) {
          setStatus(res.data.status);
          if (res.data.status === 'PAID' || res.data.status === 'CANCELLED') {
            clearInterval(timer);
          }
        }
      } catch (e) {
        // ignore polling errors
      }
    }, POLL_INTERVAL_MS);
    return () => { stopped = true; clearInterval(timer); };
  }, [orderCode]);

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
          <h1 className="hero-title">Thanh toán gói học</h1>
          <p className="hero-subtitle">Quét QR hoặc mở link để tiến hành thanh toán qua PayOS</p>
        </div>
      </section>

      <section className="main-features-section">
        <div className="features-container" style={{ maxWidth: 900 }}>
          {creating && !paymentUid ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <p>Đang tạo liên kết thanh toán...</p>
              {error && <p style={{ color: '#ff6b6b', marginTop: 12 }}>{error}</p>}
            </div>
          ) : error && !paymentUid ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <p style={{ color: '#ff6b6b' }}>{error}</p>
              <button className="feature-btn ai-btn" onClick={() => navigate('/student/pricing')} style={{ height: 48, fontSize: 16, padding: '0 22px', marginTop: 16 }}>← Quay lại bảng giá</button>
            </div>
          ) : (
            <div className="main-features-grid">
              <div className="main-feature-card linux-card" style={{ alignItems: 'center', textAlign: 'center', padding: 24 }}>
                <h3 className="feature-title">Bước 1: Quét QR</h3>
                {qrCode ? (
                  <img src={qrCode} alt="QR Code thanh toán" style={{ width: 320, height: 320, borderRadius: 12 }} />
                ) : (
                  <p>Đang tải QR...</p>
                )}
                <p style={{ marginTop: 12 }}>Hoặc</p>
                {checkoutUrl && (
                  <a className="feature-btn linux-btn" href={checkoutUrl} target="_blank" rel="noreferrer" style={{ height: 52, lineHeight: '52px', fontSize: 16 }}>Mở trang thanh toán</a>
                )}
              </div>

              <div className="main-feature-card pentest-card" style={{ alignItems: 'center', textAlign: 'center', padding: 24 }}>
                <h3 className="feature-title">Bước 2: Trạng thái</h3>
                <p>Trạng thái hiện tại: <strong>{status || 'PENDING'}</strong></p>
                {orderCode && (
                  <button className="feature-btn ai-btn" style={{ height: 48, fontSize: 16, padding: '0 22px', marginBottom: 12 }}
                    onClick={async () => {
                      try {
                        setChecking(true);
                        const res = await paymentService.getPaymentStatus(orderCode);
                        if (res?.success && res.data) {
                          setStatus(res.data.status);
                          if (res.data.status === 'PAID' && paymentUid) {
                            try { window.open(`/api/payment/invoice/${encodeURIComponent(paymentUid)}`, '_blank'); } catch {}
                          }
                        }
                      } finally {
                        setChecking(false);
                      }
                    }}
                    disabled={checking}
                  >
                    {checking ? 'Đang kiểm tra...' : 'Tôi đã thanh toán - Kiểm tra ngay'}
                  </button>
                )}
                {status === 'PAID' && (
                  <>
                    <p style={{ color: '#16a34a', fontWeight: 600 }}>Thanh toán thành công! ✓</p>
                    <button className="feature-btn pentest-btn" onClick={() => navigate('/student')} style={{ height: 52, fontSize: 16, padding: '0 24px' }}>Về trang học viên</button>
                  </>
                )}
                {status === 'CANCELLED' && (
                  <>
                    <p style={{ color: '#dc2626', fontWeight: 600 }}>Thanh toán bị hủy.</p>
                    <button className="feature-btn pentest-btn" onClick={() => { setPaymentUid(null); setOrderCode(null); setCheckoutUrl(null); setQrCode(null); setStatus(null); }} style={{ height: 52, fontSize: 16, padding: '0 24px' }}>Tạo lại liên kết</button>
                  </>
                )}
                <div style={{ marginTop: 16 }}>
                  <button className="feature-btn ai-btn" onClick={() => {
                    if (orderCode && status === 'PENDING') {
                      paymentService.cancelPayment(orderCode, 'User cancelled').then(() => {
                        navigate('/student/pricing');
                      }).catch(() => {
                        navigate('/student/pricing');
                      });
                    } else {
                      navigate('/student/pricing');
                    }
                  }} style={{ height: 48, fontSize: 16, padding: '0 22px' }}>← Hủy thanh toán</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentCheckoutPage;


