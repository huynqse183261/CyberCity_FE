import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const initialGrading = [
  { key: 1, student: 'Nguyễn Văn Khôi', assignment: 'Lab Docker', score: 8.5, status: 'Đã chấm', comment: 'Tốt' },
  { key: 2, student: 'Lê Thị Hương', assignment: 'Mobile Design', score: null, status: 'Chờ chấm', comment: '' },
];

const TeacherGrading: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedGrading, setSelectedGrading] = React.useState<any>(null);
  const [gradingData, setGradingData] = React.useState(initialGrading);

  // Chấm bài
  const handleGrade = (values: any) => {
    setGradingData(gradingData.map(g =>
      g.key === selectedGrading.key
        ? { ...g, score: values.score, comment: values.comment, status: 'Đã chấm' }
        : g
    ));
    setModalOpen(false);
    message.success('Đã chấm bài!');
  };

  const columns = [
    { title: 'Học sinh', dataIndex: 'student', key: 'student' },
    { title: 'Bài tập', dataIndex: 'assignment', key: 'assignment' },
    { title: 'Điểm', dataIndex: 'score', key: 'score', render: (score: number|null) => score ?? 'Chưa chấm' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Đã chấm' ? 'green' : 'orange'}>{status}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button disabled={record.status === 'Đã chấm'} onClick={() => { setSelectedGrading(record); setModalOpen(true); }}>Chấm</Button>
          <Button icon={<EyeOutlined />} onClick={() => { setSelectedGrading(record); setViewOpen(true); }}>Xem</Button>
        </Space>
      ),
    },
  ];

  return (
    <TeacherLayout>
      <Card title="Chấm bài & Đánh giá">
        <Table columns={columns} dataSource={gradingData} />
      </Card>
      {/* Modal chấm bài */}
      <Modal
        title="Chấm bài"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        {selectedGrading && (
          <Form layout="vertical" onFinish={handleGrade}>
            <Form.Item label="Điểm số" name="score" required rules={[{ required: true, message: 'Nhập điểm' }]}>
              <InputNumber min={0} max={10} />
            </Form.Item>
            <Form.Item label="Nhận xét" name="comment">
              <Input.TextArea />
            </Form.Item>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </Form>
        )}
      </Modal>
      {/* Modal xem chi tiết bài nộp */}
      <Modal
        title="Chi tiết bài nộp"
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={<Button onClick={() => setViewOpen(false)}>Đóng</Button>}
      >
        {selectedGrading && (
          <div>
            <p><b>Học sinh:</b> {selectedGrading.student}</p>
            <p><b>Bài tập:</b> {selectedGrading.assignment}</p>
            <p><b>Điểm:</b> {selectedGrading.score ?? 'Chưa chấm'}</p>
            <p><b>Nhận xét:</b> {selectedGrading.comment}</p>
            <p><b>Trạng thái:</b> {selectedGrading.status}</p>
          </div>
        )}
      </Modal>
    </TeacherLayout>
  );
};

export default TeacherGrading;