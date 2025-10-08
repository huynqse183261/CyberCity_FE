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
  Popconfirm,
  message,
  Form
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useUsers, useDeleteUser, useUpdateUserRole, useUpdateUserStatus } from '../hooks/useUsers';

const { Search } = Input;
const { Option } = Select;

const AdminTeamManagement: React.FC = () => {
  const { data, isLoading, error } = useUsers({ pageNumber: 1, pageSize: 100, descending: true });
  const deleteUserMutation = useDeleteUser();
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [form] = Form.useForm();

  const users = data?.items || [];

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = (user.fullName || '').toLowerCase().includes(searchText.toLowerCase()) ||
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
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (userId: string, event?: any) => {
    if (event) event.stopPropagation();
    
    if (!userId) {
      message.error('Cannot delete: Invalid ID');
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(userId);
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('Failed to delete user');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const values = await form.validateFields();
      const userId = selectedUser.uid || selectedUser.id;

      if (!userId) {
        message.error('Cannot update: Invalid ID');
        return;
      }

      if (values.role !== selectedUser.role) {
        await updateRoleMutation.mutateAsync({ id: userId, role: values.role });
      }

      if (values.isActive !== selectedUser.isActive) {
        await updateStatusMutation.mutateAsync({ id: userId, isActive: values.isActive });
      }

      message.success('Updated successfully');
      setEditModalVisible(false);
      setSelectedUser({ ...selectedUser, ...values });
    } catch (error) {
      console.error('Update failed:', error);
      message.error('Update failed');
    }
  };

  const handleStatusToggle = async (userId: string, newStatus: boolean, event?: any) => {
    if (event) event.stopPropagation();
    
    if (!userId) {
      message.error('Cannot update: Invalid ID');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({ id: userId, isActive: newStatus });
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
      case 'admin': return 'Admin';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
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
            const userId = user.uid || user.id || `user-${index}`;
            const isActive = user.isActive !== undefined ? user.isActive : true;
            const userRole = user.role || 'student';
            
            return (
              <Col key={`${userId}-${index}`} xs={24} sm={12} md={8} lg={6}>
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
                    <Popconfirm
                      key={`delete-${index}`}
                      title="Are you sure you want to delete this member?"
                      onConfirm={(e) => handleDelete(userId, e)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button 
                        type="link"
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Delete
                      </Button>
                    </Popconfirm>,
                    <Button
                      key={`toggle-${index}`}
                      type="link"
                      onClick={(e) => handleStatusToggle(userId, !isActive, e)}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  ]}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Avatar 
                      size={64} 
                      src={user.avatar} 
                      icon={<UserOutlined />}
                      style={{ marginBottom: 12 }}
                    />
                    <div style={{ marginBottom: 8 }}>
                      <strong>{user.fullName || user.username || 'Unknown User'}</strong>
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
                  src={selectedUser.avatar} 
                  icon={<UserOutlined />}
                />
              </div>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Full Name">
                  {selectedUser.fullName || 'Not provided'}
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
                  <Tag color={selectedUser.isActive ? 'green' : 'red'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Not provided'}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : 'Not provided'}
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
                  src={selectedUser.avatar} 
                  icon={<UserOutlined />}
                />
                <div style={{ marginTop: 8, fontWeight: 'bold' }}>
                  {selectedUser.fullName || selectedUser.username}
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
                  name="isActive"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select>
                    <Option value={true}>Active</Option>
                    <Option value={false}>Inactive</Option>
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
