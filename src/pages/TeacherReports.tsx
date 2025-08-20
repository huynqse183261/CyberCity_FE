import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { Card, Statistic, Row, Col, Table } from 'antd';

const topStudents = [
  { key: 1, name: 'Nguyễn Văn Khôi', average: 9.2 },
  { key: 2, name: 'Lê Thị Hương', average: 9.0 },
];

const columns = [
  { title: 'Học sinh', dataIndex: 'name', key: 'name' },
  { title: 'Điểm TB', dataIndex: 'average', key: 'average' },
];

const TeacherReports: React.FC = () => (
  <TeacherLayout>
    <Card title="Báo cáo & Thống kê">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic title="Tổng số lớp" value={2} />
        </Col>
        <Col span={8}>
          <Statistic title="Tổng số học sinh" value={55} />
        </Col>
        <Col span={8}>
          <Statistic title="Điểm TB toàn trường" value={8.7} />
        </Col>
      </Row>
      <Card title="Top học sinh xuất sắc" style={{ marginBottom: 16 }}>
        <Table columns={columns} dataSource={topStudents} pagination={false} />
      </Card>
      <Card title="Học sinh cần hỗ trợ">
        <ul>
          <li>Trần Văn A - Điểm TB: 5.2</li>
          <li>Phạm Thị B - Điểm TB: 5.5</li>
        </ul>
      </Card>
    </Card>
  </TeacherLayout>
);

export default TeacherReports;