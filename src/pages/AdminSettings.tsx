import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  CameraOutlined,
  SaveOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import AdminLayout from '../components/AdminLayout';
import userService from '../services/userService';

const { Title, Text } = Typography;

interface AdminProfile {
  uid: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  createdAt?: string;
  image?: string;
  status?: string;
}

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { refreshUserData } = useAuth();

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await userService.getMyProfile();
      console.log('✅ Admin profile loaded:', response);
      if (response.success && response.data) {
        setProfile(response.data);
        profileForm.setFieldsValue({
          fullName: response.data.fullName,
          email: response.data.email,
        });
      } else if (response.data) {
        setProfile(response.data);
        profileForm.setFieldsValue({
          fullName: response.data.fullName,
          email: response.data.email,
        });
      }
    } catch (error: any) {
      console.error('❌ Error loading admin profile:', error);
      message.error('Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async (values: any) => {
    try {
      const response = await userService.updateMyProfile(values);
      if (response.success) {
        message.success('Cập nhật thông tin thành công');
        setProfile(response.data);
      }
    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      message.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
    }
  };

  // Change password
  const handleChangePassword = async (values: any) => {
    try {
      const response = await userService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (response.success) {
        message.success('Đổi mật khẩu thành công');
        passwordForm.resetFields();
      }
    } catch (error: any) {
      console.error('❌ Error changing password:', error);
      message.error(error.response?.data?.message || 'Không thể đổi mật khẩu');
    }
  };

  // Avatar upload
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return false;
    }
    return true;
  };

  const handleAvatarChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    if (newFileList.length > 0 && newFileList[0].originFileObj && profile?.uid) {
      setAvatarUploading(true);
      try {
        const response = await userService.uploadAvatar(
          profile.uid,
          newFileList[0].originFileObj as File
        );
        message.success('Cập nhật avatar thành công');
        setProfile(prev => prev ? { ...prev, image: response.avatarUrl } : null);
        setFileList([]);
        await refreshUserData();
      } catch (error: any) {
        console.error('❌ Error uploading avatar:', error);
        message.error('Không thể tải lên avatar');
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  if (loading && !profile) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="Đang tải thông tin..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>
          <UserOutlined /> Cài đặt tài khoản quản trị viên
        </Title>

        {/* Profile Overview Card */}
        <Card>
          <Space size="large" align="start" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={profile?.image}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#e74c3c', marginBottom: 16 }}
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
                  <Text type="danger" strong style={{ textTransform: 'uppercase' }}>
                    {profile?.role}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Text type={profile?.status?.toLowerCase() === 'active' ? 'success' : 'warning'}>
                    {profile?.status?.toLowerCase() === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
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

            {/* Password Tab */}
            <Tabs.TabPane
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
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Mật khẩu phải có chữ hoa, chữ thường và số!'
                    }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
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
                  <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Đổi mật khẩu
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Space>
    </AdminLayout>
  );
};

export default AdminSettings;
