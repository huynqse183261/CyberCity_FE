import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { Card, Table, Button, Space, Avatar, Tag, Modal, Form, Input, message, Popconfirm } from 'antd';
import { UserAddOutlined, EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const initialStudents = [
  { key: 1, name: 'Nguyễn Văn Khôi', className: 'Lớp Linux', progress: 85, average: 8.5, status: 'Đang học' },
  { key: 2, name: 'Lê Thị Hương', className: 'Lớp Design', progress: 90, average: 9.0, status: 'Hoàn thành' },
];

const TeacherStudents: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<any>(null);
  const [students, setStudents] = React.useState(initialStudents);
  const [search, setSearch] = React.useState('');

  // Thêm học sinh mới
  const handleCreate = (values: any) => {
    setStudents([
      ...students,
      {
        key: students.length + 1,
        ...values,
        progress: 0,
        average: 0,
        status: 'Đang học',
      },
    ]);
    setModalOpen(false);
    message.success('Đã thêm học sinh mới!');
  };

  // Sửa học sinh
  const handleEdit = (values: any) => {
    setStudents(students.map(s => s.key === selectedStudent.key ? { ...s, ...values } : s));
    setEditOpen(false);
    message.success('Đã cập nhật thông tin học sinh!');
  };

  // Xóa học sinh
  const handleDelete = (key: number) => {
    setStudents(students.filter(s => s.key !== key));
    message.success('Đã xóa học sinh!');
  };

  // Lọc học sinh
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Space><Avatar>{text[0]}</Avatar>{text}</Space>,
    },
    { title: 'Lớp', dataIndex: 'className', key: 'className' },
    { title: 'Tiến độ', dataIndex: 'progress', key: 'progress' },
    { title: 'Điểm TB', dataIndex: 'average', key: 'average' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Hoàn thành' ? 'green' : 'blue'}>{status}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => { setSelectedStudent(record); setViewOpen(true); }}>Xem</Button>
          <Button icon={<EditOutlined />} onClick={() => { setSelectedStudent(record); setEditOpen(true); }}>Sửa</Button>
          <Popconfirm title="Xóa học sinh này?" onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <TeacherLayout>
      <Card
        title="Danh sách học sinh"
        extra={<Button icon={<UserAddOutlined />} type="primary" onClick={() => setModalOpen(true)}>Thêm học sinh</Button>}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm học sinh..."
          style={{ width: 300, marginBottom: 16 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Table columns={columns} dataSource={filteredStudents} />
      </Card>
      {/* Modal thêm học sinh */}
      <Modal
        title="Thêm học sinh mới"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreate}>
          <Form.Item label="Họ và tên" name="name" required rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Lớp" name="className" required rules={[{ required: true, message: 'Nhập lớp' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Thêm học sinh</Button>
        </Form>
      </Modal>
      {/* Modal sửa học sinh */}
      <Modal
        title="Sửa thông tin học sinh"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={null}
      >
        {selectedStudent && (
          <Form
            layout="vertical"
            initialValues={selectedStudent}
            onFinish={handleEdit}
          >
            <Form.Item label="Họ và tên" name="name" required rules={[{ required: true, message: 'Nhập họ tên' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Lớp" name="className" required rules={[{ required: true, message: 'Nhập lớp' }]}>
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
          </Form>
        )}
      </Modal>
      {/* Modal xem chi tiết học sinh */}
      <Modal
        title="Chi tiết học sinh"
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={<Button onClick={() => setViewOpen(false)}>Đóng</Button>}
      >
        {selectedStudent && (
          <div>
            <p><b>Họ và tên:</b> {selectedStudent.name}</p>
            <p><b>Lớp:</b> {selectedStudent.className}</p>
            <p><b>Tiến độ:</b> {selectedStudent.progress}%</p>
            <p><b>Điểm TB:</b> {selectedStudent.average}</p>
            <p><b>Trạng thái:</b> {selectedStudent.status}</p>
          </div>
        )}
      </Modal>
    </TeacherLayout>
  );
};

export default TeacherStudents;