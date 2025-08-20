import React from 'react';
import { Layout, Menu, Avatar, Input, Badge, Dropdown } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider, Content, Header } = Layout;

const sidebarMenu = [
  { key: '/teacher', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/teacher/classes', icon: <FileTextOutlined />, label: 'Quản lý lớp học' },
  { key: '/teacher/students', icon: <UserOutlined />, label: 'Danh sách học sinh' },
  { key: '/teacher/assignments', icon: <FileTextOutlined />, label: 'Bài tập & Thông báo' },
  { key: '/teacher/grading', icon: <FileTextOutlined />, label: 'Chấm bài & Đánh giá' },
  { key: '/teacher/reports', icon: <FileTextOutlined />, label: 'Báo cáo & Thống kê' },
  { key: '/teacher/settings', icon: <SettingOutlined />, label: 'Cài đặt' },
];

const TeacherLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', label: 'Thông tin cá nhân' },
        { key: 'logout', label: 'Đăng xuất' },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={280} style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)', color: 'white' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>💻 EduTech System</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Avatar style={{ background: 'linear-gradient(45deg, #3498db, #2980b9)', width: 50, height: 50 }}>TM</Avatar>
            <div>
              <div style={{ fontWeight: 600 }}>Thầy Minh</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Linux & Design</div>
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
          <div style={{ fontWeight: 600, fontSize: 20 }}>Trang Giáo viên</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Input.Search placeholder="Tìm kiếm..." style={{ width: 240 }} />
            <Badge count={5}>
              <BellOutlined style={{ fontSize: 22 }} />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar style={{ background: '#f56a00' }}>TM</Avatar>
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

export default TeacherLayout;