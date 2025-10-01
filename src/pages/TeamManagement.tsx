import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import type { TeamMember } from '../models/TeamTypes';
import {
  Card,
  Table,
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  UploadOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

const TeamManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form] = Form.useForm();

  // Sample team data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      key: '1',
      id: 'EMP001',
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@company.com',
      phone: '0123456789',
      position: 'Full Stack Developer',
      department: 'Công nghệ',
      role: 'employee',
      status: 'active',
      joinDate: '2023-01-15',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      salary: 25000000,
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      bio: 'Developer với 3 năm kinh nghiệm phát triển web',
    },
    {
      key: '2',
      id: 'EMP002',
      name: 'Trần Thị Bình',
      email: 'tranthibinh@company.com',
      phone: '0987654321',
      position: 'UI/UX Designer',
      department: 'Thiết kế',
      role: 'employee',
      status: 'active',
      joinDate: '2023-03-20',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      salary: 20000000,
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
      bio: 'Designer chuyên về UI/UX với 4 năm kinh nghiệm',
    },
    {
      key: '3',
      id: 'EMP003',
      name: 'Lê Văn Cường',
      email: 'levancuong@company.com',
      phone: '0369852147',
      position: 'Project Manager',
      department: 'Quản lý',
      role: 'manager',
      status: 'active',
      joinDate: '2022-06-10',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      salary: 35000000,
      skills: ['Agile', 'Scrum', 'Jira', 'Leadership'],
      bio: 'Project Manager với 6 năm kinh nghiệm quản lý dự án',
    },
    {
      key: '4',
      id: 'EMP004',
      name: 'Phạm Thị Dung',
      email: 'phamthidung@company.com',
      phone: '0741852963',
      position: 'Marketing Manager',
      department: 'Marketing',
      role: 'manager',
      status: 'active',
      joinDate: '2023-05-01',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
      address: '321 Đường GHI, Quận 4, TP.HCM',
      salary: 30000000,
      skills: ['Digital Marketing', 'SEO', 'Google Ads', 'Social Media'],
      bio: 'Marketing Manager với kinh nghiệm 5 năm trong digital marketing',
    },
    {
      key: '5',
      id: 'EMP005',
      name: 'Hoàng Văn Em',
      email: 'hoangvanem@company.com',
      phone: '0147258369',
      position: 'System Administrator',
      department: 'Công nghệ',
      role: 'admin',
      status: 'active',
      joinDate: '2022-01-10',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',
      address: '654 Đường JKL, Quận 5, TP.HCM',
      salary: 28000000,
      skills: ['Linux', 'Docker', 'AWS', 'DevOps'],
      bio: 'System Admin chuyên về cloud và infrastructure',
    },
  ]);

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

  const columns: ColumnsType<TeamMember> = [
    {
      title: 'Nhân viên',
      key: 'member',
      render: (_, record: TeamMember) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      filters: departments.map(dept => ({ text: dept, value: dept })),
      onFilter: (value: any, record: TeamMember) => record.department === value,
      render: (department: string) => <Tag color="cyan">{department}</Tag>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Quản trị viên', value: 'admin' },
        { text: 'Quản lý', value: 'manager' },
        { text: 'Nhân viên', value: 'employee' },
      ],
      onFilter: (value: any, record: TeamMember) => record.role === value,
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {getRoleText(role)}
        </Tag>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record: TeamMember) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            <MailOutlined /> {record.email}
          </div>
          <div style={{ fontSize: '12px' }}>
            <PhoneOutlined /> {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => `${salary.toLocaleString('vi-VN')} VNĐ`,
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang làm việc', value: 'active' },
        { text: 'Đã nghỉ việc', value: 'inactive' },
      ],
      onFilter: (value: any, record: TeamMember) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang làm việc' : 'Đã nghỉ việc'}
        </Tag>
      ),
    },
    {
      title: 'Ngày vào',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record: TeamMember) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingMember(null);
    form.resetFields();
    setIsModalVisible(true);
  };

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

  const handleDelete = (key: string) => {
    setTeamMembers(teamMembers.filter(member => member.key !== key));
    message.success('Xóa nhân viên thành công!');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const skillsArray = values.skills ? values.skills.split(',').map((skill: string) => skill.trim()) : [];
      
      if (editingMember) {
        // Update existing member
        setTeamMembers(teamMembers.map(member => 
          member.key === editingMember.key 
            ? { ...editingMember, ...values, skills: skillsArray }
            : member
        ));
        message.success('Cập nhật nhân viên thành công!');
      } else {
        // Add new member
        const newMember: TeamMember = {
          key: Date.now().toString(),
          id: `EMP${String(teamMembers.length + 1).padStart(3, '0')}`,
          ...values,
          skills: skillsArray,
          joinDate: new Date().toISOString().split('T')[0],
        };
        setTeamMembers([...teamMembers, newMember]);
        message.success('Thêm nhân viên thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const filteredMembers = teamMembers.filter(member => {
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
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm nhân viên
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Team Members Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredMembers}
            pagination={{
              total: filteredMembers.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} nhân viên`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

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
