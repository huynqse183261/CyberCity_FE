import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, SendOutlined, SearchOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const initialAssignments = [
  { key: 1, title: 'Lab Docker Container', deadline: '24/07/2025', status: 'Đã giao', description: 'Thực hành Docker.' },
  { key: 2, title: 'Linux Commands Practice', deadline: '22/07/2025', status: 'Chờ chấm', description: 'Luyện tập lệnh Linux.' },
];

const TeacherAssignments: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [notifyOpen, setNotifyOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedAssignment, setSelectedAssignment] = React.useState<any>(null);
  const [assignments, setAssignments] = React.useState(initialAssignments);
  const [search, setSearch] = React.useState('');

  // Thêm bài tập mới
  const handleCreate = (values: any) => {
    setAssignments([
      ...assignments,
      {
        key: assignments.length + 1,
        ...values,
        status: 'Đã giao',
        description: values.description || '',
      },
    ]);
    setModalOpen(false);
    message.success('Đã tạo bài tập mới!');
  };

  // Sửa bài tập
  const handleEdit = (values: any) => {
    setAssignments(assignments.map(a => a.key === selectedAssignment.key ? { ...a, ...values } : a));
    setEditOpen(false);
    message.success('Đã cập nhật bài tập!');
  };

  // Xóa bài tập
  const handleDelete = (key: number) => {
    setAssignments(assignments.filter(a => a.key !== key));
    message.success('Đã xóa bài tập!');
  };

  // Gửi thông báo
  const handleNotify = () => {
    setNotifyOpen(false);
    message.success('Đã gửi thông báo!');
  };

  // Lọc bài tập
  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: 'Tên bài tập', dataIndex: 'title', key: 'title' },
    { title: 'Hạn nộp', dataIndex: 'deadline', key: 'deadline' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Đã giao' ? 'blue' : 'orange'}>{status}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => { setSelectedAssignment(record); setViewOpen(true); }}>Xem</Button>
          <Button icon={<EditOutlined />} onClick={() => { setSelectedAssignment(record); setEditOpen(true); }}>Sửa</Button>
          <Popconfirm title="Xóa bài tập này?" onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <TeacherLayout>
      <Card
        title="Bài tập & Thông báo"
        extra={
          <Space>
            <Button icon={<SendOutlined />} onClick={() => setNotifyOpen(true)}>Gửi thông báo</Button>
            <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpen(true)}>Tạo bài tập</Button>
          </Space>
        }
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm bài tập..."
          style={{ width: 300, marginBottom: 16 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Table columns={columns} dataSource={filteredAssignments} />
      </Card>

      {/* Modal tạo bài tập */}
      <Modal
        title="Tạo bài tập mới"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreate}>
          <Form.Item label="Tên bài tập" name="title" required rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Hạn nộp" name="deadline" required rules={[{ required: true, message: 'Nhập hạn nộp' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">Tạo bài tập</Button>
        </Form>
      </Modal>

      {/* Modal gửi thông báo */}
      <Modal
        title="Gửi thông báo"
        open={notifyOpen}
        onCancel={() => setNotifyOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleNotify}>
          <Form.Item label="Tiêu đề" name="title" required rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Nội dung" name="content" required rules={[{ required: true, message: 'Nhập nội dung' }]}>
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">Gửi thông báo</Button>
        </Form>
      </Modal>

      {/* Modal xem chi tiết bài tập */}
      <Modal
        title="Chi tiết bài tập"
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={<Button onClick={() => setViewOpen(false)}>Đóng</Button>}
      >
        {selectedAssignment && (
          <div>
            <p><b>Tên bài tập:</b> {selectedAssignment.title}</p>
            <p><b>Hạn nộp:</b> {selectedAssignment.deadline}</p>
            <p><b>Trạng thái:</b> {selectedAssignment.status}</p>
            <p><b>Mô tả:</b> {selectedAssignment.description}</p>
          </div>
        )}
      </Modal>

      {/* Modal sửa bài tập */}
      <Modal
        title="Sửa bài tập"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={null}
      >
        {selectedAssignment && (
          <Form
            layout="vertical"
            initialValues={selectedAssignment}
            onFinish={handleEdit}
          >
            <Form.Item label="Tên bài tập" name="title" required rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Hạn nộp" name="deadline" required rules={[{ required: true, message: 'Nhập hạn nộp' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea />
            </Form.Item>
            <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
          </Form>
        )}
      </Modal>
    </TeacherLayout>
  );
};

export default TeacherAssignments;