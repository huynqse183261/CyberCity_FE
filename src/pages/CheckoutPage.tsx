import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Radio, 
  Space, 
  Typography, 
  Divider,
  Alert,
  Spin,
  message
} from 'antd';
import { 
  CreditCardOutlined, 
  BankOutlined, 
  WalletOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { useOrders } from '../hooks/useOrders';
import type { CreateOrderRequest } from '../services/orderService';
import '../styles/CheckoutPage.css';

const { Title, Text } = Typography;
const { Option } = Select;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { createOrder, loading } = useOrders();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<string>('bank_transfer');

  // Get plan info from location state
  const planInfo = location.state as {
    planUid?: string;
    planName?: string;
    price?: number;
    durationDays?: number;
    period?: 'monthly' | 'yearly';
  } | null;

  // Redirect if not authenticated
  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    message.warning('Vui lòng đăng nhập để tiếp tục');
    return <Navigate to="/login" state={{ from: '/checkout', ...planInfo }} replace />;
  }

  // Redirect if no plan info
  if (!planInfo || !planInfo.planUid) {
    message.warning('Vui lòng chọn gói dịch vụ');
    return <Navigate to="/pricing" replace />;
  }

  useEffect(() => {
    // Set form default values from user
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
      });
    }
  }, [user, form]);

  // Handle submit order
  const handleSubmit = async (values: any) => {
    try {
      if (!user?.uid || !planInfo.planUid) {
        message.error('Thông tin không hợp lệ');
        return;
      }

      const orderData: CreateOrderRequest = {
        userUid: user.uid,
        planUid: planInfo.planUid,
        paymentMethod: paymentMethod,
        notes: values.notes || `Đơn hàng ${planInfo.planName} - ${planInfo.period || 'monthly'}`
      };

      const order = await createOrder(orderData);
      
      if (order) {
        message.success('Tạo đơn hàng thành công!');
        // Redirect to payment history or order detail
        navigate('/student/payment-history', { 
          state: { orderUid: order.uid } 
        });
      }
    } catch (error: any) {
      // console.error('Error creating order:', error);
      message.error(error.response?.data?.message || 'Không thể tạo đơn hàng');
    }
  };

  const totalPrice = planInfo.price || 0;
  const discount = planInfo.period === 'yearly' ? Math.round(totalPrice * 12 * 0.2) : 0;
  const finalPrice = planInfo.period === 'yearly' 
    ? Math.round(totalPrice * 12 * 0.8) 
    : totalPrice;

  return (
    <div className="checkout-page">
      <Navigation />
      
      <div className="checkout-container">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/pricing')}
          style={{ marginBottom: 20 }}
        >
          Quay lại trang gói dịch vụ
        </Button>

        <Title level={2}>Thanh toán</Title>

        <div className="checkout-content">
          {/* Order Summary */}
          <Card className="order-summary-card">
            <Title level={4}>Tóm tắt đơn hàng</Title>
            <Divider />
            
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="order-item">
                <Text>Gói dịch vụ:</Text>
                <Text strong>{planInfo.planName || 'Premium'}</Text>
              </div>
              
              <div className="order-item">
                <Text>Thời hạn:</Text>
                <Text>{planInfo.period === 'yearly' ? '12 tháng' : '1 tháng'}</Text>
              </div>

              <div className="order-item">
                <Text>Giá gốc:</Text>
                <Text>{totalPrice.toLocaleString('vi-VN')}đ/{planInfo.period === 'yearly' ? 'năm' : 'tháng'}</Text>
              </div>

              {planInfo.period === 'yearly' && discount > 0 && (
                <div className="order-item discount">
                  <Text>Giảm giá (20%):</Text>
                  <Text strong style={{ color: '#52c41a' }}>-{discount.toLocaleString('vi-VN')}đ</Text>
                </div>
              )}

              <Divider />
              
              <div className="order-item total">
                <Text strong style={{ fontSize: '1.2em' }}>Tổng cộng:</Text>
                <Text strong style={{ fontSize: '1.5em', color: '#00d4ff' }}>
                  {finalPrice.toLocaleString('vi-VN')}đ
                </Text>
              </div>
            </Space>
          </Card>

          {/* Checkout Form */}
          <Card className="checkout-form-card">
            <Title level={4}>Thông tin thanh toán</Title>
            <Divider />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                paymentMethod: 'bank_transfer'
              }}
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Phương thức thanh toán"
                name="paymentMethod"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
              >
                <Radio.Group 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="bank_transfer">
                      <Space>
                        <BankOutlined /> Chuyển khoản ngân hàng
                      </Space>
                    </Radio>
                    <Radio value="credit_card">
                      <Space>
                        <CreditCardOutlined /> Thẻ tín dụng/Ghi nợ
                      </Space>
                    </Radio>
                    <Radio value="e_wallet">
                      <Space>
                        <WalletOutlined /> Ví điện tử (Momo, ZaloPay)
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea rows={4} placeholder="Ghi chú thêm (nếu có)..." />
              </Form.Item>

              <Alert
                message="Thông tin thanh toán"
                description="Sau khi hoàn tất đơn hàng, bạn sẽ nhận được email hướng dẫn thanh toán. Vui lòng kiểm tra email để xem thông tin chi tiết."
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
              />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                    border: 'none',
                    height: 50,
                    fontSize: '1.1em',
                    fontWeight: 'bold'
                  }}
                >
                  Xác nhận đặt hàng
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;

