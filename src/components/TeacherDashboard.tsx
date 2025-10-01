import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Button, 
  Table, 
  Space, 
  Badge, 
  Tabs,
  Progress,
  Select,
  DatePicker,
  Modal
} from 'antd';
import { 
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Define types for better TypeScript support
interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  grade: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
  status: 'draft' | 'published' | 'closed';
}

interface Course {
  id: string;
  title: string;
  students: number;
  completion: number;
  avgGrade: number;
  status: 'active' | 'completed' | 'draft';
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock data - thực tế sẽ lấy từ API
  const teacherStats = [
    {
      title: 'Total Students',
      value: 156,
      prefix: <UserOutlined />,
    },
    {
      title: 'Active Courses',
      value: 8,
      prefix: <BookOutlined />,
    },
    {
      title: 'Pending Assignments',
      value: 23,
      prefix: <FileTextOutlined />,
    },
    {
      title: 'Avg. Class Grade',
      value: 8.2,
      prefix: <CheckCircleOutlined />,
      suffix: '/10'
    }
  ];

  const studentColumns = [
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Student) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => <Progress percent={progress} size="small" />,
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade: number) => (
        <Text style={{ color: grade >= 8 ? '#52c41a' : grade >= 6 ? '#faad14' : '#f5222d' }}>
          {grade}/10
        </Text>
      ),
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : status === 'inactive' ? 'default' : 'processing'} 
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>View</Button>
          <Button size="small" icon={<EditOutlined />}>Grade</Button>
        </Space>
      ),
    }
  ];

  const studentData: Student[] = [
    {
      id: '1',
      name: 'Nguyen Van A',
      email: 'nguyenvana@student.com',
      progress: 85,
      grade: 8.5,
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Tran Thi B',
      email: 'tranthib@student.com',
      progress: 72,
      grade: 7.8,
      lastActive: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Le Van C',
      email: 'levanc@student.com',
      progress: 45,
      grade: 6.2,
      lastActive: '3 days ago',
      status: 'inactive'
    }
  ];

  const assignmentColumns = [
    {
      title: 'Assignment',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Assignment) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.course}</Text>
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Submissions',
      key: 'submissions',
      render: (_: any, record: Assignment) => (
        <div>
          <Text>{record.submittedCount}/{record.totalCount}</Text>
          <Progress 
            percent={Math.round((record.submittedCount / record.totalCount) * 100)} 
            size="small" 
            style={{ marginTop: '4px' }}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'published' ? 'success' : status === 'draft' ? 'default' : 'error'} 
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>View</Button>
          <Button size="small" icon={<EditOutlined />}>Edit</Button>
          <Button size="small" icon={<DownloadOutlined />}>Export</Button>
        </Space>
      ),
    }
  ];

  const assignmentData: Assignment[] = [
    {
      id: '1',
      title: 'Linux Command Line Basics',
      course: 'Linux Security Fundamentals',
      dueDate: 'Jan 15, 2024',
      submittedCount: 28,
      totalCount: 35,
      status: 'published'
    },
    {
      id: '2',
      title: 'Network Security Assessment',
      course: 'Penetration Testing',
      dueDate: 'Jan 20, 2024',
      submittedCount: 12,
      totalCount: 42,
      status: 'published'
    },
    {
      id: '3',
      title: 'Web Vulnerability Analysis',
      course: 'Web Application Security',
      dueDate: 'Jan 25, 2024',
      submittedCount: 0,
      totalCount: 38,
      status: 'draft'
    }
  ];

  const myCourses: Course[] = [
    {
      id: '1',
      title: 'Linux Security Fundamentals',
      students: 35,
      completion: 78,
      avgGrade: 8.2,
      status: 'active'
    },
    {
      id: '2',
      title: 'Penetration Testing with Kali Linux',
      students: 42,
      completion: 65,
      avgGrade: 7.8,
      status: 'active'
    },
    {
      id: '3',
      title: 'Web Application Security',
      students: 38,
      completion: 45,
      avgGrade: 8.5,
      status: 'active'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          👩‍🏫 Teacher Dashboard
        </Title>
        <Paragraph>
          Xin chào <strong>{user?.fullName}</strong>! Quản lý lớp học và theo dõi tiến độ học tập của sinh viên.
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {teacherStats.map((stat, index) => (
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
        extra={
          <Space>
            <Select 
              defaultValue="all" 
              style={{ width: 200 }}
            >
              <Option value="all">All Courses</Option>
              <Option value="linux">Linux Security</Option>
              <Option value="pentest">Penetration Testing</Option>
              <Option value="webapp">Web Application Security</Option>
            </Select>
            <RangePicker />
          </Space>
        }
      >
        <Space wrap>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Create Assignment
          </Button>
          <Button icon={<BookOutlined />}>
            Manage Courses
          </Button>
          <Button icon={<BarChartOutlined />}>
            View Analytics
          </Button>
          <Button icon={<FileTextOutlined />}>
            Grade Assignments
          </Button>
          <Button icon={<DownloadOutlined />}>
            Export Reports
          </Button>
        </Space>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultActiveKey="students" type="card">
        <TabPane tab="My Students" key="students">
          <Card>
            <Table 
              columns={studentColumns} 
              dataSource={studentData} 
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: 156,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} students`,
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Assignments" key="assignments">
          <Card>
            <Table 
              columns={assignmentColumns} 
              dataSource={assignmentData} 
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="My Courses" key="courses">
          <Row gutter={16}>
            {myCourses.map((course) => (
              <Col span={8} key={course.id} style={{ marginBottom: '16px' }}>
                <Card
                  title={course.title}
                  extra={
                    <Badge 
                      status={course.status === 'active' ? 'success' : 'default'} 
                      text={course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    />
                  }
                  actions={[
                    <Button key="view" type="link" icon={<EyeOutlined />}>View</Button>,
                    <Button key="edit" type="link" icon={<EditOutlined />}>Edit</Button>,
                    <Button key="stats" type="link" icon={<BarChartOutlined />}>Stats</Button>,
                  ]}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title="Students"
                          value={course.students}
                          valueStyle={{ fontSize: '20px' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Avg Grade"
                          value={course.avgGrade}
                          suffix="/10"
                          valueStyle={{ fontSize: '20px', color: '#52c41a' }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Text type="secondary">Course Completion</Text>
                    <Progress percent={course.completion} />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane tab="Analytics" key="analytics">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Student Performance Overview">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Text type="secondary">📊 Analytics charts would go here</Text>
                  <br />
                  <Text type="secondary">Performance trends, grade distributions, etc.</Text>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Course Progress">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Text type="secondary">📈 Course progress charts</Text>
                  <br />
                  <Text type="secondary">Completion rates, engagement metrics</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* Create Assignment Modal */}
      <Modal
        title="Create New Assignment"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">📝 Assignment creation form would go here</Text>
          <br />
          <Text type="secondary">Title, description, due date, course selection, etc.</Text>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherDashboard;