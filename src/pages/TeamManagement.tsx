import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import type { TeamMember } from '../models/TeamTypes';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import {
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Avatar,
  Upload,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const TeamManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form] = Form.useForm();

  // Fetch users from API
  const { data: usersData, isLoading, error } = useUsers({ pageNumber: 1, pageSize: 1000, descending: true });
  const deleteUserMutation = useDeleteUser();

  // Map backend response to TeamMember[]
  const teamMembers: TeamMember[] = (Array.isArray(usersData) ? usersData : (usersData && usersData.items) || []).map((u: any, idx: number) => ({
    key: u.uid || u.id || String(idx),
    id: u.uid || u.id || `U${idx}`,
    name: u.fullName || u.username || u.email || 'Không tên',
    email: u.email || '',
    phone: u.phone || u.mobile || '',
    position: u.position || u.role || 'Nhân viên',
    department: u.department || 'Chưa xác định',
    role: (u.role as 'admin' | 'manager' | 'employee') || 'employee',
    status: (u.status || 'active') as 'active' | 'inactive',
    joinDate: u.createdAt || u.joinDate || '',
    avatar: u.avatar || u.image || undefined,
    address: u.address || '',
    salary: u.salary || 0,
    skills: u.skills || [],
    bio: u.bio || '',
  }));

  const departments = ['Công nghệ', 'Thiết kế', 'Marketing', 'Quản lý', 'Nhân sự', 'Kế toán'];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'manager': return 'blue';
      case 'employee': return 'green';
      default: return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'manager': return 'Quản lý';
      case 'employee': return 'Nhân viên';
      default: return role;
    }
  };

  // Using card-grid UI instead of table; remove table columns


  // handleAdd is not used in card view; keep modal control via button above

  // isLoading comes from useUsers hook above

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    form.setFieldsValue({
      ...member,
      skills: member.skills.join(', '),
    });
    setIsModalVisible(true);
  };

  const handleView = (member: TeamMember) => {
    Modal.info({
      title: 'Thông tin nhân viên',
      content: (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Avatar size={80} src={member.avatar} icon={<UserOutlined />} />
          </div>
          <p><strong>Mã NV:</strong> {member.id}</p>
          <p><strong>Tên:</strong> {member.name}</p>
          <p><strong>Vị trí:</strong> {member.position}</p>
          <p><strong>Phòng ban:</strong> {member.department}</p>
          <p><strong>Email:</strong> {member.email}</p>
          <p><strong>Số điện thoại:</strong> {member.phone}</p>
          <p><strong>Địa chỉ:</strong> {member.address}</p>
          <p><strong>Lương:</strong> {member.salary.toLocaleString('vi-VN')} VNĐ</p>
          <p><strong>Kỹ năng:</strong> {member.skills.join(', ')}</p>
          <p><strong>Giới thiệu:</strong> {member.bio}</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleDelete = async (key: string) => {
    try {
      // call delete API
      await deleteUserMutation.mutateAsync(key);
    } catch (err) {
      console.error('Delete user error', err);
    }
  };

  // Local changes for optimistic create/update (backend mutations not implemented here)
  const [localChanges, setLocalChanges] = useState<TeamMember[]>([]);

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const skillsArray = values.skills ? values.skills.split(',').map((skill: string) => skill.trim()) : [];

      if (editingMember) {
        // Apply update to localChanges (replace if existed)
        const updated: TeamMember = { ...editingMember, ...values, skills: skillsArray };
        setLocalChanges(prev => prev.map(c => c.key === updated.key ? updated : c));
        message.success('Cập nhật nhân viên (cục bộ) thành công!');
      } else {
        // Add new member locally
        const newMember: TeamMember = {
          key: Date.now().toString(),
          id: `EMP${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`,
          ...values,
          skills: skillsArray,
          joinDate: new Date().toISOString().split('T')[0],
        };
        setLocalChanges(prev => [newMember, ...prev]);
        message.success('Thêm nhân viên (cục bộ) thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Merge backend members with local changes (dedupe by key)
  const mergedMembersMap = new Map<string, TeamMember>();
  teamMembers.forEach(m => mergedMembersMap.set(m.key, m));
  localChanges.forEach(m => mergedMembersMap.set(m.key, m));
  const mergedMembers = Array.from(mergedMembersMap.values());

  const filteredMembers = mergedMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         member.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    admins: teamMembers.filter(m => m.role === 'admin').length,
    managers: teamMembers.filter(m => m.role === 'manager').length,
    employees: teamMembers.filter(m => m.role === 'employee').length,
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2>Quản lý đội ngũ</h2>
        </div>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng nhân viên"
                value={stats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang làm việc"
                value={stats.active}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Quản lý"
                value={stats.managers}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Nhân viên"
                value={stats.employees}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Controls */}
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Space size="middle">
                <Input
                  placeholder="Tìm kiếm nhân viên..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                <Select
                  value={selectedDepartment}
                  onChange={setSelectedDepartment}
                  style={{ width: 150 }}
                >
                  <Option value="all">Tất cả phòng ban</Option>
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
                <Select
                  value={selectedRole}
                  onChange={setSelectedRole}
                  style={{ width: 150 }}
                >
                  <Option value="all">Tất cả vai trò</Option>
                  <Option value="admin">Quản trị viên</Option>
                  <Option value="manager">Quản lý</Option>
                  <Option value="employee">Nhân viên</Option>
                </Select>
              </Space>
            </Col>
            <div>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
              ) : (
                <Row gutter={[16, 16]}>
                  {filteredMembers.map(member => (
                    <Col key={member.key} xs={24} sm={12} md={8} lg={6}>
                      <div onClick={() => handleView(member)} style={{ cursor: 'pointer' }}>
                        <Card hoverable className="team-card">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar size={64} src={member.avatar} icon={<UserOutlined />} />
                            <div style={{ marginLeft: 12, flex: 1 }}>
                              <div style={{ fontWeight: 600 }}>{member.name}</div>
                              <div style={{ color: '#666', fontSize: 12 }}>{member.position}</div>
                              <div style={{ marginTop: 6 }}>
                                <Tag color="cyan">{member.department}</Tag>
                                <Tag color={getRoleColor(member.role)}>{getRoleText(member.role)}</Tag>
                              </div>
                            </div>
                          </div>

                          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 12, color: '#444' }}>
                              <div>{member.email}</div>
                              <div>{member.phone}</div>
                            </div>

                            <div>
                              <Space>
                                <Button size="small" onClick={(e) => { e.stopPropagation(); handleView(member); }}>
                                  Xem
                                </Button>
                                <Button size="small" onClick={(e) => { e.stopPropagation(); handleEdit(member); }}>Sửa</Button>
                                <Popconfirm title="Bạn có chắc muốn xóa nhân viên này?" onConfirm={(e) => { e?.stopPropagation(); handleDelete(member.key); }} okText="Có" cancelText="Không">
                                  <Button danger size="small" onClick={(e) => e.stopPropagation()}>Xóa</Button>
                                </Popconfirm>
                              </Space>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Row>
        </Card>

        {/* Team Members Grid (cards) rendered above */}

        {/* Add/Edit Modal */}
        <Modal
          title={editingMember ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={800}
          okText={editingMember ? 'Cập nhật' : 'Thêm'}
          cancelText="Hủy"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: 'active', role: 'employee' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên nhân viên"
                  rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                  <Input placeholder="Nhập tên nhân viên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="Vị trí"
                  rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}
                >
                  <Input placeholder="Nhập vị trí" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="department"
                  label="Phòng ban"
                  rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
                >
                  <Select placeholder="Chọn phòng ban">
                    {departments.map(dept => (
                      <Option key={dept} value={dept}>{dept}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Vai trò"
                  rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                  <Select>
                    <Option value="admin">Quản trị viên</Option>
                    <Option value="manager">Quản lý</Option>
                    <Option value="employee">Nhân viên</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="salary"
                  label="Lương (VNĐ)"
                  rules={[{ required: true, message: 'Vui lòng nhập lương!' }]}
                >
                  <Input type="number" placeholder="Nhập lương" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select>
                    <Option value="active">Đang làm việc</Option>
                    <Option value="inactive">Đã nghỉ việc</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item
              name="skills"
              label="Kỹ năng (phân cách bằng dấu phẩy)"
            >
              <Input placeholder="VD: React, Node.js, TypeScript" />
            </Form.Item>

            <Form.Item
              name="bio"
              label="Giới thiệu"
            >
              <TextArea rows={3} placeholder="Nhập mô tả về nhân viên" />
            </Form.Item>

            <Form.Item
              name="avatar"
              label="Ảnh đại diện"
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
