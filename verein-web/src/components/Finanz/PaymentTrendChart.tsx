/**
 * Payment Trend Chart Component
 * Displays monthly payment trends for member finance page
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MitgliedZahlungDto, MitgliedForderungDto } from '../../types/finanz.types';
import './PaymentTrendChart.css';

interface PaymentTrendChartProps {
  zahlungen: MitgliedZahlungDto[];
  forderungen: MitgliedForderungDto[];
}

interface MonthlyData {
  month: string;
  zahlungen: number;
  forderungen: number;
  net: number;
}

const PaymentTrendChart: React.FC<PaymentTrendChartProps> = ({ zahlungen, forderungen }) => {
  const { t } = useTranslation();

  // Calculate monthly data for the last 12 months
  const monthlyData = useMemo<MonthlyData[]>(() => {
    const now = new Date();
    const months: MonthlyData[] = [];

    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });

      // Calculate payments for this month
      const monthPayments = zahlungen
        .filter(z => {
          const paymentDate = new Date(z.zahlungsdatum);
          return paymentDate.getFullYear() === date.getFullYear() &&
                 paymentDate.getMonth() === date.getMonth();
        })
        .reduce((sum, z) => sum + z.betrag, 0);

      // Calculate claims for this month
      const monthClaims = forderungen
        .filter(f => {
          const claimDate = new Date(f.faelligkeit);
          return claimDate.getFullYear() === date.getFullYear() &&
                 claimDate.getMonth() === date.getMonth();
        })
        .reduce((sum, f) => sum + f.betrag, 0);

      months.push({
        month: monthName,
        zahlungen: Math.round(monthPayments * 100) / 100,
        forderungen: Math.round(monthClaims * 100) / 100,
        net: Math.round((monthPayments - monthClaims) * 100) / 100,
      });
    }

    return months;
  }, [zahlungen, forderungen]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalPayments = monthlyData.reduce((sum, m) => sum + m.zahlungen, 0);
    const totalClaims = monthlyData.reduce((sum, m) => sum + m.forderungen, 0);
    const avgPayment = totalPayments / 12;
    const avgClaim = totalClaims / 12;

    return {
      totalPayments: Math.round(totalPayments * 100) / 100,
      totalClaims: Math.round(totalClaims * 100) / 100,
      avgPayment: Math.round(avgPayment * 100) / 100,
      avgClaim: Math.round(avgClaim * 100) / 100,
    };
  }, [monthlyData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <div className="payment-trend-chart">
      <div className="chart-header">
        <h3>{t('finanz:paymentTrend.title')}</h3>
        <p className="chart-subtitle">{t('finanz:paymentTrend.subtitle')}</p>
      </div>

      {/* Summary Stats */}
      <div className="trend-stats">
        <div className="trend-stat">
          <span className="stat-label">{t('finanz:paymentTrend.avgMonthlyPayment')}</span>
          <span className="stat-value positive">{formatCurrency(stats.avgPayment)}</span>
        </div>
        <div className="trend-stat">
          <span className="stat-label">{t('finanz:paymentTrend.avgMonthlyClaim')}</span>
          <span className="stat-value negative">{formatCurrency(stats.avgClaim)}</span>
        </div>
        <div className="trend-stat">
          <span className="stat-label">{t('finanz:paymentTrend.totalLast12Months')}</span>
          <span className="stat-value">{formatCurrency(stats.totalPayments)}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
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
            <Legend />
            <Area
              type="monotone"
              dataKey="zahlungen"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorPayments)"
              name={t('finanz:paymentTrend.payments')}
            />
            <Area
              type="monotone"
              dataKey="forderungen"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorClaims)"
              name={t('finanz:paymentTrend.claims')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentTrendChart;

