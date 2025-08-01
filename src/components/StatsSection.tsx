import React, { useEffect, useRef, useState } from 'react';
import '../styles/StatsSection.css';

interface Stat {
  value: string;
  label: string;
  target: number;
}

const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: Stat[] = [
    { value: "3,000+", label: "Linux Security Experts", target: 3000 },
    { value: "25+", label: "Virtual Machine Labs", target: 25 },
    { value: "15+", label: "Linux Distros hỗ trợ", target: 15 },
    { value: "98%", label: "Thành thạo Linux Command", target: 98 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats" ref={sectionRef}>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <h3 className={isVisible ? 'animate-counter' : ''}>
              {stat.value}
            </h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
