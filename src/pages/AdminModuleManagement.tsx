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
  message, 
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
  useAllModules,
  useCreateModule,
  useUpdateModule,
  useDeleteModule
} from '../hooks/useModules';
import { useAllCourses } from '../hooks/useCourses';
import { useGlobalRefetch } from '../hooks/useGlobalRefetch';
import type { 
  Module, 
  CreateModuleRequest,
  UpdateModuleRequest
} from '../models';
import '../styles/AdminProductManagement.css';

const { Title } = Typography;
const { Option } = Select;

interface ModuleFilterState {
  courseId: string;
  searchQuery: string;
}

const AdminModuleManagement: React.FC = () => {
  // State management
  const [filterState, setFilterState] = useState<ModuleFilterState>({
    courseId: '',
    searchQuery: ''
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10 });
  const [form] = Form.useForm();

  // API hooks - Lấy tất cả modules và courses với phân trang
  const { 
    data: modulesResponse, 
    isLoading: loadingModules
  } = useAllModules(pagination);

  const {
    data: coursesResponse,
    isLoading: loadingCourses
  } = useAllCourses();

  // Global refetch hook
  const { refetchModules } = useGlobalRefetch();

  // Extract data from responses với fallback
  const allModules = modulesResponse?.data || [];
  const paginationInfo = (modulesResponse as any)?.pagination;
  // Handle course response - có thể là array trực tiếp hoặc wrapped trong items
  const courses = (coursesResponse?.data as any)?.items || coursesResponse?.data || [];


  // Handle pagination change
  const handleTableChange = (page: number, pageSize?: number) => {
    setPagination({
      pageNumber: page,
      pageSize: pageSize || pagination.pageSize
    });
  };

  // Filter modules based on selected course and search query (local filter)
  const filteredModules = allModules.filter((module: any) => {
    const matchesCourse = !filterState.courseId || module.courseUid === filterState.courseId;
    const matchesSearch = !filterState.searchQuery || 
      module.title?.toLowerCase().includes(filterState.searchQuery.toLowerCase()) ||
      module.description?.toLowerCase().includes(filterState.searchQuery.toLowerCase());
    
    return matchesCourse && matchesSearch;
  });

  const createModuleMutation = useCreateModule({
    onSuccess: () => {
      setModalVisible(false);
      form.resetFields();
      setEditingModule(null);
      // Reload data instead of full page
      refetchModules();
    },
    onError: (error) => {
    }
  });

  const updateModuleMutation = useUpdateModule({
    onSuccess: () => {
      setModalVisible(false);
      form.resetFields();
      setEditingModule(null);
      // Reload data instead of full page
      refetchModules();
    },
    onError: (error) => {
    }
  });

  const deleteModuleMutation = useDeleteModule({
    onSuccess: () => {
      // Reload data instead of full page
      refetchModules();
    },
    onError: (error) => {
    }
  });

  // Helper function to get course name
  const getCourseName = (courseId: string) => {
    const course = courses.find((c: any) => c.uid === courseId);
    return course?.title || courseId;
  };

  // Handle create/edit module
  const handleSaveModule = (values: any) => {
    // Validation: Kiểm tra courseId có tồn tại không
    if (!values.courseId) {
      message.error('Vui lòng chọn khóa học!');
      return;
    }

    const selectedCourse = courses.find((c: any) => c.uid === values.courseId);
    if (!selectedCourse) {
      message.error('Khóa học được chọn không tồn tại!');
      return;
    }


    if (editingModule) {
      // Update module - gửi đúng theo API spec
      const updateData: UpdateModuleRequest = {
        courseUid: values.courseId, // Frontend form field courseId -> Backend API field courseUid
        title: values.title,
        description: values.description,
        orderIndex: parseInt(values.orderIndex) || 0
      };
      

      updateModuleMutation.mutate({
        id: editingModule.uid!,
        data: updateData
      });
    } else {
      // Create module - gửi đúng theo API spec
      const createData: CreateModuleRequest = {
        courseUid: values.courseId, // Frontend form field courseId -> Backend API field courseUid
        title: values.title,
        description: values.description,
        orderIndex: parseInt(values.orderIndex) || 0
      };
      

      createModuleMutation.mutate(createData);
    }
  };

  // Handle delete module
  const handleDeleteModule = (id: string) => {
    deleteModuleMutation.mutate(id);
  };

  // Handle edit module
  const handleEditModule = (module: any) => {
    setEditingModule(module);
    form.setFieldsValue({
      title: module.title,
      description: module.description,
      orderIndex: module.orderIndex,
      courseId: module.courseUid, // Map courseUid from API to courseId form field
    });
    setModalVisible(true);
  };

  // Handle create new module
  const handleCreateModule = () => {
    setEditingModule(null);
    form.resetFields();
    // Chỉ set các giá trị mặc định cần thiết cho create mode
    form.setFieldsValue({ 
      orderIndex: allModules.length + 1
    });
    setModalVisible(true);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof ModuleFilterState, value: any) => {
    const newFilters = { ...filterState, [key]: value };
    setFilterState(newFilters);
  };

  // Table columns
  const columns: ColumnsType<any> = [
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
      title: 'Tên Module',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 120,
      render: (title: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{title || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description || 'Không có mô tả'}
          </div>
        </div>
      ),
    },
    {
      title: 'Khóa học',
      dataIndex: 'courseUid',
      key: 'courseUid',
      width: 150,
      ellipsis: true,
      render: (courseUid: string) => (
        <Tag color="blue">{getCourseName(courseUid)}</Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 80,
      sorter: (a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0),
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
            onClick={() => handleEditModule(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa module"
            description="Bạn có chắc chắn muốn xóa module này?"
            onConfirm={() => handleDeleteModule(record.uid)}
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
            <Title level={2}>Quản lý Modules</Title>
          </div>

          {/* Filters */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={8} lg={6}>
                <Input
                  placeholder="Tìm kiếm modules..."
                  prefix={<SearchOutlined />}
                  value={filterState.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Chọn khóa học"
                  value={filterState.courseId || undefined}
                  onChange={(value) => handleFilterChange('courseId', value)}
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
                  {courses.map((course: any) => (
                    <Option key={course.uid} value={course.uid}>
                      {course.title}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateModule}
                  >
                    Thêm Module
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => refetchModules()}
                    loading={loadingModules}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Stats - Hiển thị tổng quan cho tất cả modules */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {paginationInfo?.totalItems || allModules.length}
                  </div>
                  <div>Tổng Modules</div>
                </div>
              </Col>
            </Row>
            {filterState.courseId && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Tag color="processing" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  Đang hiển thị modules của: {getCourseName(filterState.courseId)}
                </Tag>
              </div>
            )}
          </Card>

          {/* Table - Hiển thị tất cả modules với phân trang từ BE */}
          <Table
            columns={columns}
            dataSource={filteredModules}
            rowKey={(record) => record.uid || record.id || Math.random().toString()}
            loading={loadingModules || loadingCourses ||
                     createModuleMutation.isPending || 
                     updateModuleMutation.isPending || 
                     deleteModuleMutation.isPending}
            pagination={{
              current: paginationInfo?.pageNumber || 1,
              pageSize: paginationInfo?.pageSize || 10,
              total: paginationInfo?.totalItems || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} modules`,
              onChange: handleTableChange,
              onShowSizeChange: handleTableChange,
            }}
            scroll={{ x: 1400 }}
            locale={{
              emptyText: allModules.length === 0 ? 
                'Chưa có modules nào được tạo' : 
                'Không tìm thấy modules phù hợp với bộ lọc'
            }}
          />

          {/* Create/Edit Modal */}
          <Modal
            title={editingModule ? 'Sửa Module' : 'Thêm Module mới'}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              setEditingModule(null);
              form.resetFields();
            }}
            footer={null}
            width={800}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveModule}
              initialValues={{
                orderIndex: 1,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="title"
                    label="Tên Module"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên module!' },
                      { min: 3, message: 'Tên module phải có ít nhất 3 ký tự!' },
                    ]}
                  >
                    <Input placeholder="Nhập tên module" />
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
                name="description"
                label="Mô tả"
                rules={[
                  { required: true, message: 'Vui lòng nhập mô tả!' },
                  { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
                ]}
              >
                <Input.TextArea rows={3} placeholder="Nhập mô tả module" />
              </Form.Item>

              <Form.Item
                name="courseId"
                label="Khóa học"
                rules={[{ required: true, message: 'Vui lòng chọn khóa học!' }]}
              >
                <Select 
                  placeholder="Chọn khóa học"
                  showSearch
                  filterOption={(input, option) => {
                    const label = option?.label || option?.children;
                    if (typeof label === 'string') {
                      return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                >
                  {courses.map((course: any) => (
                    <Option key={course.uid} value={course.uid}>
                      {course.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      setEditingModule(null);
                      form.resetFields();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={createModuleMutation.isPending || updateModuleMutation.isPending}
                  >
                    {editingModule ? 'Cập nhật' : 'Tạo mới'}
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

export default AdminModuleManagement;
