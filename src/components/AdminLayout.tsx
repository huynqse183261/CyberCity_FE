import React, { useState } from 'react';
import { Layout, Menu, Button, Space, Input, Badge, Avatar, Typography, message } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  DollarOutlined,
  BookOutlined,
  ReadOutlined,
  BranchesOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminDashboard.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Handle responsive design
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin'),
    },
    {
      key: 'education',
      icon: <BookOutlined />,
      label: 'Giáo dục',
      children: [
        {
          key: '/admin/courses',
          icon: <BookOutlined />,
          label: 'Khóa học',
          onClick: () => navigate('/admin/courses'),
        },
        {
          key: '/admin/modules',
          icon: <ReadOutlined />,
          label: 'Modules',
          onClick: () => navigate('/admin/modules'),
        },
        {
          key: '/admin/lessons',
          icon: <FileTextOutlined />,
          label: 'Lessons',
          onClick: () => navigate('/admin/lessons'),
        },
        {
          key: '/admin/topics',
          icon: <BranchesOutlined />,
          label: 'Topics',
          onClick: () => navigate('/admin/topics'),
        },
        {
          key: '/admin/subtopics',
          icon: <TagsOutlined />,
          label: 'Subtopics',
          onClick: () => navigate('/admin/subtopics'),
        },
      ],
    },
    {
      key: '/admin/orders',
      icon: <FileTextOutlined />,
      label: 'Đơn hàng',
      onClick: () => navigate('/admin/orders'),
    },
    {
      key: '/admin/invoices',
      icon: <FileTextOutlined />,
      label: 'Hóa đơn',
      onClick: () => navigate('/admin/invoices'),
    },
    {
      key: '/admin/pricing',
      icon: <DollarOutlined />,
      label: 'Định giá',
      onClick: () => navigate('/admin/pricing'),
    },
    {
      key: '/admin/messages',
      icon: <MailOutlined />,
      label: 'Hộp thư',
      onClick: () => navigate('/admin/messages'),
    },
    {
      key: '/admin/team',
      icon: <UserOutlined />,
      label: 'Đội ngũ',
      onClick: () => navigate('/admin/team'),
    },
  ];

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

  return (
    <Layout className="admin-dashboard">
      {/* Mobile backdrop */}
      {isMobile && !collapsed && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 99,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
      
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        theme="light" 
        className={`admin-sider ${isMobile && !collapsed ? 'mobile-visible' : ''}`}
        width={200}
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="sidebar-logo">
          <Typography.Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'AP' : 'AdminPage'}
          </Typography.Title>
        </div>
        
        <div className="sidebar-menu-container">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: 'none', background: 'transparent' }}
          />
        </div>
        
        <div className="sidebar-footer">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            style={{ width: '100%' }}
            onClick={handleLogout}
          >
            {!collapsed && 'Đăng xuất'}
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header 
          className={`admin-header ${collapsed ? 'collapsed' : ''}`}
          style={{ 
            padding: '0 24px', 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Space size="large">
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Space>
              <Avatar src={user?.avatar || "https://api.dicebear.com/7.x/miniavs/svg?seed=admin"} />
              <div>
                <div style={{ fontWeight: 500 }}>{user?.fullName || 'Admin'}</div>
                <Text type="secondary" style={{ fontSize: '12px' }}>{user?.role || 'Admin'}</Text>
              </div>
            </Space>
          </Space>
        </Header>

        <Content className={`admin-content ${collapsed ? 'collapsed' : ''}`}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
