import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TeacherLayout from '../components/TeacherLayout';
import {
  Card,
  Spin,
  Button,
  Space,
  Progress,
  Collapse,
  Tag,
  Empty,
  Alert,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  ArrowLeftOutlined,
  BookOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useStudentProgress } from '../hooks/useTeacher';

const { Panel } = Collapse;
const { Title, Text } = Typography;

const TeacherStudentProgress: React.FC = () => {
  const { studentUid } = useParams<{ studentUid: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseUid = searchParams.get('course') || undefined;

  const { loading, progress } = useStudentProgress(studentUid!, courseUid);

  if (loading) {
    return (
      <TeacherLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="Đang tải tiến độ học tập..." />
        </div>
      </TeacherLayout>
    );
  }

  if (!progress || progress.length === 0) {
    return (
      <TeacherLayout>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(`/teacher/students/${studentUid}`)}
          >
            Quay lại
          </Button>
          <Alert
            message="Chưa có dữ liệu tiến độ"
            description="Học sinh chưa có tiến độ học tập nào hoặc chưa đăng ký khóa học."
            type="info"
            showIcon
          />
        </Space>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(`/teacher/students/${studentUid}`)}
          >
            Quay lại
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            <TrophyOutlined /> Tiến độ học tập
          </Title>
        </Space>

        {/* Courses Progress */}
        {progress.map((courseProgress) => (
          <Card 
            key={courseProgress.courseUid}
            title={
              <Space>
                <BookOutlined />
                <span>{courseProgress.courseTitle}</span>
                <Tag color="blue">
                  {courseProgress.completedSubtopics}/{courseProgress.totalSubtopics} Chủ đề
                </Tag>
              </Space>
            }
          >
            {/* Overall Course Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tiến độ tổng"
                    value={courseProgress.overallProgress}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: courseProgress.overallProgress >= 80 ? '#52c41a' : '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tổng chủ đề"
                    value={courseProgress.totalSubtopics}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Đã hoàn thành"
                    value={courseProgress.completedSubtopics}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Hoạt động cuối"
                    value={courseProgress.lastActivity 
                      ? new Date(courseProgress.lastActivity).toLocaleDateString('vi-VN')
                      : 'Chưa có'
                    }
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ fontSize: 14 }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Progress Bar */}
            <Progress 
              percent={courseProgress.overallProgress} 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              style={{ marginBottom: 24 }}
            />

            {/* Modules Accordion */}
            {courseProgress.modules && courseProgress.modules.length > 0 ? (
              <Collapse defaultActiveKey={[courseProgress.modules[0]?.moduleUid]}>
                {courseProgress.modules.map((module) => (
                  <Panel
                    key={module.moduleUid}
                    header={
                      <Space size="large">
                        <Text strong>{module.moduleTitle}</Text>
                        <Tag color={module.progress >= 80 ? 'green' : 'blue'}>
                          {module.completedSubtopics}/{module.totalSubtopics}
                        </Tag>
                        <Progress 
                          percent={module.progress} 
                          size="small" 
                          style={{ width: 150 }}
                        />
                      </Space>
                    }
                  >
                    {/* Lessons inside Module */}
                    {module.lessons && module.lessons.length > 0 ? (
                      <Collapse ghost>
                        {module.lessons.map((lesson) => (
                          <Panel
                            key={lesson.lessonUid}
                            header={
                              <Space>
                                <FileTextOutlined />
                                <Text>{lesson.lessonTitle}</Text>
                                <Tag color={lesson.progress >= 100 ? 'success' : 'processing'}>
                                  {lesson.completedSubtopics}/{lesson.totalSubtopics}
                                </Tag>
                                <Progress 
                                  percent={lesson.progress} 
                                  size="small" 
                                  style={{ width: 120 }}
                                  strokeWidth={6}
                                />
                              </Space>
                            }
                          >
                            {/* Subtopics */}
                            {lesson.subtopics && lesson.subtopics.length > 0 ? (
                              <div style={{ paddingLeft: 24 }}>
                                {lesson.subtopics.map((subtopic) => (
                                  <div 
                                    key={subtopic.subtopicUid}
                                    style={{
                                      padding: '12px',
                                      marginBottom: '8px',
                                      background: subtopic.isCompleted ? '#f6ffed' : '#fafafa',
                                      border: `1px solid ${subtopic.isCompleted ? '#b7eb8f' : '#d9d9d9'}`,
                                      borderRadius: '4px'
                                    }}
                                  >
                                    <Space>
                                      {subtopic.isCompleted ? (
                                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                      ) : (
                                        <ClockCircleOutlined style={{ color: '#d9d9d9' }} />
                                      )}
                                      <Text 
                                        style={{ 
                                          textDecoration: subtopic.isCompleted ? 'line-through' : 'none',
                                          color: subtopic.isCompleted ? '#52c41a' : '#000'
                                        }}
                                      >
                                        {subtopic.subtopicTitle}
                                      </Text>
                                      {subtopic.isCompleted && (
                                        <Tag color="success">Hoàn thành</Tag>
                                      )}
                                      {subtopic.completedAt && (
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                          {new Date(subtopic.completedAt).toLocaleString('vi-VN')}
                                        </Text>
                                      )}
                                    </Space>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <Empty 
                                description="Chưa có chủ đề con" 
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                              />
                            )}
                          </Panel>
                        ))}
                      </Collapse>
                    ) : (
                      <Empty 
                        description="Chưa có bài học" 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )}
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <Empty 
                description="Chưa có module nào" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        ))}
      </Space>
    </TeacherLayout>
  );
};

export default TeacherStudentProgress;
