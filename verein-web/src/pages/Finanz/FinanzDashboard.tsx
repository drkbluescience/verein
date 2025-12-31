/**
 * Finanz Dashboard - Enhanced Version
 * Advanced financial analytics with KPIs, charts, and insights
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  finanzDashboardService,
} from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
import Loading from '../../components/Common/Loading';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import * as XLSX from 'xlsx';
import './FinanzDashboard.css';

// Icons
const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const PercentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const DollarSignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

type ChartLegendItem = {
  color?: string;
  value?: string | number;
};

type ChartLegendProps = {
  payload?: ChartLegendItem[];
};

const ChartLegend: React.FC<ChartLegendProps> = ({ payload }) => {
  if (!payload?.length) return null;

  return (
    <div className="chart-legend">
      {payload.map((entry, index: number) => (
        <div key={`${entry.value}-${index}`} className="chart-legend-item">
          <span className="chart-legend-color" style={{ backgroundColor: entry.color }}></span>
          <span className="chart-legend-label">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <div className={`stat-card stat-card-${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  </div>
);

const FinanzDashboard: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'gelir' | 'gider'>('gelir');
  const language = i18n.language || 'tr';
  const numberFormatter = useMemo(() => new Intl.NumberFormat(language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }), [language]);
  const currencyFormatter = useMemo(() => new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }), [language]);
  const currencyFormatterDetailed = useMemo(() => new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }), [language]);
  const percentFormatter = useMemo(() => new Intl.NumberFormat(language, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }), [language]);

  const formatNumber = (value: number) => numberFormatter.format(value);
  const formatCurrency = (value: number) => currencyFormatter.format(value);
  const formatCurrencyDetailed = (value: number) => currencyFormatterDetailed.format(value);
  const formatPercent = (value: number) => percentFormatter.format(value / 100);

  // Get vereinId based on user type
  const vereinId = useMemo(() => {
    if (user?.type === 'dernek') return user.vereinId;
    // Admin: use selected filter or null for all
    if (user?.type === 'admin') return selectedVereinId;
    return null;
  }, [user, selectedVereinId]);

  // Fetch Vereine (for Admin dropdown)
  const { data: vereine = [] } = useQuery({
    queryKey: ['vereine'],
    queryFn: () => vereinService.getAll(),
    enabled: user?.type === 'admin',
  });

  // Fetch dashboard statistics (optimized single endpoint)
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['finanz-dashboard-stats', vereinId],
    queryFn: async () => {
      return await finanzDashboardService.getStats(vereinId || undefined);
    },
    enabled: !!user,
  });

  // Extract statistics from dashboard data (no more frontend calculations!)
  const stats = useMemo(() => {
    if (!dashboardStats) {
      return {
        totalForderungen: 0,
        totalForderungsBetrag: 0,
        bezahlteForderungen: 0,
        bezahlteForderungenBetrag: 0,
        offeneForderungen: 0,
        offeneForderungenBetrag: 0,
        overdueForderungenCount: 0,
        overdueForderungenBetrag: 0,
        totalZahlungen: 0,
        totalZahlungsBetrag: 0,
        totalDitibZahlungen: 0,
        bezahlteDitibZahlungen: 0,
        offeneDitibZahlungen: 0,
        totalDitibBetrag: 0,
        bezahlteDitibBetrag: 0,
        offeneDitibBetrag: 0,
        currentMonthDitibBetrag: 0,
        collectionRate: 0,
        expectedRevenue: 0,
        cashPosition: 0,
        netPosition: 0,
        arpu: 0,
        avgPaymentDays: 0,
        activeMitglieder: 0,
      };
    }

    const { gelir, gider } = dashboardStats;

    // Calculate net position (income - expenses)
    const netPosition = gelir.totalZahlungenAmount - gider.bezahltAmount;
    const cashPosition = gelir.totalZahlungenAmount - gider.bezahltAmount;

    return {
      // Income stats
      totalForderungen: gelir.totalForderungen,
      totalForderungsBetrag: gelir.totalAmount,
      bezahlteForderungen: gelir.bezahlteForderungen,
      bezahlteForderungenBetrag: gelir.bezahltAmount,
      offeneForderungen: gelir.offeneForderungen,
      offeneForderungenBetrag: gelir.offenAmount,
      overdueForderungenCount: gelir.ueberfaelligeForderungen,
      overdueForderungenBetrag: gelir.ueberfaelligAmount,
      totalZahlungen: gelir.totalZahlungen,
      totalZahlungsBetrag: gelir.totalZahlungenAmount,
      collectionRate: gelir.collectionRate,
      expectedRevenue: gelir.expectedRevenue,
      arpu: gelir.arpu,

      // Expense stats
      totalDitibZahlungen: gider.totalDitibZahlungen,
      bezahlteDitibZahlungen: gider.bezahlteDitibZahlungen,
      offeneDitibZahlungen: gider.offeneDitibZahlungen,
      totalDitibBetrag: gider.totalAmount,
      bezahlteDitibBetrag: gider.bezahltAmount,
      offeneDitibBetrag: gider.offenAmount,
      currentMonthDitibBetrag: gider.currentMonthAmount,

      // Calculated stats
      netPosition,
      cashPosition,
      avgPaymentDays: gelir.avgPaymentDays,
      activeMitglieder: gelir.activeMitglieder,
    };
  }, [dashboardStats]);

  // Monthly Revenue Trend (from backend)
  const monthlyRevenueData = useMemo(() => {
    if (!dashboardStats) return [];

    const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    return dashboardStats.gelir.monthlyTrend.map((trend, index) => ({
      month: t(`common:monthsShort.${monthKeys[trend.month - 1]}`),
      gelir: Math.round(trend.amount),
      alacak: Math.round(trend.amount), // Same as gelir for now
      gider: Math.round(dashboardStats.gider.monthlyTrend[index]?.amount || 0),
    }));
  }, [dashboardStats, t]);

  // Dernek Comparison Data (from backend for Admin)
  const vereinComparisonData = useMemo(() => {
    if (user?.type !== 'admin' || selectedVereinId !== null) return [];
    if (!dashboardStats?.vereinComparison) return [];

    return dashboardStats.vereinComparison.map(vc => ({
      vereinId: vc.vereinId,
      vereinName: vc.vereinName,
      totalForderungen: 0, // Not in backend DTO yet
      totalForderungsBetrag: vc.revenue,
      bezahlteForderungen: 0,
      bezahlteForderungenBetrag: vc.revenue,
      offeneForderungen: 0,
      offeneForderungenBetrag: 0,
      overdueForderungenCount: 0,
      overdueForderungenBetrag: 0,
      totalZahlungen: 0,
      totalZahlungsBetrag: vc.revenue,
      totalBankBetrag: vc.revenue,
      collectionRate: vc.collectionRate,
    }));
  }, [user, selectedVereinId, dashboardStats]);

  const paymentMethods = dashboardStats?.gelir.paymentMethods ?? [];
  const paymentMethodsTotal = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
  const paymentMethodColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (statsLoading) return <Loading />;

  // Export to Excel function
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      [t('finanz:export.financialSummaryReport'), ''],
      ['', ''],
      [t('finanz:dashboard.totalClaims'), stats.totalForderungen],
      [t('finanz:dashboard.totalAmount'), `€${stats.totalForderungsBetrag.toFixed(2)}`],
      [t('finanz:dashboard.paidClaims'), stats.bezahlteForderungen],
      [t('finanz:export.amountColumn'), `€${stats.bezahlteForderungenBetrag.toFixed(2)}`],
      [t('finanz:dashboard.openClaims'), stats.offeneForderungen],
      [t('finanz:export.amountColumn'), `€${stats.offeneForderungenBetrag.toFixed(2)}`],
      [t('finanz:dashboard.overduePayments'), stats.overdueForderungenCount],
      [t('finanz:export.amountColumn'), `€${stats.overdueForderungenBetrag.toFixed(2)}`],
      ['', ''],
      [t('finanz:dashboard.collectionRate'), `${stats.collectionRate.toFixed(1)}%`],
      [t('finanz:dashboard.avgPaymentDays'), `${stats.avgPaymentDays.toFixed(0)} ${t('common:common.days')}`],
      [t('finanz:dashboard.expectedRevenue'), `€${stats.expectedRevenue.toFixed(2)}`],
      [t('finanz:dashboard.cashPosition'), `€${stats.cashPosition.toFixed(2)}`],
      [t('finanz:dashboard.arpu'), `€${stats.arpu.toFixed(2)}`],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, t('finanz:export.summarySheet'));

    // Monthly Data Sheet
    const ws2 = XLSX.utils.json_to_sheet(monthlyRevenueData);
    XLSX.utils.book_append_sheet(wb, ws2, t('finanz:export.monthlyDataSheet'));

    // Payment Methods Sheet
    if (dashboardStats?.gelir.paymentMethods && dashboardStats.gelir.paymentMethods.length > 0) {
      const paymentMethodsData = dashboardStats.gelir.paymentMethods.map(pm => ({
        [t('finanz:export.paymentMethod')]: pm.method,
        [t('finanz:export.count')]: pm.count,
        [t('finanz:export.amount')]: pm.amount.toFixed(2)
      }));
      const ws3 = XLSX.utils.json_to_sheet(paymentMethodsData);
      XLSX.utils.book_append_sheet(wb, ws3, t('finanz:export.paymentMethodsSheet'));
    }

    XLSX.writeFile(wb, `${t('finanz:export.financeReportFileName')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="finanz-dashboard">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:dashboard.title')}</h1>
      </div>

      <div className="finanz-topbar">
        <div className="finanz-tabs">
          <div className="finanz-tab-buttons">
            <button
              type="button"
              onClick={() => setActiveTab('gelir')}
              className={`finanz-tab-button ${activeTab === 'gelir' ? 'active' : ''}`}
            >
              <span className="finanz-tab-title">{t('finanz:dashboard.incomeTab')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gider')}
              className={`finanz-tab-button ${activeTab === 'gider' ? 'active' : ''}`}
            >
              <span className="finanz-tab-title">{t('finanz:dashboard.expenseTab')}</span>
            </button>
          </div>
          <p className="finanz-tab-description">
            {activeTab === 'gelir'
              ? t('finanz:dashboard.incomeStatistics')
              : t('finanz:dashboard.expenseStatistics')}
          </p>
        </div>
        <div className="finanz-actions">
              {user?.type === 'admin' && (
                <select
                  value={selectedVereinId || ''}
                  onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
                  className="finanz-filter-select"
                >
                  <option value="">{t('common:filter.allVereine')}</option>
                  {vereine.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              )}
          <div className="finanz-actions-bar">
            {activeTab === 'gelir' && (
              <button
                type="button"
                className="btn btn-secondary finanz-action-btn"
                onClick={() => navigate('/finanzen/bank-upload')}
              >
                <UploadIcon />
                {t('finanz:bankUpload.title')}
              </button>
            )}
            {activeTab === 'gider' && (
              <button
                type="button"
                className="btn btn-secondary finanz-action-btn"
                onClick={() => navigate('/finanzen/ditib-upload')}
              >
                <UploadIcon />
                {t('finanz:dashboard.ditibUploadButton')}
              </button>
            )}
            <button type="button" className="btn btn-primary finanz-action-btn" onClick={exportToExcel}>
              <DownloadIcon />
              {t('finanz:dashboard.exportToExcel')}
            </button>
          </div>
        </div>
      </div>

      {/* GELIR TAB CONTENT */}
      {activeTab === 'gelir' && (
        <>
          {/* Important Metrics - 2x2 Grid */}
          <div className="dashboard-section kpi-section">
            <h2 className="section-title">{t('finanz:dashboard.incomeStatistics')}</h2>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon"
                    style={{
                      background: stats.collectionRate >= 80
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                        : stats.collectionRate >= 60
                          ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                          : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      boxShadow: stats.collectionRate >= 80
                        ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                        : stats.collectionRate >= 60
                          ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                          : '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <PercentIcon />
                  </div>
                </div>
                <div className="kpi-content">
                  <p className="kpi-title">{t('finanz:dashboard.collectionRate')}</p>
                  <p className="kpi-value">{formatPercent(stats.collectionRate)}</p>
                  <p className="kpi-subtitle">{t('finanz:dashboard.paymentSuccessRate')}</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon"
                    style={{
                      background: stats.overdueForderungenCount === 0
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      boxShadow: stats.overdueForderungenCount === 0
                        ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                        : '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <AlertCircleIcon />
                  </div>
                </div>
                <div className="kpi-content">
                  <p className="kpi-title">{t('finanz:dashboard.overduePayments')}</p>
                  <p className="kpi-value">{formatNumber(stats.overdueForderungenCount)}</p>
                  <p className="kpi-subtitle">{formatCurrency(stats.overdueForderungenBetrag)}</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon"
                    style={{
                      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <DollarSignIcon />
                  </div>
                </div>
                <div className="kpi-content">
                  <p className="kpi-title">{t('finanz:dashboard.expectedRevenue')}</p>
                  <p className="kpi-value">{formatCurrency(stats.expectedRevenue)}</p>
                  <p className="kpi-subtitle">{t('finanz:dashboard.dueThisMonth')}</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon"
                    style={{
                      background: stats.cashPosition >= 0
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      boxShadow: stats.cashPosition >= 0
                        ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                        : '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <WalletIcon />
                  </div>
                </div>
                <div className="kpi-content">
                  <p className="kpi-title">{t('finanz:dashboard.cashPosition')}</p>
                  <p className="kpi-value">{formatCurrency(Math.abs(stats.cashPosition))}</p>
                  <p className="kpi-subtitle">
                    {stats.cashPosition >= 0 ? t('finanz:dashboard.positive') : t('finanz:dashboard.negative')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access - Gelir */}
          <div className="dashboard-section quick-access-section">
            <h2 className="section-title">{t('finanz:dashboard.quickAccess')}</h2>
            <div className="quick-access-grid">
              <button
                type="button"
                className="quick-access-card"
                onClick={() => navigate('/finanzen/forderungen')}
              >
                <span className="quick-access-icon quick-access-icon-primary">
                  <CreditCardIcon />
                </span>
                <span className="quick-access-text">
                  <span className="quick-access-title">{t('finanz:dashboard.forderungen')}</span>
                  <span className="quick-access-desc">{t('finanz:dashboard.forderungenDesc')}</span>
                </span>
              </button>
              <button
                type="button"
                className="quick-access-card"
                onClick={() => navigate('/finanzen/zahlungen')}
              >
                <span className="quick-access-icon quick-access-icon-success">
                  <TrendingUpIcon />
                </span>
                <span className="quick-access-text">
                  <span className="quick-access-title">{t('finanz:dashboard.zahlungen')}</span>
                  <span className="quick-access-desc">{t('finanz:dashboard.zahlungenDesc')}</span>
                </span>
              </button>
              <button
                type="button"
                className="quick-access-card"
                onClick={() => navigate('/finanzen/bank')}
              >
                <span className="quick-access-icon quick-access-icon-violet">
                  <WalletIcon />
                </span>
                <span className="quick-access-text">
                  <span className="quick-access-title">{t('finanz:dashboard.bankBuchungen')}</span>
                  <span className="quick-access-desc">{t('finanz:dashboard.bankBuchungenDesc')}</span>
                </span>
              </button>
            </div>
          </div>

      {/* Verein Comparison Table (Admin only, when no filter selected) */}
      {user?.type === 'admin' && selectedVereinId === null && vereinComparisonData.length > 0 && (
        <div className="dashboard-section" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text)' }}>
            {t('finanz:dashboard.vereinComparison')}
          </h2>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {t('common:verein')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {t('finanz:dashboard.totalClaims')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {t('finanz:dashboard.paidClaims')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {t('finanz:dashboard.openClaims')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {t('finanz:dashboard.overdueClaims')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {t('finanz:dashboard.collectionRate')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {t('finanz:dashboard.totalPayments')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                      {t('finanz:dashboard.bankBalance')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vereinComparisonData.map((verein, index) => (
                    <tr
                      key={verein.vereinId}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        background: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-background)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-background)'}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
                        {verein.vereinName}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                        {verein.totalForderungen} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                          (€{verein.totalForderungsBetrag.toFixed(2)})
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#10B981' }}>
                        {verein.bezahlteForderungen} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                          (€{verein.bezahlteForderungenBetrag.toFixed(2)})
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#F59E0B' }}>
                        {verein.offeneForderungen} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                          (€{verein.offeneForderungenBetrag.toFixed(2)})
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#EF4444' }}>
                        {verein.overdueForderungenCount} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                          (€{verein.overdueForderungenBetrag.toFixed(2)})
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>
                        <span style={{
                          color: verein.collectionRate >= 80 ? '#10B981' : verein.collectionRate >= 60 ? '#F59E0B' : '#EF4444'
                        }}>
                          {verein.collectionRate.toFixed(1)}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                        {verein.totalZahlungen} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                          (€{verein.totalZahlungsBetrag.toFixed(2)})
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>
                        <span style={{ color: verein.totalBankBetrag >= 0 ? '#10B981' : '#EF4444' }}>
                          €{verein.totalBankBetrag.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr style={{
                    borderTop: '2px solid var(--color-border)',
                    background: 'var(--color-background)',
                    fontWeight: '600'
                  }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-primary)' }}>
                      {t('finanz:dashboard.total')}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
                      {vereinComparisonData.reduce((sum, v) => sum + v.totalForderungen, 0)} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        (€{vereinComparisonData.reduce((sum, v) => sum + v.totalForderungsBetrag, 0).toFixed(2)})
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#10B981' }}>
                      {vereinComparisonData.reduce((sum, v) => sum + v.bezahlteForderungen, 0)} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        (€{vereinComparisonData.reduce((sum, v) => sum + v.bezahlteForderungenBetrag, 0).toFixed(2)})
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#F59E0B' }}>
                      {vereinComparisonData.reduce((sum, v) => sum + v.offeneForderungen, 0)} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        (€{vereinComparisonData.reduce((sum, v) => sum + v.offeneForderungenBetrag, 0).toFixed(2)})
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#EF4444' }}>
                      {vereinComparisonData.reduce((sum, v) => sum + v.overdueForderungenCount, 0)} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        (€{vereinComparisonData.reduce((sum, v) => sum + v.overdueForderungenBetrag, 0).toFixed(2)})
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
                      {(vereinComparisonData.reduce((sum, v) => sum + v.bezahlteForderungenBetrag, 0) /
                        vereinComparisonData.reduce((sum, v) => sum + v.totalForderungsBetrag, 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
                      {vereinComparisonData.reduce((sum, v) => sum + v.totalZahlungen, 0)} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        (€{vereinComparisonData.reduce((sum, v) => sum + v.totalZahlungsBetrag, 0).toFixed(2)})
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--color-text-primary)' }}>
                      €{vereinComparisonData.reduce((sum, v) => sum + v.totalBankBetrag, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Revenue Trend */}
        <div className="chart-section chart-section-large">
          <div className="chart-header">
            <h2>{t('finanz:dashboard.monthlyRevenueTrend')}</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData} margin={{ bottom: 20, left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="month"
                  stroke="#666"
                  style={{ fontSize: '0.75rem' }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#666"
                  style={{ fontSize: '0.875rem' }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrencyDetailed(value)}
                />
                <Legend content={<ChartLegend />} />
                <Line
                  type="monotone"
                  dataKey="gelir"
                  stroke="#10B981"
                  strokeWidth={2}
                  name={t('finanz:transaction.income')}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="gider"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name={t('finanz:transaction.expense')}
                  dot={{ fill: '#EF4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="alacak"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name={t('finanz:dashboard.claims')}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>{t('finanz:dashboard.paymentMethods')}</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethods.map((pm) => ({
                    name: pm.method,
                    value: pm.amount
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={paymentMethodColors[index % paymentMethodColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrencyDetailed(value)}
                />
                <Legend content={<ChartLegend />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="payment-methods-table">
              <div className="payment-methods-header">
                <span>{t('finanz:export.paymentMethod')}</span>
                <span>%</span>
                <span>{t('finanz:export.count')}</span>
                <span>{t('finanz:export.amount')}</span>
              </div>
              {paymentMethods.map((pm, index) => {
                const percent = paymentMethodsTotal > 0 ? (pm.amount / paymentMethodsTotal) * 100 : 0;

                return (
                  <div key={pm.method} className="payment-methods-row">
                    <span className="payment-methods-name">
                      <span
                        className="payment-methods-dot"
                        style={{ backgroundColor: paymentMethodColors[index % paymentMethodColors.length] }}
                      ></span>
                      {pm.method}
                    </span>
                    <span className="payment-methods-percent">{formatPercent(percent)}</span>
                    <span className="payment-methods-count">{formatNumber(pm.count)}</span>
                    <span className="payment-methods-amount">{formatCurrency(pm.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics - Collapsible */}
      <details className="dashboard-section detailed-stats">
        <summary className="detailed-stats-summary">
          <span className="detailed-stats-icon">
            <TrendingUpIcon />
          </span>
          <span>{t('finanz:dashboard.detailedStatistics')}</span>
        </summary>
        <div className="detailed-stats-grid">
          <StatCard
            title={t('finanz:dashboard.totalClaims')}
            value={formatNumber(stats.totalForderungen)}
            icon={<CreditCardIcon />}
            color="primary"
            subtitle={formatCurrency(stats.totalForderungsBetrag)}
          />
          <StatCard
            title={t('finanz:dashboard.paidClaims')}
            value={formatNumber(stats.bezahlteForderungen)}
            icon={<CheckCircleIcon />}
            color="success"
            subtitle={formatCurrency(stats.bezahlteForderungenBetrag)}
          />
          <StatCard
            title={t('finanz:dashboard.openClaims')}
            value={formatNumber(stats.offeneForderungen)}
            icon={<AlertCircleIcon />}
            color={stats.offeneForderungen > 0 ? 'warning' : 'success'}
            subtitle={formatCurrency(stats.offeneForderungenBetrag)}
          />
          <StatCard
            title={t('finanz:dashboard.totalPayments')}
            value={formatNumber(stats.totalZahlungen)}
            icon={<TrendingUpIcon />}
            color="primary"
            subtitle={formatCurrency(stats.totalZahlungsBetrag)}
          />
          <StatCard
            title={t('finanz:dashboard.avgPaymentDays')}
            value={formatNumber(Math.abs(stats.avgPaymentDays))}
            icon={<ClockIcon />}
            color={stats.avgPaymentDays <= 0 ? 'success' : stats.avgPaymentDays <= 7 ? 'warning' : 'error'}
            subtitle={stats.avgPaymentDays <= 0 ? t('finanz:dashboard.onTime') : t('finanz:dashboard.daysDelay')}
          />
          <StatCard
            title={t('finanz:dashboard.arpu')}
            value={formatCurrency(stats.arpu)}
            icon={<UsersIcon />}
            color="primary"
            subtitle={`${formatNumber(stats.activeMitglieder)} ${t('finanz:dashboard.activeMembers')}`}
          />
        </div>
      </details>

      {/* Info Message */}
      <div className={`alert-banner ${stats.overdueForderungenCount > 0 ? 'alert-warning' : 'alert-success'}`}>
        <div className="alert-icon">
          {stats.overdueForderungenCount > 0 ? <AlertCircleIcon /> : <CheckCircleIcon />}
        </div>
        <div className="alert-content">
          <p
            className="alert-title"
            dangerouslySetInnerHTML={{
              __html: t('finanz:dashboard.collectionRateMessage')
                .replace('{rate}', stats.collectionRate.toFixed(1))
                .replace('{overdueMessage}', stats.overdueForderungenCount > 0
                  ? t('finanz:dashboard.overdueExists').replace('{count}', stats.overdueForderungenCount.toString())
                  : t('finanz:dashboard.allPaymentsCurrent'))
            }}
          />
          <p className="alert-subtitle">{t('finanz:dashboard.info')}</p>
        </div>
        {stats.overdueForderungenCount > 0 && (
          <button
            type="button"
            className="btn btn-secondary alert-action"
            onClick={() => navigate('/finanzen/forderungen')}
          >
            {t('common:view')} {t('finanz:dashboard.overdueClaims')}
          </button>
        )}
      </div>

        </>
      )}

      {/* GIDER TAB CONTENT */}
      {activeTab === 'gider' && (
        <>
          {/* DITIB Payments Statistics */}
          <div className="dashboard-section kpi-section">
            <h2 className="section-title">{t('finanz:dashboard.expenseStatistics')}</h2>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon"
                    style={{
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <DollarSignIcon />
                  </div>
                </div>
                <div className="kpi-content">
                  <p className="kpi-title">{t('finanz:dashboard.totalDitibPayments')}</p>
                  <p className="kpi-value">{formatNumber(stats.totalDitibZahlungen)}</p>
                  <p className="kpi-subtitle">{formatCurrency(stats.totalDitibBetrag)}</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon"
                    style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <CheckCircleIcon />
                  </div>
                </div>
                <div className="kpi-content">
                  <p className="kpi-title">{t('finanz:dashboard.paidDitib')}</p>
                  <p className="kpi-value">{formatNumber(stats.bezahlteDitibZahlungen)}</p>
                  <p className="kpi-subtitle">{formatCurrency(stats.bezahlteDitibBetrag)}</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon"
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <ClockIcon />
                  </div>
                </div>
                <div className="kpi-content">
                  <p className="kpi-title">{t('finanz:dashboard.pendingDitib')}</p>
                  <p className="kpi-value">{formatNumber(stats.offeneDitibZahlungen)}</p>
                  <p className="kpi-subtitle">{formatCurrency(stats.offeneDitibBetrag)}</p>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-header">
                  <div
                    className="kpi-icon"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <TrendingUpIcon />
                  </div>
                </div>
                <div className="kpi-content">
                  <p className="kpi-title">{t('finanz:dashboard.currentMonth')}</p>
                  <p className="kpi-value">{formatCurrency(stats.currentMonthDitibBetrag)}</p>
                  <p className="kpi-subtitle">{t('finanz:dashboard.ditibPayment')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access - DITIB */}
          <div className="dashboard-section quick-access-section">
            <h2 className="section-title">{t('finanz:dashboard.quickAccess')}</h2>
            <div className="quick-access-grid">
              <button
                type="button"
                className="quick-access-card"
                onClick={() => navigate('/finanzen/ditib-zahlungen')}
              >
                <span className="quick-access-icon quick-access-icon-danger">
                  <DollarSignIcon />
                </span>
                <span className="quick-access-text">
                  <span className="quick-access-title">{t('finanz:dashboard.ditibPaymentsButton')}</span>
                  <span className="quick-access-desc">{t('finanz:dashboard.ditibPayment')}</span>
                </span>
              </button>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default FinanzDashboard;

