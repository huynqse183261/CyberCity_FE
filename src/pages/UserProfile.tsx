import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Avatar,
  Typography,
  Space,
  Divider,
  Tag,
  Row,
  Col,
  Spin,
  message as antdMessage
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  CameraOutlined,
  MailOutlined,
  IdcardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import { useUserProfile } from '../hooks/useUserProfile';
import TeacherLayout from '../components/TeacherLayout';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const {
    profile,
    loading,
    updateProfile,
    changePassword,
    updateAvatar,
    isUpdating,
    isChangingPassword,
    isUpdatingAvatar
  } = useUserProfile();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');

  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // ===========================
  // HANDLERS
  // ===========================

  const handleEditProfile = async () => {
    try {
      const values = await editForm.validateFields();
      const success = await updateProfile(values);
      if (success) {
        setEditModalOpen(false);
        editForm.resetFields();
      }
    } catch (error) {
      // Validation failed
    }
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      const success = await changePassword(values);
      if (success) {
        setPasswordModalOpen(false);
        passwordForm.resetFields();
      }
    } catch (error) {
      // Validation failed
    }
  };

  const handleAvatarUpload = async () => {
    if (fileList.length === 0) {
      antdMessage.error('Vui lòng chọn ảnh!');
      return;
    }

    const file = fileList[0].originFileObj as File;
    if (!profile?.uid) return;

    const avatarUrl = await updateAvatar(profile.uid, file);
    if (avatarUrl) {
      setAvatarModalOpen(false);
      setFileList([]);
      setPreviewImage('');
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      antdMessage.error('Chỉ được upload file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      antdMessage.error('Kích thước ảnh phải nhỏ hơn 5MB!');
      return false;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    return false; // Prevent auto upload
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList.slice(-1)); // Only keep latest file
  };

  // ===========================
  // RENDER
  // ===========================

  if (loading) {
    return (
      <TeacherLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="Đang tải thông tin..." />
        </div>
      </TeacherLayout>
    );
  }

  if (!profile) {
    return (
      <TeacherLayout>
        <Card>
          <Text type="danger">Không thể tải thông tin người dùng!</Text>
        </Card>
      </TeacherLayout>
    );
  }

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'red',
      teacher: 'blue',
      student: 'green'
    };
    return roleColors[role.toLowerCase()] || 'default';
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      admin: 'Quản trị viên',
      teacher: 'Giáo viên',
      student: 'Học viên'
    };
    return roleLabels[role.toLowerCase()] || role;
  };

  return (
    <TeacherLayout>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <UserOutlined /> Thông tin tài khoản
          </Title>
        </div>

        {/* Avatar & Basic Info Card */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={24} align="middle">
            <Col>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={profile.image}
                  icon={<UserOutlined />}
                  style={{
                    border: '4px solid #1890ff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  size="large"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                  onClick={() => setAvatarModalOpen(true)}
                  loading={isUpdatingAvatar}
                />
              </div>
            </Col>
            <Col flex="auto">
              <Title level={3} style={{ marginBottom: 8 }}>
                {profile.fullName}
              </Title>
              <Space size="large" wrap>
                <Text type="secondary">
                  <IdcardOutlined /> {profile.username}
                </Text>
                <Text type="secondary">
                  <MailOutlined /> {profile.email}
                </Text>
                <Tag color={getRoleColor(profile.role)} icon={<UserOutlined />}>
                  {getRoleLabel(profile.role)}
                </Tag>
                <Tag
                  color={profile.status === 'active' ? 'success' : 'default'}
                  icon={profile.status === 'active' ? <CheckCircleOutlined /> : undefined}
                >
                  {profile.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
              </Space>
              <Divider style={{ margin: '16px 0' }} />
              <Space>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    editForm.setFieldsValue({
                      email: profile.email,
                      fullName: profile.fullName
                    });
                    setEditModalOpen(true);
                  }}
                >
                  Chỉnh sửa thông tin
                </Button>
                <Button
                  icon={<LockOutlined />}
                  onClick={() => setPasswordModalOpen(true)}
                >
                  Đổi mật khẩu
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Detailed Information Card */}
        <Card title="Thông tin chi tiết">
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
            <Descriptions.Item label="UID" span={2}>
              <Text code copyable>
                {profile.uid}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Text copyable>{profile.email}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              <Text strong>{profile.username}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Họ và tên">
              {profile.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={getRoleColor(profile.role)}>
                {getRoleLabel(profile.role)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo tài khoản" span={2}>
              <Space>
                <CalendarOutlined />
                <Text>
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleString('vi-VN')
                    : 'Không rõ'}
                </Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <Tag
                color={profile.status === 'active' ? 'success' : 'default'}
                icon={profile.status === 'active' ? <CheckCircleOutlined /> : undefined}
              >
                {profile.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Modal: Edit Profile */}
        <Modal
          title={
            <Space>
              <EditOutlined />
              <span>Chỉnh sửa thông tin</span>
            </Space>
          }
          open={editModalOpen}
          onCancel={() => {
            setEditModalOpen(false);
            editForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditProfile}
            initialValues={{
              email: profile.email,
              fullName: profile.fullName
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: 'email', message: 'Email không hợp lệ!' },
                { required: true, message: 'Vui lòng nhập email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" />
            </Form.Item>

            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { max: 128, message: 'Họ tên không được quá 128 ký tự!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setEditModalOpen(false);
                    editForm.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<EditOutlined />}
                  loading={isUpdating}
                >
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal: Change Password */}
        <Modal
          title={
            <Space>
              <LockOutlined />
              <span>Đổi mật khẩu</span>
            </Space>
          }
          open={passwordModalOpen}
          onCancel={() => {
            setPasswordModalOpen(false);
            passwordForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu hiện tại"
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
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  }
                })
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setPasswordModalOpen(false);
                    passwordForm.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LockOutlined />}
                  loading={isChangingPassword}
                >
                  Đổi mật khẩu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal: Update Avatar */}
        <Modal
          title={
            <Space>
              <CameraOutlined />
              <span>Cập nhật avatar</span>
            </Space>
          }
          open={avatarModalOpen}
          onCancel={() => {
            setAvatarModalOpen(false);
            setFileList([]);
            setPreviewImage('');
          }}
          footer={null}
          width={500}
        >
          <div style={{ textAlign: 'center' }}>
            {previewImage && (
              <div style={{ marginBottom: 24 }}>
                <Avatar
                  size={200}
                  src={previewImage}
                  icon={<UserOutlined />}
                  style={{ border: '4px solid #1890ff' }}
                />
              </div>
            )}

            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length === 0 && (
                <div>
                  <CameraOutlined style={{ fontSize: 32 }} />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
            </Upload>

            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
              Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </Text>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setAvatarModalOpen(false);
                    setFileList([]);
                    setPreviewImage('');
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  icon={isUpdatingAvatar ? <LoadingOutlined /> : <CameraOutlined />}
                  onClick={handleAvatarUpload}
                  loading={isUpdatingAvatar}
                  disabled={fileList.length === 0}
                >
                  Cập nhật
                </Button>
              </Space>
            </div>
          </div>
        </Modal>
      </div>
    </TeacherLayout>
  );
};

export default UserProfile;
