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
  useAllSubtopics,
  useCreateSubtopic,
  useUpdateSubtopic,
  useDeleteSubtopic
} from '../hooks/useSubtopics';
import { useAllTopics } from '../hooks/useTopics';
import { useGlobalRefetch } from '../hooks/useGlobalRefetch';
import type { 
  Subtopic,
  CreateSubtopicRequest,
  UpdateSubtopicRequest,
  SubtopicListParams
} from '../services/subtopicService';
import '../styles/AdminProductManagement.css';

const { Title } = Typography;
const { Option } = Select;

interface SubtopicFilterState {
  topicId: string;
  searchQuery: string;
}

interface AdminSubtopicManagementProps {}

const AdminSubtopicManagement: React.FC<AdminSubtopicManagementProps> = () => {
  // State management
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingSubtopic, setEditingSubtopic] = useState<Subtopic | null>(null);
  const [form] = Form.useForm();
  
  // Pagination and filter state
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10 });
  const [filters, setFilters] = useState<SubtopicFilterState>({
    topicId: '',
    searchQuery: '',
  });

  // Build request params - Send all filters to server
  const requestParams: SubtopicListParams = {
    pageNumber: pagination.pageNumber,
    pageSize: pagination.pageSize,
    ...(filters.topicId && { topicId: filters.topicId }),
    ...(filters.searchQuery && { search: filters.searchQuery })
  };

  // React Query hooks
  const { 
    data: subtopicsResponse, 
    isLoading: loadingSubtopics
  } = useAllSubtopics(requestParams);

  const { 
    data: topicsResponse,
    isLoading: loadingTopics
  } = useAllTopics({ pageSize: 1000 }); // Get all topics for dropdown

  // Global refetch hook
  const { refetchSubtopics } = useGlobalRefetch();

  // Extract data from responses - Use server-side filtered data directly
  const subtopics = subtopicsResponse?.data?.items || [];
  const paginationInfo = subtopicsResponse?.data;
  const topics = topicsResponse?.data?.items || [];

  // Mutation hooks
  const createSubtopicMutation = useCreateSubtopic({
    onSuccess: () => {
      setModalVisible(false);
      setEditingSubtopic(null);
      form.resetFields();
      refetchSubtopics();
    },
    onError: (error) => {
      // console.error('Create subtopic error:', error);
    }
  });

  const updateSubtopicMutation = useUpdateSubtopic({
    onSuccess: () => {
      setModalVisible(false);
      setEditingSubtopic(null);
      form.resetFields();
      refetchSubtopics();
    },
    onError: (error) => {
      // console.error('Update subtopic error:', error);
    }
  });

  const deleteSubtopicMutation = useDeleteSubtopic({
    onSuccess: () => {
      refetchSubtopics();
    },
    onError: (error) => {
      // console.error('Delete subtopic error:', error);
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
  const handleFilterChange = (key: keyof SubtopicFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  // Helper function to get topic name
  const getTopicName = (topicId: string) => {
    const topic = topics.find((t: any) => t.uid === topicId);
    return topic?.title || topicId;
  };

  // Handle create/edit subtopic
  const handleSaveSubtopic = (values: any) => {
    if (!values.topicId) {
      // console.error('Topic ID is required');
      return;
    }

    const selectedTopic = topics.find((t: any) => t.uid === values.topicId);
    if (!selectedTopic) {
      // console.error('Selected topic not found');
      return;
    }

    // console.log('Selected topic for subtopic:', selectedTopic);
    // console.log('Form values:', values);

    if (editingSubtopic) {
      // Update subtopic
      const updateData: UpdateSubtopicRequest = {
        topicId: values.topicId,
        title: values.title,
        content: values.content,
        orderIndex: parseInt(values.orderIndex) || 0
      };
      
      updateSubtopicMutation.mutate({
        id: editingSubtopic.uid!,
        data: updateData
      });
    } else {
      // Create subtopic
      const createData: CreateSubtopicRequest = {
        topicId: values.topicId,
        title: values.title,
        content: values.content,
        orderIndex: parseInt(values.orderIndex) || 0
      };
      
      createSubtopicMutation.mutate(createData);
    }
  };

  // Handle delete subtopic
  const handleDeleteSubtopic = (id: string) => {
    deleteSubtopicMutation.mutate(id);
  };

  // Handle edit subtopic
  const handleEditSubtopic = (subtopic: Subtopic) => {
    setEditingSubtopic(subtopic);
    form.setFieldsValue({
      title: subtopic.title,
      content: subtopic.content,
      orderIndex: subtopic.orderIndex,
      topicId: subtopic.topicId,
    });
    setModalVisible(true);
  };

  // Handle create new subtopic
  const handleCreateSubtopic = () => {
    setEditingSubtopic(null);
    form.resetFields();
    form.setFieldsValue({ 
      orderIndex: subtopics.length + 1
    });
    setModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<Subtopic> = [
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
      title: 'Tên Subtopic',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 200,
      render: (title: string, record: Subtopic) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{title || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.content?.slice(0, 50) || 'Không có nội dung'}...
          </div>
        </div>
      ),
    },
    {
      title: 'Topic',
      dataIndex: 'topicId',
      key: 'topicId',
      width: 150,
      ellipsis: true,
      render: (topicId: string) => (
        <Tag color="blue">{getTopicName(topicId)}</Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 80,
      sorter: (a: Subtopic, b: Subtopic) => (a.orderIndex || 0) - (b.orderIndex || 0),
      render: (orderIndex: number) => (
        <Tag color="green">#{orderIndex || 0}</Tag>
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
            onClick={() => handleEditSubtopic(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa subtopic"
            description="Bạn có chắc chắn muốn xóa subtopic này?"
            onConfirm={() => handleDeleteSubtopic(record.uid)}
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
            <Title level={2}>Quản lý Subtopics</Title>
          </div>

          {/* Filters */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={6} lg={5}>
                <Input
                  placeholder="Tìm kiếm subtopics..."
                  prefix={<SearchOutlined />}
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Select
                  placeholder="Chọn topic"
                  value={filters.topicId || undefined}
                  onChange={(value) => handleFilterChange('topicId', value)}
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
                  {topics.map((topic: any) => (
                    <Option key={topic.uid} value={topic.uid}>
                      {topic.title}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateSubtopic}
                  >
                    Thêm Subtopic
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => refetchSubtopics()}
                    loading={loadingSubtopics}
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
                    {paginationInfo?.totalItems || subtopics.length}
                  </div>
                  <div>Tổng Subtopics</div>
                </div>
              </Col>
            </Row>
            {filters.topicId && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Tag color="processing" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  Đang hiển thị subtopics của: {getTopicName(filters.topicId)}
                </Tag>
              </div>
            )}
          </Card>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={subtopics}
            rowKey={(record) => record.uid || Math.random().toString()}
            loading={loadingSubtopics || loadingTopics ||
                     createSubtopicMutation.isPending || 
                     updateSubtopicMutation.isPending || 
                     deleteSubtopicMutation.isPending}
            pagination={{
              current: paginationInfo?.pageNumber || 1,
              pageSize: paginationInfo?.pageSize || 10,
              total: paginationInfo?.totalItems || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} subtopics`,
              onChange: handleTableChange,
              onShowSizeChange: handleTableChange,
            }}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: subtopics.length === 0 ? 
                'Chưa có subtopics nào được tạo' : 
                'Không tìm thấy subtopics phù hợp với bộ lọc'
            }}
          />

          {/* Create/Edit Modal */}
          <Modal
            title={editingSubtopic ? 'Sửa Subtopic' : 'Thêm Subtopic mới'}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              setEditingSubtopic(null);
              form.resetFields();
            }}
            footer={null}
            width={900}
            destroyOnHidden
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveSubtopic}
              initialValues={{
                orderIndex: 1,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="title"
                    label="Tên Subtopic"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên subtopic!' },
                      { min: 3, message: 'Tên subtopic phải có ít nhất 3 ký tự!' },
                    ]}
                  >
                    <Input placeholder="Nhập tên subtopic" />
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
                name="topicId"
                label="Topic"
                rules={[{ required: true, message: 'Vui lòng chọn topic!' }]}
              >
                <Select 
                  placeholder="Chọn topic"
                  showSearch
                  filterOption={(input, option) => {
                    const label = option?.label || option?.children;
                    if (typeof label === 'string') {
                      return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                >
                  {topics.map((topic: any) => (
                    <Option key={topic.uid} value={topic.uid}>
                      {topic.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="content"
                label="Nội dung"
                rules={[
                  { required: true, message: 'Vui lòng nhập nội dung!' },
                  { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự!' },
                ]}
              >
                <Input.TextArea rows={6} placeholder="Nhập nội dung subtopic" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      setEditingSubtopic(null);
                      form.resetFields();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={createSubtopicMutation.isPending || updateSubtopicMutation.isPending}
                  >
                    {editingSubtopic ? 'Cập nhật' : 'Tạo mới'}
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

export default AdminSubtopicManagement;