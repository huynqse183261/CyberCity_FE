import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import '../styles/StudentPaymentHistory.css';

// Mock data - sẽ được thay thế bằng API thực
const mockPayments = [
  {
    uid: '1',
    order_id: 'ORD-2024-001',
    amount: 500000,
    currency: 'VND',
    payment_method: 'bank_transfer',
    status: 'completed',
    description: 'Khóa học Linux cơ bản',
    transaction_id: 'TXN-20240115-001',
    created_at: '2024-01-15T10:30:00Z',
    completed_at: '2024-01-15T10:35:00Z'
  },
  {
    uid: '2',
    order_id: 'ORD-2024-002',
    amount: 750000,
    currency: 'VND',
    payment_method: 'credit_card',
    status: 'completed',
    description: 'Khóa học Penetration Testing nâng cao',
    transaction_id: 'TXN-20240110-002',
    created_at: '2024-01-10T14:20:00Z',
    completed_at: '2024-01-10T14:22:00Z'
  },
  {
    uid: '3',
    order_id: 'ORD-2024-003',
    amount: 300000,
    currency: 'VND',
    payment_method: 'e_wallet',
    status: 'pending',
    description: 'Lab Environment - 30 ngày',
    transaction_id: 'TXN-20240120-003',
    created_at: '2024-01-20T09:15:00Z',
    completed_at: null
  },
  {
    uid: '4',
    order_id: 'ORD-2023-123',
    amount: 1000000,
    currency: 'VND',
    payment_method: 'bank_transfer',
    status: 'completed',
    description: 'Gói Premium - 12 tháng',
    transaction_id: 'TXN-20231215-123',
    created_at: '2023-12-15T16:45:00Z',
    completed_at: '2023-12-15T16:50:00Z'
  },
  {
    uid: '5',
    order_id: 'ORD-2024-004',
    amount: 250000,
    currency: 'VND',
    payment_method: 'credit_card',
    status: 'failed',
    description: 'Chứng chỉ Linux Professional',
    transaction_id: 'TXN-20240118-004',
    created_at: '2024-01-18T11:30:00Z',
    completed_at: null
  }
];

const StudentPaymentHistory: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [selectedPayment, setSelectedPayment] = useState<typeof mockPayments[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter payments
  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = 
      payment.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: mockPayments.length,
    completed: mockPayments.filter(p => p.status === 'completed').length,
    pending: mockPayments.filter(p => p.status === 'pending').length,
    failed: mockPayments.filter(p => p.status === 'failed').length,
    totalAmount: mockPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Thành công', class: 'badge-success', icon: '✓' },
      pending: { label: 'Đang xử lý', class: 'badge-pending', icon: '⏳' },
      failed: { label: 'Thất bại', class: 'badge-failed', icon: '✕' }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      bank_transfer: 'Chuyển khoản ngân hàng',
      credit_card: 'Thẻ tín dụng',
      e_wallet: 'Ví điện tử',
      cash: 'Tiền mặt'
    };
    return methods[method] || method;
  };

  const handleViewDetail = (payment: typeof mockPayments[0]) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  return (
    <div className="linux-lab-page payment-history-page">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      {/* Payment History Content */}
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <h1 className="payment-title">
            <span className="icon">💳</span>
            Lịch sử thanh toán
          </h1>
          <button className="btn-back" onClick={() => navigate('/student')}>
            ← Quay lại
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng giao dịch</div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Thành công</div>
            </div>
          </div>
          
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Đang xử lý</div>
            </div>
          </div>
          
          <div className="stat-card failed">
            <div className="stat-icon">✕</div>
            <div className="stat-content">
              <div className="stat-value">{stats.failed}</div>
              <div className="stat-label">Thất bại</div>
            </div>
          </div>

          <div className="stat-card total">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(stats.totalAmount)}</div>
              <div className="stat-label">Tổng chi tiêu</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="payment-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, mô tả, mã giao dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Tất cả
            </button>
            <button
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              ✓ Thành công
            </button>
            <button
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              ⏳ Đang xử lý
            </button>
            <button
              className={`filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('failed')}
            >
              ✕ Thất bại
            </button>
          </div>
        </div>

        {/* Payment Table */}
        <div className="payment-table-container">
          {filteredPayments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Không tìm thấy giao dịch</h3>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          ) : (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Mô tả</th>
                  <th>Phương thức</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const statusBadge = getStatusBadge(payment.status);
                  return (
                    <tr key={payment.uid}>
                      <td>
                        <span className="order-id">{payment.order_id}</span>
                      </td>
                      <td>
                        <div className="payment-description">
                          {payment.description}
                        </div>
                      </td>
                      <td>
                        <span className="payment-method">
                          {getPaymentMethodLabel(payment.payment_method)}
                        </span>
                      </td>
                      <td>
                        <span className="payment-amount">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${statusBadge.class}`}>
                          {statusBadge.icon} {statusBadge.label}
                        </span>
                      </td>
                      <td>
                        <span className="payment-date">
                          {formatDate(payment.created_at)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-view-detail"
                          onClick={() => handleViewDetail(payment)}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💳 Chi tiết giao dịch</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin đơn hàng</h4>
                <div className="detail-row">
                  <span className="detail-label">Mã đơn hàng:</span>
                  <span className="detail-value">{selectedPayment.order_id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mô tả:</span>
                  <span className="detail-value">{selectedPayment.description}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Số tiền:</span>
                  <span className="detail-value amount">
                    {formatCurrency(selectedPayment.amount)}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Thông tin thanh toán</h4>
                <div className="detail-row">
                  <span className="detail-label">Phương thức:</span>
                  <span className="detail-value">
                    {getPaymentMethodLabel(selectedPayment.payment_method)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Mã giao dịch:</span>
                  <span className="detail-value code">{selectedPayment.transaction_id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className={`status-badge ${getStatusBadge(selectedPayment.status).class}`}>
                    {getStatusBadge(selectedPayment.status).icon}{' '}
                    {getStatusBadge(selectedPayment.status).label}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Thời gian</h4>
                <div className="detail-row">
                  <span className="detail-label">Ngày tạo:</span>
                  <span className="detail-value">{formatDate(selectedPayment.created_at)}</span>
                </div>
                {selectedPayment.completed_at && (
                  <div className="detail-row">
                    <span className="detail-label">Ngày hoàn thành:</span>
                    <span className="detail-value">
                      {formatDate(selectedPayment.completed_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDetailModal(false)}>
                Đóng
              </button>
              {selectedPayment.status === 'completed' && (
                <button className="btn-primary">
                  📄 Tải hóa đơn
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPaymentHistory;

