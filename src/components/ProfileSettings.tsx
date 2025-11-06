import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Avatar,
  Upload,
  Tabs,
  Typography,
  Descriptions,
  Spin,
  message as antdMessage
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  CameraOutlined,
  SaveOutlined,
  MailOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useProfile } from '../hooks/useProfile';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ProfileSettingsProps {
  title?: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ title = 'Cài đặt tài khoản' }) => {
  const { loading, profile, avatarUploading, updateProfile, changePassword, uploadAvatar } = useProfile();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Update profile form initial values when profile loads
  React.useEffect(() => {
    if (profile) {
      profileForm.setFieldsValue({
        fullName: profile.fullName,
        email: profile.email,
      });
    }
  }, [profile, profileForm]);

  // Handle profile update
  const handleUpdateProfile = async (values: any) => {
    const success = await updateProfile(values);
    if (success) {
      profileForm.resetFields();
      profileForm.setFieldsValue(values);
    }
  };

  // Handle password change
  const handleChangePassword = async (values: any) => {
    const success = await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    });
    if (success) {
      passwordForm.resetFields();
    }
  };

  // Handle avatar upload
  const handleAvatarChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const success = await uploadAvatar(file);
      if (success) {
        setFileList([]);
      }
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      antdMessage.error('Chỉ được upload file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      antdMessage.error('Ảnh phải nhỏ hơn 5MB!');
      return false;
    }
    return true;
  };

  if (loading && !profile) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>
        <UserOutlined /> {title}
      </Title>

      {/* Profile Overview Card */}
      <Card>
        <Space size="large" align="start" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={profile?.image}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
            />
            <br />
            <Upload
              fileList={fileList}
              onChange={handleAvatarChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
              showUploadList={false}
            >
              <Button
                icon={<CameraOutlined />}
                loading={avatarUploading}
              >
                Đổi avatar
              </Button>
            </Upload>
          </div>
          <div style={{ flex: 1 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ và tên">
                <Text strong>{profile?.fullName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {profile?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {profile?.username}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Text type="success" strong style={{ textTransform: 'uppercase' }}>
                  {profile?.role}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Text type={profile?.status === 'active' ? 'success' : 'warning'}>
                  {profile?.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </Text>
              </Descriptions.Item>
              {profile?.createdAt && (
                <Descriptions.Item label="Ngày tạo">
                  {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        </Space>
      </Card>

      {/* Settings Tabs */}
      <Card>
        <Tabs defaultActiveKey="profile">
          {/* Profile Tab */}
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Thông tin cá nhân
              </span>
            }
            key="profile"
          >
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleUpdateProfile}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên!' },
                  { max: 128, message: 'Họ tên không được quá 128 ký tự!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nguyễn Văn A"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="email@example.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Cập nhật thông tin
                  </Button>
                  <Button
                    onClick={() => profileForm.resetFields()}
                    size="large"
                  >
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Password Tab */}
          <TabPane
            tab={
              <span>
                <LockOutlined />
                Đổi mật khẩu
              </span>
            }
            key="password"
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                label="Mật khẩu hiện tại"
                name="currentPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu hiện tại"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số!'
                  }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu mới"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập lại mật khẩu mới"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Đổi mật khẩu
                  </Button>
                  <Button
                    onClick={() => passwordForm.resetFields()}
                    size="large"
                  >
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </Space>
  );
};

export default ProfileSettings;
