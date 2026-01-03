/**
 * Payment Trend Chart Component
 * Displays monthly payment trends for member finance page
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './PaymentTrendChart.css';

export interface PaymentTrendPoint {
  monthName: string;
  actual: number;
  planned: number;
}

interface PaymentTrendChartProps {
  data: PaymentTrendPoint[];
  title?: string;
}

const PaymentTrendChart: React.FC<PaymentTrendChartProps> = ({ data, title }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'de' ? 'de-DE' : 'tr-TR';

  const formatCurrency = (value: number, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits,
    }).format(value);
  };

  const actualColor = 'var(--payment-trend-actual, #16a34a)';
  const plannedColor = 'var(--payment-trend-planned, #9ca3af)';
  const hasActualPayments = data.some((point) => point.actual > 0);
  const hasPlannedPayments = data.some((point) => point.planned > 0);

  return (
    <div className="payment-trend-chart">
      <div className="chart-header">
        <h3>{title || t('finanz:paymentTrend.title')}</h3>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-line actual" />
            {t('finanz:paymentTrend.actual')}
          </span>
          <span className="legend-item">
            <span className="legend-line planned" />
            {t('finanz:paymentTrend.planned')}
          </span>
        </div>
      </div>

      {hasActualPayments ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="monthName"
                stroke="#6b7280"
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '0.75rem' }}
                tickFormatter={(value) => formatCurrency(value, 0)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke={actualColor}
                strokeWidth={2}
                dot={false}
                name={t('finanz:paymentTrend.actual')}
              />
              {hasPlannedPayments && (
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke={plannedColor}
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  dot={false}
                  name={t('finanz:paymentTrend.planned')}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="chart-empty">
          <p>{t('finanz:paymentTrend.emptyState')}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentTrendChart;
