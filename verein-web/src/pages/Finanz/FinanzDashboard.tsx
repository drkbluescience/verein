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
  mitgliedForderungService,
  mitgliedZahlungService,
  bankBuchungService,
} from '../../services/finanzService';
import { mitgliedService } from '../../services/mitgliedService';
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
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);

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

  // Fetch claims
  const { data: forderungen = [], isLoading: forderungenLoading } = useQuery({
    queryKey: ['forderungen', vereinId],
    queryFn: async () => {
      if (vereinId) {
        // Dernek user - get unpaid claims
        return await mitgliedForderungService.getUnpaid(vereinId);
      }
      // Admin - get all claims
      return await mitgliedForderungService.getAll();
    },
    enabled: !!user,
  });

  // Fetch payments
  const { data: zahlungen = [], isLoading: zahlungenLoading } = useQuery({
    queryKey: ['zahlungen', vereinId],
    queryFn: async () => {
      if (vereinId) {
        // Dernek user - get payments for their verein
        const allZahlungen = await mitgliedZahlungService.getAll();
        return allZahlungen.filter(z => z.vereinId === vereinId);
      }
      // Admin - get all payments
      return await mitgliedZahlungService.getAll();
    },
    enabled: !!user,
  });

  // Fetch bank transactions
  const { data: bankBuchungen = [], isLoading: bankBuchungenLoading } = useQuery({
    queryKey: ['bankBuchungen', vereinId],
    queryFn: async () => {
      if (vereinId) {
        // Dernek user - get bank transactions for their verein
        return await bankBuchungService.getByVereinId(vereinId);
      }
      // Admin - get all bank transactions
      return await bankBuchungService.getAll();
    },
    enabled: !!user,
  });

  // Fetch mitglieder for ARPU calculation
  const { data: mitgliederData } = useQuery({
    queryKey: ['mitglieder-for-finanz', vereinId],
    queryFn: async () => {
      if (vereinId) {
        return await mitgliedService.getAll({ pageNumber: 1, pageSize: 10000, vereinId });
      }
      return await mitgliedService.getAll({ pageNumber: 1, pageSize: 10000 });
    },
    enabled: !!user,
  });

  const allMitglieder = useMemo(() => {
    if (!mitgliederData) return [];
    return Array.isArray(mitgliederData) ? mitgliederData : mitgliederData.items || [];
  }, [mitgliederData]);

  // Calculate advanced statistics
  const stats = useMemo(() => {
    const totalForderungen = forderungen.length;
    const totalForderungsBetrag = forderungen.reduce((sum, f) => sum + f.betrag, 0);

    const bezahlteForderungen = forderungen.filter(f => f.statusId === 1).length;
    const bezahlteForderungenBetrag = forderungen.filter(f => f.statusId === 1).reduce((sum, f) => sum + f.betrag, 0);
    const offeneForderungen = forderungen.filter(f => f.statusId === 2).length;
    const offeneForderungenBetrag = forderungen.filter(f => f.statusId === 2).reduce((sum, f) => sum + f.betrag, 0);

    // Overdue claims (gecikmiş ödemeler)
    const today = new Date();
    const overdueForderungen = forderungen.filter(f => {
      if (f.statusId === 1) return false; // Already paid
      return new Date(f.faelligkeit) < today;
    });
    const overdueForderungenCount = overdueForderungen.length;
    const overdueForderungenBetrag = overdueForderungen.reduce((sum, f) => sum + f.betrag, 0);

    const totalZahlungen = zahlungen.length;
    const totalZahlungsBetrag = zahlungen.reduce((sum, z) => sum + z.betrag, 0);

    const totalBankBuchungen = bankBuchungen.length;
    const totalBankBetrag = bankBuchungen.reduce((sum, b) => sum + b.betrag, 0);

    // Collection Rate (Tahsilat Oranı)
    const collectionRate = totalForderungsBetrag > 0
      ? (bezahlteForderungenBetrag / totalForderungsBetrag) * 100
      : 0;

    // Average Payment Days (Ortalama Ödeme Süresi)
    const paidForderungenWithDates = forderungen.filter(f => f.statusId === 1 && f.bezahltAm && f.faelligkeit);
    const avgPaymentDays = paidForderungenWithDates.length > 0
      ? paidForderungenWithDates.reduce((sum, f) => {
          const dueDate = new Date(f.faelligkeit);
          const paidDate = new Date(f.bezahltAm!);
          const diffDays = Math.floor((paidDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0) / paidForderungenWithDates.length
      : 0;

    // Expected Revenue (Bu ay beklenen gelir)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const expectedRevenue = forderungen
      .filter(f => {
        const dueDate = new Date(f.faelligkeit);
        return dueDate.getMonth() === currentMonth &&
               dueDate.getFullYear() === currentYear &&
               f.statusId === 2; // Only unpaid
      })
      .reduce((sum, f) => sum + f.betrag, 0);

    // Cash Position (Nakit Pozisyonu) - Simplified: Total payments - Total claims
    const cashPosition = totalZahlungsBetrag - totalForderungsBetrag;

    // ARPU (Average Revenue Per User)
    const activeMitglieder = allMitglieder.filter(m => m.aktiv).length;
    const arpu = activeMitglieder > 0 ? totalZahlungsBetrag / activeMitglieder : 0;

    return {
      totalForderungen,
      totalForderungsBetrag,
      bezahlteForderungen,
      bezahlteForderungenBetrag,
      offeneForderungen,
      offeneForderungenBetrag,
      overdueForderungenCount,
      overdueForderungenBetrag,
      totalZahlungen,
      totalZahlungsBetrag,
      totalBankBuchungen,
      totalBankBetrag,
      collectionRate,
      avgPaymentDays,
      expectedRevenue,
      cashPosition,
      arpu,
      activeMitglieder,
    };
  }, [forderungen, zahlungen, bankBuchungen, allMitglieder]);

  // Monthly Revenue Trend (Son 12 ay)
  const monthlyRevenueData = useMemo(() => {
    const data = [];
    const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthPayments = zahlungen.filter(z => {
        const paymentDate = new Date(z.zahlungsdatum);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      }).reduce((sum, z) => sum + z.betrag, 0);

      const monthClaims = forderungen.filter(f => {
        const dueDate = new Date(f.faelligkeit);
        return dueDate >= monthStart && dueDate <= monthEnd;
      }).reduce((sum, f) => sum + f.betrag, 0);

      data.push({
        month: t(`common:monthsShort.${monthKeys[date.getMonth()]}`),
        gelir: Math.round(monthPayments),
        alacak: Math.round(monthClaims),
      });
    }
    return data;
  }, [zahlungen, forderungen, t]);

  // Payment Methods Distribution
  const paymentMethodsData = useMemo(() => {
    const methods: { [key: string]: number } = {};

    zahlungen.forEach(z => {
      const method = z.zahlungsweg || 'Belirtilmemiş';
      methods[method] = (methods[method] || 0) + z.betrag;
    });

    return Object.entries(methods).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [zahlungen]);

  // Dernek Comparison Data (for Admin when no filter selected)
  const vereinComparisonData = useMemo(() => {
    if (user?.type !== 'admin' || selectedVereinId !== null) return [];

    return vereine.map(verein => {
      const vereinForderungen = forderungen.filter(f => f.vereinId === verein.id);
      const vereinZahlungen = zahlungen.filter(z => z.vereinId === verein.id);
      const vereinBankBuchungen = bankBuchungen.filter(b => b.vereinId === verein.id);

      const totalForderungen = vereinForderungen.length;
      const totalForderungsBetrag = vereinForderungen.reduce((sum, f) => sum + f.betrag, 0);
      const bezahlteForderungen = vereinForderungen.filter(f => f.statusId === 1).length;
      const bezahlteForderungenBetrag = vereinForderungen.filter(f => f.statusId === 1).reduce((sum, f) => sum + f.betrag, 0);
      const offeneForderungen = vereinForderungen.filter(f => f.statusId === 2).length;
      const offeneForderungenBetrag = vereinForderungen.filter(f => f.statusId === 2).reduce((sum, f) => sum + f.betrag, 0);

      const today = new Date();
      const overdueForderungen = vereinForderungen.filter(f => {
        if (f.statusId === 1) return false;
        return new Date(f.faelligkeit) < today;
      });
      const overdueForderungenCount = overdueForderungen.length;
      const overdueForderungenBetrag = overdueForderungen.reduce((sum, f) => sum + f.betrag, 0);

      const totalZahlungen = vereinZahlungen.length;
      const totalZahlungsBetrag = vereinZahlungen.reduce((sum, z) => sum + z.betrag, 0);

      const totalBankBetrag = vereinBankBuchungen.reduce((sum, b) => sum + b.betrag, 0);

      const collectionRate = totalForderungsBetrag > 0
        ? (bezahlteForderungenBetrag / totalForderungsBetrag) * 100
        : 0;

      return {
        vereinId: verein.id,
        vereinName: verein.name,
        totalForderungen,
        totalForderungsBetrag,
        bezahlteForderungen,
        bezahlteForderungenBetrag,
        offeneForderungen,
        offeneForderungenBetrag,
        overdueForderungenCount,
        overdueForderungenBetrag,
        totalZahlungen,
        totalZahlungsBetrag,
        totalBankBetrag,
        collectionRate,
      };
    });
  }, [user, selectedVereinId, vereine, forderungen, zahlungen, bankBuchungen]);

  // Colors for pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const isLoading = forderungenLoading || zahlungenLoading || bankBuchungenLoading;

  if (isLoading) return <Loading />;

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
    const ws3 = XLSX.utils.json_to_sheet(paymentMethodsData);
    XLSX.utils.book_append_sheet(wb, ws3, t('finanz:export.paymentMethodsSheet'));

    XLSX.writeFile(wb, `${t('finanz:export.financeReportFileName')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="finanz-dashboard">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:dashboard.title')}</h1>
      </div>

      {/* Filters & Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* Admin: Verein Filter */}
        {user?.type === 'admin' && (
          <select
            value={selectedVereinId || ''}
            onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
            style={{
              padding: '10px 16px',
              border: '2px solid var(--color-border)',
              borderRadius: '12px',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '200px',
            }}
          >
            <option value="">{t('common:filter.allVereine')}</option>
            {vereine.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        )}
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-secondary" onClick={() => navigate('/finanzen/bank-upload')}>
          <UploadIcon />
          {t('finanz:bankUpload.title')}
        </button>
        <button className="btn btn-primary" onClick={exportToExcel}>
          <DownloadIcon />
          {t('finanz:dashboard.exportToExcel')}
        </button>
      </div>

      {/* Important Metrics - 2x2 Grid */}
      <div className="dashboard-section" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text)' }}>{t('finanz:dashboard.importantMetrics')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.25rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: stats.collectionRate >= 80 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : stats.collectionRate >= 60 ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: stats.collectionRate >= 80 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : stats.collectionRate >= 60 ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}>
                <PercentIcon />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', fontWeight: '500' }}>{t('finanz:dashboard.collectionRate')}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{stats.collectionRate.toFixed(1)}%</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{t('finanz:dashboard.paymentSuccessRate')}</p>
            </div>
          </div>

          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.25rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: stats.overdueForderungenCount === 0 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: stats.overdueForderungenCount === 0 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}>
                <AlertCircleIcon />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', fontWeight: '500' }}>{t('finanz:dashboard.overduePayments')}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{stats.overdueForderungenCount}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>€ {stats.overdueForderungenBetrag.toFixed(2)}</p>
            </div>
          </div>

          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.25rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}>
                <DollarSignIcon />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', fontWeight: '500' }}>{t('finanz:dashboard.expectedRevenue')}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.25rem' }}>€ {stats.expectedRevenue.toFixed(0)}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{t('finanz:dashboard.dueThisMonth')}</p>
            </div>
          </div>

          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.25rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: stats.cashPosition >= 0 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: stats.cashPosition >= 0 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                <WalletIcon />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', fontWeight: '500' }}>{t('finanz:dashboard.cashPosition')}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.25rem' }}>€ {Math.abs(stats.cashPosition).toFixed(0)}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{stats.cashPosition >= 0 ? t('finanz:dashboard.positive') : t('finanz:dashboard.negative')}</p>
            </div>
          </div>
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

      {/* Quick Access Buttons */}
      <div className="dashboard-section" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text)' }}>{t('finanz:dashboard.quickAccess')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <button
            className="action-card"
            style={{
              cursor: 'pointer',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'left',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            onClick={() => navigate('/finanzen/forderungen')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}>
                <CreditCardIcon />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text)' }}>
                {stats.totalForderungen}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--color-text)' }}>{t('finanz:dashboard.forderungen')}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>{t('finanz:dashboard.forderungenDesc')}</p>
              <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text)' }}>
                €{stats.totalForderungsBetrag.toFixed(2)}
              </div>
            </div>
          </button>

          <button
            className="action-card"
            style={{
              cursor: 'pointer',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'left',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            onClick={() => navigate('/finanzen/zahlungen')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#f093fb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
              }}>
                <CheckCircleIcon />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text)' }}>
                {stats.totalZahlungen}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--color-text)' }}>{t('finanz:dashboard.zahlungen')}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>{t('finanz:dashboard.zahlungenDesc')}</p>
              <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text)' }}>
                €{stats.totalZahlungsBetrag.toFixed(2)}
              </div>
            </div>
          </button>

          <button
            className="action-card"
            style={{
              cursor: 'pointer',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'left',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            onClick={() => navigate('/finanzen/bank')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#4facfe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
              }}>
                <WalletIcon />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text)' }}>
                {stats.totalBankBuchungen}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--color-text)' }}>{t('finanz:dashboard.bankBuchungen')}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>{t('finanz:dashboard.bankBuchungenDesc')}</p>
              <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text)' }}>
                €{stats.totalBankBetrag.toFixed(2)}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Revenue Trend */}
        <div className="chart-section chart-section-large">
          <h2>{t('finanz:dashboard.monthlyRevenueTrend')}</h2>
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
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => `€${value}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gelir"
                  stroke="#10B981"
                  strokeWidth={2}
                  name={t('finanz:dashboard.revenue')}
                  dot={{ fill: '#10B981', r: 4 }}
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
          <h2>{t('finanz:dashboard.paymentMethodsDistribution')}</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `€${value.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => value.toUpperCase()}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Statistics - Collapsible */}
      <details className="dashboard-section" style={{ marginBottom: '2rem' }}>
        <summary style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          padding: '1.25rem 1.5rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: 'var(--color-text)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-background)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-surface)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        }}>
          <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>▼</span>
          <span>{t('finanz:dashboard.detailedStatistics')}</span>
        </summary>
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <StatCard
            title={t('finanz:dashboard.totalClaims')}
            value={stats.totalForderungen}
            icon={<CreditCardIcon />}
            color="primary"
            subtitle={`€ ${stats.totalForderungsBetrag.toFixed(2)}`}
          />
          <StatCard
            title={t('finanz:dashboard.paidClaims')}
            value={stats.bezahlteForderungen}
            icon={<CheckCircleIcon />}
            color="success"
            subtitle={`€ ${stats.bezahlteForderungenBetrag.toFixed(2)}`}
          />
          <StatCard
            title={t('finanz:dashboard.openClaims')}
            value={stats.offeneForderungen}
            icon={<AlertCircleIcon />}
            color={stats.offeneForderungen > 0 ? 'warning' : 'success'}
            subtitle={`€ ${stats.offeneForderungenBetrag.toFixed(2)}`}
          />
          <StatCard
            title={t('finanz:dashboard.totalPayments')}
            value={stats.totalZahlungen}
            icon={<TrendingUpIcon />}
            color="primary"
            subtitle={`€ ${stats.totalZahlungsBetrag.toFixed(2)}`}
          />
          <StatCard
            title={t('finanz:dashboard.avgPaymentDays')}
            value={`${Math.abs(stats.avgPaymentDays).toFixed(0)}`}
            icon={<ClockIcon />}
            color={stats.avgPaymentDays <= 0 ? 'success' : stats.avgPaymentDays <= 7 ? 'warning' : 'error'}
            subtitle={stats.avgPaymentDays <= 0 ? t('finanz:dashboard.onTime') : t('finanz:dashboard.daysDelay')}
          />
          <StatCard
            title={t('finanz:dashboard.arpu')}
            value={`€ ${stats.arpu.toFixed(2)}`}
            icon={<UsersIcon />}
            color="primary"
            subtitle={`${stats.activeMitglieder} ${t('finanz:dashboard.activeMembers')}`}
          />
        </div>
      </details>

      {/* Info Message */}
      <div style={{
        background: stats.overdueForderungenCount > 0
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
        border: `1px solid ${stats.overdueForderungenCount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem' }}>
            {stats.overdueForderungenCount > 0 ? '⚠️' : '✅'}
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text)' }}
              dangerouslySetInnerHTML={{
                __html: t('finanz:dashboard.collectionRateMessage')
                  .replace('{rate}', stats.collectionRate.toFixed(1))
                  .replace('{overdueMessage}', stats.overdueForderungenCount > 0
                    ? t('finanz:dashboard.overdueExists').replace('{count}', stats.overdueForderungenCount.toString())
                    : t('finanz:dashboard.allPaymentsCurrent'))
              }}
            />
            <p style={{ fontSize: '0.875rem', opacity: 0.8, color: 'var(--color-text-secondary)' }}>
              {t('finanz:dashboard.info')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanzDashboard;

