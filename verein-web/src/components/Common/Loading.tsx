import React from 'react';
import { useTranslation } from 'react-i18next';
import './Loading.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text,
  fullScreen = false
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation('common');
  const loadingText = text || t('status.loading');
  const containerClass = fullScreen ? 'loading-container-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className="loading-content">
        <div className={`loading-spinner loading-spinner-${size}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        {loadingText && <p className="loading-text">{loadingText}</p>}
      </div>
    </div>
  );
};

// Inline loading component for buttons
export const InlineLoading: React.FC<{ size?: 'small' | 'medium' }> = ({ size = 'small' }) => {
  return (
    <div className={`inline-loading loading-spinner-${size}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );
};

// Loading skeleton for content
export const LoadingSkeleton: React.FC<{ 
  lines?: number; 
  height?: string; 
  className?: string; 
}> = ({ lines = 3, height = '20px', className = '' }) => {
  return (
    <div className={`skeleton-container ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className="skeleton-line"
          style={{ height, width: index === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
};

export default Loading;
