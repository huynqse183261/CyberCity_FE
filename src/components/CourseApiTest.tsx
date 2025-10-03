import React, { useState } from 'react';
import { Button, Card, Space, message, Typography } from 'antd';
import courseService from '../services/courseService';
import type { CreateCourseRequest } from '../models/CourseTypes';

const { Title, Text } = Typography;

const CourseApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const testGetCourses = async () => {
    setLoading(true);
    try {
      console.log('Testing GET /api/courses...');
      const response = await courseService.getCourses({
        pageNumber: 1,
        pageSize: 10,
        descending: true
      });
      
      console.log('Get courses response:', response);
      
      if (response.success) {
        message.success(`Thành công! Tìm thấy ${response.data?.items?.length || 0} khóa học`);
      } else {
        message.error(response.message || 'Lỗi khi lấy danh sách khóa học');
      }
    } catch (error) {
      console.error('Test get courses error:', error);
      message.error('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const testCreateCourse = async () => {
    setLoading(true);
    try {
      console.log('Testing POST /api/courses...');
      
      const testCourse: CreateCourseRequest = {
        title: 'Test Course - ' + Date.now(),
        description: 'Đây là khóa học test được tạo từ frontend',
        level: 'beginner',
        price: 299000,
        duration: '20 giờ',
        instructor: 'Test Instructor',
        isActive: true
      };
      
      console.log('Creating course with data:', testCourse);
      const response = await courseService.createCourse(testCourse);
      
      console.log('Create course response:', response);
      
      if (response.success) {
        message.success('Tạo khóa học test thành công!');
      } else {
        message.error(response.message || 'Lỗi khi tạo khóa học');
      }
    } catch (error) {
      console.error('Test create course error:', error);
      message.error('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Course API Test" style={{ margin: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Test Course API Endpoints</Title>
          <Text type="secondary">
            Kiểm tra kết nối và functionality của Course API
          </Text>
        </div>

        <Space wrap>
          <Button 
            type="primary" 
            onClick={testGetCourses}
            loading={loading}
          >
            Test GET Courses
          </Button>
          
          <Button 
            type="default" 
            onClick={testCreateCourse}
            loading={loading}
          >
            Test CREATE Course
          </Button>
        </Space>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <Text strong>Debug Info:</Text>
          <br />
          <Text code>API Base URL: {import.meta.env.VITE_API_BASE_URL}</Text>
          <br />
          <Text code>Debug Mode: {import.meta.env.VITE_DEBUG_MODE}</Text>
          <br />
          <Text type="secondary">
            Mở Console (F12) để xem chi tiết request/response
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default CourseApiTest;