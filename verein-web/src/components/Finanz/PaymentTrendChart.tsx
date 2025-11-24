/**
 * Payment Trend Chart Component
 * Displays monthly payment trends for member finance page
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyTrendDto } from '../../types/finanz.types';
import './PaymentTrendChart.css';

interface PaymentTrendChartProps {
  data: MonthlyTrendDto[];
}

const PaymentTrendChart: React.FC<PaymentTrendChartProps> = ({ data }) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <div className="payment-trend-chart">
      <h3>{t('finanz:paymentTrend.title')}</h3>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="monthName"
              stroke="#6b7280"
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '0.75rem' }}
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: any) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorPayments)"
              name={t('finanz:paymentTrend.payments')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentTrendChart;

