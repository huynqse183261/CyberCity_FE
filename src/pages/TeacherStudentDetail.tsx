import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherLayout from '../components/TeacherLayout';
import {
  Card,
  Spin,
  Descriptions,
  Button,
  Space,
  Tag,
  Empty,
  Alert,
  List,
  Avatar
} from 'antd';
import {
  ArrowLeftOutlined,
  LineChartOutlined,
  UserOutlined,
  BookOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useTeacherStudents } from '../hooks/useTeacher';
import type { StudentDetailDto } from '../services/teacherService';

const TeacherStudentDetail: React.FC = () => {
  const { studentUid } = useParams<{ studentUid: string }>();
  const navigate = useNavigate();
  const { getStudentDetail } = useTeacherStudents();
  
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<StudentDetailDto | null>(null);

  // Load student detail
  useEffect(() => {
    const loadDetail = async () => {
      if (!studentUid) return;
      
      setLoading(true);
      const data = await getStudentDetail(studentUid);
      setStudent(data);
      setLoading(false);
    };

    loadDetail();
  }, [studentUid, getStudentDetail]);

  if (loading) {
    return (
      <TeacherLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      </TeacherLayout>
    );
  }

  if (!student) {
    return (
      <TeacherLayout>
        <Alert
          message="Không tìm thấy học sinh"
          description="Học sinh không tồn tại hoặc bạn không có quyền xem thông tin."
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/teacher/students')}>
              Quay lại danh sách
            </Button>
          }
        />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header Actions */}
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/teacher/students')}
          >
            Quay lại
          </Button>
          <Button 
            icon={<LineChartOutlined />} 
            type="primary"
            onClick={() => navigate(`/teacher/students/${studentUid}/progress`)}
          >
            Xem tiến độ học tập
          </Button>
        </Space>

        {/* Student Basic Info Card */}
        <Card 
          title={
            <Space>
              <UserOutlined />
              <span>Thông tin học sinh</span>
            </Space>
          }
        >
          <Space size="large" align="start">
            <Avatar 
              size={100} 
              style={{ backgroundColor: '#1890ff', fontSize: 40 }}
            >
              {student.fullName?.charAt(0) || 'S'}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Họ và tên" span={2}>
                  <strong style={{ fontSize: 18 }}>{student.fullName}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {student.email}
                </Descriptions.Item>
                <Descriptions.Item label="Username">
                  {student.username}
                </Descriptions.Item>
                <Descriptions.Item label="UID" span={2}>
                  <code style={{ 
                    fontSize: 12, 
                    padding: '2px 8px', 
                    background: '#f5f5f5', 
                    borderRadius: 4 
                  }}>
                    {student.uid}
                  </code>
                </Descriptions.Item>
                <Descriptions.Item label="Hoạt động cuối" span={2}>
                  <Space>
                    <ClockCircleOutlined />
                    {student.lastActive 
                      ? new Date(student.lastActive).toLocaleString('vi-VN')
                      : 'Chưa có hoạt động'
                    }
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Space>
        </Card>

        {/* Enrolled Courses Card */}
        <Card 
          title={
            <Space>
              <BookOutlined />
              <span>Khóa học đã đăng ký ({student.enrolledCourses?.length || 0})</span>
            </Space>
          }
        >
          {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
            <List
              dataSource={student.enrolledCourses}
              renderItem={(course, index) => (
                <List.Item
                  actions={[
                    <Button 
                      key="progress"
                      type="link"
                      icon={<LineChartOutlined />}
                      onClick={() => navigate(`/teacher/students/${studentUid}/progress?course=${course.courseUid}`)}
                    >
                      Xem tiến độ
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#52c41a' }}>
                        {index + 1}
                      </Avatar>
                    }
                    title={<Tag color="blue">{course.courseTitle}</Tag>}
                    description={course.enrolledAt ? `Đăng ký: ${new Date(course.enrolledAt).toLocaleDateString('vi-VN')}` : 'Khóa học'}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty 
              description="Học sinh chưa đăng ký khóa học nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {/* Quick Stats Card (Optional - can add later) */}
        <Card title="Thống kê nhanh">
          <Space size="large">
            <Card.Grid style={{ width: '33.33%', textAlign: 'center' }}>
              <div style={{ fontSize: 32, color: '#1890ff' }}>
                {student.enrolledCourses?.length || 0}
              </div>
              <div>Khóa học</div>
            </Card.Grid>
            <Card.Grid style={{ width: '33.33%', textAlign: 'center' }}>
              <div style={{ fontSize: 32, color: '#52c41a' }}>-</div>
              <div>Tiến độ TB</div>
            </Card.Grid>
            <Card.Grid style={{ width: '33.33%', textAlign: 'center' }}>
              <div style={{ fontSize: 32, color: '#faad14' }}>-</div>
              <div>Bài tập</div>
            </Card.Grid>
          </Space>
        </Card>
      </Space>
    </TeacherLayout>
  );
};

export default TeacherStudentDetail;
