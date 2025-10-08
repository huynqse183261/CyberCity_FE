import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  Card,
  Row,
  Col,
  Avatar,
  Tag,
  Button,
  Modal,
  Descriptions,
  Spin,
  Input,
  Select,
  Space,
  message,
  Form
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useUsers, useUpdateUserRole, useUpdateUserStatus } from '../hooks/useUsers';

const { Search } = Input;
const { Option } = Select;

const AdminTeamManagement: React.FC = () => {
  const { data, isLoading, error } = useUsers({ pageNumber: 1, pageSize: 100, descending: true });
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [form] = Form.useForm();

  // Helper to get a stable user id from various possible fields
  const getUserId = (user: any): string | undefined => {
    if (!user) return undefined;
    return (
      user.uid ??
      user.id ??
      user.userId ??
      user._id ??
      user.userID ??
      user.Id ??
      user.Uid ??
      user.user_uid ??
      user.userUid ??
      user.UID ??
      user.uId
    );
  };

  const users = data?.items || [];

  const filteredUsers = users.filter((user: any) => {
    const name = (user.full_name || user.fullName || user.username || '').toLowerCase();
    const matchesSearch = name.includes(searchText.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchText.toLowerCase()) ||
                         (user.username || '').toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCardClick = (user: any) => {
    setSelectedUser(user);
    setDetailModalVisible(true);
  };

  const handleEdit = (user: any, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedUser(user);
    form.setFieldsValue({
      role: user.role,
      status: user.status ?? (user.isActive ? 'Active' : 'Inactive')
    });
    setEditModalVisible(true);
  };

  // Deletion is disabled by requirement; only role/status updates are allowed

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const values = await form.validateFields();
  const userId = getUserId(selectedUser);

      if (!userId) {
        message.error('Cannot update: Invalid ID');
        return;
      }

      if (values.role !== selectedUser.role) {
        await updateRoleMutation.mutateAsync({ id: userId, role: values.role });
      }

      const prevStatus: 'Active' | 'Inactive' = selectedUser.status ?? (selectedUser.isActive ? 'Active' : 'Inactive');
      if (values.status && values.status !== prevStatus) {
        await updateStatusMutation.mutateAsync({ id: userId, status: values.status });
      }

      message.success('Updated successfully');
      setEditModalVisible(false);
      setSelectedUser({ ...selectedUser, ...values });
    } catch (error) {
      console.error('Update failed:', error);
      message.error('Update failed');
    }
  };

  const handleStatusToggle = async (userId: string | undefined, newStatus: 'Active' | 'Inactive', event?: any) => {
    if (event) event.stopPropagation();
    
    if (!userId) {
      message.error('Cannot update: Invalid ID');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({ id: userId, status: newStatus });
      message.success('Status updated successfully');
    } catch (error) {
      console.error('Status update failed:', error);
      message.error('Status update failed');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'teacher': return 'blue';
      case 'student': return 'green';
      default: return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'admin';
      case 'teacher': return 'teacher';
      case 'student': return 'student';
      default: return role || 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading team members...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <h2>Error loading team data</h2>
          <p>Please try again later</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <h2>Team Management</h2>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Member
            </Button>
          </Col>
        </Row>

        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Space size="middle">
                <Search
                  placeholder="Search by name, email, username..."
                  allowClear
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Select
                  value={roleFilter}
                  onChange={setRoleFilter}
                  style={{ width: 150 }}
                >
                  <Option value="all">All Roles</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="teacher">Teacher</Option>
                  <Option value="student">Student</Option>
                </Select>
              </Space>
            </Col>
            <Col>
              <Tag color="blue">Total: {filteredUsers.length} members</Tag>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {filteredUsers.map((user: any, index: number) => {
            const userId = getUserId(user);
            const status: 'Active' | 'Inactive' = user.status ?? (user.isActive ? 'Active' : 'Inactive');
            const isActive = status === 'Active';
            const userRole = user.role || 'student';
            
            return (
              <Col key={`${userId ?? 'user'}-${index}`} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => handleCardClick(user)}
                  style={{ height: 280, cursor: 'pointer' }}
                  actions={[
                    <Button 
                      key={`edit-${index}`}
                      type="link"
                      icon={<EditOutlined />} 
                      onClick={(e) => handleEdit(user, e)}
                    >
                      Edit
                    </Button>,
                    <Button
                      key={`toggle-${index}`}
                      type="link"
                      onClick={(e) => handleStatusToggle(userId, isActive ? 'Inactive' : 'Active', e)}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  ]}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Avatar 
                      size={64} 
                      src={user.image || user.avatar} 
                      icon={<UserOutlined />}
                      style={{ marginBottom: 12 }}
                    />
                    <div style={{ marginBottom: 8 }}>
                      <strong>{user.full_name || user.fullName || user.username || 'Unknown User'}</strong>
                    </div>
                    <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>
                      {user.email || 'No email'}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <Tag color={getRoleColor(userRole)}>
                        {getRoleText(userRole)}
                      </Tag>
                    </div>
                    <div>
                      <Tag color={isActive ? 'green' : 'red'}>
                        {isActive ? 'Active' : 'Inactive'}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
            <p>No members found</p>
          </div>
        )}

        <Modal
          title="Member Details"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Close
            </Button>
          ]}
          width={600}
        >
          {selectedUser && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar 
                  size={80} 
                  src={selectedUser.image || selectedUser.avatar} 
                  icon={<UserOutlined />}
                />
              </div>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Full Name">
                  {selectedUser.full_name || selectedUser.fullName || 'Not provided'}
                </Descriptions.Item>
                <Descriptions.Item label="Username">
                  {selectedUser.username || 'Not provided'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedUser.email || 'Not provided'}
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={getRoleColor(selectedUser.role)}>
                    {getRoleText(selectedUser.role)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={(selectedUser.status ?? (selectedUser.isActive ? 'Active' : 'Inactive')) === 'Active' ? 'green' : 'red'}>
                    {(selectedUser.status ?? (selectedUser.isActive ? 'Active' : 'Inactive'))}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : (selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Not provided')}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleDateString() : (selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : 'Not provided')}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Modal>

        <Modal
          title="Edit Member"
          open={editModalVisible}
          onOk={handleSaveEdit}
          onCancel={() => setEditModalVisible(false)}
          okText="Save"
          cancelText="Cancel"
          width={500}
        >
          {selectedUser && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar 
                  size={64} 
                  src={selectedUser.image || selectedUser.avatar} 
                  icon={<UserOutlined />}
                />
                <div style={{ marginTop: 8, fontWeight: 'bold' }}>
                  {selectedUser.full_name || selectedUser.fullName || selectedUser.username}
                </div>
                <div style={{ color: '#666' }}>
                  {selectedUser.email}
                </div>
              </div>
              
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: 'Please select a role' }]}
                >
                  <Select>
                    <Option value="student">Student</Option>
                    <Option value="teacher">Teacher</Option>
                    <Option value="admin">Admin</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select>
                    <Option value={'Active'}>Active</Option>
                    <Option value={'Inactive'}>Inactive</Option>
                  </Select>
                </Form.Item>
              </Form>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminTeamManagement;
