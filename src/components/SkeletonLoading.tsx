import React from 'react';
import '../styles/SkeletonLoading.css';

interface SkeletonLoadingProps {
  type?: 'page' | 'card' | 'list' | 'simple';
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({ type = 'simple' }) => {
  if (type === 'simple') {
    return (
      <div className="skeleton-simple">
        <div className="skeleton-spinner"></div>
        <p className="skeleton-text">Đang tải...</p>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-card-header shimmer"></div>
        <div className="skeleton-card-body">
          <div className="skeleton-line shimmer" style={{ width: '80%' }}></div>
          <div className="skeleton-line shimmer" style={{ width: '60%' }}></div>
          <div className="skeleton-line shimmer" style={{ width: '90%' }}></div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="skeleton-list">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-list-item">
            <div className="skeleton-avatar shimmer"></div>
            <div className="skeleton-content">
              <div className="skeleton-line shimmer" style={{ width: '70%' }}></div>
              <div className="skeleton-line shimmer" style={{ width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // type === 'page'
  return (
    <div className="skeleton-page">
      <div className="skeleton-page-header">
        <div className="skeleton-line shimmer" style={{ width: '200px', height: '32px' }}></div>
        <div className="skeleton-line shimmer" style={{ width: '150px', height: '24px', marginTop: '8px' }}></div>
      </div>
      <div className="skeleton-page-content">
        <div className="skeleton-card">
          <div className="skeleton-card-header shimmer"></div>
          <div className="skeleton-card-body">
            <div className="skeleton-line shimmer" style={{ width: '100%' }}></div>
            <div className="skeleton-line shimmer" style={{ width: '85%' }}></div>
            <div className="skeleton-line shimmer" style={{ width: '95%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;

