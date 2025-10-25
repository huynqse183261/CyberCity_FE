import React from 'react';
import { Layout, Menu, Avatar, Input, Badge, Dropdown, message } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Sider, Content, Header } = Layout;

const sidebarMenu = [
  { key: '/student', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/student/courses', icon: <BookOutlined />, label: 'Khóa học của tôi' },
  { key: '/student/messages', icon: <MessageOutlined />, label: 'Hộp thư tin nhắn' },
  { key: '/student/settings', icon: <SettingOutlined />, label: 'Cài đặt' },
];

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const pathname = window.location.pathname;
  const avatarSrc = user?.image;

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Có lỗi xảy ra khi đăng xuất!');
    }
  };

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', label: 'Thông tin cá nhân' },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={280} style={{ background: 'linear-gradient(180deg, #27ae60 0%, #229954 100%)', color: 'white' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>🎓 EduTech System</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {avatarSrc ? (
              <Avatar 
                style={{ background: 'linear-gradient(45deg, #2ecc71, #27ae60)', width: 50, height: 50 }}
                src={avatarSrc}
              />
            ) : (
              <Avatar 
                style={{ background: 'linear-gradient(45deg, #2ecc71, #27ae60)', width: 50, height: 50 }}
              >
                {user?.fullName?.charAt(0) || 'S'}
              </Avatar>
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{user?.fullName || 'Student'}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{user?.email}</div>
            </div>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={sidebarMenu.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(item.key),
          }))}
          style={{ background: 'transparent', border: 'none', marginTop: 24 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <div style={{ fontWeight: 600, fontSize: 20 }}>Trang Học sinh</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Input.Search placeholder="Tìm kiếm..." style={{ width: 240 }} />
            <Badge count={3}>
              <BellOutlined style={{ fontSize: 22 }} />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar style={{ background: '#27ae60' }} src={avatarSrc}>
                {user?.fullName?.charAt(0) || 'S'}
              </Avatar>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ padding: 24 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;
