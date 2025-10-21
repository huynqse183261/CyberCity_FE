import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherLayout from '../components/TeacherLayout';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Avatar, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  message, 
  Popconfirm,
  Select
} from 'antd';
import { 
  UserAddOutlined, 
  EyeOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  LineChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTeacherStudents } from '../hooks/useTeacher';
import type { StudentDto } from '../services/teacherService';
import { useAllCourses } from '../hooks/useCourses';

const TeacherStudents: React.FC = () => {
  const navigate = useNavigate();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();
  
  // Search & filter state
  const [searchText, setSearchText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // Fetch students from API
  const {
    loading,
    students,
    totalItems,
    currentPage,
    addStudent,
    removeStudent,
    handleSearch,
    handleCourseFilter,
    handlePageChange,
  } = useTeacherStudents();

  // Fetch courses for filter dropdown (optional - nếu không có API courses thì comment lại)
  const { data: coursesData } = useAllCourses({ pageSize: 1000 });
  const courses = Array.isArray(coursesData?.data) ? coursesData.data : [];
  
  console.log('Courses data:', coursesData); // Debug log
  console.log('Courses array:', courses); // Debug log

  // Handle search with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch(searchText);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchText, handleSearch]);

  // Handle course filter
  useEffect(() => {
    handleCourseFilter(selectedCourse || undefined);
  }, [selectedCourse, handleCourseFilter]);

  // Thêm học sinh vào khóa học
  const handleAddStudent = async () => {
    try {
      const values = await addForm.validateFields();
      const success = await addStudent({
        studentUid: values.studentUid,
        courseUid: values.courseUid
      });
      
      if (success) {
        setAddModalOpen(false);
        addForm.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Xóa học sinh khỏi khóa học (placeholder - sẽ cần modal để chọn course)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveStudent = async (studentUid: string, courseUid: string) => {
    const success = await removeStudent(studentUid, courseUid);
    if (success) {
      message.success('Đã xóa học sinh khỏi khóa học!');
    }
  };

  // View student detail
  const handleViewDetail = (studentUid: string) => {
    navigate(`/teacher/students/${studentUid}`);
  };

  // View student progress
  const handleViewProgress = (studentUid: string) => {
    navigate(`/teacher/students/${studentUid}/progress`);
  };

  // Table columns
  const columns: ColumnsType<StudentDto> = [
    {
      title: 'Học sinh',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {record.fullName?.charAt(0) || 'S'}
          </Avatar>
          <div>
            <div><strong>{record.fullName}</strong></div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Khóa học đã đăng ký',
      dataIndex: 'enrolledCourses',
      key: 'enrolledCourses',
      render: (courses: any[]) => (
        <Space direction="vertical" size={4}>
          {courses && courses.length > 0 ? (
            courses.map((course: any, idx: number) => (
              <Tag key={idx} color="blue">{course.courseTitle || course}</Tag>
            ))
          ) : (
            <Tag color="default">Chưa có khóa học</Tag>
          )}
        </Space>
      )
    },
    {
      title: 'Hoạt động cuối',
      dataIndex: 'lastActive',
      key: 'lastActive',
      width: 180,
      render: (date: string) => date ? new Date(date).toLocaleString('vi-VN') : 'Chưa có hoạt động'
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 280,
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record.uid)}
            size="small"
          >
            Chi tiết
          </Button>
          <Button 
            icon={<LineChartOutlined />} 
            onClick={() => handleViewProgress(record.uid)}
            type="primary"
            size="small"
          >
            Tiến độ
          </Button>
          <Popconfirm 
            title="Xóa học sinh khỏi khóa học?" 
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => {
              // TODO: Need to select which course to remove from
              // For now, just show warning
              message.warning('Vui lòng chọn khóa học cần xóa');
            }}
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <TeacherLayout>
      <Card
        title="Quản lý học sinh"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => window.location.reload()}
            >
              Làm mới
            </Button>
            <Button 
              icon={<UserAddOutlined />} 
              type="primary" 
              onClick={() => setAddModalOpen(true)}
            >
              Thêm học sinh
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Search & Filter */}
          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm theo tên/email..."
              style={{ width: 300 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
            {courses.length > 0 && (
              <Select
                placeholder="Lọc theo khóa học"
                style={{ width: 250 }}
                value={selectedCourse || undefined}
                onChange={value => setSelectedCourse(value || '')}
                allowClear
                options={courses.map((course: any) => ({
                  label: course.title || course.name || 'Untitled',
                  value: course.uid || course.id
                }))}
              />
            )}
          </Space>

          {/* Students Table */}
          <Table 
            columns={columns} 
            dataSource={students}
            rowKey="uid"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: 20,
              total: totalItems,
              onChange: handlePageChange,
              showSizeChanger: false,
              showTotal: (total) => `Tổng ${total} học sinh`
            }}
          />
        </Space>
      </Card>

      {/* Modal Thêm học sinh vào khóa học */}
      <Modal
        title="Thêm học sinh vào khóa học"
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          addForm.resetFields();
        }}
        footer={null}
      >
        <Form 
          form={addForm}
          layout="vertical" 
          onFinish={handleAddStudent}
        >
          <Form.Item 
            label="UID Học sinh" 
            name="studentUid" 
            required 
            rules={[{ required: true, message: 'Nhập UID học sinh' }]}
          >
            <Input placeholder="UUID của học sinh" />
          </Form.Item>
          <Form.Item 
            label="Khóa học" 
            name="courseUid" 
            required 
            rules={[{ required: true, message: 'Chọn khóa học' }]}
          >
            <Select
              placeholder="Chọn khóa học"
              notFoundContent="Không có khóa học nào"
              options={courses.map((course: any) => ({
                label: course.title || course.name || 'Untitled',
                value: course.uid || course.id
              }))}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setAddModalOpen(false);
                addForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm học sinh
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </TeacherLayout>
  );
};

export default TeacherStudents;