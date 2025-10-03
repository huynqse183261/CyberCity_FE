import React from 'react';
import { Spin } from 'antd';

interface PageLoadingProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
}

const PageLoading: React.FC<PageLoadingProps> = ({ 
  tip = 'Đang tải...', 
  size = 'large' 
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default PageLoading;