import React from 'react';
import { useTranslation } from 'react-i18next';
import './ErrorMessage.css';

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
  fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = 'error',
  onRetry,
  onDismiss,
  fullScreen = false
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation('common');

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'warning':
        return t('status.warning');
      case 'info':
        return t('status.info');
      default:
        return t('status.error');
    }
  };

  const containerClass = fullScreen 
    ? 'error-container-fullscreen' 
    : 'error-container';

  return (
    <div className={containerClass}>
      <div className={`error-content error-content-${type}`}>
        <div className="error-icon">
          {getIcon()}
        </div>
        
        <div className="error-details">
          <h3 className="error-title">
            {title || getDefaultTitle()}
          </h3>
          <p className="error-message">
            {message}
          </p>
        </div>
        
        {(onRetry || onDismiss) && (
          <div className="error-actions">
            {onRetry && (
              <button
                className="btn btn-primary error-btn"
                onClick={onRetry}
              >
                🔄 {t('actions.refresh')}
              </button>
            )}
            {onDismiss && (
              <button
                className="btn btn-secondary error-btn"
                onClick={onDismiss}
              >
                {t('actions.close')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Inline error component for forms
export const InlineError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="inline-error">
      <span className="inline-error-icon">⚠️</span>
      <span className="inline-error-message">{message}</span>
    </div>
  );
};

// Toast-style error notification
export const ErrorToast: React.FC<{
  message: string;
  onClose: () => void;
  duration?: number;
}> = ({ message, onClose, duration = 5000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="error-toast">
      <div className="error-toast-content">
        <span className="error-toast-icon">❌</span>
        <span className="error-toast-message">{message}</span>
        <button 
          className="error-toast-close"
          onClick={onClose}
          aria-label="Kapat"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
