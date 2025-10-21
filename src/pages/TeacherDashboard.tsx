import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { Row, Col, Card, Statistic, Button, Alert, List, Avatar, Modal, Form, Input, message } from 'antd';
import { TeamOutlined, LineChartOutlined, ClockCircleOutlined, PlusOutlined, SendOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { useTeacherDashboard } from '../hooks/useTeacher';

const chartData = [
  { week: 'T2', progress: 65 },
  { week: 'T3', progress: 70 },
  { week: 'T4', progress: 75 },
  { week: 'T5', progress: 80 },
  { week: 'T6', progress: 85 },
  { week: 'T7', progress: 82 },
  { week: 'CN', progress: 78 },
];

const lineConfig = {
  data: chartData,
  xField: 'week',
  yField: 'progress',
  smooth: true,
  height: 200,
  point: { size: 4, shape: 'circle' },
  color: '#1890ff',
};

const TeacherDashboard: React.FC = () => {
  // Fetch real stats from API
  const { loading: statsLoading, stats } = useTeacherDashboard();

  // Modal state
  const [classModal, setClassModal] = React.useState(false);
  const [notifyModal, setNotifyModal] = React.useState(false);
  const [assignmentModal, setAssignmentModal] = React.useState(false);
  const [studentModal, setStudentModal] = React.useState(false);

  // Handlers
  const handleCreateClass = () => {
    setClassModal(false);
    message.success('Đã tạo lớp học mới!');
  };
  const handleSendNotify = () => {
    setNotifyModal(false);
    message.success('Đã gửi thông báo!');
  };
  const handleCreateAssignment = () => {
    setAssignmentModal(false);
    message.success('Đã tạo bài tập mới!');
  };
  const handleAddStudent = () => {
    setStudentModal(false);
    message.success('Đã thêm học sinh mới!');
  };

  return (
    <TeacherLayout>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setClassModal(true)}>Tạo lớp học</Button>
        </Col>
        <Col>
          <Button icon={<SendOutlined />} onClick={() => setNotifyModal(true)}>Gửi thông báo</Button>
        </Col>
        <Col>
          <Button icon={<PlusOutlined />} onClick={() => setAssignmentModal(true)}>Tạo bài tập</Button>
        </Col>
        <Col>
          <Button icon={<UserOutlined />} onClick={() => setStudentModal(true)}>Thêm học sinh</Button>
        </Col>
      </Row>
      <Alert
        message="Có 5 học sinh chưa nộp bài tập Network Security tuần này!"
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng học sinh" 
              value={stats?.totalStudents || 0} 
              prefix={<TeamOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tiến độ TB" 
              value={stats?.avgProgress || 0} 
              suffix="%" 
              prefix={<LineChartOutlined />}
              precision={1}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Khóa học hoạt động" 
              value={stats?.activeCourses || 0} 
              prefix={<ClockCircleOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tin nhắn chưa đọc" 
              value={stats?.unreadMessages || 0} 
              prefix={<MessageOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>
      <Card title="Biểu đồ tiến độ học tập" style={{ marginBottom: 16 }}>
        <Line {...lineConfig} />
      </Card>
      <Card title="Hoạt động gần đây">
        <List
          itemLayout="horizontal"
          dataSource={[
            'Nguyễn Văn Khôi nộp Lab Docker',
            'Lê Thị Hương hoàn thành Mobile Design',
            '5 học sinh chưa nộp bài Network Security',
            'Tạo bài tập mới: Kubernetes Advanced',
          ]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta avatar={<Avatar>•</Avatar>} title={item} description="2 giờ trước" />
            </List.Item>
          )}
        />
      </Card>

      {/* Modal Tạo lớp học */}
      <Modal
        title="Tạo lớp học mới"
        open={classModal}
        onCancel={() => setClassModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreateClass}>
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

      {/* Modal Gửi thông báo */}
      <Modal
        title="Gửi thông báo"
        open={notifyModal}
        onCancel={() => setNotifyModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSendNotify}>
          <Form.Item label="Tiêu đề" name="title" required rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Nội dung" name="content" required rules={[{ required: true, message: 'Nhập nội dung' }]}>
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">Gửi thông báo</Button>
        </Form>
      </Modal>

      {/* Modal Tạo bài tập */}
      <Modal
        title="Tạo bài tập mới"
        open={assignmentModal}
        onCancel={() => setAssignmentModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreateAssignment}>
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

      {/* Modal Thêm học sinh */}
      <Modal
        title="Thêm học sinh mới"
        open={studentModal}
        onCancel={() => setStudentModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddStudent}>
          <Form.Item label="Họ và tên" name="name" required rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Lớp" name="className" required rules={[{ required: true, message: 'Nhập lớp' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Thêm học sinh</Button>
        </Form>
      </Modal>
    </TeacherLayout>
  );
};

export default TeacherDashboard;


