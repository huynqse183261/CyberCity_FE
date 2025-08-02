import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import type { Invoice, InvoiceItem } from '../models/InvoiceTypes';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  message,
  Select,
  Row,
  Col,
  Statistic,
  Typography,
  Descriptions,
  Divider,
  DatePicker,
  InputNumber,
} from 'antd';
import {
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  DollarOutlined,
  PrinterOutlined,
  SendOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const InvoiceManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [form] = Form.useForm();

  // Sample invoices data
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      key: '1',
      id: 'INV001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      customerPhone: '0123456789',
      customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
      items: [
        { productName: 'Laptop Gaming ASUS ROG', quantity: 1, unitPrice: 25000000, total: 25000000 },
        { productName: 'Chuột gaming', quantity: 1, unitPrice: 500000, total: 500000 },
      ] as InvoiceItem[],
      subtotal: 25500000,
      tax: 2550000,
      discount: 1000000,
      total: 27050000,
      status: 'sent',
      issueDate: '2024-01-15',
      dueDate: '2024-01-30',
      paymentMethod: 'Chuyển khoản',
      notes: 'Khách hàng VIP, ưu tiên giao hàng',
    },
    {
      key: '2',
      id: 'INV002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      customerPhone: '0987654321',
      customerAddress: '456 Đường XYZ, Quận 2, TP.HCM',
      items: [
        { productName: 'iPhone 15 Pro Max', quantity: 1, unitPrice: 35000000, total: 35000000 },
      ],
      subtotal: 35000000,
      tax: 3500000,
      discount: 0,
      total: 38500000,
      status: 'paid',
      issueDate: '2024-01-14',
      dueDate: '2024-01-29',
      paymentMethod: 'Tiền mặt',
    },
    {
      key: '3',
      id: 'INV003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      customerPhone: '0369852147',
      customerAddress: '789 Đường DEF, Quận 3, TP.HCM',
      items: [
        { productName: 'MacBook Air M2', quantity: 1, unitPrice: 28000000, total: 28000000 },
        { productName: 'Adapter', quantity: 1, unitPrice: 2000000, total: 2000000 },
      ],
      subtotal: 30000000,
      tax: 3000000,
      discount: 500000,
      total: 32500000,
      status: 'overdue',
      issueDate: '2024-01-10',
      dueDate: '2024-01-25',
      paymentMethod: 'Chuyển khoản',
    },
    {
      key: '4',
      id: 'INV004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      customerPhone: '0147258369',
      customerAddress: '321 Đường GHI, Quận 4, TP.HCM',
      items: [
        { productName: 'Tablet iPad', quantity: 2, unitPrice: 15000000, total: 30000000 },
      ],
      subtotal: 30000000,
      tax: 3000000,
      discount: 1500000,
      total: 31500000,
      status: 'draft',
      issueDate: '2024-01-16',
      dueDate: '2024-01-31',
    },
  ]);

  const columns = [
    {
      title: 'Số hóa đơn',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      filteredValue: [searchText],
      onFilter: (value: any, record: Invoice) =>
        record.customerName.toLowerCase().includes(value.toLowerCase()) ||
        record.id.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          {total.toLocaleString('vi-VN')} VNĐ
        </Text>
      ),
      sorter: (a: Invoice, b: Invoice) => a.total - b.total,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          draft: { color: 'default', text: 'Nháp' },
          sent: { color: 'blue', text: 'Đã gửi' },
          paid: { color: 'green', text: 'Đã thanh toán' },
          overdue: { color: 'red', text: 'Quá hạn' },
          cancelled: { color: 'red', text: 'Đã hủy' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Nháp', value: 'draft' },
        { text: 'Đã gửi', value: 'sent' },
        { text: 'Đã thanh toán', value: 'paid' },
        { text: 'Quá hạn', value: 'overdue' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value: any, record: Invoice) => record.status === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: Invoice, b: Invoice) => dayjs(a.issueDate).unix() - dayjs(b.issueDate).unix(),
    },
    {
      title: 'Hạn thanh toán',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string, record: Invoice) => {
        const isOverdue = dayjs().isAfter(dayjs(date)) && record.status !== 'paid';
        return (
          <Text type={isOverdue ? 'danger' : undefined}>
            {dayjs(date).format('DD/MM/YYYY')}
          </Text>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 250,
      render: (_: any, record: Invoice) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="default"
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
          >
            In
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingInvoice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    form.setFieldsValue({
      ...invoice,
      issueDate: dayjs(invoice.issueDate),
      dueDate: dayjs(invoice.dueDate),
    });
    setIsModalVisible(true);
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalVisible(true);
  };

  const handlePrint = (invoice: Invoice) => {
    message.info(`In hóa đơn ${invoice.id}`);
  };

  const handleDelete = (key: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.key !== key));
    message.success('Xóa hóa đơn thành công!');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const invoiceData = {
        ...values,
        issueDate: values.issueDate.format('YYYY-MM-DD'),
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        items: values.items || [],
        subtotal: values.subtotal || 0,
        tax: values.tax || 0,
        discount: values.discount || 0,
        total: (values.subtotal || 0) + (values.tax || 0) - (values.discount || 0),
      };

      if (editingInvoice) {
        setInvoices(prev => prev.map(invoice => 
          invoice.key === editingInvoice.key ? { ...editingInvoice, ...invoiceData } : invoice
        ));
        message.success('Cập nhật hóa đơn thành công!');
      } else {
        const newInvoice: Invoice = {
          key: Date.now().toString(),
          id: `INV${Date.now().toString().slice(-3)}`,
          ...invoiceData,
        };
        setInvoices(prev => [...prev, newInvoice]);
        message.success('Tạo hóa đơn thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalInvoices = invoices.length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Quản lý hóa đơn</Title>
        </div>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng hóa đơn"
                value={totalInvoices}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={totalRevenue}
                formatter={(value) => `${Number(value).toLocaleString('vi-VN')} VNĐ`}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Chưa thanh toán"
                value={pendingAmount}
                formatter={(value) => `${Number(value).toLocaleString('vi-VN')} VNĐ`}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Quá hạn"
                value={overdueCount}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#f5222d' }}
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
                  placeholder="Tìm kiếm hóa đơn..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 150 }}
                >
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="draft">Nháp</Option>
                  <Option value="sent">Đã gửi</Option>
                  <Option value="paid">Đã thanh toán</Option>
                  <Option value="overdue">Quá hạn</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Tạo hóa đơn
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Invoices Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredInvoices}
            pagination={{
              total: filteredInvoices.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} hóa đơn`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingInvoice ? 'Cập nhật hóa đơn' : 'Tạo hóa đơn mới'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          okText={editingInvoice ? 'Cập nhật' : 'Tạo'}
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Title level={4}>Thông tin khách hàng</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="customerName"
                  label="Tên khách hàng"
                  rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                >
                  <Input placeholder="Nhập tên khách hàng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="customerEmail"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="customerPhone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="draft">Nháp</Option>
                    <Option value="sent">Đã gửi</Option>
                    <Option value="paid">Đã thanh toán</Option>
                    <Option value="overdue">Quá hạn</Option>
                    <Option value="cancelled">Đã hủy</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="customerAddress"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Divider />

            <Title level={4}>Thông tin hóa đơn</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="issueDate"
                  label="Ngày tạo"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày tạo!' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dueDate"
                  label="Hạn thanh toán"
                  rules={[{ required: true, message: 'Vui lòng chọn hạn thanh toán!' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="subtotal"
                  label="Tạm tính (VNĐ)"
                  rules={[{ required: true, message: 'Vui lòng nhập tạm tính!' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="tax"
                  label="Thuế (VNĐ)"
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="discount"
                  label="Giảm giá (VNĐ)"
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="paymentMethod"
              label="Phương thức thanh toán"
            >
              <Select placeholder="Chọn phương thức thanh toán">
                <Option value="Tiền mặt">Tiền mặt</Option>
                <Option value="Chuyển khoản">Chuyển khoản</Option>
                <Option value="Thẻ tín dụng">Thẻ tín dụng</Option>
                <Option value="Ví điện tử">Ví điện tử</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="notes"
              label="Ghi chú"
            >
              <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
            </Form.Item>
          </Form>
        </Modal>

        {/* View Invoice Modal */}
        <Modal
          title={`Hóa đơn ${selectedInvoice?.id}`}
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          width={800}
          footer={[
            <Button key="print" icon={<PrinterOutlined />} onClick={() => handlePrint(selectedInvoice!)}>
              In hóa đơn
            </Button>,
            <Button key="send" type="primary" icon={<SendOutlined />}>
              Gửi email
            </Button>,
            <Button key="download" icon={<DownloadOutlined />}>
              Tải xuống
            </Button>,
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          {selectedInvoice && (
            <div>
              <Descriptions title="Thông tin khách hàng" bordered size="small" column={2}>
                <Descriptions.Item label="Tên khách hàng">{selectedInvoice.customerName}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedInvoice.customerEmail}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{selectedInvoice.customerPhone}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={
                    selectedInvoice.status === 'paid' ? 'green' :
                    selectedInvoice.status === 'sent' ? 'blue' :
                    selectedInvoice.status === 'overdue' ? 'red' : 'default'
                  }>
                    {selectedInvoice.status === 'paid' ? 'Đã thanh toán' :
                     selectedInvoice.status === 'sent' ? 'Đã gửi' :
                     selectedInvoice.status === 'overdue' ? 'Quá hạn' :
                     selectedInvoice.status === 'draft' ? 'Nháp' : 'Đã hủy'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {selectedInvoice.customerAddress}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Descriptions title="Chi tiết hóa đơn" bordered size="small" column={2}>
                <Descriptions.Item label="Ngày tạo">
                  {dayjs(selectedInvoice.issueDate).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Hạn thanh toán">
                  {dayjs(selectedInvoice.dueDate).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Tạm tính">
                  {selectedInvoice.subtotal.toLocaleString('vi-VN')} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Thuế">
                  {selectedInvoice.tax.toLocaleString('vi-VN')} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Giảm giá">
                  {selectedInvoice.discount.toLocaleString('vi-VN')} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Tổng cộng">
                  <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                    {selectedInvoice.total.toLocaleString('vi-VN')} VNĐ
                  </Text>
                </Descriptions.Item>
                {selectedInvoice.paymentMethod && (
                  <Descriptions.Item label="Phương thức thanh toán" span={2}>
                    {selectedInvoice.paymentMethod}
                  </Descriptions.Item>
                )}
                {selectedInvoice.notes && (
                  <Descriptions.Item label="Ghi chú" span={2}>
                    {selectedInvoice.notes}
                  </Descriptions.Item>
                )}
              </Descriptions>

              {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <>
                  <Divider />
                  <Title level={5}>Sản phẩm</Title>
                  <Table
                    dataSource={selectedInvoice.items.map((item, index) => ({ ...item, key: index }))}
                    pagination={false}
                    size="small"
                    columns={[
                      { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
                      { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
                      { 
                        title: 'Đơn giá', 
                        dataIndex: 'unitPrice', 
                        key: 'unitPrice',
                        render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`
                      },
                      { 
                        title: 'Thành tiền', 
                        dataIndex: 'total', 
                        key: 'total',
                        render: (total: number) => `${total.toLocaleString('vi-VN')} VNĐ`
                      },
                    ]}
                  />
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default InvoiceManagement;
