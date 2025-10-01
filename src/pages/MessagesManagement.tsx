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
  message,
  Avatar,
  Badge,
  Row,
  Col,
  Statistic,
  Typography,
  List,
  Divider,
  Select,
} from 'antd';
import {
  MailOutlined,
  SendOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarOutlined,
  StarFilled,
  SearchOutlined,
  InboxOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface Message {
  key: string;
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'high' | 'medium' | 'low';
  type: 'inquiry' | 'complaint' | 'feedback' | 'support';
}

const MessagesManagement: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form] = Form.useForm();

  // Sample messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      key: '1',
      id: 'MSG001',
      sender: 'Nguyễn Văn A',
      senderEmail: 'nguyenvana@email.com',
      subject: 'Thắc mắc về sản phẩm laptop',
      content: 'Tôi muốn biết thêm thông tin về laptop gaming ASUS ROG. Sản phẩm có còn hàng không?',
      timestamp: '2024-01-15 14:30',
      isRead: false,
      isStarred: true,
      priority: 'high',
      type: 'inquiry',
    },
    {
      key: '2',
      id: 'MSG002',
      sender: 'Trần Thị B',
      senderEmail: 'tranthib@email.com',
      subject: 'Khiếu nại về đơn hàng #12346',
      content: 'Đơn hàng của tôi đã quá 3 ngày mà vẫn chưa được giao. Xin hãy kiểm tra và phản hồi.',
      timestamp: '2024-01-15 10:15',
      isRead: true,
      isStarred: false,
      priority: 'high',
      type: 'complaint',
    },
    {
      key: '3',
      id: 'MSG003',
      sender: 'Lê Văn C',
      senderEmail: 'levanc@email.com',
      subject: 'Đánh giá dịch vụ',
      content: 'Tôi rất hài lòng với dịch vụ của cửa hàng. Nhân viên tư vấn nhiệt tình và chuyên nghiệp.',
      timestamp: '2024-01-14 16:45',
      isRead: true,
      isStarred: true,
      priority: 'medium',
      type: 'feedback',
    },
    {
      key: '4',
      id: 'MSG004',
      sender: 'Phạm Thị D',
      senderEmail: 'phamthid@email.com',
      subject: 'Yêu cầu hỗ trợ kỹ thuật',
      content: 'Laptop mua từ cửa hàng bị lỗi màn hình. Xin hướng dẫn cách xử lý.',
      timestamp: '2024-01-14 09:20',
      isRead: false,
      isStarred: false,
      priority: 'high',
      type: 'support',
    },
  ]);

  const columns = [
    {
      title: '',
      dataIndex: 'isRead',
      key: 'isRead',
      width: 20,
      render: (isRead: boolean) => (
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isRead ? 'transparent' : '#1890ff' }} />
      ),
    },
    {
      title: '',
      dataIndex: 'isStarred',
      key: 'isStarred',
      width: 40,
      render: (isStarred: boolean, record: Message) => (
        <Button
          type="text"
          size="small"
          icon={isStarred ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
          onClick={() => handleToggleStar(record.key)}
        />
      ),
    },
    {
      title: 'Người gửi',
      dataIndex: 'sender',
      key: 'sender',
      render: (sender: string, record: Message) => (
        <div>
          <div style={{ fontWeight: record.isRead ? 'normal' : 'bold' }}>{sender}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.senderEmail}</Text>
        </div>
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string, record: Message) => (
        <div style={{ fontWeight: record.isRead ? 'normal' : 'bold' }}>
          {subject}
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          inquiry: { color: 'blue', text: 'Thắc mắc' },
          complaint: { color: 'red', text: 'Khiếu nại' },
          feedback: { color: 'green', text: 'Phản hồi' },
          support: { color: 'orange', text: 'Hỗ trợ' },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const priorityConfig = {
          high: { color: 'red', text: 'Cao' },
          medium: { color: 'orange', text: 'Trung bình' },
          low: { color: 'green', text: 'Thấp' },
        };
        const config = priorityConfig[priority as keyof typeof priorityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_: any, record: Message) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewMessage(record)}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<SendOutlined />}
            onClick={() => handleReplyMessage(record)}
          >
            Trả lời
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMessage(record.key)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsModalVisible(true);
    
    // Mark as read
    if (!message.isRead) {
      setMessages(prev => prev.map(msg => 
        msg.key === message.key ? { ...msg, isRead: true } : msg
      ));
    }
  };

  const handleReplyMessage = (message: Message) => {
    setSelectedMessage(message);
    form.setFieldsValue({
      to: message.senderEmail,
      subject: `RE: ${message.subject}`,
    });
    setIsReplyModalVisible(true);
  };

  const handleDeleteMessage = (key: string) => {
    setMessages(prev => prev.filter(msg => msg.key !== key));
    message.success('Đã xóa tin nhắn!');
  };

  const handleToggleStar = (key: string) => {
    setMessages(prev => prev.map(msg => 
      msg.key === key ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const handleSendReply = () => {
    form.validateFields().then(_values => {
      message.success('Đã gửi phản hồi thành công!');
      setIsReplyModalVisible(false);
      form.resetFields();
    });
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchText.toLowerCase()) ||
                         msg.sender.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' || msg.type === filterType;
    return matchesSearch && matchesType;
  });

  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const starredCount = messages.filter(msg => msg.isStarred).length;
  const highPriorityCount = messages.filter(msg => msg.priority === 'high').length;

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Quản lý hộp thư</Title>
        </div>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng tin nhắn"
                value={messages.length}
                prefix={<MailOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Chưa đọc"
                value={unreadCount}
                prefix={<Badge count={unreadCount} size="small" />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Quan trọng"
                value={starredCount}
                prefix={<StarFilled style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Ưu tiên cao"
                value={highPriorityCount}
                prefix={<Badge status="error" />}
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
                  placeholder="Tìm kiếm tin nhắn..."
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
                  <Option value="inquiry">Thắc mắc</Option>
                  <Option value="complaint">Khiếu nại</Option>
                  <Option value="feedback">Phản hồi</Option>
                  <Option value="support">Hỗ trợ</Option>
                </Select>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button type="default" icon={<InboxOutlined />}>
                  Đánh dấu tất cả đã đọc
                </Button>
                <Button type="primary" icon={<SendOutlined />}>
                  Soạn tin nhắn mới
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Messages Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredMessages}
            pagination={{
              total: filteredMessages.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} tin nhắn`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {/* View Message Modal */}
        <Modal
          title="Chi tiết tin nhắn"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="reply" type="primary" icon={<SendOutlined />} onClick={() => {
              setIsModalVisible(false);
              handleReplyMessage(selectedMessage!);
            }}>
              Trả lời
            </Button>,
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={700}
        >
          {selectedMessage && (
            <div>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Từ: </Text>
                      <Text>{selectedMessage.sender} ({selectedMessage.senderEmail})</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Thời gian: </Text>
                      <Text>{selectedMessage.timestamp}</Text>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Text strong>Tiêu đề: </Text>
                  <Text>{selectedMessage.subject}</Text>
                </div>
                <Divider />
                <div>
                  <Text strong>Nội dung:</Text>
                  <div style={{ marginTop: 8, padding: 16, background: '#f5f5f5', borderRadius: 6 }}>
                    {selectedMessage.content}
                  </div>
                </div>
              </Space>
            </div>
          )}
        </Modal>

        {/* Reply Modal */}
        <Modal
          title="Trả lời tin nhắn"
          open={isReplyModalVisible}
          onOk={handleSendReply}
          onCancel={() => setIsReplyModalVisible(false)}
          okText="Gửi"
          cancelText="Hủy"
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="to"
              label="Đến"
              rules={[{ required: true, message: 'Vui lòng nhập email người nhận!' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="subject"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
            >
              <TextArea rows={6} placeholder="Nhập nội dung phản hồi..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default MessagesManagement;
