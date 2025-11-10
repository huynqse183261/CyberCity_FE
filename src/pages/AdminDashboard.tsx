import React, { useState } from 'react';
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
  List,
  Select,
} from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { 
  useDashboardStats, 
  useSalesData, 
  useRecentOrders, 
  useRecentActivities 
} from '../hooks/DashboardHooks';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  // State for year selection
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Fetch data using React Query hooks
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: salesData, isLoading: salesLoading, error: salesError } = useSalesData(selectedYear);
  const { data: recentOrders, isLoading: ordersLoading, error: ordersError } = useRecentOrders(10);
  const { data: recentActivities, isLoading: activitiesLoading, error: activitiesError } = useRecentActivities(5);

  // Generate year options for the last 5 years and next 2 years
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      years.push({ label: year.toString(), value: year });
    }
    return years;
  };

  // Transform sales data for line chart (12 months)
  const transformSalesDataForChart = (data: any[]) => {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    
    // Create a map for existing data
    const dataMap = new Map();
    data?.forEach(item => {
      dataMap.set(item.month, item.orderCount);
    });
    
    // Generate data for all 12 months
    return monthNames.map((monthName, index) => ({
      month: monthName,
      orderCount: dataMap.get(index + 1) || 0,
    }));
  };

  // Stats data with real API data - PHẢI ĐẶT TRƯỚC ERROR HANDLING
  const statsData = React.useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        title: 'Tổng số người dùng',
        value: stats.totalUsers,
        precision: 0,
        valueStyle: { color: '#3f8600' },
        prefix: <UserOutlined />,
        suffix: 'Người dùng',
        icon: <UserOutlined />,
        color: '#e6f7ff',
      },
      {
        title: 'Tổng số đơn hàng',
        value: stats.totalOrders,
        precision: 0,
        valueStyle: { color: '#3f8600' },
        prefix: <ShoppingOutlined />,
        suffix: 'Đơn hàng',
        icon: <ShoppingOutlined />,
        color: '#f6ffed',
      },
      {
        title: 'Tổng khóa học',
        value: stats.totalCourses,
        precision: 0,
        valueStyle: { color: '#1890ff' },
        prefix: <BookOutlined />,
        suffix: 'Khóa học',
        icon: <BookOutlined />,
        color: '#f0f9ff',
      },
    ];
  }, [stats]);

  // Table columns configuration for recent orders
  const tableColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'planName',
      key: 'planName',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        let color = 'default';
        let text = '';
        switch (status) {
          case 'paid':
            color = 'green';
            text = 'Đã thanh toán';
            break;
          case 'pending':
            color = 'orange';
            text = 'Chờ thanh toán';
            break;
          case 'failed':
            color = 'red';
            text = 'Thất bại';
            break;
          default:
            text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Phê duyệt',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (status: string) => {
        let color = 'default';
        let text = '';
        switch (status) {
          case 'approved':
            color = 'green';
            text = 'Đã phê duyệt';
            break;
          case 'pending':
            color = 'orange';
            text = 'Chờ phê duyệt';
            break;
          case 'rejected':
            color = 'red';
            text = 'Từ chối';
            break;
          default:
            text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
  ];

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
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Thống kê đơn hàng theo tháng</span>
                  <Select
                    value={selectedYear}
                    style={{ width: 120 }}
                    onChange={(value) => setSelectedYear(value)}
                    options={generateYearOptions()}
                    placeholder="Chọn năm"
                  />
                </div>
              }
              style={{ marginBottom: 16 }}
            >
              {salesLoading ? (
                <Spin size="large" />
              ) : (
                <Line 
                  data={transformSalesDataForChart(salesData || [])}
                  xField="month"
                  yField="orderCount"
                  height={300}
                  smooth={true}
                  color="#1890ff"
                  area={{
                    style: {
                      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                      fillOpacity: 0.3,
                    },
                  }}
                  point={{
                    size: 5,
                    shape: 'diamond',
                    style: {
                      fill: 'white',
                      stroke: '#1890ff',
                      lineWidth: 2,
                    },
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fontSize: 12,
                      },
                    },
                  }}
                  yAxis={{
                    label: {
                      style: {
                        fontSize: 12,
                      },
                    },
                    title: {
                      text: 'Số lượng đơn hàng',
                      style: {
                        fontSize: 14,
                        fontWeight: 'bold',
                      },
                    },
                  }}
                  tooltip={{
                    formatter: (datum: any) => {
                      return {
                        name: 'Số đơn hàng',
                        value: `${datum.orderCount} đơn`,
                      };
                    },
                  }}
                  meta={{
                    orderCount: {
                      alias: 'Số lượng đơn hàng',
                    },
                    month: {
                      alias: 'Tháng',
                    },
                  }}
                />
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
              {activitiesLoading ? (
                <Spin />
              ) : activitiesError ? (
                <Alert message="Lỗi tải hoạt động" type="error" />
              ) : (
                <List
                  size="small"
                  dataSource={recentActivities || []}
                  renderItem={(activity) => (
                    <List.Item>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar size="small" style={{ marginRight: 12, backgroundColor: '#1890ff' }}>
                          {activity.type === 'order' ? 'O' : 
                           activity.type === 'user' ? 'U' : 
                           activity.type === 'course' ? 'C' : 'A'}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px' }}>{activity.title}</div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {activity.detail}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            {new Date(activity.when).toLocaleDateString('vi-VN')}
                          </Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Card>

            <Card title="Thống kê nhanh">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tổng đơn hàng</Text>
                  <Text strong>{stats?.totalOrders || 0}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tổng người dùng</Text>
                  <Text strong>{stats?.totalUsers || 0}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tổng khóa học</Text>
                  <Text strong>{stats?.totalCourses || 0}</Text>
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
