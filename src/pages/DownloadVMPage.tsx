import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card, Button, Space, Typography, Row, Col, Divider, Alert, Steps, Tag } from 'antd';
import { DownloadOutlined, FileOutlined, CloudDownloadOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import '../styles/DownloadVMPage.css';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const DownloadVMPage: React.FC = () => {
  const vmOptions = [
    {
      name: 'Kali Linux',
      version: '2024.1',
      size: '3.5 GB',
      description: 'Hệ điều hành dành cho penetration testing và bảo mật',
      downloadUrl: '#',
      icon: '🐧',
      requirements: ['RAM: 2GB tối thiểu, 4GB khuyến nghị', 'Ổ cứng: 20GB trống', 'VMware hoặc VirtualBox']
    },
    {
      name: 'Ubuntu Server',
      version: '22.04 LTS',
      size: '2.8 GB',
      description: 'Hệ điều hành Linux phổ biến cho server và development',
      downloadUrl: '#',
      icon: '🖥️',
      requirements: ['RAM: 1GB tối thiểu, 2GB khuyến nghị', 'Ổ cứng: 15GB trống', 'VMware hoặc VirtualBox']
    },
    {
      name: 'Parrot Security',
      version: '5.3',
      size: '4.2 GB',
      description: 'Hệ điều hành bảo mật dựa trên Debian',
      downloadUrl: '#',
      icon: '🦜',
      requirements: ['RAM: 2GB tối thiểu, 4GB khuyến nghị', 'Ổ cứng: 25GB trống', 'VMware hoặc VirtualBox']
    }
  ];

  const downloadSteps = [
    {
      title: 'Tải file ISO',
      description: 'Tải file ISO từ link bên dưới',
      icon: <DownloadOutlined />
    },
    {
      title: 'Cài đặt VirtualBox/VMware',
      description: 'Cài đặt phần mềm ảo hóa nếu chưa có',
      icon: <FileOutlined />
    },
    {
      title: 'Tạo máy ảo mới',
      description: 'Tạo VM mới và mount file ISO',
      icon: <CloudDownloadOutlined />
    },
    {
      title: 'Cài đặt và khởi động',
      description: 'Khởi động VM và cài đặt hệ điều hành',
      icon: <CheckCircleOutlined />
    }
  ];

  return (
    <div className="download-vm-page">
      <Navigation />
      
      <div className="download-vm-container">
        {/* Hero Section */}
        <div className="download-hero">
          <Title level={1}>Tải máy ảo miễn phí</Title>
          <Paragraph className="hero-subtitle">
            Tải về các máy ảo Linux đã được cấu hình sẵn để bắt đầu học tập ngay lập tức.
            <br />
            Không cần cài đặt từ đầu, chỉ cần import và sử dụng!
          </Paragraph>
        </div>

        {/* Alert */}
        <Alert
          message="Hướng dẫn cài đặt"
          description="Các máy ảo này đã được cấu hình sẵn với các công cụ cần thiết. Bạn chỉ cần tải về và import vào VMware hoặc VirtualBox."
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{ marginBottom: 40 }}
        />

        {/* Steps */}
        <Card title="Các bước cài đặt" style={{ marginBottom: 40 }}>
          <Steps current={0} items={downloadSteps} />
        </Card>

        {/* VM Options */}
        <Title level={2}>Các máy ảo có sẵn</Title>
        
        <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
          {vmOptions.map((vm, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card
                className="vm-card"
                hoverable
                cover={
                  <div className="vm-card-header">
                    <div className="vm-icon">{vm.icon}</div>
                    <div>
                      <Title level={4} style={{ margin: 0, color: '#00d4ff' }}>
                        {vm.name}
                      </Title>
                      <Text type="secondary">Version {vm.version}</Text>
                    </div>
                  </div>
                }
                actions={[
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    block
                    onClick={() => {
                      window.open(vm.downloadUrl || '#', '_blank');
                    }}
                  >
                    Tải về ({vm.size})
                  </Button>
                ]}
              >
                <div className="vm-card-content">
                  <Paragraph>{vm.description}</Paragraph>
                  
                  <Divider style={{ margin: '16px 0' }} />
                  
                  <div className="vm-requirements">
                    <Text strong>Yêu cầu hệ thống:</Text>
                    <ul className="requirements-list">
                      {vm.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Alternative Options */}
        <Card title="Phương án thay thế" style={{ marginBottom: 40 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message="Sử dụng máy ảo trực tuyến"
              description={
                <div>
                  Nếu không muốn tải về, bạn có thể sử dụng máy ảo trực tuyến của chúng tôi.
                  <br />
                  <Button 
                    type="link" 
                    onClick={() => window.location.href = '/linux'}
                    style={{ padding: 0, marginTop: 8 }}
                  >
                    Truy cập Linux Lab trực tuyến →
                  </Button>
                </div>
              }
              type="success"
              showIcon
            />
            
            <Alert
              message="Sử dụng Docker (Dành cho người dùng nâng cao)"
              description="Nếu bạn đã quen với Docker, có thể sử dụng các Docker images thay vì máy ảo để tiết kiệm tài nguyên."
              type="info"
              showIcon
            />
          </Space>
        </Card>

        {/* FAQ Section */}
        <Card title="Câu hỏi thường gặp">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={5}>Có phải trả phí không?</Title>
              <Paragraph>
                Tất cả các máy ảo đều được cung cấp miễn phí. Bạn chỉ cần có tài khoản để tải về.
              </Paragraph>
            </div>
            
            <div>
              <Title level={5}>Tôi nên sử dụng VMware hay VirtualBox?</Title>
              <Paragraph>
                Cả hai đều hoạt động tốt. VirtualBox miễn phí hoàn toàn, còn VMware có hiệu năng tốt hơn một chút. 
                Nếu bạn mới bắt đầu, khuyến nghị dùng VirtualBox.
              </Paragraph>
            </div>
            
            <div>
              <Title level={5}>File có an toàn không?</Title>
              <Paragraph>
                Tất cả các file đều được kiểm tra virus và malware trước khi upload. 
                Chúng tôi đảm bảo an toàn 100% cho người dùng.
              </Paragraph>
            </div>
            
            <div>
              <Title level={5}>Tôi cần giúp đỡ cài đặt?</Title>
              <Paragraph>
                Nếu bạn gặp khó khăn trong quá trình cài đặt, vui lòng liên hệ hỗ trợ hoặc sử dụng AI Assistant 
                để được hướng dẫn từng bước.
              </Paragraph>
            </div>
          </Space>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default DownloadVMPage;

