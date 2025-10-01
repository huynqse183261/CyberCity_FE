import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { Card, Table, Button, Space, Progress, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const initialClasses = [
  { key: 1, name: 'Lớp Linux', subject: 'Linux', students: 30, progress: 80, schedule: 'Thứ 2, 4, 6' },
  { key: 2, name: 'Lớp Design', subject: 'UI/UX', students: 25, progress: 75, schedule: 'Thứ 3, 5, 7' },
];

const TeacherClasses: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<any>(null);
  const [classes, setClasses] = React.useState(initialClasses);
  const [search, setSearch] = React.useState('');

  // Tạo lớp mới
  const handleCreate = (values: any) => {
    setClasses([
      ...classes,
      {
        key: classes.length + 1,
        ...values,
        students: 0,
        progress: 0,
      },
    ]);
    setModalOpen(false);
    message.success('Đã tạo lớp mới!');
  };

  // Sửa lớp
  const handleEdit = (values: any) => {
    setClasses(classes.map(c => c.key === selectedClass.key ? { ...c, ...values } : c));
    setEditOpen(false);
    message.success('Đã cập nhật thông tin lớp!');
  };

  // Xóa lớp
  const handleDelete = (key: number) => {
    setClasses(classes.filter(c => c.key !== key));
    message.success('Đã xóa lớp!');
  };

  // Lọc lớp
  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: 'Tên lớp', dataIndex: 'name', key: 'name' },
    { title: 'Môn học', dataIndex: 'subject', key: 'subject' },
    { title: 'Số học sinh', dataIndex: 'students', key: 'students' },
    {
      title: 'Tiến độ TB',
      dataIndex: 'progress',
      key: 'progress',
      render: (value: number) => <Progress percent={value} size="small" />,
    },
    { title: 'Lịch học', dataIndex: 'schedule', key: 'schedule' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => { setSelectedClass(record); setViewOpen(true); }}>Xem</Button>
          <Button icon={<EditOutlined />} onClick={() => { setSelectedClass(record); setEditOpen(true); }}>Sửa</Button>
          <Popconfirm title="Xóa lớp này?" onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <TeacherLayout>
      <Card
        title="Quản lý lớp học"
        extra={<Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpen(true)}>Tạo lớp học</Button>}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm lớp học..."
          style={{ width: 300, marginBottom: 16 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Table columns={columns} dataSource={filteredClasses} />
      </Card>
      {/* Modal tạo lớp */}
      <Modal
        title="Tạo lớp học mới"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreate}>
          <Form.Item label="Tên lớp" name="name" required rules={[{ required: true, message: 'Nhập tên lớp' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Môn học" name="subject" required rules={[{ required: true, message: 'Nhập môn học' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Lịch học" name="schedule">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Tạo lớp</Button>
        </Form>
      </Modal>
      {/* Modal sửa lớp */}
      <Modal
        title="Sửa thông tin lớp"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={null}
      >
        {selectedClass && (
          <Form
            layout="vertical"
            initialValues={selectedClass}
            onFinish={handleEdit}
          >
            <Form.Item label="Tên lớp" name="name" required rules={[{ required: true, message: 'Nhập tên lớp' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Môn học" name="subject" required rules={[{ required: true, message: 'Nhập môn học' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Lịch học" name="schedule">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
          </Form>
        )}
      </Modal>
      {/* Modal xem chi tiết lớp */}
      <Modal
        title="Chi tiết lớp học"
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={<Button onClick={() => setViewOpen(false)}>Đóng</Button>}
      >
        {selectedClass && (
          <div>
            <p><b>Tên lớp:</b> {selectedClass.name}</p>
            <p><b>Môn học:</b> {selectedClass.subject}</p>
            <p><b>Số học sinh:</b> {selectedClass.students}</p>
            <p><b>Tiến độ TB:</b> {selectedClass.progress}%</p>
            <p><b>Lịch học:</b> {selectedClass.schedule}</p>
          </div>
        )}
      </Modal>
    </TeacherLayout>
  );
};

export default TeacherClasses;