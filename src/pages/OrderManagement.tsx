import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import type { Order } from '../models/OrderTypes';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  DatePicker,
  Descriptions,
  Drawer,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PrinterOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  // Sample orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      key: '1',
      id: 'ORD001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      customerPhone: '0123456789',
      products: [
        { name: 'Laptop Gaming ASUS ROG', quantity: 1, price: 25000000 },
        { name: 'Mouse Gaming', quantity: 2, price: 500000 },
      ],
      totalAmount: 26000000,
      status: 'processing',
      paymentStatus: 'paid',
      orderDate: '2024-01-15',
      shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
      notes: 'Giao hàng trong giờ hành chính',
    },
    {
      key: '2',
      id: 'ORD002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      customerPhone: '0987654321',
      products: [
        { name: 'iPhone 15 Pro Max', quantity: 1, price: 35000000 },
      ],
      totalAmount: 35000000,
      status: 'pending',
      paymentStatus: 'pending',
      orderDate: '2024-01-14',
      shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
    },
    {
      key: '3',
      id: 'ORD003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      customerPhone: '0369852147',
      products: [
        { name: 'MacBook Air M2', quantity: 1, price: 28000000 },
        { name: 'Ốp lưng MacBook', quantity: 1, price: 200000 },
      ],
      totalAmount: 28200000,
      status: 'completed',
      paymentStatus: 'paid',
      orderDate: '2024-01-13',
      shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
    },
    {
      key: '4',
      id: 'ORD004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      customerPhone: '0741852963',
      products: [
        { name: 'Tai nghe không dây', quantity: 2, price: 2000000 },
      ],
      totalAmount: 4000000,
      status: 'shipping',
      paymentStatus: 'paid',
      orderDate: '2024-01-12',
      shippingAddress: '321 Đường GHI, Quận 4, TP.HCM',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'shipping': return 'purple';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'paid': return 'green';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      default: return status;
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      filteredValue: [searchText],
      onFilter: (value: any, record: Order) =>
        record.customerName.toLowerCase().includes(value.toLowerCase()) ||
        record.customerEmail.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Sản phẩm',
      key: 'products',
      render: (_, record: Order) => (
        <div>
          {record.products.slice(0, 2).map((product, index) => (
            <div key={index} style={{ fontSize: '12px' }}>
              {product.name} x{product.quantity}
            </div>
          ))}
          {record.products.length > 2 && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              +{record.products.length - 2} sản phẩm khác
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')} VNĐ`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Đang xử lý', value: 'processing' },
        { text: 'Đang giao', value: 'shipping' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value: any, record: Order) => record.status === value,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      filters: [
        { text: 'Chờ thanh toán', value: 'pending' },
        { text: 'Đã thanh toán', value: 'paid' },
        { text: 'Thất bại', value: 'failed' },
      ],
      onFilter: (value: any, record: Order) => record.paymentStatus === value,
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>
          {getPaymentStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record: Order) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
          >
            Xem
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditOrder(record)}
          >
            Sửa
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<PrinterOutlined />}
            onClick={() => handlePrintOrder(record)}
          >
            In
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDrawerVisible(true);
  };

  const handleEditOrder = (order: Order) => {
    form.setFieldsValue(order);
    // Open edit modal logic here
    message.info('Chức năng chỉnh sửa đang được phát triển');
  };

  const handlePrintOrder = (order: Order) => {
    message.info(`In hóa đơn ${order.id}`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as Order['status'] }
        : order
    ));
    message.success(`Cập nhật trạng thái đơn hàng ${orderId} thành công!`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2>Quản lý đơn hàng</h2>
        </div>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={stats.total}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Chờ xử lý"
                value={stats.pending}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Hoàn thành"
                value={stats.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={stats.totalRevenue}
                formatter={(value) => `${Number(value).toLocaleString('vi-VN')} VNĐ`}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Controls */}
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Space size="middle">
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc mã đơn..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Select
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  style={{ width: 150 }}
                >
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="processing">Đang xử lý</Option>
                  <Option value="shipping">Đang giao</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
                <Select
                  value={selectedPaymentStatus}
                  onChange={setSelectedPaymentStatus}
                  style={{ width: 150 }}
                >
                  <Option value="all">Tất cả thanh toán</Option>
                  <Option value="pending">Chờ thanh toán</Option>
                  <Option value="paid">Đã thanh toán</Option>
                  <Option value="failed">Thất bại</Option>
                </Select>
                <RangePicker />
              </Space>
            </Col>
            <Col>
              <Button
                type="default"
                icon={<ExportOutlined />}
              >
                Xuất Excel
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Orders Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            pagination={{
              total: filteredOrders.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Order Detail Drawer */}
        <Drawer
          title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
          placement="right"
          onClose={() => setIsDetailDrawerVisible(false)}
          open={isDetailDrawerVisible}
          width={600}
        >
          {selectedOrder && (
            <div>
              <Descriptions title="Thông tin khách hàng" bordered column={1}>
                <Descriptions.Item label="Tên khách hàng">{selectedOrder.customerName}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedOrder.customerEmail}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{selectedOrder.customerPhone}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ giao hàng">{selectedOrder.shippingAddress}</Descriptions.Item>
              </Descriptions>

              <Descriptions title="Thông tin đơn hàng" bordered column={1} style={{ marginTop: 24 }}>
                <Descriptions.Item label="Mã đơn hàng">{selectedOrder.id}</Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">{selectedOrder.orderDate}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thanh toán">
                  <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                    {getPaymentStatusText(selectedOrder.paymentStatus)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú">{selectedOrder.notes || 'Không có'}</Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 24 }}>
                <h4>Sản phẩm đã đặt:</h4>
                <Table
                  size="small"
                  columns={[
                    { title: 'Sản phẩm', dataIndex: 'name', key: 'name' },
                    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
                    { 
                      title: 'Đơn giá', 
                      dataIndex: 'price', 
                      key: 'price',
                      render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`
                    },
                    { 
                      title: 'Thành tiền', 
                      key: 'total',
                      render: (_, record: any) => `${(record.price * record.quantity).toLocaleString('vi-VN')} VNĐ`
                    },
                  ]}
                  dataSource={selectedOrder.products.map((product, index) => ({ ...product, key: index }))}
                  pagination={false}
                />
                <div style={{ textAlign: 'right', marginTop: 16, fontSize: '16px', fontWeight: 'bold' }}>
                  Tổng cộng: {selectedOrder.totalAmount.toLocaleString('vi-VN')} VNĐ
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <h4>Cập nhật trạng thái:</h4>
                <Space>
                  <Button 
                    type="primary"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={selectedOrder.status !== 'pending'}
                  >
                    Xác nhận đơn
                  </Button>
                  <Button 
                    type="primary"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipping')}
                    disabled={selectedOrder.status !== 'processing'}
                  >
                    Giao hàng
                  </Button>
                  <Button 
                    type="primary"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'completed')}
                    disabled={selectedOrder.status !== 'shipping'}
                  >
                    Hoàn thành
                  </Button>
                  <Button 
                    danger
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                    disabled={selectedOrder.status === 'completed' || selectedOrder.status === 'cancelled'}
                  >
                    Hủy đơn
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;
