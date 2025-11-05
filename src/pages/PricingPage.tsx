import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { usePricingPlans } from '../hooks/usePricing';
import { Spin, message } from 'antd';
import '../styles/PricingPage.css';

interface PricingPlan {
  uid: string;
  planName: string;
  price: number;
  durationDays: number;
  features: string | string[];
  isFeatured?: boolean;
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = usePricingPlans();
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Parse plans from API
  const plans: PricingPlan[] = React.useMemo(() => {
    if (!data) return [];
    const rawPlans = Array.isArray(data) ? data : (data as any)?.items || [];
    return rawPlans.map((plan: any) => ({
      uid: plan.uid,
      planName: plan.planName,
      price: plan.price || 0,
      durationDays: plan.durationDays || 30,
      features: typeof plan.features === 'string' && plan.features.startsWith('[')
        ? JSON.parse(plan.features)
        : plan.features?.split('\n') || [],
      isFeatured: plan.planName?.toLowerCase().includes('premium') || plan.planName?.toLowerCase().includes('pro')
    }));
  }, [data]);

  // Mock plans nếu API chưa có dữ liệu
  const mockPlans: PricingPlan[] = [
    {
      uid: 'free',
      planName: 'Free',
      price: 0,
      durationDays: 9999,
      features: [
        '5 bài tập cơ bản',
        'Truy cập Linux Terminal (giới hạn)',
        'Khóa học miễn phí',
        'Cộng đồng học tập',
        'Hỗ trợ email'
      ],
      isFeatured: false
    },
    {
      uid: 'premium',
      planName: 'Premium',
      price: pricingPeriod === 'monthly' ? 299000 : 2390000,
      durationDays: pricingPeriod === 'monthly' ? 30 : 365,
      features: [
        'Truy cập không giới hạn tất cả bài tập',
        'Linux Terminal đầy đủ tính năng',
        'AI Assistant 24/7',
        'Lab Environment riêng biệt',
        'Tất cả khóa học Premium',
        'Penetration Testing Tools',
        'Chứng chỉ hoàn thành',
        'Hỗ trợ ưu tiên',
        'Tài liệu độc quyền'
      ],
      isFeatured: true
    },
    {
      uid: 'business',
      planName: 'Business',
      price: pricingPeriod === 'monthly' ? 899000 : 7192000,
      durationDays: pricingPeriod === 'monthly' ? 30 : 365,
      features: [
        'Tất cả tính năng Premium',
        'Quản lý nhóm và tiến độ',
        'Dashboard doanh nghiệp',
        'API tích hợp',
        'Báo cáo chi tiết',
        'Đào tạo tùy chỉnh',
        'Dedicated Account Manager',
        'SSO (Single Sign-On)',
        'Hỗ trợ 24/7 priority',
        'Tùy chỉnh branding'
      ],
      isFeatured: false
    }
  ];

  const displayPlans = plans.length > 0 ? plans : mockPlans;

  // Handle plan selection
  const handleSelectPlan = (plan: PricingPlan) => {
    if (!isAuthenticated) {
      // Chưa đăng nhập -> redirect đến login với returnUrl
      message.info('Vui lòng đăng nhập để tiếp tục mua gói');
      navigate('/login', { 
        state: { 
          from: '/pricing',
          planUid: plan.uid,
          planName: plan.planName 
        } 
      });
      return;
    }

    // Đã đăng nhập -> chuyển đến trang checkout/order
    // Có thể tạo order ngay hoặc đi đến trang checkout
    navigate('/checkout', {
      state: {
        planUid: plan.uid,
        planName: plan.planName,
        price: plan.price,
        durationDays: plan.durationDays,
        period: pricingPeriod
      }
    });
  };

  // Toggle FAQ
  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="pricing-page">
        <Navigation />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 20, color: '#cbd5e0' }}>Đang tải thông tin gói dịch vụ...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pricing-page">
        <Navigation />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p style={{ color: '#ff4d4f' }}>Có lỗi khi tải dữ liệu. Đang hiển thị gói mặc định.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pricing-page">
      <Navigation />
      
      <div className="pricing-container">
        {/* Hero Section */}
        <div className="pricing-hero">
          <h1 className="pricing-title">Nâng tầm kỹ năng với Premium</h1>
          <p className="pricing-subtitle">
            Chọn gói dịch vụ phù hợp để trải nghiệm toàn bộ tính năng học tập và phát triển kỹ năng cybersecurity
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Học viên</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Bài tập</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Khóa học</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Hỗ trợ</div>
            </div>
          </div>
        </div>

        {/* Pricing Toggle */}
        <div className="pricing-toggle">
          <div className="toggle-container">
            <button
              className={`toggle-btn ${pricingPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setPricingPeriod('monthly')}
            >
              Thanh toán theo tháng
            </button>
            <button
              className={`toggle-btn ${pricingPeriod === 'yearly' ? 'active' : ''}`}
              onClick={() => setPricingPeriod('yearly')}
            >
              Thanh toán theo năm
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards">
          {displayPlans.map((plan, index) => {
            const isFree = plan.price === 0;
            const yearlyPrice = pricingPeriod === 'yearly' && !isFree
              ? Math.round(plan.price * 12 * 0.8) // 20% discount
              : plan.price;
            const monthlyPrice = plan.price;

            return (
              <div
                key={plan.uid || index}
                className={`pricing-card ${plan.isFeatured ? 'featured' : ''}`}
              >
                <div className="card-header">
                  <div className="plan-icon">
                    {plan.planName === 'Free' ? '🆓' : plan.planName === 'Premium' ? '⭐' : '🏢'}
                  </div>
                  <div className="plan-name">{plan.planName}</div>
                  <div className="plan-description">
                    {plan.planName === 'Free' && 'Bắt đầu học tập với các tính năng cơ bản'}
                    {plan.planName === 'Premium' && 'Tối ưu cho học viên cá nhân muốn phát triển kỹ năng'}
                    {plan.planName === 'Business' && 'Dành cho doanh nghiệp và nhóm học tập'}
                  </div>
                </div>

                <div className="pricing">
                  {isFree ? (
                    <>
                      <div className="price">0đ</div>
                      <div className="price-period">/ tháng</div>
                      <div className="price-note">Miễn phí mãi mãi</div>
                    </>
                  ) : (
                    <>
                      <div className={`price ${pricingPeriod === 'yearly' ? 'yearly' : 'monthly'}`}>
                        {pricingPeriod === 'monthly' 
                          ? `${monthlyPrice.toLocaleString('vi-VN')}đ`
                          : `${yearlyPrice.toLocaleString('vi-VN')}đ`
                        }
                      </div>
                      <div className={`price-period ${pricingPeriod === 'yearly' ? 'yearly' : 'monthly'}`}>
                        {pricingPeriod === 'monthly' ? '/ tháng' : '/ năm'}
                      </div>
                      {pricingPeriod === 'yearly' && (
                        <div className="price-note">Tiết kiệm 20% so với thanh toán tháng</div>
                      )}
                    </>
                  )}
                </div>

                <div className="features">
                  <h4>Tính năng bao gồm:</h4>
                  <ul className="feature-list">
                    {Array.isArray(plan.features) ? (
                      plan.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))
                    ) : (
                      <li>{plan.features}</li>
                    )}
                  </ul>
                </div>

                <button
                  className={`cta-button ${
                    plan.isFeatured ? 'cta-primary' : isFree ? 'cta-outline' : 'cta-secondary'
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {isFree ? 'Bắt đầu miễn phí' : plan.isFeatured ? 'Chọn gói Premium' : 'Chọn gói Business'}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="faq">
          <h3>Câu hỏi thường gặp</h3>
          
          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(0)}>
              <span>Tôi có thể thay đổi gói dịch vụ không?</span>
              <span>{expandedFAQ === 0 ? '−' : '+'}</span>
            </div>
            <div className={`faq-answer ${expandedFAQ === 0 ? 'active' : ''}`}>
              Bạn có thể nâng cấp hoặc hạ cấp gói dịch vụ bất cứ lúc nào. Việc thay đổi sẽ có hiệu lực ngay lập tức và bạn chỉ trả phần chênh lệch.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(1)}>
              <span>Có được hoàn tiền không?</span>
              <span>{expandedFAQ === 1 ? '−' : '+'}</span>
            </div>
            <div className={`faq-answer ${expandedFAQ === 1 ? 'active' : ''}`}>
              Chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày đầu tiên nếu bạn không hài lòng với dịch vụ.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(2)}>
              <span>Gói Business có hỗ trợ thêm thành viên không?</span>
              <span>{expandedFAQ === 2 ? '−' : '+'}</span>
            </div>
            <div className={`faq-answer ${expandedFAQ === 2 ? 'active' : ''}`}>
              Gói Business hỗ trợ tối đa 10 thành viên. Nếu cần thêm, vui lòng liên hệ với chúng tôi để được tư vấn gói Enterprise.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(3)}>
              <span>Thanh toán theo năm có ưu đãi gì?</span>
              <span>{expandedFAQ === 3 ? '−' : '+'}</span>
            </div>
            <div className={`faq-answer ${expandedFAQ === 3 ? 'active' : ''}`}>
              Thanh toán theo năm bạn sẽ được giảm 20% cho gói Premium và 33% cho gói Business so với thanh toán hàng tháng.
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
