/**
 * Mitglied Finanz Dashboard (Summary Only)
 * Member's financial overview with summary, yearly stats, and trend
 */

import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedForderungService } from '../../services/finanzService';
import Loading from '../../components/Common/Loading';
import PaymentTrendChart from '../../components/Finanz/PaymentTrendChart';
import './MitgliedFinanzDashboard.css';

const DebtIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const OverdueIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const PaidIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
  </svg>
);

const MitgliedFinanzDashboard: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();

  const mitgliedId = user?.mitgliedId;

  const { data: summary, isLoading } = useQuery({
    queryKey: ['mitglied-finanz-summary', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return null;
      return await mitgliedForderungService.getSummary(mitgliedId);
    },
    enabled: !!mitgliedId,
  });

  useEffect(() => {
    if (user && user.type !== 'mitglied') {
      navigate('/startseite');
    }
  }, [user, navigate]);

  const locale = i18n.language === 'de' ? 'de-DE' : 'tr-TR';
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const year = summary?.yearlyStats?.year ?? new Date().getFullYear();
  const hasPayments = (summary?.yearlyStats?.totalPayments ?? 0) > 0;

  const chartData = useMemo(() => {
    if (!summary) {
      return [];
    }

    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
    const actualByMonth: Record<number, number> = {};
    summary.last12MonthsTrend.forEach((entry) => {
      if (entry.year === year) {
        actualByMonth[entry.month] = (actualByMonth[entry.month] || 0) + entry.amount;
      }
    });

    const plannedByMonth: Record<number, number> = {};
    summary.beitragPlan?.nextPaymentDates?.forEach((entry) => {
      if (entry.year === year) {
        plannedByMonth[entry.month] = (plannedByMonth[entry.month] || 0) + entry.amount;
      }
    });

    return Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      return {
        monthName: monthFormatter.format(new Date(year, index, 1)),
        actual: hasPayments ? (actualByMonth[monthNumber] || 0) : 0,
        planned: plannedByMonth[monthNumber] || 0,
      };
    });
  }, [summary, locale, year, hasPayments]);

  if (user && user.type !== 'mitglied') {
    return null;
  }

  if (isLoading || !summary) {
    return <Loading />;
  }

  return (
    <div className="mitglied-finanz-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('finanz:mitgliedFinanz.title')}</h1>
          <p className="page-subtitle">{t('finanz:mitgliedFinanz.subtitle')}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <div className="summary-cards-grid">
            <button
              type="button"
              className="summary-card summary-card--debt"
              onClick={() => navigate('/meine-finanzen/forderungen')}
            >
              <span className="summary-card-icon"><DebtIcon /></span>
              <span className="summary-card-body">
                <span className="summary-card-title">{t('finanz:mitgliedFinanz.totalDebt')}</span>
                <span className="summary-card-value">{formatCurrency(summary.totalDebt)}</span>
                <span className="summary-card-note">{t('finanz:mitgliedFinanz.totalDebtNote')}</span>
              </span>
            </button>

            <button
              type="button"
              className="summary-card summary-card--overdue"
              onClick={() => navigate('/meine-finanzen/forderungen?filter=overdue')}
            >
              <span className="summary-card-icon"><OverdueIcon /></span>
              <span className="summary-card-body">
                <span className="summary-card-title">{t('finanz:mitgliedFinanz.overdueClaims')}</span>
                <span className="summary-card-value">{formatCurrency(summary.totalOverdue)}</span>
                <span className="summary-card-note">{t('finanz:mitgliedFinanz.overdueNote')}</span>
              </span>
            </button>

            <button
              type="button"
              className="summary-card summary-card--paid"
              onClick={() => navigate(`/meine-finanzen/zahlungen?year=${year}`)}
            >
              <span className="summary-card-icon"><PaidIcon /></span>
              <span className="summary-card-body">
                <span className="summary-card-title">{t('finanz:mitgliedFinanz.paidThisYear')}</span>
                <span className="summary-card-value">{formatCurrency(summary.yearlyStats?.totalAmount || 0)}</span>
                <span className="summary-card-note">{t('finanz:mitgliedFinanz.paidThisYearNote')}</span>
              </span>
            </button>

            <button
              type="button"
              className="summary-card summary-card--credit"
              onClick={() => navigate('/meine-finanzen')}
            >
              <span className="summary-card-icon"><WalletIcon /></span>
              <span className="summary-card-body">
                <span className="summary-card-title">{t('finanz:mitgliedFinanz.creditBalance')}</span>
                <span className="summary-card-value">{formatCurrency(summary.creditBalance)}</span>
                <span className="summary-card-note">{t('finanz:mitgliedFinanz.creditBalanceNote')}</span>
              </span>
            </button>
          </div>
        </section>

        <section className="dashboard-section yearly-summary-section">
          <div className="section-header">
            <h2>{t('finanz:mitgliedFinanz.yearlyStats')} ({year})</h2>
          </div>
          {hasPayments ? (
            <div className="yearly-summary-grid">
              <div className="yearly-summary-item">
                <div className="yearly-summary-value">{summary.yearlyStats?.totalPayments}</div>
                <div className="yearly-summary-label">{t('finanz:mitgliedFinanz.totalPaymentsCount')}</div>
              </div>
              <div className="yearly-summary-item">
                <div className="yearly-summary-value">{formatCurrency(summary.yearlyStats?.totalAmount || 0)}</div>
                <div className="yearly-summary-label">{t('finanz:mitgliedFinanz.totalPaidThisYear')}</div>
              </div>
              <div className="yearly-summary-item">
                <div className="yearly-summary-value">
                  {summary.yearlyStats?.averagePaymentDays ?? 0} {t('finanz:mitgliedFinanz.days')}
                </div>
                <div className="yearly-summary-label">{t('finanz:mitgliedFinanz.avgPaymentTime')}</div>
              </div>
            </div>
          ) : (
            <div className="yearly-summary-empty">
              {t('finanz:mitgliedFinanz.yearlyStatsEmpty')}
            </div>
          )}
        </section>

        <section className="dashboard-section chart-section">
          <PaymentTrendChart
            data={chartData}
            title={`${t('finanz:mitgliedFinanz.paymentHistoryTitle')} (${year})`}
          />
        </section>

        <div className="dashboard-footer">
          <Link className="dashboard-link" to="/meine-finanzen">
            {t('finanz:mitgliedFinanz.viewPlanLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MitgliedFinanzDashboard;
