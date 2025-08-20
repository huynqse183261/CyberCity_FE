import React from 'react';
import TeacherLayout from '../components/TeacherLayout';
import { Card, Form, Input, Button, Checkbox, Select } from 'antd';

const TeacherSettings: React.FC = () => (
  <TeacherLayout>
    <Card title="Cài đặt">
      <Form layout="vertical">
        <Form.Item label="Họ và tên">
          <Input defaultValue="Nguyễn Văn Minh" />
        </Form.Item>
        <Form.Item label="Email">
          <Input defaultValue="minh.nguyen@edutech.com" />
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input defaultValue="0901234567" />
        </Form.Item>
        <Form.Item label="Chuyên môn">
          <Input defaultValue="Linux System & UI/UX Design" />
        </Form.Item>
        <Form.Item label="Ngôn ngữ giao diện">
          <Select defaultValue="vi">
            <Select.Option value="vi">Tiếng Việt</Select.Option>
            <Select.Option value="en">English</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Nhận thông báo email" valuePropName="checked">
          <Checkbox defaultChecked />
        </Form.Item>
        <Form.Item label="Tự động sao lưu dữ liệu" valuePropName="checked">
          <Checkbox defaultChecked />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Lưu cài đặt</Button>
        </Form.Item>
      </Form>
    </Card>
  </TeacherLayout>
);

export default TeacherSettings;