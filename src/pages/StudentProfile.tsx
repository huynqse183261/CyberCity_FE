import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import '../styles/StudentProfile.css';

const StudentProfile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Sử dụng thông tin từ AuthContext thay vì useUserProfile
  const profile = currentUser;
  const loading = false;
  const isUpdating = false;
  const isChangingPassword = false;
  const isUpdatingAvatar = false;

  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    email: profile?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!formData.fullName || !formData.email) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // TODO: Implement API call
    alert('Chức năng cập nhật thông tin đang được phát triển!');
    setIsEditMode(false);
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Mật khẩu mới phải có ít nhất 8 ký tự!');
      return;
    }

    // TODO: Implement API call
    alert('Chức năng đổi mật khẩu đang được phát triển!');
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Handle avatar upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh phải nhỏ hơn 5MB!');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile || !profile?.id) return;

    // TODO: Implement API call
    alert('Chức năng cập nhật avatar đang được phát triển!');
    setShowAvatarModal(false);
    setSelectedFile(null);
    setPreviewUrl('');
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
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="linux-lab-page">
        <ParticleBackground />
        <nav className="navigation">
          <div className="nav-container">
            <LinuxLabNavigation />
            <UserDropdown user={user} />
          </div>
        </nav>
        <div className="error-container">
          <h2>❌ Không thể tải thông tin người dùng</h2>
          <button className="btn-primary" onClick={() => navigate('/student')}>
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Quản trị viên',
      teacher: 'Giáo viên',
      student: 'Học viên'
    };
    return labels[role?.toLowerCase()] || role;
  };

  const getRoleBadgeClass = (role: string) => {
    const classes: Record<string, string> = {
      admin: 'badge-red',
      teacher: 'badge-blue',
      student: 'badge-green'
    };
    return classes[role?.toLowerCase()] || 'badge-default';
  };

  return (
    <div className="linux-lab-page student-profile-page">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      {/* Profile Content */}
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">
            <span className="icon">👤</span>
            Thông tin tài khoản
          </h1>
          <button className="btn-back" onClick={() => navigate('/student')}>
            ← Quay lại
          </button>
        </div>

        {/* Avatar Card */}
        <div className="profile-card avatar-card">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <div className="avatar-large">
                {profile.image ? (
                  <img src={profile.image} alt={profile.fullName} />
                ) : (
                  <span className="avatar-placeholder">
                    {profile.fullName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <button 
                className="avatar-edit-btn"
                onClick={() => setShowAvatarModal(true)}
                title="Đổi avatar"
              >
                📷
              </button>
            </div>
            
            <div className="user-basic-info">
              <h2 className="user-name">{profile.fullName}</h2>
              <p className="user-username">@{profile.username}</p>
              <div className="user-badges">
                <span className={`badge ${getRoleBadgeClass(profile.role)}`}>
                  {getRoleLabel(profile.role)}
                </span>
                <span className={`badge ${profile.status?.toLowerCase() === 'active' ? 'badge-success' : 'badge-gray'}`}>
                  {profile.status?.toLowerCase() === 'active' ? '✓ Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="profile-grid">
          {/* Personal Info Card */}
          <div className="profile-card info-card">
            <div className="card-header">
              <h3>📋 Thông tin cá nhân</h3>
              {!isEditMode ? (
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditMode(true)}
                >
                  ✏️ Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn-cancel"
                    onClick={() => {
                      setIsEditMode(false);
                      setFormData({
                        fullName: profile.fullName || '',
                        email: profile.email || ''
                      });
                    }}
                  >
                    Hủy
                  </button>
                  <button 
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Đang lưu...' : '💾 Lưu'}
                  </button>
                </div>
              )}
            </div>

            <div className="card-content">
              <div className="info-row">
                <label className="info-label">Họ và tên:</label>
                {isEditMode ? (
                  <input
                    type="text"
                    className="info-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                ) : (
                  <span className="info-value">{profile.fullName}</span>
                )}
              </div>

              <div className="info-row">
                <label className="info-label">Email:</label>
                {isEditMode ? (
                  <input
                    type="email"
                    className="info-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <span className="info-value">{profile.email}</span>
                )}
              </div>

              <div className="info-row">
                <label className="info-label">Username:</label>
                <span className="info-value">{profile.username}</span>
              </div>

              <div className="info-row">
                <label className="info-label">ID:</label>
                <span className="info-value code">{profile.id || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Account Info Card */}
          <div className="profile-card info-card">
            <div className="card-header">
              <h3>🔐 Thông tin tài khoản</h3>
            </div>

            <div className="card-content">
              <div className="info-row">
                <label className="info-label">Vai trò:</label>
                <span className={`badge ${getRoleBadgeClass(profile.role)}`}>
                  {getRoleLabel(profile.role)}
                </span>
              </div>

              <div className="info-row">
                <label className="info-label">Trạng thái:</label>
                <span className={`badge ${profile.status?.toLowerCase() === 'active' ? 'badge-success' : 'badge-gray'}`}>
                  {profile.status?.toLowerCase() === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>

              <div className="info-row">
                <label className="info-label">Ngày tạo:</label>
                <span className="info-value">
                  {new Date().toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="info-row">
                <button 
                  className="btn-password"
                  onClick={() => setShowPasswordModal(true)}
                >
                  🔒 Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="profile-card stats-card">
          <h3 className="card-title">📊 Thống kê hoạt động</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🎓</div>
              <div className="stat-info">
                <div className="stat-value">0</div>
                <div className="stat-label">Khóa học đã tham gia</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🧪</div>
              <div className="stat-info">
                <div className="stat-value">0</div>
                <div className="stat-label">Labs đã hoàn thành</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <div className="stat-value">0</div>
                <div className="stat-label">Chứng chỉ đã nhận</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <div className="stat-value">0</div>
                <div className="stat-label">Điểm tích lũy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔒 Đổi mật khẩu</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                />
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div className="password-requirements">
                <p>Yêu cầu mật khẩu:</p>
                <ul>
                  <li className={passwordData.newPassword.length >= 8 ? 'valid' : ''}>
                    ✓ Ít nhất 8 ký tự
                  </li>
                  <li className={/[A-Z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                    ✓ Có chữ hoa
                  </li>
                  <li className={/[a-z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                    ✓ Có chữ thường
                  </li>
                  <li className={/\d/.test(passwordData.newPassword) ? 'valid' : ''}>
                    ✓ Có số
                  </li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn-primary"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📷 Cập nhật Avatar</h3>
              <button className="modal-close" onClick={() => setShowAvatarModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body avatar-upload-body">
              {previewUrl && (
                <div className="avatar-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}

              <div className="upload-area">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-upload" className="upload-label">
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">
                    {selectedFile ? selectedFile.name : 'Chọn ảnh'}
                  </div>
                  <div className="upload-hint">
                    JPG, PNG, GIF (Tối đa 5MB)
                  </div>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowAvatarModal(false);
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
              >
                Hủy
              </button>
              <button 
                className="btn-primary"
                onClick={handleUploadAvatar}
                disabled={!selectedFile || isUpdatingAvatar}
              >
                {isUpdatingAvatar ? 'Đang tải lên...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;

