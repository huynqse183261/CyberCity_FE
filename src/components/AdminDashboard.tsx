import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button, Table, Badge } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  SettingOutlined,
  TeamOutlined,
  LineChartOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - thực tế sẽ lấy từ API
  const stats = [
    {
      title: 'Tổng số Users',
      value: 1234,
      prefix: <UserOutlined />,
      suffix: 'users'
    },
    {
      title: 'Khóa học',
      value: 45,
      prefix: <BookOutlined />,
      suffix: 'courses'
    },
    {
      title: 'Lab Sessions Active',
      value: 89,
      prefix: <SecurityScanOutlined />,
      suffix: 'sessions'
    },
    {
      title: 'Revenue',
      value: 15234,
      prefix: '$',
      suffix: 'USD'
    }
  ];

  const recentActivities = [
    {
      key: '1',
      user: 'john.doe@example.com',
      action: 'Created new Linux Lab session',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      key: '2', 
      user: 'jane.smith@example.com',
      action: 'Completed Penetration Testing course',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      key: '3',
      user: 'mike.wilson@example.com',
      action: 'Failed login attempt',
      time: '1 hour ago',
      status: 'error'
    }
  ];

  const activityColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'success' ? 'success' : 'error'} 
          text={status} 
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          🛡️ Admin Dashboard
        </Title>
        <Paragraph>
          Xin chào <strong>{user?.fullName}</strong>! Quản lý toàn bộ hệ thống CyberLearn VN.
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Card 
        title="Quick Actions" 
        style={{ marginBottom: '24px' }}
        extra={<Button type="link">View All</Button>}
      >
        <Space wrap>
          <Button type="primary" icon={<UserOutlined />}>
            Manage Users
          </Button>
          <Button icon={<BookOutlined />}>
            Manage Courses
          </Button>
          <Button icon={<SecurityScanOutlined />}>
            Monitor Labs
          </Button>
          <Button icon={<TeamOutlined />}>
            View Reports
          </Button>
          <Button icon={<LineChartOutlined />}>
            Analytics
          </Button>
          <Button icon={<SettingOutlined />}>
            System Settings
          </Button>
        </Space>
      </Card>

      {/* Recent Activities */}
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Recent Activities">
            <Table 
              dataSource={recentActivities} 
              columns={activityColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="System Status" style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Server Status</span>
                <Badge status="success" text="Online" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Database</span>
                <Badge status="success" text="Connected" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Lab Environments</span>
                <Badge status="processing" text="Running" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>AI Assistant</span>
                <Badge status="success" text="Active" />
              </div>
            </Space>
          </Card>

          <Card title="Performance">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic title="CPU Usage" value={45} suffix="%" />
              <Statistic title="Memory Usage" value={67} suffix="%" />
              <Statistic title="Storage Usage" value={23} suffix="%" />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;