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

const { Title, Text } = Typography;

// Sample data for statistics
const statsData = [
  {
    title: 'Tổng số người dùng',
    value: 40689,
    precision: 0,
    valueStyle: { color: '#3f8600' },
    prefix: <ArrowUpOutlined />,
    suffix: '8.5% Tăng so với hôm qua',
    icon: <UserOutlined />,
    color: '#e6f7ff',
  },
  {
    title: 'Tổng số đơn',
    value: 10293,
    precision: 0,
    valueStyle: { color: '#3f8600' },
    prefix: <ArrowUpOutlined />,
    suffix: '1.3% Tăng so với tuần trước',
    icon: <ShoppingOutlined />,
    color: '#f6ffed',
  },
  {
    title: 'Tổng doanh số',
    value: 89000,
    precision: 0,
    valueStyle: { color: '#cf1322' },
    prefix: <ArrowDownOutlined />,
    suffix: '4.3% Thấp so với tuần trước',
    icon: <FileTextOutlined />,
    color: '#fff2e8',
  },
  {
    title: 'Tổng số đang chờ xử lý',
    value: 2040,
    precision: 0,
    valueStyle: { color: '#3f8600' },
    prefix: <ArrowUpOutlined />,
    suffix: '1.8% Tăng so với tuần trước',
    icon: <DashboardOutlined />,
    color: '#fff0f6',
  },
];

// Sample data for sales chart
const salesData = [
  { month: 'Jan', value: 20 },
  { month: 'Feb', value: 25 },
  { month: 'Mar', value: 30 },
  { month: 'Apr', value: 35 },
  { month: 'May', value: 45 },
  { month: 'Jun', value: 50 },
  { month: 'Jul', value: 65 },
  { month: 'Aug', value: 55 },
  { month: 'Sep', value: 60 },
  { month: 'Oct', value: 70 },
  { month: 'Nov', value: 75 },
  { month: 'Dec', value: 80 },
];

// Sample data for recent orders table
const recentOrders = [
  {
    key: '1',
    orderId: '#12345',
    customer: 'Nguyễn Văn A',
    product: 'Laptop Gaming',
    amount: 25000000,
    status: 'completed',
    date: '2024-01-15',
  },
  {
    key: '2',
    orderId: '#12346',
    customer: 'Trần Thị B',
    product: 'Điện thoại iPhone',
    amount: 15000000,
    status: 'processing',
    date: '2024-01-14',
  },
  {
    key: '3',
    orderId: '#12347',
    customer: 'Lê Văn C',
    product: 'Máy tính bảng',
    amount: 8000000,
    status: 'pending',
    date: '2024-01-14',
  },
  {
    key: '4',
    orderId: '#12348',
    customer: 'Phạm Thị D',
    product: 'Tai nghe không dây',
    amount: 2000000,
    status: 'completed',
    date: '2024-01-13',
  },
];

const AdminDashboard: React.FC = () => {
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

  const chartConfig = {
    data: salesData,
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

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Dashboard</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statsData.map((stat, index) => (
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
          ))}
        </Row>

        {/* Charts and Tables */}
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Card title="Chi tiết bán hàng" style={{ marginBottom: 16 }}>
              <Line {...chartConfig} height={300} />
            </Card>
            
            <Card title="Đơn hàng gần đây">
              <Table
                columns={tableColumns}
                dataSource={recentOrders}
                pagination={{ pageSize: 5 }}
                size="small"
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
                  <Text strong>23</Text>
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
