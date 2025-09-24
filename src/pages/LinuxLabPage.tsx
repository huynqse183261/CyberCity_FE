import React, { useEffect, useState } from 'react';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import FeatureCard from '../components/FeatureCard';
import AIAssistant from '../components/AIAssistant';
import ParticleBackground from '../components/ParticleBackground';
import type { User } from '../models/LinuxLabTypes';
import '../styles/LinuxLabPage.css';

const HomeLogin: React.FC = () => {
  const [user] = useState<User>({
    name: 'H',
    username: 'huy@linuxlab',
    avatar: 'H'
  });

  const [isAIExpanded, setIsAIExpanded] = useState(false);

  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(target.getAttribute('href')!);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);

    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  const features = [
    {
      icon: '🖥️',
      title: 'Linux Terminal',
      description: 'Thực hành trực tiếp trên terminal Linux với môi trường ảo hóa',
      features: [
        'Terminal tương tác thời gian thực',
        'Bash scripting & automation',
        'System administration',
        'Quản lý file và quyền truy cập'
      ],
      stats: [
        { value: '25+', label: 'Bài lab' },
        { value: '24/7', label: 'Truy cập' }
      ],
      buttonText: 'Khởi động Terminal',
      buttonAction: () => window.open('testingTerminal.html', '_blank')
    },
    {
      icon: '🔍',
      title: 'Penetration Testing',
      description: 'Học các kỹ thuật pentesting trong môi trường an toàn',
      features: [
        'Kali Linux tools tích hợp',
        'Vulnerability scanning',
        'Web application testing',
        'Network penetration'
      ],
      stats: [
        { value: '15', label: 'Targets' },
        { value: '100+', label: 'Tools' }
      ],
      buttonText: 'Bắt đầu Pentest',
      buttonAction: () => console.log('Start Pentest')
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Trợ lý AI hỗ trợ học tập và giải đáp thắc mắc 24/7',
      features: [
        'Hướng dẫn lệnh Linux',
        'Giải thích các công cụ pentest',
        'Debug và troubleshooting',
        'Best practices bảo mật'
      ],
      stats: [
        { value: 'AI', label: 'Powered' },
        { value: '24/7', label: 'Support' }
      ],
      buttonText: 'Trò chuyện với AI',
      buttonAction: () => setIsAIExpanded(!isAIExpanded)
    }
  ];

  return (
    <div className="linux-lab-page">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Thành thạo Linux & Pentesting</h1>
          <p className="hero-subtitle">
            Nền tảng học trực tuyến giúp sinh viên thực hành An toàn thông tin 
            với môi trường Linux tích hợp và AI hỗ trợ học tập
          </p>
          <div className="hero-buttons">
            <a href="#start" className="btn btn-primary">Bắt đầu học</a>
            <a href="#demo" className="btn btn-secondary">Xem demo</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Tính năng nổi bật</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                features={feature.features}
                stats={feature.stats}
                buttonText={feature.buttonText}
                onButtonClick={feature.buttonAction}
              />
            ))}
          </div>
        </div>
      </section>

      <AIAssistant 
        isExpanded={isAIExpanded}
        onToggle={() => setIsAIExpanded(!isAIExpanded)}
      />
    </div>
  );
};

export default HomeLogin;