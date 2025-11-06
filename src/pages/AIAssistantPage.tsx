import React from 'react';
import LinuxLabNavigation from '../components/LinuxLabNavigation';
import UserDropdown from '../components/UserDropdown';
import ParticleBackground from '../components/ParticleBackground';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../models/LinuxLabTypes';
import AIAssistant from '../components/AIAssistant';
import '../styles/LinuxLabPage.css';

const AIAssistantPage: React.FC = () => {
  const { user: currentUser } = useAuth();

  const user: User = {
    name: currentUser?.fullName || 'User',
    username: currentUser?.username || currentUser?.email || 'Unknown User',
    avatar: currentUser?.fullName?.charAt(0).toUpperCase() || 'U'
  };

  return (
    <div className="linux-lab-page">
      <ParticleBackground />

      {/* Navigation (Student layout) */}
      <nav className="navigation">
        <div className="nav-container">
          <LinuxLabNavigation />
          <UserDropdown user={user} />
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🤖 Trợ Lý AI</h1>
          <p className="hero-subtitle">Đặt câu hỏi và nhận hỗ trợ từ AI về Linux & Pentesting</p>
        </div>
      </section>

      <section className="main-features-section" style={{ paddingBottom: '2rem' }}>
        <div className="features-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AIAssistant />
        </div>
      </section>
    </div>
  );
};

export default AIAssistantPage;
