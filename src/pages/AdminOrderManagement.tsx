import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
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
  Typography,
  Tooltip,
  Badge,
  Progress,
  Divider,
  List,
  Avatar
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
  DollarOutlined,
  ShoppingCartOutlined,
  ReloadOutlined,
  FilterOutlined,
  DownloadOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  UserOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import '../styles/AdminProductManagement.css';

// Mock data interfaces
interface MockOrderItem {
  uid: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface MockPayment {
  uid: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  transactionId: string;
}

interface MockOrder {
  uid: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  items: MockOrderItem[];
  payments: MockPayment[];
}

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// Mock data
const mockOrders: MockOrder[] = [
  {
    uid: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Nguyễn Văn An',
    customerEmail: 'nguyenvanan@gmail.com',
    customerPhone: '0123456789',
    customerAddress: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    totalAmount: 1500000,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'bank_transfer',
    createdAt: '2024-01-20T09:30:00Z',
    notes: 'Khách hàng yêu cầu giao hàng nhanh',
    items: [
      {
        uid: '1-1',
        productName: 'Khóa học Linux System Administration',
        quantity: 1,
        unitPrice: 1200000,
        totalPrice: 1200000
      },
      {
        uid: '1-2',
        productName: 'Lab Environment - 3 tháng',
        quantity: 1,
        unitPrice: 300000,
        totalPrice: 300000
      }
    ],
    payments: []
  },
  {
    uid: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Trần Thị Bình',
    customerEmail: 'tranthibinh@gmail.com',
    customerPhone: '0987654321',
    customerAddress: '456 Lê Lợi, Quận 3, TP.HCM',
    totalAmount: 2500000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:25:00Z',
    notes: 'Đã hoàn thành',
    items: [
      {
        uid: '2-1',
        productName: 'Khóa học Penetration Testing Advanced',
        quantity: 1,
        unitPrice: 2000000,
        totalPrice: 2000000
      },
      {
        uid: '2-2',
        productName: 'Chứng chỉ Security+',
        quantity: 1,
        unitPrice: 500000,
        totalPrice: 500000
      }
    ],
    payments: [
      {
        uid: 'pay-2-1',
        amount: 2500000,
        paymentMethod: 'credit_card',
        status: 'completed',
        createdAt: '2024-01-18T14:22:00Z',
        transactionId: 'TXN-20240118-002'
      }
    ]
  },
  {
    uid: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Lê Minh Cường',
    customerEmail: 'leminhcuong@gmail.com',
    customerPhone: '0912345678',
    customerAddress: '789 Võ Văn Tần, Quận 10, TP.HCM',
    totalAmount: 800000,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'e_wallet',
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-19T16:50:00Z',
    notes: 'Đang xử lý',
    items: [
      {
        uid: '3-1',
        productName: 'Khóa học Docker & Kubernetes',
        quantity: 1,
        unitPrice: 800000,
        totalPrice: 800000
      }
    ],
    payments: [
      {
        uid: 'pay-3-1',
        amount: 800000,
        paymentMethod: 'e_wallet',
        status: 'completed',
        createdAt: '2024-01-19T16:47:00Z',
        transactionId: 'TXN-20240119-003'
      }
    ]
  },
  {
    uid: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Phạm Thu Hương',
    customerEmail: 'phamthuhuong@gmail.com',
    customerPhone: '0934567890',
    customerAddress: '321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    totalAmount: 3000000,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'bank_transfer',
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
    notes: 'Khách hàng hủy đơn, đã hoàn tiền',
    items: [
      {
        uid: '4-1',
        productName: 'Gói Premium - 12 tháng',
        quantity: 1,
        unitPrice: 3000000,
        totalPrice: 3000000
      }
    ],
    payments: [
      {
        uid: 'pay-4-1',
        amount: 3000000,
        paymentMethod: 'bank_transfer',
        status: 'refunded',
        createdAt: '2024-01-15T10:20:00Z',
        transactionId: 'TXN-20240115-004'
      }
    ]
  },
  {
    uid: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Hoàng Văn Đức',
    customerEmail: 'hoangvanduc@gmail.com',
    customerPhone: '0945678901',
    customerAddress: '654 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    totalAmount: 1800000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-01-17T13:00:00Z',
    updatedAt: '2024-01-17T13:05:00Z',
    items: [
      {
        uid: '5-1',
        productName: 'Khóa học Ethical Hacking',
        quantity: 1,
        unitPrice: 1500000,
        totalPrice: 1500000
      },
      {
        uid: '5-2',
        productName: 'Tools & Lab Access',
        quantity: 1,
        unitPrice: 300000,
        totalPrice: 300000
      }
    ],
    payments: [
      {
        uid: 'pay-5-1',
        amount: 1800000,
        paymentMethod: 'credit_card',
        status: 'completed',
        createdAt: '2024-01-17T13:02:00Z',
        transactionId: 'TXN-20240117-005'
      }
    ]
  },
  {
    uid: '6',
    orderNumber: 'ORD-2024-006',
    customerName: 'Vũ Thị Mai',
    customerEmail: 'vuthimai@gmail.com',
    customerPhone: '0956789012',
    totalAmount: 600000,
    status: 'pending',
    paymentStatus: 'failed',
    paymentMethod: 'credit_card',
    createdAt: '2024-01-21T11:20:00Z',
    notes: 'Thanh toán thất bại, đang chờ khách hàng xử lý',
    items: [
      {
        uid: '6-1',
        productName: 'Khóa học Network Security',
        quantity: 1,
        unitPrice: 600000,
        totalPrice: 600000
      }
    ],
    payments: [
      {
        uid: 'pay-6-1',
        amount: 600000,
        paymentMethod: 'credit_card',
        status: 'failed',
        createdAt: '2024-01-21T11:22:00Z',
        transactionId: 'TXN-20240121-006'
      }
    ]
  }
];

const mockStats = {
  totalOrders: mockOrders.length,
  pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
  completedOrders: mockOrders.filter(o => o.status === 'completed').length,
  cancelledOrders: mockOrders.filter(o => o.status === 'cancelled').length,
  totalRevenue: mockOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
};

const AdminOrderManagement: React.FC = () => {
  // State thay thế cho hooks
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<MockOrder[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<MockOrder[]>(mockOrders);
  const [stats] = useState(mockStats);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');

  // Local state
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<MockOrder | null>(null);
  
  const [form] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [approvalForm] = Form.useForm();

  // Filter function
  const filterOrders = () => {
    let filtered = mockOrders;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Payment status filter
    if (filterPaymentStatus !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === filterPaymentStatus);
    }

    setFilteredOrders(filtered);
  };

  // Effect to filter orders when filters change
  useEffect(() => {
    filterOrders();
  }, [searchText, filterStatus, filterPaymentStatus]);

  // Mock functions to replace API calls
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value || 'all');
  };

  const handlePaymentStatusFilter = (value: string) => {
    setFilterPaymentStatus(value || 'all');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Dữ liệu đã được làm mới!');
    }, 1000);
  };

  const handleUpdateOrder = async (uid: string, data: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.uid === uid ? { ...order, ...data } : order
      );
      setOrders(updatedOrders);
      setLoading(false);
      message.success('Cập nhật đơn hàng thành công!');
    }, 1000);
  };

  const handleDeleteOrder = async (uid: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedOrders = orders.filter(order => order.uid !== uid);
      setOrders(updatedOrders);
      setLoading(false);
      message.success('Xóa đơn hàng thành công!');
    }, 1000);
  };

  const handleApproveOrder = async (uid: string, notes?: string) => {
    setLoading(true);
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.uid === uid ? { ...order, status: 'processing', notes } : order
      );
      setOrders(updatedOrders);
      setLoading(false);
      message.success('Phê duyệt đơn hàng thành công!');
    }, 1000);
  };

  const handleRejectOrder = async (uid: string, notes: string) => {
    setLoading(true);
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.uid === uid ? { ...order, status: 'cancelled', notes } : order
      );
      setOrders(updatedOrders);
      setLoading(false);
      message.success('Từ chối đơn hàng thành công!');
    }, 1000);
  };

  const handleProcessPayment = async (uid: string, paymentData: any) => {
    setLoading(true);
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.uid === uid ? { 
          ...order, 
          paymentStatus: 'paid',
          payments: [...order.payments, {
            uid: `pay-${Date.now()}`,
            amount: paymentData.amount,
            paymentMethod: paymentData.paymentMethod,
            status: 'completed',
            createdAt: new Date().toISOString(),
            transactionId: `TXN-${Date.now()}`
          }]
        } : order
      );
      setOrders(updatedOrders);
      setLoading(false);
      message.success('Xử lý thanh toán thành công!');
    }, 1000);
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'orange',
      processing: 'blue',
      completed: 'green',
      cancelled: 'red',
      refunded: 'purple'
    };
    return statusColors[status] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'orange',
      paid: 'green',
      failed: 'red',
      refunded: 'purple',
      partial: 'blue'
    };
    return statusColors[status] || 'default';
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, React.ReactNode> = {
      'credit_card': <CreditCardOutlined />,
      'bank_transfer': <BankOutlined />,
      'e_wallet': <WalletOutlined />,
      'cash': <DollarOutlined />
    };
    return icons[method] || <DollarOutlined />;
  };

  // Table columns
  const columns: ColumnsType<MockOrder> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 120,
      render: (text: string) => (
        <Text strong style={{ color: '#1890ff' }}>{text}</Text>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 180,
      render: (_, record: MockOrder) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.customerName}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.customerEmail}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Sản phẩm/Dịch vụ',
      key: 'products',
      width: 200,
      render: (_, record: MockOrder) => (
        <div>
          {record.items?.slice(0, 2).map((item, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              <Text>{item.productName}</Text>
              <Text type="secondary"> (x{item.quantity})</Text>
            </div>
          ))}
          {(record.items?.length || 0) > 2 && (
            <Text type="secondary">+{(record.items?.length || 0) - 2} sản phẩm khác</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      align: 'right',
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(amount)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => {
        const statusLabels: Record<string, string> = {
          pending: 'Chờ xử lý',
          processing: 'Đang xử lý',
          completed: 'Hoàn thành',
          cancelled: 'Đã hủy',
          refunded: 'Đã hoàn tiền'
        };
        return (
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {statusLabels[status] || status}
          </Tag>
        );
      },
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 120,
      render: (paymentStatus: string, record: OrderDto) => (
        <Space direction="vertical" size={0}>
          <Tag color={getPaymentStatusColor(paymentStatus)}>
            {getPaymentStatusLabel(paymentStatus)}
          </Tag>
          {record.paymentMethod && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {getPaymentMethodIcon(record.paymentMethod)} {record.paymentMethod}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (date: string) => (
        <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_, record: MockOrder) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewOrder(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Phê duyệt">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleApproveOrderAction(record)}
              />
            </Tooltip>
          )}
          {record.paymentStatus === 'pending' && (
            <Tooltip title="Xử lý thanh toán">
              <Button
                icon={<CreditCardOutlined />}
                size="small"
                onClick={() => handleProcessPaymentAction(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditOrder(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa đơn hàng"
            description="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDeleteOrderAction(record.uid)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Helper functions
  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <ClockCircleOutlined />,
      processing: <InfoCircleOutlined />,
      completed: <CheckCircleOutlined />,
      cancelled: <CloseCircleOutlined />,
      refunded: <DollarOutlined />
    };
    return icons[status];
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thất bại',
      refunded: 'Đã hoàn tiền',
      partial: 'Thanh toán một phần'
    };
    return labels[status] || status;
  };

  // Event handlers
  const handleViewOrder = (order: MockOrder) => {
    setSelectedOrderForAction(order);
    setIsDetailDrawerVisible(true);
  };

  const handleEditOrder = (order: MockOrder) => {
    setSelectedOrderForAction(order);
    form.setFieldsValue({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      status: order.status,
      paymentMethod: order.paymentMethod,
      notes: order.notes
    });
    setIsEditModalVisible(true);
  };

  const handleDeleteOrderAction = (uid: string) => {
    handleDeleteOrder(uid);
  };

  const handleApproveOrderAction = (order: MockOrder) => {
    setSelectedOrderForAction(order);
    setActionType('approve');
    setIsApprovalModalVisible(true);
  };

  const handleRejectOrderAction = (order: MockOrder) => {
    setSelectedOrderForAction(order);
    setActionType('reject');
    setIsApprovalModalVisible(true);
  };

  const handleProcessPaymentAction = (order: MockOrder) => {
    setSelectedOrderForAction(order);
    paymentForm.setFieldsValue({
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod || 'credit_card'
    });
    setIsPaymentModalVisible(true);
  };

  const handleSubmitEdit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedOrderForAction) {
        await handleUpdateOrder(selectedOrderForAction.uid, values);
        setIsEditModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error('Edit order validation failed:', error);
    }
  };

  const handleSubmitPayment = async () => {
    try {
      const values = await paymentForm.validateFields();
      if (selectedOrderForAction) {
        await handleProcessPayment(selectedOrderForAction.uid, values);
        setIsPaymentModalVisible(false);
        paymentForm.resetFields();
      }
    } catch (error) {
      console.error('Payment processing validation failed:', error);
    }
  };

  const handleSubmitApproval = async () => {
    try {
      const values = await approvalForm.validateFields();
      if (selectedOrderForAction) {
        if (actionType === 'approve') {
          await handleApproveOrder(selectedOrderForAction.uid, values.notes);
        } else {
          await handleRejectOrder(selectedOrderForAction.uid, values.notes);
        }
        setIsApprovalModalVisible(false);
        approvalForm.resetFields();
      }
    } catch (error) {
      console.error('Approval validation failed:', error);
    }
  };

  const handleExport = (format: 'excel' | 'csv' | 'pdf' = 'excel') => {
    message.success(`Xuất file ${format.toUpperCase()} thành công!`);
    // Implement export logic here
  };

  const handleDateRangeChange = (dates: any, dateStrings: string[]) => {
    // Implement date range filtering
    message.info('Lọc theo ngày tháng sẽ được triển khai trong phiên bản tiếp theo');
  };

  return (
    <AdminLayout>
      <div className="admin-page-container">
        {/* Header */}
        <div className="admin-page-header">
          <Title level={2}>
            <ShoppingCartOutlined /> Quản lý đơn hàng
          </Title>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng đơn hàng"
                  value={stats.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Chờ xử lý"
                  value={stats.pendingOrders}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Hoàn thành"
                  value={stats.completedOrders}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Doanh thu"
                  value={stats.totalRevenue}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  formatter={(value) => 
                    new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      maximumFractionDigits: 0
                    }).format(Number(value))
                  }
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Filters */}
        <Card className="admin-filter-card">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input.Search
                placeholder="Tìm kiếm đơn hàng..."
                allowClear
                value={searchText}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Trạng thái"
                allowClear
                style={{ width: '100%' }}
                value={filterStatus !== 'all' ? filterStatus : undefined}
                onChange={handleStatusFilter}
              >
                <Option value="pending">Chờ xử lý</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Thanh toán"
                allowClear
                style={{ width: '100%' }}
                value={filterPaymentStatus !== 'all' ? filterPaymentStatus : undefined}
                onChange={handlePaymentStatusFilter}
              >
                <Option value="pending">Chờ thanh toán</Option>
                <Option value="paid">Đã thanh toán</Option>
                <Option value="failed">Thất bại</Option>
                <Option value="refunded">Đã hoàn tiền</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                placeholder={['Từ ngày', 'Đến ngày']}
                format="DD/MM/YYYY"
              />
            </Col>
            <Col xs={24} sm={24} md={4}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Làm mới
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  onClick={() => handleExport('excel')}
                >
                  Xuất Excel
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card className="admin-table-card">
            <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="uid"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Hiển thị ${range[0]}-${range[1]} của ${total} đơn hàng`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: 1400 }}
          />
        </Card>

        {/* Detail Drawer */}
        <Drawer
          title={`Chi tiết đơn hàng: ${selectedOrderForAction?.orderNumber}`}
          placement="right"
          width={600}
          onClose={() => setIsDetailDrawerVisible(false)}
          open={isDetailDrawerVisible}
        >
          {selectedOrderForAction && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Descriptions title="Thông tin đơn hàng" bordered column={1}>
                <Descriptions.Item label="Mã đơn hàng">
                  {selectedOrderForAction.orderNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {selectedOrderForAction.customerName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedOrderForAction.customerEmail}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedOrderForAction.customerPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={getStatusColor(selectedOrderForAction.status)}>
                    {selectedOrderForAction.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  <Text strong style={{ color: '#52c41a' }}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(selectedOrderForAction.totalAmount)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left">Sản phẩm/Dịch vụ</Divider>
              <List
                itemLayout="horizontal"
                dataSource={selectedOrderForAction.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.productName}
                      description={`Số lượng: ${item.quantity} × ${new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.unitPrice)}`}
                    />
                    <Text strong>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.totalPrice)}
                    </Text>
                  </List.Item>
                )}
              />

              {selectedOrderForAction.payments && selectedOrderForAction.payments.length > 0 && (
                <>
                  <Divider orientation="left">Lịch sử thanh toán</Divider>
                  <List
                    itemLayout="horizontal"
                    dataSource={selectedOrderForAction.payments}
                    renderItem={(payment: MockPayment) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={getPaymentMethodIcon(payment.paymentMethod)} />}
                          title={
                            <Space>
                              <Text strong>{payment.paymentMethod}</Text>
                              <Tag color={getPaymentStatusColor(payment.status)}>
                                {payment.status}
                              </Tag>
                            </Space>
                          }
                          description={dayjs(payment.createdAt).format('DD/MM/YYYY HH:mm')}
                        />
                        <Text strong>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(payment.amount)}
                        </Text>
                      </List.Item>
                    )}
                  />
                </>
              )}
            </Space>
          )}
        </Drawer>

        {/* Edit Order Modal */}
        <Modal
          title="Chỉnh sửa đơn hàng"
          open={isEditModalVisible}
          onOk={handleSubmitEdit}
          onCancel={() => setIsEditModalVisible(false)}
          width={600}
          okText="Cập nhật"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên khách hàng" name="customerName">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="customerEmail">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Số điện thoại" name="customerPhone">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Trạng thái" name="status">
                  <Select>
                    <Option value="pending">Chờ xử lý</Option>
                    <Option value="processing">Đang xử lý</Option>
                    <Option value="completed">Hoàn thành</Option>
                    <Option value="cancelled">Đã hủy</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Phương thức thanh toán" name="paymentMethod">
              <Select>
                <Option value="credit_card">Thẻ tín dụng</Option>
                <Option value="bank_transfer">Chuyển khoản</Option>
                <Option value="e_wallet">Ví điện tử</Option>
                <Option value="cash">Tiền mặt</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ghi chú" name="notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Payment Processing Modal */}
        <Modal
          title="Xử lý thanh toán"
          open={isPaymentModalVisible}
          onOk={handleSubmitPayment}
          onCancel={() => setIsPaymentModalVisible(false)}
          okText="Xử lý"
          cancelText="Hủy"
        >
          <Form form={paymentForm} layout="vertical">
            <Form.Item 
              label="Số tiền" 
              name="amount" 
              rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
            >
              <Input 
                type="number" 
                prefix={<DollarOutlined />}
                suffix="VND"
              />
            </Form.Item>
            <Form.Item 
              label="Phương thức thanh toán" 
              name="paymentMethod"
              rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
            >
              <Select>
                <Option value="credit_card">Thẻ tín dụng</Option>
                <Option value="bank_transfer">Chuyển khoản</Option>
                <Option value="e_wallet">Ví điện tử</Option>
                <Option value="cash">Tiền mặt</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ghi chú thanh toán" name="notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Approval/Rejection Modal */}
        <Modal
          title={actionType === 'approve' ? 'Phê duyệt đơn hàng' : 'Từ chối đơn hàng'}
          open={isApprovalModalVisible}
          onOk={handleSubmitApproval}
          onCancel={() => setIsApprovalModalVisible(false)}
          okText={actionType === 'approve' ? 'Phê duyệt' : 'Từ chối'}
          cancelText="Hủy"
        >
          <Form form={approvalForm} layout="vertical">
            <Form.Item 
              label="Ghi chú" 
              name="notes"
              rules={actionType === 'reject' ? [{ required: true, message: 'Vui lòng nhập lý do từ chối!' }] : []}
            >
              <Input.TextArea 
                rows={4} 
                placeholder={
                  actionType === 'approve' 
                    ? 'Ghi chú phê duyệt (tùy chọn)...' 
                    : 'Lý do từ chối (bắt buộc)...'
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderManagement;
