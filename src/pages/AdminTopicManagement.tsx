import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  Popconfirm,
  Card,
  Row,
  Col,
  Tag,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  useAllTopics,
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic
} from '../hooks/useTopics';
import { useAllLessons } from '../hooks/useLessons';
import { useAllModules } from '../hooks/useModules';
import { useGlobalRefetch } from '../hooks/useGlobalRefetch';
import type { 
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
  TopicListParams
} from '../services/topicService';
import '../styles/AdminProductManagement.css';

const { Title } = Typography;
const { Option } = Select;

interface TopicFilterState {
  lessonUid: string;
  moduleUid: string;
  searchQuery: string;
}

interface AdminTopicManagementProps {}

const AdminTopicManagement: React.FC<AdminTopicManagementProps> = () => {
  // State management
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [form] = Form.useForm();
  
  // Pagination and filter state
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10 });
  const [filters, setFilters] = useState<TopicFilterState>({
    lessonUid: '',
    moduleUid: '',
    searchQuery: '',
  });

  // Build request params - Send all filters to server
  const requestParams: TopicListParams = {
    pageNumber: pagination.pageNumber,
    pageSize: pagination.pageSize,
    ...(filters.lessonUid && { lessonUid: filters.lessonUid }),
    ...(filters.searchQuery && { search: filters.searchQuery })
  };

  // React Query hooks
  const { 
    data: topicsResponse, 
    isLoading: loadingTopics
  } = useAllTopics(requestParams);

  const { 
    data: lessonsResponse,
    isLoading: loadingLessons
  } = useAllLessons({ pageSize: 1000 }); // Get all lessons for dropdown

  const { 
    data: modulesResponse,
    isLoading: loadingModules
  } = useAllModules({ pageSize: 1000 }); // Get all modules for dropdown

  // Global refetch hook
  const { refetchTopics } = useGlobalRefetch();

  // Extract data from responses
  const topics = topicsResponse?.data?.items || [];
  const paginationInfo = topicsResponse?.data;
  const lessons = lessonsResponse?.data?.items || [];
  const modules = modulesResponse?.data || [];

  // Mutation hooks
  const createTopicMutation = useCreateTopic({
    onSuccess: () => {
      setModalVisible(false);
      setEditingTopic(null);
      form.resetFields();
      refetchTopics();
    },
    onError: (error) => {
      console.error('Create topic error:', error);
    }
  });

  const updateTopicMutation = useUpdateTopic({
    onSuccess: () => {
      setModalVisible(false);
      setEditingTopic(null);
      form.resetFields();
      refetchTopics();
    },
    onError: (error) => {
      console.error('Update topic error:', error);
    }
  });

  const deleteTopicMutation = useDeleteTopic({
    onSuccess: () => {
      refetchTopics();
    },
    onError: (error) => {
      console.error('Delete topic error:', error);
    }
  });

  // Handle table change - Trigger server request with new pagination
  const handleTableChange = (page: number, pageSize?: number) => {
    setPagination({
      pageNumber: page,
      pageSize: pageSize || pagination.pageSize
    });
  };

  // Handle filter change - Trigger server request with new filters
  const handleFilterChange = (key: keyof TopicFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  // Helper function to get lesson name
  const getLessonName = (lessonUid: string) => {
    const lesson = lessons.find((l: any) => l.uid === lessonUid);
    return lesson?.title || lessonUid;
  };

  // Helper function to get module name from lesson
  const getModuleNameFromLesson = (lessonUid: string) => {
    const lesson = lessons.find((l: any) => l.uid === lessonUid);
    if (lesson?.moduleUid) {
      const module = modules.find((m: any) => m.uid === lesson.moduleUid);
      return module?.title || lesson.moduleUid;
    }
    return 'N/A';
  };

  // Handle create/edit topic
  const handleSaveTopic = (values: any) => {
    if (!values.lessonUid) {
      console.error('Lesson UID is required');
      return;
    }

    const selectedLesson = lessons.find((l: any) => l.uid === values.lessonUid);
    if (!selectedLesson) {
      console.error('Selected lesson not found');
      return;
    }

    console.log('Selected lesson for topic:', selectedLesson);
    console.log('Form values:', values);

    if (editingTopic) {
      // Update topic
      const updateData: UpdateTopicRequest = {
        lessonUid: values.lessonUid,
        title: values.title,
        description: values.description,
        orderIndex: parseInt(values.orderIndex) || 0
      };
      
      updateTopicMutation.mutate({
        id: editingTopic.uid!,
        data: updateData
      });
    } else {
      // Create topic
      const createData: CreateTopicRequest = {
        lessonUid: values.lessonUid,
        title: values.title,
        description: values.description,
        orderIndex: parseInt(values.orderIndex) || 0
      };
      
      createTopicMutation.mutate(createData);
    }
  };

  // Handle delete topic
  const handleDeleteTopic = (id: string) => {
    deleteTopicMutation.mutate(id);
  };

  // Handle edit topic
  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    form.setFieldsValue({
      title: topic.title,
      description: topic.description,
      orderIndex: topic.orderIndex,
      lessonUid: topic.lessonUid,
    });
    setModalVisible(true);
  };

  // Handle create new topic
  const handleCreateTopic = () => {
    setEditingTopic(null);
    form.resetFields();
    form.setFieldsValue({ 
      orderIndex: topics.length + 1
    });
    setModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<Topic> = [
    {
      title: 'ID',
      dataIndex: 'uid',
      key: 'uid',
      width: 120,
      ellipsis: true,
      render: (uid: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {(uid || '').slice(0, 8)}...
        </span>
      ),
    },
    {
      title: 'Tên Topic',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 200,
      render: (title: string, record: Topic) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{title || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description?.slice(0, 50) || 'Không có mô tả'}...
          </div>
        </div>
      ),
    },
    {
      title: 'Lesson',
      dataIndex: 'lessonUid',
      key: 'lessonUid',
      width: 150,
      ellipsis: true,
      render: (lessonUid: string) => (
        <Tag color="blue">{getLessonName(lessonUid)}</Tag>
      ),
    },
    {
      title: 'Module',
      dataIndex: 'lessonUid',
      key: 'module',
      width: 150,
      ellipsis: true,
      render: (lessonUid: string) => (
        <Tag color="green">{getModuleNameFromLesson(lessonUid)}</Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 80,
      sorter: (a: Topic, b: Topic) => (a.orderIndex || 0) - (b.orderIndex || 0),
      render: (orderIndex: number) => (
        <Tag color="orange">#{orderIndex || 0}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (createdAt: string) => (
        <span>{createdAt ? new Date(createdAt).toLocaleString() : ''}</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTopic(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa topic"
            description="Bạn có chắc chắn muốn xóa topic này?"
            onConfirm={() => handleDeleteTopic(record.uid)}
            okText="Xóa"
            cancelText="Hủy"
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

  return (
    <AdminLayout>
      <div className="admin-product-management">
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Title level={2}>Quản lý Topics</Title>
          </div>

          {/* Filters */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={6} lg={5}>
                <Input
                  placeholder="Tìm kiếm topics..."
                  prefix={<SearchOutlined />}
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Select
                  placeholder="Chọn lesson"
                  value={filters.lessonUid || undefined}
                  onChange={(value) => handleFilterChange('lessonUid', value)}
                  allowClear
                  style={{ width: '100%' }}
                  showSearch
                  filterOption={(input, option) => {
                    const label = option?.label || option?.children;
                    if (typeof label === 'string') {
                      return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                >
                  {lessons.map((lesson: any) => (
                    <Option key={lesson.uid} value={lesson.uid}>
                      {lesson.title}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateTopic}
                  >
                    Thêm Topic
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => refetchTopics()}
                    loading={loadingTopics}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Stats */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {paginationInfo?.totalItems || topics.length}
                  </div>
                  <div>Tổng Topics</div>
                </div>
              </Col>
            </Row>
            {filters.lessonUid && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Tag color="processing" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  Đang hiển thị topics của: {getLessonName(filters.lessonUid)}
                </Tag>
              </div>
            )}
          </Card>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={topics}
            rowKey={(record) => record.uid || Math.random().toString()}
            loading={loadingTopics || loadingLessons || loadingModules ||
                     createTopicMutation.isPending || 
                     updateTopicMutation.isPending || 
                     deleteTopicMutation.isPending}
            pagination={{
              current: paginationInfo?.pageNumber || 1,
              pageSize: paginationInfo?.pageSize || 10,
              total: paginationInfo?.totalItems || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} topics`,
              onChange: handleTableChange,
              onShowSizeChange: handleTableChange,
            }}
            scroll={{ x: 1500 }}
            locale={{
              emptyText: topics.length === 0 ? 
                'Chưa có topics nào được tạo' : 
                'Không tìm thấy topics phù hợp với bộ lọc'
            }}
          />

          {/* Create/Edit Modal */}
          <Modal
            title={editingTopic ? 'Sửa Topic' : 'Thêm Topic mới'}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              setEditingTopic(null);
              form.resetFields();
            }}
            footer={null}
            width={900}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveTopic}
              initialValues={{
                orderIndex: 1,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="title"
                    label="Tên Topic"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên topic!' },
                      { min: 3, message: 'Tên topic phải có ít nhất 3 ký tự!' },
                    ]}
                  >
                    <Input placeholder="Nhập tên topic" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="orderIndex"
                    label="Thứ tự"
                    rules={[{ required: true, message: 'Vui lòng nhập thứ tự!' }]}
                  >
                    <Input type="number" placeholder="1" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="lessonUid"
                label="Lesson"
                rules={[{ required: true, message: 'Vui lòng chọn lesson!' }]}
              >
                <Select 
                  placeholder="Chọn lesson"
                  showSearch
                  filterOption={(input, option) => {
                    const label = option?.label || option?.children;
                    if (typeof label === 'string') {
                      return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                >
                  {lessons.map((lesson: any) => (
                    <Option key={lesson.uid} value={lesson.uid}>
                      {lesson.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[
                  { required: true, message: 'Vui lòng nhập mô tả!' },
                  { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
                ]}
              >
                <Input.TextArea rows={6} placeholder="Nhập mô tả topic" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      setEditingTopic(null);
                      form.resetFields();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={createTopicMutation.isPending || updateTopicMutation.isPending}
                  >
                    {editingTopic ? 'Cập nhật' : 'Tạo mới'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTopicManagement;