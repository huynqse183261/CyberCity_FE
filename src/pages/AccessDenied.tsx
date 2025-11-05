import React from 'react';
import { Result, Button, Typography, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleGoBack = () => {
    // Quay lại trang trước nếu có, nếu không thì về trang chủ
    if (location.state?.from) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleGoHomeAndClearToken = () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (e) {
      // noop
    }
    navigate('/', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Result
        status="403"
        title="Không có quyền truy cập"
        subTitle={
          <Paragraph>
            <Text> Tài khoản của bạn hiện không được phép truy cập vào trang này. </Text>
          </Paragraph>
        }
        extra={
          <Space>
            <Button onClick={handleGoBack}>Quay lại</Button>
            <Button type="primary" onClick={handleGoHomeAndClearToken}>Về trang chủ</Button>
          </Space>
        }
      />
    </div>
  );
};

export default AccessDenied;
