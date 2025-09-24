import React, { useEffect } from 'react';

const ParticleBackground: React.FC = () => {
  useEffect(() => {
    const createParticles = () => {
      const particles = document.getElementById('particles');
      if (!particles) return;

      // Clear existing particles
      particles.innerHTML = '';

      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particles.appendChild(particle);
      }
    };

    // Create particles immediately
    setTimeout(() => createParticles(), 100);

    // Create floating particles continuously like in original
    const createFloatingParticle = () => {
      const particles = document.getElementById('particles');
      if (!particles) return;
      
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
      particle.style.animationDuration = Math.random() * 3 + 3 + 's';
      
      particles.appendChild(particle);
      
      // Auto remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 6000);
    };

    // Create floating particles every 300ms like original
    const particleInterval = setInterval(createFloatingParticle, 300);

    // Cleanup function
    return () => {
      clearInterval(particleInterval);
      const particles = document.getElementById('particles');
      if (particles) {
        particles.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="particles" id="particles"></div>
  );
};

export default ParticleBackground;