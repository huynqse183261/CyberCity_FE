import React from 'react';
import type { FeatureCardProps } from '../models/LinuxLabTypes';

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  features,
  stats,
  buttonText,
  onButtonClick
}) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      <ul className="feature-list">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <div className="stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
      <button 
        className="btn btn-primary feature-button" 
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default FeatureCard;