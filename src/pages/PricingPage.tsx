import React from 'react';
import { Card, Row, Col, Button, Spin, Tag } from 'antd';
import { usePricingPlans } from '../hooks/usePricing';
import '../styles/PricingPage.css';

const PricingPage: React.FC = () => {
  const { data, isLoading, error } = usePricingPlans();

  if (isLoading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  if (error) return <div style={{ padding: 40 }}>Có lỗi khi tải dữ liệu.</div>;

  // Backend might return array or paged object
  const plans = Array.isArray(data) ? data : (data as any).items || [];

  return (
    <div style={{ padding: 24 }}>
      <h2>Gói cước</h2>
      <Row gutter={16}>
        {plans.map((p: any) => (
          <Col key={p.uid} xs={24} sm={12} md={8} lg={6} style={{ marginBottom: 16 }}>
            <Card title={p.planName} bordered>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{p.price?.toLocaleString('vi-VN')} VNĐ</div>
              <div>Thời hạn: {p.durationDays} ngày</div>
              <div style={{ marginTop: 8 }}>
                {/* features could be JSON or plain text */}
                {typeof p.features === 'string' && p.features.startsWith('[') ? (
                  JSON.parse(p.features).map((f: string, idx: number) => <Tag key={idx}>{f}</Tag>)
                ) : (
                  <div style={{ whiteSpace: 'pre-line' }}>{p.features}</div>
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <Button type="primary">Chọn gói</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PricingPage;
