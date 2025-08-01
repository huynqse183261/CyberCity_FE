import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import StatsSection from '../components/StatsSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(target.getAttribute('href')!);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Add scroll effect to navigation
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
          nav.style.background = 'rgba(15, 15, 35, 0.95)';
        }
      }
    };

    // Floating particles effect - chỉ trong homepage
    const createFloatingParticle = () => {
      const homepage = document.querySelector('.homepage');
      if (!homepage) return;
      
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
      particle.style.animationDuration = Math.random() * 3 + 3 + 's';
      
      // Thêm particle vào homepage container thay vì body
      homepage.appendChild(particle);
      
      // Tự động xóa particle sau khi animation kết thúc
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 6000);
    };

    // Event listeners
    document.addEventListener('click', handleSmoothScroll);
    window.addEventListener('scroll', handleScroll);
    const particleInterval = setInterval(createFloatingParticle, 300);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <div className="homepage">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
