import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Statistic,
  Row,
  Col,
  Modal,
  Form,
  Avatar,
  Tag,
  Popconfirm,
  Typography,
  Spin,
  Empty
} from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAdminMessages } from '../hooks/useAdminMessages';
import type { ConversationDto, MessageDto } from '../services/adminMessageService';
import AdminLayout from '../components/AdminLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminMessagesPage: React.FC = () => {
  const {
    loading,
    stats,
    conversations,
    messages,
    selectedConversation,
    currentPage,
    pageSize,
    totalConversations,
    searchQuery,
    selectConversation,
    sendMessage,
    deleteMessage,
    handleSearch,
    handlePageChange,
    refreshAll
  } = useAdminMessages();

  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyForm] = Form.useForm();

  // ===========================
  // COLUMNS FOR CONVERSATIONS
  // ===========================
  const conversationColumns: ColumnsType<ConversationDto> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record) => (
        <Space>
          <MessageOutlined />
          <Text strong>{title || 'Không có tiêu đề'}</Text>
          {record.isGroup && <Tag color="blue">Nhóm</Tag>}
        </Space>
      )
    },
    {
      title: 'Thành viên',
      dataIndex: 'members',
      key: 'members',
      render: (members: any[]) => (
        <Avatar.Group maxCount={3}>
          {members?.map(member => (
            <Avatar key={member.uid} src={member.image} icon={<UserOutlined />}>
              {member.username?.[0]?.toUpperCase()}
            </Avatar>
          ))}
        </Avatar.Group>
      )
    },
    {
      title: 'Số tin nhắn',
      dataIndex: 'totalMessages',
      key: 'totalMessages',
      width: 120,
      render: (count: number) => <Tag color="cyan">{count}</Tag>
    },
    {
      title: 'Hoạt động cuối',
      dataIndex: 'lastMessageAt',
      key: 'lastMessageAt',
      width: 180,
      render: (date: string) => date ? new Date(date).toLocaleString('vi-VN') : '-'
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => selectConversation(record)}
        >
          Xem chi tiết
        </Button>
      )
    }
  ];

  // ===========================
  // COLUMNS FOR MESSAGES
  // ===========================
  const messageColumns: ColumnsType<MessageDto> = [
    {
      title: 'Người gửi',
      dataIndex: 'sender',
      key: 'sender',
      width: 200,
      render: (sender: any) => (
        <Space>
          <Avatar src={sender?.image} icon={<UserOutlined />} />
          <div>
            <div><Text strong>{sender?.fullName}</Text></div>
            <div><Text type="secondary" style={{ fontSize: 12 }}>{sender?.role}</Text></div>
          </div>
        </Space>
      )
    },
    {
      title: 'Nội dung',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true
    },
    {
      title: 'Thời gian',
      dataIndex: 'sentAt',
      key: 'sentAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa tin nhắn này?"
          onConfirm={() => deleteMessage(record.uid)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small" icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      )
    }
  ];

  // ===========================
  // HANDLERS
  // ===========================
  const handleSendMessage = async () => {
    if (!selectedConversation) return;

    try {
      const values = await replyForm.validateFields();
      const success = await sendMessage(selectedConversation.uid, values.message);
      
      if (success) {
        replyForm.resetFields();
        setReplyModalVisible(false);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <MessageOutlined /> Quản lý hộp thư
          </Title>
        </div>

        {/* Stats */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng cuộc hội thoại"
                value={stats?.totalConversations || 0}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng tin nhắn"
                value={stats?.totalMessages || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tin nhắn hôm nay"
                value={stats?.todayMessages || 0}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tin nhắn tuần này"
                value={stats?.thisWeekMessages || 0}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Conversations List */}
        <Card
          title="Danh sách cuộc hội thoại"
          extra={
            <Space>
              <Input.Search
                placeholder="Tìm kiếm cuộc hội thoại..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={refreshAll}>
                Làm mới
              </Button>
            </Space>
          }
        >
          <Table
            columns={conversationColumns}
            dataSource={conversations}
            rowKey="uid"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalConversations,
              onChange: handlePageChange,
              showSizeChanger: false,
              showTotal: (total) => `Tổng ${total} cuộc hội thoại`
            }}
          />
        </Card>

        {/* Messages Modal */}
        {selectedConversation && (
          <Modal
            title={
              <Space>
                <MessageOutlined />
                <span>{selectedConversation.title || 'Cuộc hội thoại'}</span>
              </Space>
            }
            open={!!selectedConversation}
            onCancel={() => selectConversation(null as any)}
            width={900}
            footer={[
              <Button key="close" onClick={() => selectConversation(null as any)}>
                Đóng
              </Button>,
              <Button
                key="reply"
                type="primary"
                icon={<SendOutlined />}
                onClick={() => setReplyModalVisible(true)}
              >
                Phản hồi
              </Button>
            ]}
          >
            <Spin spinning={loading}>
              {messages.length > 0 ? (
                <Table
                  columns={messageColumns}
                  dataSource={messages}
                  rowKey="uid"
                  pagination={false}
                  scroll={{ y: 400 }}
                />
              ) : (
                <Empty description="Chưa có tin nhắn" />
              )}
            </Spin>
          </Modal>
        )}

        {/* Reply Modal */}
        <Modal
          title="Gửi tin nhắn phản hồi"
          open={replyModalVisible}
          onCancel={() => {
            setReplyModalVisible(false);
            replyForm.resetFields();
          }}
          onOk={handleSendMessage}
          okText="Gửi"
          cancelText="Hủy"
        >
          <Form form={replyForm} layout="vertical">
            <Form.Item
              name="message"
              label="Nội dung tin nhắn"
              rules={[
                { required: true, message: 'Vui lòng nhập nội dung tin nhắn!' },
                { min: 1, message: 'Tin nhắn quá ngắn!' }
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Nhập nội dung tin nhắn..."
                showCount
                maxLength={1000}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminMessagesPage;
