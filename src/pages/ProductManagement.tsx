import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import type { Product } from '../models/ProductTypes';
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
  InputNumber,
  Upload,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const ProductManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Sample product data
  const [products, setProducts] = useState<Product[]>([
    {
      key: '1',
      id: 'SP001',
      name: 'Laptop Gaming ASUS ROG',
      category: 'Laptop',
      price: 25000000,
      stock: 15,
      status: 'active',
      image: 'laptop1.jpg',
      description: 'Laptop gaming cao cấp với chip Intel i7',
    },
    {
      key: '2',
      id: 'SP002',
      name: 'iPhone 15 Pro Max',
      category: 'Điện thoại',
      price: 35000000,
      stock: 8,
      status: 'active',
      image: 'iphone15.jpg',
      description: 'iPhone mới nhất với chip A17 Pro',
    },
    {
      key: '3',
      id: 'SP003',
      name: 'MacBook Air M2',
      category: 'Laptop',
      price: 28000000,
      stock: 0,
      status: 'inactive',
      image: 'macbook.jpg',
      description: 'MacBook Air với chip M2 mạnh mẽ',
    },
  ]);

  const categories = ['Laptop', 'Điện thoại', 'Tablet', 'Phụ kiện'];

  const columns = [
    {
      title: 'Mã SP',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value: any, record: Product) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      filters: categories.map(cat => ({ text: cat, value: cat })),
      onFilter: (value: any, record: Product) => record.category === value,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`,
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
      sorter: (a: Product, b: Product) => a.stock - b.stock,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Ngừng bán', value: 'inactive' },
      ],
      onFilter: (value: any, record: Product) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Ngừng bán'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_text: any, record: Product) => (
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
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleView = (product: Product) => {
    Modal.info({
      title: 'Chi tiết sản phẩm',
      content: (
        <div>
          <p><strong>Mã SP:</strong> {product.id}</p>
          <p><strong>Tên:</strong> {product.name}</p>
          <p><strong>Danh mục:</strong> {product.category}</p>
          <p><strong>Giá:</strong> {product.price.toLocaleString('vi-VN')} VNĐ</p>
          <p><strong>Tồn kho:</strong> {product.stock}</p>
          <p><strong>Mô tả:</strong> {product.description}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleDelete = (key: string) => {
    setProducts(products.filter(product => product.key !== key));
    message.success('Xóa sản phẩm thành công!');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingProduct) {
        // Update existing product
        setProducts(products.map(product => 
          product.key === editingProduct.key 
            ? { ...editingProduct, ...values }
            : product
        ));
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        // Add new product
        const newProduct: Product = {
          key: Date.now().toString(),
          id: `SP${Date.now().toString().slice(-3)}`,
          ...values,
        };
        setProducts([...products, newProduct]);
        message.success('Thêm sản phẩm thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2>Quản lý sản phẩm</h2>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={products.length}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang bán"
              value={products.filter(p => p.status === 'active').length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hết hàng"
              value={products.filter(p => p.stock === 0).length}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={products.reduce((sum, p) => sum + p.price * p.stock, 0)}
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
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả danh mục</Option>
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm sản phẩm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Products Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          pagination={{
            total: filteredProducts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={editingProduct ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active' }}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined) => Number(value!.replace(/\$\s?|(,*)/g, '')) || 0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Số lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Ngừng bán</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh"
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;
