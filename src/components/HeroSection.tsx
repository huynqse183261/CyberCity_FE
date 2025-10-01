import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import '../styles/HeroSection.css';

const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js background animation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    
    // Lấy kích thước thực của hero section
    const heroSection = canvasRef.current.parentElement;
    const heroRect = heroSection?.getBoundingClientRect();
    const heroWidth = heroRect?.width || window.innerWidth;
    const heroHeight = heroRect?.height || window.innerHeight;
    
    renderer.setSize(heroWidth, heroHeight);
    renderer.setClearColor(0x000000, 0);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 10000; // Tăng số lượng particles
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20; // Tăng phạm vi phân bố
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02, // Tăng kích thước particles
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5; // Đưa camera ra xa hơn

    // Animation
    const animate = () => {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.001; // Tăng tốc độ xoay
        particlesMesh.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
        const updatedHeroRect = heroSection?.getBoundingClientRect();
        const updatedHeroWidth = updatedHeroRect?.width || window.innerWidth;
        const updatedHeroHeight = updatedHeroRect?.height || window.innerHeight;
        
        camera.aspect = updatedHeroWidth / updatedHeroHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(updatedHeroWidth, updatedHeroHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="hero" id="home">
      <canvas ref={canvasRef} className="hero-bg"></canvas>
      <div className="hero-content">
        <div className="hero-text">
          <h1>Thành thạo An toàn thông tin với Linux</h1>
          <p>
            Nền tảng học trực tuyến giúp sinh viên thực hành An toàn thông tin (ATTT) 
            thông qua việc sử dụng và khai thác hệ điều hành Linux. Học viên được học 
            bằng tiếng Việt, kèm theo môi trường máy ảo Linux tích hợp ngay trên web 
            và AI hỗ trợ hỏi đáp.
          </p>
          <div className="hero-buttons">
            <a href="#courses" className="btn-primary">Khám phá khóa học</a>
            <a href="#demo" className="btn-secondary">Dùng thử AI miễn phí</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="ai-chat-demo">
            <div className="chat-header">
              <div className="ai-avatar">🤖</div>
            </div>
            <div className="chat-message">
              <strong>Bạn:</strong> Làm sao setup Kali Linux để pentest?
            </div>
            <div className="chat-message">
              <strong>AI:</strong> Tôi sẽ hướng dẫn bạn setup Kali Linux trên VMware: 
              1) Download Kali ISO, 2) Tạo VM với 4GB RAM, 3) Cài đặt tools cần thiết 
              như Nmap, Metasploit... Bạn muốn lab thực hành nào?
            </div>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
