import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { message } from 'antd';
import type { UserDropdownProps } from '../models/LinuxLabTypes';

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = async (action: string) => {
    console.log('Navigating to:', action);
    setIsOpen(false);
    
    if (action === 'logout') {
      if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        try {
          await logout();
          message.success('Đăng xuất thành công!');
          navigate('/login');
        } catch (error) {
          console.error('Logout error:', error);
          message.error('Có lỗi xảy ra khi đăng xuất!');
        }
      }
    }
  };

  return (
    <div className="user-menu-container" ref={dropdownRef}>
      <div 
        className="avatar user-icon" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.avatar}
      </div>
      <span style={{ color: '#b8c5d1' }}>{user.username}</span>
      {isOpen && (
        <div className="user-dropdown">
          <div onClick={() => handleMenuItemClick('profile')}>
            Thông tin tài khoản
          </div>
          <div onClick={() => handleMenuItemClick('profile')}>
            Hồ sơ của tôi
          </div>
          <div onClick={() => handleMenuItemClick('friends')}>
            Bạn bè
          </div>
          <div onClick={() => handleMenuItemClick('classes')}>
            Lớp của tôi
          </div>
          <div onClick={() => handleMenuItemClick('payment-history')}>
            Lịch sử thanh toán
          </div>
          <div onClick={() => handleMenuItemClick('payment-settings')}>
            Quản lý thanh toán
          </div>
          <div onClick={() => handleMenuItemClick('logout')}>
            Thoát
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;