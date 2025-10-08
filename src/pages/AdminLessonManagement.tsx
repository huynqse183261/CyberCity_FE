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
  useAllLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson
} from '../hooks/useLessons';
import { useAllModules } from '../hooks/useModules';
import { useAllCourses } from '../hooks/useCourses';
import { useGlobalRefetch } from '../hooks/useGlobalRefetch';
import type { 
  Lesson,
  CreateLessonRequest,
  UpdateLessonRequest,
  LessonListParams
} from '../services/lessonService';
import '../styles/AdminProductManagement.css';

const { Title } = Typography;
const { Option } = Select;

interface LessonFilterState {
  moduleUid: string;
  courseUid: string;
  searchQuery: string;
}

interface AdminLessonManagementProps {}

const AdminLessonManagement: React.FC<AdminLessonManagementProps> = () => {
  // State management
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10 });
  const [filters, setFilters] = useState<LessonFilterState>({
    courseUid: '',
    moduleUid: '',
    searchQuery: '',
  });
  const [form] = Form.useForm();

  // Build request params - Send all filters to server
  const requestParams: LessonListParams = {
    pageNumber: pagination.pageNumber,
    pageSize: pagination.pageSize,
    ...(filters.moduleUid && { moduleUid: filters.moduleUid }),
    ...(filters.searchQuery && { search: filters.searchQuery })
  };

  // API hooks - Lấy tất cả lessons với phân trang và modules, courses cho dropdown
  const { 
    data: lessonsResponse, 
    isLoading: loadingLessons
  } = useAllLessons(requestParams);

  const { 
    data: modulesResponse,
    isLoading: loadingModules
  } = useAllModules({ pageSize: 1000 }); // Get all modules for dropdown

  const {
    data: coursesResponse,
    isLoading: loadingCourses
  } = useAllCourses({ pageSize: 1000 }); // Get all courses for dropdown

  // Global refetch hook
  const { refetchLessons } = useGlobalRefetch();

  // Extract data from responses với fallback - Use server-side filtered data directly
  const lessons = lessonsResponse?.data?.items || [];
  const paginationInfo = lessonsResponse?.data;
  const modules = modulesResponse?.data || [];
  // Handle course response - có thể là array trực tiếp hoặc wrapped trong items
  const courses = (coursesResponse?.data as any)?.items || coursesResponse?.data || [];

  console.log('AdminLessonManagement: lessonsResponse:', lessonsResponse);
  console.log('AdminLessonManagement: paginationInfo:', paginationInfo);
  console.log('AdminLessonManagement: modulesResponse:', modulesResponse);
  console.log('AdminLessonManagement: lessons:', lessons);
  console.log('AdminLessonManagement: modules:', modules);

  // Mutation hooks
  const createLessonMutation = useCreateLesson({
    onSuccess: () => {
      console.log('Create lesson success');
      setModalVisible(false);
      setEditingLesson(null);
      form.resetFields();
      refetchLessons();
    },
    onError: (error) => {
      console.error('Create lesson error:', error);
    }
  });

  const updateLessonMutation = useUpdateLesson({
    onSuccess: () => {
      console.log('AdminLessonManagement: Update lesson success callback called');
      setModalVisible(false);
      setEditingLesson(null);
      form.resetFields();
      refetchLessons();
    },
    onError: (error) => {
      console.error('AdminLessonManagement: Update lesson error:', error);
    }
  });

  const deleteLessonMutation = useDeleteLesson({
    onSuccess: () => {
      console.log('AdminLessonManagement: Delete lesson success callback called');
      refetchLessons();
    },
    onError: (error) => {
      console.error('AdminLessonManagement: Delete lesson error:', error);
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
  const handleFilterChange = (key: keyof LessonFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  // Helper function to get module name
  const getModuleName = (moduleUid: string) => {
    const module = modules.find((m: any) => m.uid === moduleUid);
    return module?.title || moduleUid;
  };

  // Helper function to get course name from module
  const getCourseNameFromModule = (moduleUid: string) => {
    const module = modules.find((m: any) => m.uid === moduleUid);
    if (module?.courseUid) {
      const course = courses.find((c: any) => c.uid === module.courseUid);
      return course?.title || module.courseUid;
    }
    return 'N/A';
  };

  // Handle create/edit lesson
  const handleSaveLesson = (values: any) => {
    // Validation: Kiểm tra moduleUid có tồn tại không
    if (!values.moduleUid) {
      console.error('Module UID is required');
      return;
    }

    const selectedModule = modules.find((m: any) => m.uid === values.moduleUid);
    if (!selectedModule) {
      console.error('Selected module not found');
      return;
    }

    console.log('Selected module for lesson:', selectedModule);
    console.log('Form values:', values);
    console.log('Editing lesson:', editingLesson);

    if (editingLesson) {
      // Update lesson - gửi đúng theo API spec
      const updateData: UpdateLessonRequest = {
        moduleUid: values.moduleUid,
        title: values.title,
        content: values.content,
        lessonType: values.lessonType,
        orderIndex: parseInt(values.orderIndex) || 0
      };
      
      console.log('Updating lesson data:', updateData);
      console.log('Lesson ID to update:', editingLesson.uid);

      updateLessonMutation.mutate({
        id: editingLesson.uid!,
        data: updateData
      });
    } else {
      // Create lesson - gửi đúng theo API spec
      const createData: CreateLessonRequest = {
        moduleUid: values.moduleUid,
        title: values.title,
        content: values.content,
        lessonType: values.lessonType,
        orderIndex: parseInt(values.orderIndex) || 0
      };
      
      console.log('Creating lesson data:', createData);
      console.log('Available modules:', modules);

      createLessonMutation.mutate(createData);
    }
  };

  // Handle delete lesson
  const handleDeleteLesson = (id: string) => {
    deleteLessonMutation.mutate(id);
  };

  // Handle edit lesson
  const handleEditLesson = (lesson: Lesson) => {
    console.log('Editing lesson:', lesson);
    setEditingLesson(lesson);
    form.setFieldsValue({
      title: lesson.title,
      content: lesson.content,
      lessonType: lesson.lessonType,
      orderIndex: lesson.orderIndex,
      moduleUid: lesson.moduleUid, // Map moduleUid from API to moduleUid form field
    });
    setModalVisible(true);
  };

  // Handle create new lesson
  const handleCreateLesson = () => {
    setEditingLesson(null);
    form.resetFields();
    // Chỉ set các giá trị mặc định cần thiết cho create mode
    form.setFieldsValue({ 
      orderIndex: lessons.length + 1,
      lessonType: 'theory'
    });
    setModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<Lesson> = [
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
      title: 'Tên Lesson',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 200,
      render: (title: string, record: Lesson) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{title || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.content?.slice(0, 50) || 'Không có nội dung'}...
          </div>
        </div>
      ),
    },
    {
      title: 'Module',
      dataIndex: 'moduleUid',
      key: 'moduleUid',
      width: 150,
      ellipsis: true,
      render: (moduleUid: string) => (
        <Tag color="blue">{getModuleName(moduleUid)}</Tag>
      ),
    },
    {
      title: 'Khóa học',
      dataIndex: 'moduleUid',
      key: 'course',
      width: 150,
      ellipsis: true,
      render: (moduleUid: string) => (
        <Tag color="green">{getCourseNameFromModule(moduleUid)}</Tag>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'lessonType',
      key: 'lessonType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'theory' ? 'blue' : type === 'practice' ? 'orange' : 'purple'}>
          {type === 'theory' ? 'Lý thuyết' : 
           type === 'exercise' ? 'Thực hành' : 
           type === 'summary' ? 'Tóm tắt' : type}
        </Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 80,
      sorter: (a: Lesson, b: Lesson) => (a.orderIndex || 0) - (b.orderIndex || 0),
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
            onClick={() => handleEditLesson(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa lesson"
            description="Bạn có chắc chắn muốn xóa lesson này?"
            onConfirm={() => handleDeleteLesson(record.uid)}
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
            <Title level={2}>Quản lý Lessons</Title>
          </div>

          {/* Filters */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={6} lg={5}>
                <Input
                  placeholder="Tìm kiếm lessons..."
                  prefix={<SearchOutlined />}
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Select
                  placeholder="Chọn module"
                  value={filters.moduleUid || undefined}
                  onChange={(value) => handleFilterChange('moduleUid', value)}
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
                  {modules.map((module: any) => (
                    <Option key={module.uid} value={module.uid}>
                      {module.title}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateLesson}
                  >
                    Thêm Lesson
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => refetchLessons()}
                    loading={loadingLessons}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Stats - Hiển thị tổng quan cho tất cả lessons */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {paginationInfo?.totalItems || lessons.length}
                  </div>
                  <div>Tổng Lessons</div>
                </div>
              </Col>
            </Row>
            {filters.moduleUid && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Tag color="processing" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  Đang hiển thị lessons của: {getModuleName(filters.moduleUid)}
                </Tag>
              </div>
            )}
          </Card>

          {/* Table - Hiển thị tất cả lessons với phân trang từ BE */}
          <Table
            columns={columns}
            dataSource={lessons}
            rowKey={(record) => record.uid || Math.random().toString()}
            loading={loadingLessons || loadingModules || loadingCourses ||
                     createLessonMutation.isPending || 
                     updateLessonMutation.isPending || 
                     deleteLessonMutation.isPending}
            pagination={{
              current: paginationInfo?.pageNumber || 1,
              pageSize: paginationInfo?.pageSize || 10,
              total: paginationInfo?.totalItems || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} lessons`,
              onChange: handleTableChange,
              onShowSizeChange: handleTableChange,
            }}
            scroll={{ x: 1500 }}
            locale={{
              emptyText: lessons.length === 0 ? 
                'Chưa có lessons nào được tạo' : 
                'Không tìm thấy lessons phù hợp với bộ lọc'
            }}
          />

          {/* Create/Edit Modal */}
          <Modal
            title={editingLesson ? 'Sửa Lesson' : 'Thêm Lesson mới'}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              setEditingLesson(null);
              form.resetFields();
            }}
            footer={null}
            width={900}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveLesson}
              initialValues={{
                orderIndex: 1,
                lessonType: 'theory',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="title"
                    label="Tên Lesson"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên lesson!' },
                      { min: 3, message: 'Tên lesson phải có ít nhất 3 ký tự!' },
                    ]}
                  >
                    <Input placeholder="Nhập tên lesson" />
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

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="moduleUid"
                    label="Module"
                    rules={[{ required: true, message: 'Vui lòng chọn module!' }]}
                  >
                    <Select 
                      placeholder="Chọn module"
                      showSearch
                      filterOption={(input, option) => {
                        const label = option?.label || option?.children;
                        if (typeof label === 'string') {
                          return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }
                        return false;
                      }}
                    >
                      {modules.map((module: any) => (
                        <Option key={module.uid} value={module.uid}>
                          {module.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="lessonType"
                    label="Loại lesson"
                    rules={[{ required: true, message: 'Vui lòng chọn loại lesson!' }]}
                  >
                    <Select placeholder="Chọn loại lesson">
                      <Option value="theory">Lý thuyết</Option>
                      <Option value="exercise">Thực hành</Option>
                      <Option value="summary">Tóm tắt</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="content"
                label="Nội dung"
                rules={[
                  { required: true, message: 'Vui lòng nhập nội dung!' },
                  { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự!' },
                ]}
              >
                <Input.TextArea rows={6} placeholder="Nhập nội dung lesson" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      setEditingLesson(null);
                      form.resetFields();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={createLessonMutation.isPending || updateLessonMutation.isPending}
                  >
                    {editingLesson ? 'Cập nhật' : 'Tạo mới'}
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

export default AdminLessonManagement;
