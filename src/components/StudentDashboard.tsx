import React from 'react';
import { Card, Row, Col, Statistic, Typography, Button, List, Progress, Space, Badge } from 'antd';
import { 
  BookOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph, Text } = Typography;

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - thực tế sẽ lấy từ API
  const studentStats = [
    {
      title: 'Khóa học đang học',
      value: 3,
      prefix: <BookOutlined />,
    },
    {
      title: 'Bài tập đã hoàn thành',
      value: 28,
      prefix: <CheckCircleOutlined />,
    },
    {
      title: 'Lab sessions',
      value: 45,
      prefix: <PlayCircleOutlined />,
    },
    {
      title: 'Điểm trung bình',
      value: 8.5,
      prefix: <TrophyOutlined />,
      suffix: '/10'
    }
  ];

  const recentCourses = [
    {
      title: 'Linux Security Fundamentals',
      progress: 75,
      status: 'In Progress',
      nextLesson: 'File Permissions and Access Control',
      dueDate: '2024-01-15'
    },
    {
      title: 'Penetration Testing with Kali Linux',
      progress: 45,
      status: 'In Progress', 
      nextLesson: 'Network Scanning with Nmap',
      dueDate: '2024-01-20'
    },
    {
      title: 'Web Application Security',
      progress: 100,
      status: 'Completed',
      grade: 9.2,
      completedDate: '2023-12-20'
    }
  ];

  const upcomingAssignments = [
    {
      title: 'Linux Command Line Lab',
      course: 'Linux Security Fundamentals',
      dueDate: 'Jan 15, 2024',
      status: 'pending'
    },
    {
      title: 'Network Vulnerability Assessment',
      course: 'Penetration Testing',
      dueDate: 'Jan 18, 2024', 
      status: 'pending'
    },
    {
      title: 'SQL Injection Prevention',
      course: 'Web Application Security',
      dueDate: 'Jan 22, 2024',
      status: 'submitted'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          📚 Student Dashboard
        </Title>
        <Paragraph>
          Xin chào <strong>{user?.fullName}</strong>! Tiếp tục hành trình học tập Linux Security của bạn.
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {studentStats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Card 
        title="Quick Actions" 
        style={{ marginBottom: '24px' }}
      >
        <Space wrap>
          <Button type="primary" icon={<PlayCircleOutlined />}>
            Continue Learning
          </Button>
          <Button icon={<BookOutlined />}>
            Browse Courses
          </Button>
          <Button icon={<PlayCircleOutlined />}>
            Start Lab Session
          </Button>
          <Button icon={<UserOutlined />}>
            AI Assistant
          </Button>
          <Button icon={<TrophyOutlined />}>
            View Achievements
          </Button>
        </Space>
      </Card>

      <Row gutter={16}>
        {/* My Courses */}
        <Col span={12}>
          <Card title="My Courses" extra={<Button type="link">View All</Button>}>
            <List
              dataSource={recentCourses}
              renderItem={(course) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <Text strong>{course.title}</Text>
                      <Badge 
                        status={course.status === 'Completed' ? 'success' : 'processing'} 
                        text={course.status} 
                      />
                    </div>
                    
                    {course.status !== 'Completed' && (
                      <>
                        <Progress percent={course.progress} size="small" />
                        <div style={{ marginTop: '8px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Next: {course.nextLesson}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Due: {course.dueDate}
                          </Text>
                        </div>
                      </>
                    )}
                    
                    {course.status === 'Completed' && (
                      <div>
                        <Text type="success">Grade: {course.grade}/10</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Completed: {course.completedDate}
                        </Text>
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Upcoming Assignments */}
        <Col span={12}>
          <Card title="Upcoming Assignments" extra={<Button type="link">View All</Button>}>
            <List
              dataSource={upcomingAssignments}
              renderItem={(assignment) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <Text strong>{assignment.title}</Text>
                      <Badge 
                        status={assignment.status === 'submitted' ? 'success' : 'warning'} 
                        text={assignment.status === 'submitted' ? 'Submitted' : 'Pending'} 
                      />
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {assignment.course}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <ClockCircleOutlined /> Due: {assignment.dueDate}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* Study Progress */}
          <Card title="Weekly Study Progress" style={{ marginTop: '16px' }}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Text>Study Hours This Week</Text>
                <Progress 
                  percent={68} 
                  format={() => '27/40 hours'}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text>Lab Sessions Completed</Text>
                <Progress 
                  percent={80} 
                  format={() => '8/10 labs'}
                  strokeColor="#52c41a"
                />
              </div>
              
              <div>
                <Text>Assignment Completion</Text>
                <Progress 
                  percent={90} 
                  format={() => '9/10 done'}
                  strokeColor="#1890ff"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;