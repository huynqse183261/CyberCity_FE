import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import paymentService from '../services/paymentService';
import authService from '../services/authService';
import { API_BASE_URL } from '../utils/env';
import '../styles/LinuxLabPage.css';

const useQuery = () => new URLSearchParams(useLocation().search);

const POLL_INTERVAL_MS = 3000; // 3 giây
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 phút

type PaymentStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

const StudentCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const planUid = query.get('planUid') || '';
  const { user: currentUser, refreshUserData } = useAuth();

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
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState<boolean>(false);
  const [notified, setNotified] = useState<boolean>(false);
  
  // Payment details từ API response
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  // Kiểm tra planUid
  useEffect(() => {
    if (!planUid) {
      setError('Thiếu planUid. Vui lòng chọn gói ở trang Bảng giá.');
    }
  }, [planUid]);

  // Cleanup: Hủy payment khi unmount nếu vẫn đang pending
  useEffect(() => {
    return () => {
      if (orderCode && status === 'pending') {
        paymentService.cancelPayment(orderCode, 'User navigated away').catch(() => {
          // Ignore errors khi cancel - không block unmount
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode, status]);

  // Tự động tạo liên kết thanh toán khi có planUid và user
  useEffect(() => {
    if (planUid && currentUser && !paymentUid && !creating && !error) {
      createPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planUid, currentUser]);

  const createPayment = async () => {
    // Refresh user data trước để đảm bảo có thông tin mới nhất
    try {
      await refreshUserData();
      const refreshedUser = authService.getCurrentUser();
      if (!refreshedUser) {
        setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      // Lấy userUid - ưu tiên các field phổ biến
      // Theo API documentation, backend yêu cầu userUid (có thể là id hoặc uid)
      const userUid = (refreshedUser as any)?.uid || 
                      (refreshedUser as any)?.userUid || 
                      refreshedUser?.id || 
                      (refreshedUser as any)?.userId;
      
      if (!userUid || !planUid) {
        setError('Thông tin không hợp lệ. Vui lòng đăng nhập lại.');
        return;
      }
      
      // Validate userUid format
      if (typeof userUid !== 'string' || userUid.trim().length === 0) {
        setError('Mã người dùng không hợp lệ.');
        return;
      }
      
      const requestBody = {
        userUid: String(userUid).trim(),
        planUid: String(planUid).trim()
      };
      
      // Log để debug (chỉ trong development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating payment link with:', {
          userUid: requestBody.userUid,
          planUid: requestBody.planUid,
          currentUser: refreshedUser
        });
      }
      
      setError(null);
      setCreating(true);
      
      const res = await paymentService.createPaymentLink(requestBody);
      
      if (res?.success && res.data) {
        // Lưu thông tin payment
        setPaymentUid(res.data.uid);
        setOrderCode(res.data.orderCode);
        setCheckoutUrl(res.data.checkoutUrl);
        setQrCode(res.data.qrCode || res.data.checkoutUrl); // Sepay: qrCode và checkoutUrl là cùng 1 URL
        setStatus(res.data.status as PaymentStatus);
        
        // Lưu thông tin chi tiết
        setPaymentAmount(res.data.amount);
        setPlanName(res.data.planName || null);
        setDescription(res.data.description || null);
      } else {
        // Xử lý lỗi từ response
        const errorMsg = res?.message || 'Không thể tạo liên kết thanh toán.';
        setError(errorMsg);
      }
    } catch (e: any) {
      // Lỗi từ BE - hiển thị thông báo lỗi từ response
      const errorMsg = e?.response?.data?.message 
        || e?.response?.data?.error 
        || e?.message 
        || 'Lỗi khi tạo liên kết thanh toán. Vui lòng thử lại.';
      
      // Log chi tiết lỗi để debug
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment link creation error:', {
          error: e,
          response: e?.response?.data,
          status: e?.response?.status,
          userUid: currentUser?.id
        });
      }
      
      // Xử lý lỗi đặc biệt: User not found
      if (errorMsg.includes('not found') || errorMsg.includes('không tìm thấy') || errorMsg.includes('User with UID')) {
        setError(`${errorMsg}. Vui lòng đăng xuất và đăng nhập lại để cập nhật thông tin.`);
      } else if (e?.response?.status === 400) {
        setError(`${errorMsg}. Vui lòng kiểm tra lại thông tin và thử lại.`);
      } else {
        setError(errorMsg);
      }
    } finally {
      setCreating(false);
    }
  };

  // Polling payment status - tự động cập nhật khi thanh toán thành công
  useEffect(() => {
    if (!orderCode || status !== 'pending') return;
    
    let stopped = false;
    const startedAt = Date.now();
    
    const timer = setInterval(async () => {
      if (stopped) return;
      
      // Timeout sau 5 phút
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        clearInterval(timer);
        return;
      }
      
      try {
        const res = await paymentService.getPaymentStatus(orderCode);
        if (res?.success && res.data) {
          const paymentStatus = res.data.status.toLowerCase() as PaymentStatus;
          
          // Cập nhật trạng thái
          setStatus(paymentStatus);
          
          // Nếu thanh toán thành công hoặc bị hủy/thất bại, dừng polling
          if (paymentStatus === 'completed' || paymentStatus === 'cancelled' || paymentStatus === 'failed') {
            clearInterval(timer);
            stopped = true;
          }
        }
      } catch (e) {
        // Ignore polling errors - tiếp tục polling
        if (process.env.NODE_ENV === 'development') {
          console.error('Polling error:', e);
        }
      }
    }, POLL_INTERVAL_MS);
    
    return () => { 
      stopped = true; 
      clearInterval(timer); 
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode, status]);

  // Khi thanh toán thành công: thông báo và điều hướng về trang Student
  useEffect(() => {
    if (status === 'completed' && !notified) {
      setNotified(true);
      message.success('Thanh toán thành công! Chuyển về trang học viên...');
      setTimeout(() => {
        navigate('/student');
      }, 1200);
    }
  }, [status, notified, navigate]);

  // Format số tiền
  const formatAmount = (amount: number | null): string => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get status display text và color
  const getStatusDisplay = (status: PaymentStatus | null) => {
    if (!status) return { text: 'PENDING', color: '#f59e0b' };
    
    const statusMap: Record<PaymentStatus, { text: string; color: string }> = {
      pending: { text: 'ĐANG CHỜ', color: '#f59e0b' },
      completed: { text: 'THÀNH CÔNG', color: '#16a34a' },
      cancelled: { text: 'ĐÃ HỦY', color: '#dc2626' },
      failed: { text: 'THẤT BẠI', color: '#dc2626' }
    };
    
    return statusMap[status] || { text: status.toUpperCase(), color: '#6b7280' };
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
          <h1 className="hero-title">Thanh toán gói học</h1>
          <p className="hero-subtitle">Quét QR Code để thanh toán qua ứng dụng ngân hàng (Sepay)</p>
        </div>
      </section>

      <section className="main-features-section">
        <div className="features-container" style={{ maxWidth: 900 }}>
          {/* Loading state */}
          {creating && !paymentUid && (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div className="spinner" style={{ 
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
              </div>
              <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 8 }}>Đang tạo liên kết thanh toán...</p>
              {error && (
                <div style={{ 
                  background: '#fee2e2', 
                  border: '1px solid #fca5a5',
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 16,
                  color: '#dc2626'
                }}>
                  <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Error state */}
          {error && !paymentUid && !creating && (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ 
                background: '#fee2e2', 
                border: '2px solid #dc2626',
                borderRadius: 8,
                padding: 20,
                marginBottom: 16
              }}>
                <p style={{ color: '#dc2626', fontWeight: 600, fontSize: 18, margin: '0 0 8px 0' }}>
                  ⚠️ Lỗi thanh toán
                </p>
                <p style={{ color: '#991b1b', fontSize: 14, margin: 0 }}>{error}</p>
              </div>
              <button 
                className="feature-btn ai-btn" 
                onClick={() => navigate('/student/pricing')} 
                style={{ height: 48, fontSize: 16, padding: '0 22px', marginRight: 12 }}
              >
                ← Quay lại bảng giá
              </button>
              <button 
                className="feature-btn pentest-btn" 
                onClick={() => {
                  setError(null);
                  createPayment();
                }} 
                style={{ height: 48, fontSize: 16, padding: '0 22px' }}
              >
                🔄 Thử lại
              </button>
            </div>
          )}

          {/* Payment success/pending state */}
          {paymentUid && status && (
            <div className="main-features-grid">
              {/* QR Code Section */}
              <div className="main-feature-card linux-card" style={{ alignItems: 'center', textAlign: 'center', padding: 24 }}>
                <h3 className="feature-title">Bước 1: Quét QR Code</h3>
                
                {/* Payment Info */}
                {planName && (
                  <div style={{ 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    padding: 12, 
                    borderRadius: 8, 
                    marginBottom: 16,
                    width: '100%'
                  }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#1e40af', fontWeight: 600 }}>
                      📦 {planName}
                    </p>
                    {paymentAmount !== null && (
                      <p style={{ margin: '8px 0 0 0', fontSize: 18, color: '#1e40af', fontWeight: 700 }}>
                        {formatAmount(paymentAmount)}
                      </p>
                    )}
                  </div>
                )}

                {qrCode ? (
                  <>
                    <img 
                      src={qrCode} 
                      alt="QR Code thanh toán Sepay" 
                      style={{ 
                        width: 280, 
                        height: 280, 
                        borderRadius: 12, 
                        border: '2px solid #e5e7eb',
                        margin: '0 auto',
                        display: 'block'
                      }} 
                    />
                    <p style={{ marginTop: 16, fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
                      Mở ứng dụng ngân hàng và quét QR Code này để thanh toán
                    </p>
                    {checkoutUrl && (
                      <a 
                        className="feature-btn linux-btn" 
                        href={checkoutUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ 
                          height: 48, 
                          lineHeight: '48px', 
                          fontSize: 14, 
                          marginTop: 12, 
                          display: 'inline-block',
                          textDecoration: 'none'
                        }}
                      >
                        🔗 Mở QR Code trong tab mới
                      </a>
                    )}
                    {description && (
                      <div style={{ 
                        marginTop: 16, 
                        padding: 12, 
                        background: '#f9fafb', 
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#6b7280',
                        textAlign: 'left'
                      }}>
                        <p style={{ margin: 0, fontWeight: 600 }}>Nội dung thanh toán:</p>
                        <p style={{ margin: '4px 0 0 0', fontFamily: 'monospace' }}>{description}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ color: '#6b7280' }}>Đang tải QR Code...</p>
                )}
              </div>

              {/* Status Section */}
              <div className="main-feature-card pentest-card" style={{ alignItems: 'center', textAlign: 'center', padding: 24 }}>
                <h3 className="feature-title">Bước 2: Trạng thái thanh toán</h3>
                
                {/* Status Display */}
                <div style={{ marginBottom: 20 }}>
                  {(() => {
                    const statusDisplay = getStatusDisplay(status);
                    return (
                      <div style={{ 
                        background: status === 'completed' ? '#d1fae5' : 
                                   status === 'cancelled' || status === 'failed' ? '#fee2e2' : 
                                   '#fef3c7',
                        border: `2px solid ${statusDisplay.color}`,
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 12
                      }}>
                        <p style={{ 
                          fontSize: 20, 
                          fontWeight: 700, 
                          color: statusDisplay.color,
                          margin: 0
                        }}>
                          {status === 'completed' && '✓ '}
                          {status === 'cancelled' && '⚠ '}
                          {status === 'failed' && '✗ '}
                          {statusDisplay.text}
                        </p>
                        {status === 'pending' && (
                          <p style={{ fontSize: 14, color: '#92400e', marginTop: 8, margin: 0 }}>
                            Đang chờ thanh toán... Hệ thống sẽ tự động cập nhật khi thanh toán thành công
                          </p>
                        )}
                        {status === 'completed' && (
                          <p style={{ fontSize: 14, color: '#065f46', marginTop: 8, margin: 0 }}>
                            Hệ thống đã tự động cập nhật trạng thái thanh toán của bạn.
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Manual Check Button (chỉ hiển thị khi pending) */}
                {status === 'pending' && orderCode && (
                  <button 
                    className="feature-btn ai-btn" 
                    style={{ height: 48, fontSize: 16, padding: '0 22px', marginBottom: 16, width: '100%' }}
                    onClick={async () => {
                      try {
                        setChecking(true);
                        const res = await paymentService.getPaymentStatus(orderCode);
                        if (res?.success && res.data) {
                          const paymentStatus = res.data.status.toLowerCase() as PaymentStatus;
                          setStatus(paymentStatus);
                          
                          if (paymentStatus === 'completed' && paymentUid) {
                            // Tự động mở invoice
                            try {
                              const invoiceUrl = `${API_BASE_URL || window.location.origin}/api/payment/invoice/${encodeURIComponent(paymentUid)}`;
                              window.open(invoiceUrl, '_blank'); 
                            } catch (e) {
                              console.error('Error opening invoice:', e);
                            }
                          }
                        }
                      } catch (e) {
                        if (process.env.NODE_ENV === 'development') {
                          console.error('Error checking payment status:', e);
                        }
                      } finally {
                        setChecking(false);
                      }
                    }}
                    disabled={checking}
                  >
                    {checking ? '⏳ Đang kiểm tra...' : '✅ Tôi đã thanh toán - Kiểm tra ngay'}
                  </button>
                )}

                {/* Success Actions */}
                {status === 'completed' && (
                  <div style={{ marginTop: 16, width: '100%' }}>
                    {paymentUid && (
                      <button 
                        className="feature-btn ai-btn" 
                        onClick={() => {
                          try {
                            const invoiceUrl = `${API_BASE_URL || window.location.origin}/api/payment/invoice/${encodeURIComponent(paymentUid)}`;
                            window.open(invoiceUrl, '_blank'); 
                          } catch (e) {
                            console.error('Error opening invoice:', e);
                          }
                        }}
                        style={{ height: 48, fontSize: 16, padding: '0 22px', marginBottom: 12, width: '100%' }}
                      >
                        📄 Xem hóa đơn
                      </button>
                    )}
                    <button 
                      className="feature-btn pentest-btn" 
                      onClick={() => navigate('/student')} 
                      style={{ height: 52, fontSize: 16, padding: '0 24px', width: '100%' }}
                    >
                      🏠 Về trang học viên
                    </button>
                  </div>
                )}

                {/* Cancelled/Failed Actions */}
                {(status === 'cancelled' || status === 'failed') && (
                  <div style={{ marginTop: 16, width: '100%' }}>
                    <button 
                      className="feature-btn pentest-btn" 
                      onClick={() => { 
                        // Reset state để tạo lại payment
                        setPaymentUid(null); 
                        setOrderCode(null); 
                        setCheckoutUrl(null); 
                        setQrCode(null); 
                        setStatus(null);
                        setError(null);
                        setPaymentAmount(null);
                        setPlanName(null);
                        setDescription(null);
                      }} 
                      style={{ height: 52, fontSize: 16, padding: '0 24px', width: '100%' }}
                    >
                      🔄 Tạo lại liên kết thanh toán
                    </button>
                  </div>
                )}

                {/* Cancel Payment Button */}
                {status === 'pending' && (
                  <div style={{ marginTop: 16, width: '100%' }}>
                    <button 
                      className="feature-btn ai-btn" 
                      onClick={() => {
                        if (orderCode) {
                          paymentService.cancelPayment(orderCode, 'User cancelled').then(() => {
                            navigate('/student/pricing');
                          }).catch(() => {
                            navigate('/student/pricing');
                          });
                        } else {
                          navigate('/student/pricing');
                        }
                      }} 
                      style={{ height: 48, fontSize: 16, padding: '0 22px', width: '100%' }}
                    >
                      ← Hủy thanh toán
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StudentCheckoutPage;
