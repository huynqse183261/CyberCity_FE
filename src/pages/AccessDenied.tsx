import React, { useEffect, useState } from 'react';
import { Result, Button, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [counter, setCounter] = useState<number>(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((c) => {
        if (c <= 1) {
          clearInterval(timer);
          navigate('/login', { replace: true });
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleBackToLogin = () => {
    navigate('/login', { replace: true, state: { from: location.state?.from } });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Result
        status="403"
        title="Không có quyền truy cập"
        subTitle={
          <Paragraph>
            <Text> Tài khoản của bạn hiện không được phép truy cập vào trang này. </Text>
            <br />
            <Text type="secondary">Bạn sẽ được chuyển về trang đăng nhập sau {counter}s...</Text>
          </Paragraph>
        }
        extra={<Button type="primary" onClick={handleBackToLogin}>Về trang đăng nhập</Button>}
      />
    </div>
  );
};

export default AccessDenied;
