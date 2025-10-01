import React from 'react';
import '../styles/AdminDashboard.css';
import AdminLayout from '../components/AdminLayout';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Avatar,
  Tag,
  Space,
  Typography,
  Spin,
  Alert,
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { useDashboardStats, useSalesData, useRecentOrders } from '../hooks/DashboardHooks';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  // Fetch data using React Query hooks
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: salesData, isLoading: salesLoading, error: salesError } = useSalesData();
  const { data: recentOrders, isLoading: ordersLoading, error: ordersError } = useRecentOrders();

  // Table columns configuration
  const tableColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = '';
        switch (status) {
          case 'completed':
            color = 'green';
            text = 'Hoàn thành';
            break;
          case 'processing':
            color = 'blue';
            text = 'Đang xử lý';
            break;
          case 'pending':
            color = 'orange';
            text = 'Chờ xử lý';
            break;
          default:
            text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  // Chart configuration
  const chartConfig = {
    data: salesData || [],
    xField: 'month',
    yField: 'value',
    smooth: true,
    color: '#1890ff',
    area: {
      style: {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        fillOpacity: 0.3,
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#1890ff',
        lineWidth: 2,
      },
    },
  };

  // Stats data with real API data
  const statsData = React.useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        title: 'Tổng số người dùng',
        value: stats.totalUsers,
        precision: 0,
        valueStyle: { color: '#3f8600' },
        prefix: <ArrowUpOutlined />,
        suffix: '8.5% Tăng so với hôm qua',
        icon: <UserOutlined />,
        color: '#e6f7ff',
      },
      {
        title: 'Tổng số đơn',
        value: stats.totalOrders,
        precision: 0,
        valueStyle: { color: '#3f8600' },
        prefix: <ArrowUpOutlined />,
        suffix: '1.3% Tăng so với tuần trước',
        icon: <ShoppingOutlined />,
        color: '#f6ffed',
      },
      {
        title: 'Tổng doanh số',
        value: stats.totalRevenue,
        precision: 0,
        valueStyle: { color: '#cf1322' },
        prefix: <ArrowDownOutlined />,
        suffix: '4.3% Thấp so với tuần trước',
        icon: <FileTextOutlined />,
        color: '#fff2e8',
      },
      {
        title: 'Tổng số đang chờ xử lý',
        value: stats.pendingOrders,
        precision: 0,
        valueStyle: { color: '#3f8600' },
        prefix: <ArrowUpOutlined />,
        suffix: '1.8% Tăng so với tuần trước',
        icon: <DashboardOutlined />,
        color: '#fff0f6',
      },
    ];
  }, [stats]);

  // Error handling
  if (statsError || salesError || ordersError) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px' }}>
          <Alert
            message="Lỗi tải dữ liệu"
            description="Không thể tải dữ liệu dashboard. Vui lòng thử lại sau."
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Dashboard</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statsLoading ? (
            <Col span={24}>
              <Spin size="large" />
            </Col>
          ) : (
            statsData.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="stats-card">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      className="stats-icon"
                      style={{
                        background: stat.color,
                        marginRight: '16px',
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        precision={stat.precision}
                        valueStyle={stat.valueStyle}
                        prefix={stat.prefix}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {stat.suffix}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Charts and Tables */}
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Card title="Chi tiết bán hàng" style={{ marginBottom: 16 }}>
              {salesLoading ? (
                <Spin size="large" />
              ) : (
                <Line {...chartConfig} height={300} />
              )}
            </Card>
            
            <Card title="Đơn hàng gần đây">
              <Table
                columns={tableColumns}
                dataSource={recentOrders}
                pagination={{ pageSize: 5 }}
                size="small"
                loading={ordersLoading}
              />
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card title="Hoạt động gần đây" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                    <Avatar size="small" style={{ marginRight: 12 }}>
                      {item}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px' }}>Người dùng {item} đã tạo đơn hàng mới</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item} phút trước
                      </Text>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>

            <Card title="Thống kê nhanh">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Đơn hàng hôm nay</Text>
                  <Text strong>156</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Doanh thu hôm nay</Text>
                  <Text strong>50,000,000 VNĐ</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Người dùng mới</Text>
                  <Text strong>{statsLoading ? '...' : (stats?.totalUsers || 0)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Sản phẩm bán chạy</Text>
                  <Text strong>Laptop Gaming</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
