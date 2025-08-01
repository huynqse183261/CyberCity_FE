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
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 2;

    // Animation
    const animate = () => {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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
