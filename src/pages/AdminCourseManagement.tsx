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
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { 
  useAllCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse
} from '../hooks/useCourses';
import { useGlobalRefetch } from '../hooks/useGlobalRefetch';
import type { 
  Course, 
  CourseFormData, 
  CourseListParams,
  CourseFilterState
} from '../models/CourseTypes';
import '../styles/AdminProductManagement.css';

const { Title } = Typography;
const { Option } = Select;

interface AdminCourseManagementProps {}

const AdminCourseManagement: React.FC<AdminCourseManagementProps> = () => {
  // State management
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  
  // Pagination and filter state
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10 });
  const [filters, setFilters] = useState<CourseFilterState>({
    level: '',
    searchQuery: '',
    isActive: undefined,
  });

  // Build request params
  const requestParams: CourseListParams = {
    pageNumber: pagination.pageNumber,
    pageSize: pagination.pageSize,
    level: filters.level || undefined,
    descending: true,
  };

  // React Query hooks
  const { 
    data: coursesResponse, 
    isLoading: loading
  } = useAllCourses(requestParams);

  // Global refetch hook
  const { refetchCourses } = useGlobalRefetch();

  // Extract data from response
  const courses = coursesResponse?.data?.items || [];
  const paginationInfo = coursesResponse?.data;

  // Mutation hooks
  const createCourseMutation = useCreateCourse({
    onSuccess: () => {
      setModalVisible(false);
      setEditingCourse(null);
      form.resetFields();
      // Use global refetch
      refetchCourses();
    },
    onError: (error) => {
      // console.error('Create course error:', error);
    }
  });

  const updateCourseMutation = useUpdateCourse({
    onSuccess: () => {
      setModalVisible(false);
      setEditingCourse(null);
      form.resetFields();
      // Use global refetch
      refetchCourses();
    },
    onError: (error) => {
      // console.error('Update course error:', error);
    }
  });

  const deleteCourseMutation = useDeleteCourse({
    onSuccess: () => {
      // console.log('Delete course success');
      // Use global refetch
      refetchCourses();
    },
    onError: (error) => {
      // console.error('Delete course error:', error);
    }
  });

  // Handle table change
  const handleTableChange = (
    newPagination: TablePaginationConfig,
  ) => {
    setPagination({
      pageNumber: newPagination.current || pagination.pageNumber,
      pageSize: newPagination.pageSize || pagination.pageSize,
    });
  };

  // Handle create/edit course
  const handleSaveCourse = async (values: CourseFormData) => {
    const courseData = {
      title: values.title,
      description: values.description,
      level: values.level,
    };
    
    // console.log('Saving course data:', courseData);
    
    if (editingCourse) {
      updateCourseMutation.mutate({
        uid: editingCourse.uid,
        ...courseData,
      });
    } else {
      createCourseMutation.mutate(courseData);
    }
  };

  // Handle delete course
  const handleDeleteCourse = async (id: string) => {
    // console.log('Attempting to delete course with ID:', id);
    deleteCourseMutation.mutate(id);
  };

  // Handle edit course
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      title: course.title,
      description: course.description,
      level: course.level,
      price: course.price,
      duration: course.duration,
      instructor: course.instructor,
      thumbnail: course.thumbnail,
      isActive: course.isActive,
    });
    setModalVisible(true);
  };

  // Handle create new course
  const handleCreateCourse = () => {
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof CourseFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  // Table columns
  const columns: ColumnsType<Course> = [
    {
      title: 'ID',
      dataIndex: 'uid',
      key: 'uid',
      width: 200,
      ellipsis: true,
        render: (uid: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {(uid || '').slice(0, 8)}...
        </span>
      ),
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => (
        <Tag color={
          level === 'beginner' ? 'green' : 
          level === 'intermediate' ? 'orange' : 
          level === 'advanced' ? 'red' : 'default'
        }>
          {level === 'beginner' ? 'Cơ bản' : 
           level === 'intermediate' ? 'Trung cấp' : 
           level === 'advanced' ? 'Nâng cao' : level}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(record)}
          />
          <Popconfirm
            title="Xóa khóa học"
            description="Bạn có chắc chắn muốn xóa khóa học này?"
            onConfirm={() => handleDeleteCourse(record.uid)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
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
            <Title level={2}>Quản lý Khóa học</Title>
          </div>

          {/* Filters */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input
                  placeholder="Tìm kiếm khóa học..."
                  prefix={<SearchOutlined />}
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Chọn cấp độ"
                  value={filters.level || undefined}
                  onChange={(value) => handleFilterChange('level', value)}
                  allowClear
                  style={{ width: '100%' }}
                >
                  <Option value="beginner">Cơ bản</Option>
                  <Option value="intermediate">Trung cấp</Option>
                  <Option value="advanced">Nâng cao</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateCourse}
                  >
                    Thêm khóa học
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => refetchCourses()}
                    loading={loading}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={courses}
            rowKey={(record) => record.uid}
            loading={loading ||
                     createCourseMutation.isPending || 
                     updateCourseMutation.isPending || 
                     deleteCourseMutation.isPending}
            pagination={{
              current: pagination.pageNumber,
              pageSize: pagination.pageSize,
              total: paginationInfo?.totalCount || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khóa học`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1400 }}
          />

          {/* Create/Edit Modal */}
          <Modal
            title={editingCourse ? 'Sửa khóa học' : 'Thêm khóa học mới'}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              setEditingCourse(null);
              form.resetFields();
            }}
            footer={null}
            width={900}
            destroyOnHidden
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveCourse}
              initialValues={{
                isActive: true,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="title"
                    label="Tên khóa học"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên khóa học!' },
                      { min: 3, message: 'Tên khóa học phải có ít nhất 3 ký tự!' },
                    ]}
                  >
                    <Input placeholder="Nhập tên khóa học" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="level"
                    label="Cấp độ"
                    rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}
                  >
                    <Select placeholder="Chọn cấp độ">
                      <Option value="beginner">Cơ bản</Option>
                      <Option value="intermediate">Trung cấp</Option>
                      <Option value="advanced">Nâng cao</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[
                  { required: true, message: 'Vui lòng nhập mô tả!' },
                  { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Nhập mô tả khóa học" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      setEditingCourse(null);
                      form.resetFields();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={createCourseMutation.isPending || updateCourseMutation.isPending}
                  >
                    {editingCourse ? 'Cập nhật' : 'Tạo mới'}
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

export default AdminCourseManagement;
