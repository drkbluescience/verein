import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface VirtualPaymentListProps {
  payments: any[];
  isLoading: boolean;
  onLoadMore: () => void;
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

const VirtualPaymentList: React.FC<VirtualPaymentListProps> = ({
  payments,
  isLoading,
  onLoadMore,
  itemHeight = 60,
  containerHeight = 400,
  renderItem
}) => {
  const { t } = useTranslation();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Calculate visible items based on scroll position
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      payments.length
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, payments.length]);

  // Handle scroll events with throttling
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!isScrolling) {
      setIsScrolling(true);
      requestAnimationFrame(() => {
        setScrollTop(e.currentTarget.scrollTop);
        setIsScrolling(false);
      });
    }
  }, [isScrolling, itemHeight]);

  // Check if user scrolled near bottom and load more
  useEffect(() => {
    const { startIndex, endIndex } = visibleRange;
    const remainingItems = payments.length - endIndex;
    
    if (remainingItems < 5 && !isLoading) {
      onLoadMore();
    }
  }, [visibleRange, payments.length, isLoading, onLoadMore]);

  return (
    <div className="virtual-payment-list">
      <div className="virtual-list-header">
        <h3>{t('paymentHistory.title')}</h3>
        <p className="virtual-list-info">
          {t('paymentHistory.showing', {
            count: payments.length,
            visible: visibleRange.endIndex - visibleRange.startIndex + 1
          })}
        </p>
      </div>
      
      <div
        ref={containerRef}
        className="virtual-list-container"
        style={{ height: `${containerHeight}px`, overflow: 'auto' }}
        onScroll={handleScroll}
      >
        <div 
          className="virtual-list-content"
          style={{ 
            height: `${payments.length * itemHeight}px`,
            paddingTop: `${visibleRange.startIndex * itemHeight}px`
          }}
        >
          {payments.slice(visibleRange.startIndex, visibleRange.endIndex).map((payment, index) => (
            <div
              key={payment.id || index}
              className="virtual-list-item"
              style={{ height: `${itemHeight}px` }}
            >
              {renderItem(payment, visibleRange.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="virtual-list-loading">
          <div className="loading-spinner"></div>
          <p>{t('paymentHistory.loadingMore')}</p>
        </div>
      )}
    </div>
  );
};

export default VirtualPaymentList;