import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Avatar,
  Badge,
  Typography,
  Empty,
  Spin,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTeacherConversations } from '../hooks/useTeacher';
import type { ConversationDto, MessageDto } from '../services/teacherService';
import TeacherLayout from '../components/TeacherLayout';
import '../styles/TeacherMessages.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Search } = Input;

const TeacherMessages: React.FC = () => {
  const {
    loading,
    conversations,
    selectedConversation,
    messages,
    currentPage,
    totalItems,
    selectConversation,
    sendMessage,
    handlePageChange
  } = useTeacherConversations();

  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [sendForm] = Form.useForm();

  // ===========================
  // COLUMNS
  // ===========================
  const conversationColumns: ColumnsType<ConversationDto> = [
    {
      title: 'Học sinh',
      dataIndex: 'participantName',
      key: 'participantName',
      render: (name: string, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div><Text strong>{name}</Text></div>
            {record.unreadCount > 0 && (
              <Badge count={record.unreadCount} size="small" />
            )}
          </div>
        </Space>
      )
    },
    {
      title: 'Tin nhắn cuối',
      dataIndex: 'lastMessage',
      key: 'lastMessage',
      ellipsis: true,
      render: (text: string) => (
        <Text type="secondary" ellipsis>{text || 'Chưa có tin nhắn'}</Text>
      )
    },
    {
      title: 'Thời gian',
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
          icon={<MessageOutlined />}
          onClick={() => handleViewConversation(record)}
        >
          Xem
        </Button>
      )
    }
  ];

  // ===========================
  // HANDLERS
  // ===========================
  const handleViewConversation = (conversation: ConversationDto) => {
    selectConversation(conversation);
    setMessageModalVisible(true);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation) return;

    try {
      const values = await sendForm.validateFields();
      const success = await sendMessage(selectedConversation.conversationUid, values.content);

      if (success) {
        sendForm.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCloseModal = () => {
    setMessageModalVisible(false);
    sendForm.resetFields();
  };

  // Tính unread messages
  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <TeacherLayout>
      <div className="teacher-messages-page" style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <MessageOutlined /> Hộp thư tin nhắn
          </Title>
        </div>

        {/* Stats */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng hội thoại"
                value={totalItems}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tin nhắn chưa đọc"
                value={unreadCount}
                prefix={<Badge count={unreadCount} />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Hội thoại hoạt động"
                value={conversations.filter(c => c.lastMessageAt).length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Conversations List */}
        <Card
          title="Danh sách hội thoại"
          extra={
            <Space>
              <Search
                placeholder="Tìm kiếm học sinh..."
                allowClear
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
                Làm mới
              </Button>
            </Space>
          }
        >
          <Table
            columns={conversationColumns}
            dataSource={conversations}
            rowKey="conversationUid"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: 20,
              total: totalItems,
              onChange: handlePageChange,
              showSizeChanger: false,
              showTotal: (total) => `Tổng ${total} hội thoại`
            }}
          />
        </Card>

        {/* Messages Modal */}
        <Modal
          title={
            <Space>
              <MessageOutlined />
              <span>Hội thoại với {selectedConversation?.participantName}</span>
            </Space>
          }
          open={messageModalVisible}
          onCancel={handleCloseModal}
          width={800}
          footer={null}
        >
          <div className="messages-container" style={{ marginBottom: 16 }}>
            <Spin spinning={loading}>
              {messages.length > 0 ? (
                <div className="messages-list" style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 16 }}>
                  {messages.map((msg: MessageDto) => (
                    <div
                      key={msg.uid}
                      className={`message-item ${msg.senderUid === selectedConversation?.participantUid ? 'received' : 'sent'}`}
                      style={{
                        marginBottom: 12,
                        display: 'flex',
                        justifyContent: msg.senderUid === selectedConversation?.participantUid ? 'flex-start' : 'flex-end'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '8px 12px',
                          borderRadius: 8,
                          backgroundColor: msg.senderUid === selectedConversation?.participantUid ? '#f0f0f0' : '#1890ff',
                          color: msg.senderUid === selectedConversation?.participantUid ? '#000' : '#fff'
                        }}
                      >
                        <div>{msg.content}</div>
                        <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                          {new Date(msg.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="Chưa có tin nhắn" style={{ margin: '40px 0' }} />
              )}
            </Spin>
          </div>

          {/* Send Message Form */}
          <Form form={sendForm} onFinish={handleSendMessage}>
            <Form.Item
              name="content"
              rules={[
                { required: true, message: 'Vui lòng nhập nội dung tin nhắn!' },
                { min: 1, message: 'Tin nhắn quá ngắn!' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập tin nhắn..."
                showCount
                maxLength={1000}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCloseModal}>
                  Đóng
                </Button>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                  Gửi
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </TeacherLayout>
  );
};

export default TeacherMessages;
