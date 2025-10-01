import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  InputNumber,
  message,
  Select,
  Row,
  Col,
  Statistic,
  Typography,
  Switch,
  DatePicker,
  Descriptions,
} from 'antd';
import {
  DollarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  TagsOutlined,
  PercentageOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface PriceRule {
  key: string;
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'markup' | 'fixed' | 'bulk';
  value: number;
  unit: 'percent' | 'amount';
  minQuantity?: number;
  maxQuantity?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  applicableProducts: string[];
  customerTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const PricingManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);
  const [form] = Form.useForm();

  // Sample pricing rules data
  const [priceRules, setPriceRules] = useState<PriceRule[]>([
    {
      key: '1',
      id: 'PR001',
      name: 'Giảm giá cuối năm',
      description: 'Giảm giá 20% cho tất cả laptop gaming',
      type: 'discount',
      value: 20,
      unit: 'percent',
      validFrom: '2024-12-01',
      validTo: '2024-12-31',
      isActive: true,
      applicableProducts: ['Laptop Gaming'],
      customerTier: 'gold',
    },
    {
      key: '2',
      id: 'PR002',
      name: 'Mua số lượng lớn',
      description: 'Giảm 5% khi mua từ 10 sản phẩm trở lên',
      type: 'bulk',
      value: 5,
      unit: 'percent',
      minQuantity: 10,
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      isActive: true,
      applicableProducts: ['Tất cả'],
    },
    {
      key: '3',
      id: 'PR003',
      name: 'Giá cố định iPhone',
      description: 'Giá đặc biệt cho iPhone 15 Pro Max',
      type: 'fixed',
      value: 32000000,
      unit: 'amount',
      validFrom: '2024-01-15',
      validTo: '2024-02-15',
      isActive: false,
      applicableProducts: ['iPhone 15 Pro Max'],
      customerTier: 'platinum',
    },
    {
      key: '4',
      id: 'PR004',
      name: 'Phụ thu giao hàng nhanh',
      description: 'Phụ thu 50,000 VNĐ cho giao hàng trong ngày',
      type: 'markup',
      value: 50000,
      unit: 'amount',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      isActive: true,
      applicableProducts: ['Dịch vụ giao hàng'],
    },
  ]);

  const columns = [
    {
      title: 'Mã quy tắc',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên quy tắc',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value: any, record: PriceRule) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          discount: { color: 'green', text: 'Giảm giá' },
          markup: { color: 'red', text: 'Phụ thu' },
          fixed: { color: 'blue', text: 'Giá cố định' },
          bulk: { color: 'purple', text: 'Số lượng lớn' },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Giảm giá', value: 'discount' },
        { text: 'Phụ thu', value: 'markup' },
        { text: 'Giá cố định', value: 'fixed' },
        { text: 'Số lượng lớn', value: 'bulk' },
      ],
      onFilter: (value: any, record: PriceRule) => record.type === value,
    },
    {
      title: 'Giá trị',
      key: 'value',
      render: (record: PriceRule) => (
        <div>
          {record.unit === 'percent' ? (
            <Text strong>{record.value}%</Text>
          ) : (
            <Text strong>{record.value.toLocaleString('vi-VN')} VNĐ</Text>
          )}
          {record.minQuantity && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Từ {record.minQuantity} sp
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thời gian áp dụng',
      key: 'validity',
      render: (record: PriceRule) => (
        <div>
          <div>{dayjs(record.validFrom).format('DD/MM/YYYY')}</div>
          <Text type="secondary">đến</Text>
          <div>{dayjs(record.validTo).format('DD/MM/YYYY')}</div>
        </div>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerTier',
      key: 'customerTier',
      render: (tier: string) => {
        if (!tier) return <Text type="secondary">Tất cả</Text>;
        const tierConfig = {
          bronze: { color: '#cd7f32', text: 'Đồng' },
          silver: { color: '#c0c0c0', text: 'Bạc' },
          gold: { color: '#ffd700', text: 'Vàng' },
          platinum: { color: '#e5e4e2', text: 'Bạch kim' },
        };
        const config = tierConfig[tier as keyof typeof tierConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: PriceRule) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(record.key, checked)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm dừng"
        />
      ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Tạm dừng', value: false },
      ],
      onFilter: (value: any, record: PriceRule) => record.isActive === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_: any, record: PriceRule) => (
        <Space>
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
    setEditingRule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (rule: PriceRule) => {
    setEditingRule(rule);
    form.setFieldsValue({
      ...rule,
      validityRange: [dayjs(rule.validFrom), dayjs(rule.validTo)],
    });
    setIsModalVisible(true);
  };

  const handleView = (rule: PriceRule) => {
    Modal.info({
      title: 'Chi tiết quy tắc định giá',
      content: (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Mã quy tắc">{rule.id}</Descriptions.Item>
          <Descriptions.Item label="Tên">{rule.name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{rule.description}</Descriptions.Item>
          <Descriptions.Item label="Loại">
            {rule.type === 'discount' && 'Giảm giá'}
            {rule.type === 'markup' && 'Phụ thu'}
            {rule.type === 'fixed' && 'Giá cố định'}
            {rule.type === 'bulk' && 'Số lượng lớn'}
          </Descriptions.Item>
          <Descriptions.Item label="Giá trị">
            {rule.unit === 'percent' ? `${rule.value}%` : `${rule.value.toLocaleString('vi-VN')} VNĐ`}
          </Descriptions.Item>
          {rule.minQuantity && (
            <Descriptions.Item label="Số lượng tối thiểu">{rule.minQuantity}</Descriptions.Item>
          )}
          <Descriptions.Item label="Thời gian áp dụng">
            {dayjs(rule.validFrom).format('DD/MM/YYYY')} - {dayjs(rule.validTo).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Sản phẩm áp dụng">
            {rule.applicableProducts.join(', ')}
          </Descriptions.Item>
          <Descriptions.Item label="Hạng khách hàng">
            {rule.customerTier || 'Tất cả'}
          </Descriptions.Item>
        </Descriptions>
      ),
      width: 600,
    });
  };

  const handleDelete = (key: string) => {
    setPriceRules(prev => prev.filter(rule => rule.key !== key));
    message.success('Xóa quy tắc thành công!');
  };

  const handleToggleActive = (key: string, isActive: boolean) => {
    setPriceRules(prev => prev.map(rule => 
      rule.key === key ? { ...rule, isActive } : rule
    ));
    message.success(`${isActive ? 'Kích hoạt' : 'Tạm dừng'} quy tắc thành công!`);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const validityRange = values.validityRange;
      const ruleData = {
        ...values,
        validFrom: validityRange[0].format('YYYY-MM-DD'),
        validTo: validityRange[1].format('YYYY-MM-DD'),
      };
      delete ruleData.validityRange;

      if (editingRule) {
        setPriceRules(prev => prev.map(rule => 
          rule.key === editingRule.key ? { ...editingRule, ...ruleData } : rule
        ));
        message.success('Cập nhật quy tắc thành công!');
      } else {
        const newRule: PriceRule = {
          key: Date.now().toString(),
          id: `PR${Date.now().toString().slice(-3)}`,
          ...ruleData,
          applicableProducts: ruleData.applicableProducts || ['Tất cả'],
        };
        setPriceRules(prev => [...prev, newRule]);
        message.success('Thêm quy tắc thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredRules = priceRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' || rule.type === filterType;
    return matchesSearch && matchesType;
  });

  const activeRulesCount = priceRules.filter(rule => rule.isActive).length;
  const discountRulesCount = priceRules.filter(rule => rule.type === 'discount').length;
  const totalSavings = priceRules
    .filter(rule => rule.type === 'discount' && rule.isActive)
    .reduce((sum, rule) => sum + (rule.unit === 'percent' ? rule.value : rule.value / 1000), 0);

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Quản lý định giá</Title>
        </div>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng quy tắc"
                value={priceRules.length}
                prefix={<TagsOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={activeRulesCount}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Quy tắc giảm giá"
                value={discountRulesCount}
                prefix={<PercentageOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng tiết kiệm (%)"
                value={totalSavings}
                precision={1}
                prefix={<PercentageOutlined />}
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
                  placeholder="Tìm kiếm quy tắc..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Select
                  value={filterType}
                  onChange={setFilterType}
                  style={{ width: 150 }}
                >
                  <Option value="all">Tất cả loại</Option>
                  <Option value="discount">Giảm giá</Option>
                  <Option value="markup">Phụ thu</Option>
                  <Option value="fixed">Giá cố định</Option>
                  <Option value="bulk">Số lượng lớn</Option>
                </Select>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm quy tắc
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Pricing Rules Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredRules}
            pagination={{
              total: filteredRules.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} quy tắc`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={editingRule ? 'Cập nhật quy tắc định giá' : 'Thêm quy tắc định giá'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={700}
          okText={editingRule ? 'Cập nhật' : 'Thêm'}
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên quy tắc"
              rules={[{ required: true, message: 'Vui lòng nhập tên quy tắc!' }]}
            >
              <Input placeholder="Nhập tên quy tắc" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <Input.TextArea rows={2} placeholder="Nhập mô tả quy tắc" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Loại quy tắc"
                  rules={[{ required: true, message: 'Vui lòng chọn loại quy tắc!' }]}
                >
                  <Select placeholder="Chọn loại quy tắc">
                    <Option value="discount">Giảm giá</Option>
                    <Option value="markup">Phụ thu</Option>
                    <Option value="fixed">Giá cố định</Option>
                    <Option value="bulk">Số lượng lớn</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="unit"
                  label="Đơn vị"
                  rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
                >
                  <Select placeholder="Chọn đơn vị">
                    <Option value="percent">Phần trăm (%)</Option>
                    <Option value="amount">Số tiền (VNĐ)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="value"
                  label="Giá trị"
                  rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="minQuantity"
                  label="Số lượng tối thiểu"
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="validityRange"
              label="Thời gian áp dụng"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="customerTier"
              label="Hạng khách hàng"
            >
              <Select placeholder="Chọn hạng khách hàng" allowClear>
                <Option value="bronze">Đồng</Option>
                <Option value="silver">Bạc</Option>
                <Option value="gold">Vàng</Option>
                <Option value="platinum">Bạch kim</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Trạng thái"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default PricingManagement;
