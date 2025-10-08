import React, { useState, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Popconfirm, Tag, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePricingPlans, useCreatePricing, useUpdatePricing, useDeletePricing } from '../hooks/usePricing';
import type { PricingPlanDTO } from '../models/PricingTypes';

const AdminPricingManagement: React.FC = () => {
  const { data, isLoading } = usePricingPlans();
  const createMutation = useCreatePricing();
  const updateMutation = useUpdatePricing();
  const deleteMutation = useDeletePricing();

  const [isModalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<PricingPlanDTO | null>(null);
  const [form] = Form.useForm();

  const plans = useMemo(() => (Array.isArray(data) ? data : (data as any)?.items || []), [data]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (p: PricingPlanDTO) => {
    setEditing(p);
    form.setFieldsValue({
      planName: p.planName,
      price: p.price,
      durationDays: p.durationDays,
      features: p.features,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.uid, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      setModalVisible(false);
      form.resetFields();
    } catch (err: any) {
      console.error(err);
      // message shown by mutations on error
    }
  };

  const columns = [
    { title: 'Tên gói', dataIndex: 'planName', key: 'planName' },
    { title: 'Giá (VNĐ)', dataIndex: 'price', key: 'price', render: (v: number) => v?.toLocaleString('vi-VN') },
    { title: 'Thời hạn (ngày)', dataIndex: 'durationDays', key: 'durationDays' },
    { title: 'Tính năng', dataIndex: 'features', key: 'features', render: (f: string) => (
      typeof f === 'string' && f.startsWith('[') ? (
        JSON.parse(f).map((x: string, i: number) => <Tag key={i}>{x}</Tag>)
      ) : (
        <div style={{ whiteSpace: 'pre-line' }}>{f}</div>
      )
    )},
    { title: 'Thao tác', key: 'action', width: 220, render: (_: any, record: PricingPlanDTO) => (
      <Space>
        <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>Sửa</Button>
        <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.uid)} okText="Có" cancelText="Không">
          <Button danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>
      </Space>
    )}
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <h2>Quản lý gói cước</h2>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm gói mới</Button>
          </Col>
        </Row>

        <Card>
          <Table
            rowKey={(r: any) => r.uid}
            loading={isLoading}
            columns={columns}
            dataSource={plans}
            pagination={{ pageSize: 10 }}
          />
        </Card>

        <Modal title={editing ? 'Cập nhật gói' : 'Thêm gói mới'} open={isModalVisible} onOk={handleOk} onCancel={() => setModalVisible(false)} okText={editing ? 'Lưu' : 'Tạo'}>
          <Form form={form} layout="vertical">
            <Form.Item name="planName" label="Tên gói" rules={[{ required: true, message: 'Nhập tên gói' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Nhập giá' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="durationDays" label="Thời hạn (ngày)" rules={[{ required: true, message: 'Nhập thời hạn' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="features" label="Tính năng (hoặc JSON array)">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminPricingManagement;
