/**
 * Mitglied Finanz Page
 * Member's personal finance overview: claims, payments, balance
 * Accessible by: Mitglied (member) only
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedForderungService, mitgliedZahlungService, veranstaltungZahlungService } from '../../services/finanzService';
import type { MitgliedZahlungDto, VeranstaltungZahlungDto } from '../../types/finanz.types';
import { vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import Loading from '../../components/Common/Loading';
import PaymentTrendChart from '../../components/Finanz/PaymentTrendChart';
import PaymentInstructionCard from '../../components/PaymentInstructionCard';
import DatePicker from 'react-datepicker';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { de, tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './MitgliedFinanz.css';
import './FinanzList.css';

// Tab Types
type TabType = 'overview' | 'beitrag' | 'events' | 'claims' | 'history';

// Card Icons (Professional SVG)
const DebtIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const OverdueIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const PaidIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
  </svg>
);

// Tab Icons
const OverviewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const BeitragIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const EventsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ClaimsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

// Payment History Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);


const MitgliedFinanz: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();

  const mitgliedId = user?.mitgliedId;

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Show paid claims state
  const [showPaidClaims, setShowPaidClaims] = useState(false);

  // Copied reference state
  const [copiedReference, setCopiedReference] = useState<number | null>(null);

  // Payment history states
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentStartDate, setPaymentStartDate] = useState<Date | null>(null);
  const [paymentEndDate, setPaymentEndDate] = useState<Date | null>(null);
  const [paymentMinAmount, setPaymentMinAmount] = useState('');
  const [paymentMaxAmount, setPaymentMaxAmount] = useState('');
  const [paymentSortBy, setPaymentSortBy] = useState<'date' | 'amount'>('date');
  const [paymentSortOrder, setPaymentSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showPaymentFilters, setShowPaymentFilters] = useState(false);

  // Copy to clipboard function
  const copyToClipboard = (text: string, forderungId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedReference(forderungId);
      setTimeout(() => setCopiedReference(null), 2000);
    });
  };

  // Fetch financial summary (single API call)
  const { data: summary, isLoading } = useQuery({
    queryKey: ['mitglied-finanz-summary', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return null;
      return await mitgliedForderungService.getSummary(mitgliedId);
    },
    enabled: !!mitgliedId,
  });

  // Fetch Mitglied data to get vereinId
  const { data: mitglied } = useQuery({
    queryKey: ['mitglied', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return null;
      return await mitgliedService.getById(mitgliedId);
    },
    enabled: !!mitgliedId,
  });

  // Fetch Verein data to get bank account info
  const { data: verein } = useQuery({
    queryKey: ['verein', mitglied?.vereinId],
    queryFn: async () => {
      if (!mitglied?.vereinId) return null;
      return await vereinService.getById(mitglied.vereinId);
    },
    enabled: !!mitglied?.vereinId,
  });

  // Unified payment type for combined display
  type UnifiedPayment = {
    id: number;
    type: 'mitglied' | 'veranstaltung';
    betrag: number;
    zahlungsdatum: string;
    zahlungsweg?: string;
    referenz?: string;
    bemerkung?: string;
    statusId: number;
    description: string;
  };

  // Fetch member payments for history tab
  const { data: mitgliedZahlungen = [], isLoading: isLoadingMitgliedPayments } = useQuery({
    queryKey: ['mitglied-zahlungen', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return [];
      const allZahlungen = await mitgliedZahlungService.getAll();
      return allZahlungen.filter(z => z.mitgliedId === mitgliedId);
    },
    enabled: !!mitgliedId && activeTab === 'history',
  });

  // Fetch event payments for history tab
  const { data: veranstaltungZahlungen = [], isLoading: isLoadingEventPayments } = useQuery({
    queryKey: ['veranstaltung-zahlungen', mitgliedId],
    queryFn: async () => {
      if (!mitgliedId) return [];
      return veranstaltungZahlungService.getByMitgliedId(mitgliedId);
    },
    enabled: !!mitgliedId && activeTab === 'history',
  });

  const isLoadingPayments = isLoadingMitgliedPayments || isLoadingEventPayments;

  // Combine and unify payments
  const allPayments: UnifiedPayment[] = useMemo(() => {
    const mitgliedPayments: UnifiedPayment[] = mitgliedZahlungen.map(z => ({
      id: z.id,
      type: 'mitglied' as const,
      betrag: z.betrag,
      zahlungsdatum: z.zahlungsdatum,
      zahlungsweg: z.zahlungsweg,
      referenz: z.referenz,
      bemerkung: z.bemerkung,
      statusId: z.statusId,
      description: z.bemerkung || t('finanz:paymentHistory.memberPayment'),
    }));

    const eventPayments: UnifiedPayment[] = veranstaltungZahlungen.map(z => ({
      id: z.id,
      type: 'veranstaltung' as const,
      betrag: z.betrag,
      zahlungsdatum: z.zahlungsdatum,
      zahlungsweg: z.zahlungsweg,
      referenz: z.referenz,
      bemerkung: undefined,
      statusId: z.statusId,
      description: z.veranstaltungTitel || t('finanz:paymentHistory.eventPayment'),
    }));

    return [...mitgliedPayments, ...eventPayments];
  }, [mitgliedZahlungen, veranstaltungZahlungen, t]);

  // Filter and sort payments
  const filteredZahlungen = useMemo(() => {
    let filtered = [...allPayments];

    // Search filter
    if (paymentSearchTerm) {
      const term = paymentSearchTerm.toLowerCase();
      filtered = filtered.filter(z =>
        z.referenz?.toLowerCase().includes(term) ||
        z.bemerkung?.toLowerCase().includes(term) ||
        z.description?.toLowerCase().includes(term)
      );
    }

    // Date range filter
    if (paymentStartDate) {
      filtered = filtered.filter(z => new Date(z.zahlungsdatum) >= paymentStartDate);
    }
    if (paymentEndDate) {
      filtered = filtered.filter(z => new Date(z.zahlungsdatum) <= paymentEndDate);
    }

    // Amount range filter
    if (paymentMinAmount) {
      filtered = filtered.filter(z => z.betrag >= parseFloat(paymentMinAmount));
    }
    if (paymentMaxAmount) {
      filtered = filtered.filter(z => z.betrag <= parseFloat(paymentMaxAmount));
    }

    // Sort
    filtered.sort((a, b) => {
      if (paymentSortBy === 'date') {
        const dateA = new Date(a.zahlungsdatum).getTime();
        const dateB = new Date(b.zahlungsdatum).getTime();
        return paymentSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return paymentSortOrder === 'asc' ? a.betrag - b.betrag : b.betrag - a.betrag;
      }
    });

    return filtered;
  }, [allPayments, paymentSearchTerm, paymentStartDate, paymentEndDate, paymentMinAmount, paymentMaxAmount, paymentSortBy, paymentSortOrder]);

  // Clear payment filters
  const clearPaymentFilters = () => {
    setPaymentSearchTerm('');
    setPaymentStartDate(null);
    setPaymentEndDate(null);
    setPaymentMinAmount('');
    setPaymentMaxAmount('');
  };

  // Export payments to Excel
  const exportPaymentsToExcel = () => {
    const data = filteredZahlungen.map(z => ({
      [t('finanz:paymentHistory.paymentType')]: z.type === 'mitglied'
        ? t('finanz:paymentHistory.memberPayment')
        : t('finanz:paymentHistory.eventPayment'),
      [t('finanz:paymentHistory.paymentDescription')]: z.description,
      [t('finanz:paymentHistory.paymentDate')]: formatPaymentDate(z.zahlungsdatum),
      [t('finanz:paymentHistory.paymentAmount')]: formatCurrency(z.betrag),
      [t('finanz:paymentHistory.paymentMethod')]: z.zahlungsweg || '-',
      [t('finanz:paymentHistory.paymentReference')]: z.referenz || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('finanz:paymentHistory.title'));
    XLSX.writeFile(wb, `${t('finanz:export.paymentHistoryFileName')}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  // Format payment date
  const formatPaymentDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'de' ? de : tr;
    return format(date, 'dd.MM.yyyy', { locale });
  };

  // Get payment urgency class
  const getPaymentUrgency = (dueDate: string): 'overdue' | 'urgent' | 'upcoming' | 'normal' => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue'; // Vadesi geçmiş
    if (diffDays <= 7) return 'urgent'; // 1-7 gün kaldı
    if (diffDays <= 30) return 'upcoming'; // 7-30 gün kaldı
    return 'normal'; // 30+ gün kaldı
  };

  // Redirect if not a member
  if (user?.type !== 'mitglied') {
    navigate('/startseite');
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Format date - Dynamic locale based on current language
  const formatDate = (dateString: string) => {
    const locale = i18n.language === 'de' ? 'de-DE' : 'tr-TR';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!summary) {
    return <Loading />;
  }

  // Tab configuration with badges
  const tabs: { id: TabType; icon: React.ReactNode; labelKey: string; badge?: number }[] = [
    { id: 'overview', icon: <OverviewIcon />, labelKey: 'finanz:tabs.overview' },
    { id: 'beitrag', icon: <BeitragIcon />, labelKey: 'finanz:tabs.beitrag' },
    {
      id: 'events',
      icon: <EventsIcon />,
      labelKey: 'finanz:tabs.events',
      badge: summary.veranstaltungAnmeldungen?.length || 0
    },
    {
      id: 'claims',
      icon: <ClaimsIcon />,
      labelKey: 'finanz:tabs.claims',
      badge: (summary.unpaidClaims?.length || 0) + (summary.unpaidEventClaims?.length || 0)
    },
    { id: 'history', icon: <HistoryIcon />, labelKey: 'finanz:paymentHistory.title' }
  ];

  return (
    <div className="mitglied-finanz">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:mitgliedFinanz.title')}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="finanz-tabs">
        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{t(tab.labelKey)}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <>
            {/* Summary Cards Section - 4 Cards */}
            <div className="finance-summary-cards four-cards">
              {/* 1. Ödenmemiş Borç (Unpaid Debt) */}
              <div className={`summary-card ${summary.totalDebt > 0 ? 'card-warning' : 'card-success'}`}>
                <div className="card-icon"><DebtIcon /></div>
                <div className="card-content">
                  <h3>{t('finanz:mitgliedFinanz.totalDebt')}</h3>
                  <div className={`card-amount ${summary.totalDebt > 0 ? 'warning' : 'success'}`}>
                    {formatCurrency(summary.totalDebt)}
                  </div>
                  {summary.unpaidClaims && summary.unpaidClaims.length > 0 && (
                    <div className="card-subtitle muted">
                      {summary.unpaidClaims.length} {t('finanz:mitgliedFinanz.unpaidClaims')}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Vadesi Geçmiş (Overdue) */}
              <div className={`summary-card ${summary.overdueCount > 0 ? 'card-danger' : 'card-success'}`}>
                <div className="card-icon"><OverdueIcon /></div>
                <div className="card-content">
                  <h3>{t('finanz:mitgliedFinanz.overdueClaims')}</h3>
                  <div className={`card-amount ${summary.overdueCount > 0 ? 'danger' : 'success'}`}>
                    {formatCurrency(summary.totalOverdue)}
                  </div>
                  {summary.overdueCount > 0 && (
                    <div className="card-subtitle danger">
                      {summary.overdueCount} {t('finanz:mitgliedFinanz.overdueItems')}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Bu Yıl Ödediğim (Paid This Year) */}
              <div className={`summary-card card-positive`}>
                <div className="card-icon"><PaidIcon /></div>
                <div className="card-content">
                  <h3>{t('finanz:mitgliedFinanz.paidThisYear')}</h3>
                  <div className="card-amount positive">
                    {formatCurrency(summary.yearlyStats?.totalAmount || 0)}
                  </div>
                  {summary.yearlyStats && summary.yearlyStats.totalPayments > 0 && (
                    <div className="card-subtitle muted">
                      {summary.yearlyStats.totalPayments} {t('finanz:mitgliedFinanz.payments')}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Kredi Bakiyesi (Credit Balance) */}
              <div className={`summary-card ${summary.creditBalance > 0 ? 'card-info' : 'card-neutral'}`}>
                <div className="card-icon"><WalletIcon /></div>
                <div className="card-content">
                  <h3>{t('finanz:mitgliedFinanz.creditBalance')}</h3>
                  <div className={`card-amount ${summary.creditBalance > 0 ? 'info' : 'muted'}`}>
                    {formatCurrency(summary.creditBalance)}
                  </div>
                  {summary.creditBalance > 0 && (
                    <div className="card-subtitle info">
                      {t('finanz:mitgliedFinanz.availableCredit')}
                    </div>
                  )}
                </div>
              </div>
            </div>

      {/* Yearly Stats Section */}
      {summary.yearlyStats && (
        <div className="yearly-stats-section">
          <div className="section-header">
            <h2><ChartIcon /> {t('finanz:mitgliedFinanz.yearlyStats')} ({summary.yearlyStats.year})</h2>
          </div>
          <div className="yearly-stats-grid">
            <div className="stat-item">
              <div className="stat-value">{summary.yearlyStats.totalPayments}</div>
              <div className="stat-label">{t('finanz:mitgliedFinanz.totalPaymentsCount')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatCurrency(summary.yearlyStats.totalAmount)}</div>
              <div className="stat-label">{t('finanz:mitgliedFinanz.totalPaidThisYear')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {summary.yearlyStats.averagePaymentDays > 0
                  ? `${summary.yearlyStats.averagePaymentDays} ${t('finanz:mitgliedFinanz.days')}`
                  : '-'}
              </div>
              <div className="stat-label">{t('finanz:mitgliedFinanz.avgPaymentTime')}</div>
            </div>
            {summary.yearlyStats.preferredPaymentMethod && (
              <div className="stat-item">
                <div className="stat-value">{summary.yearlyStats.preferredPaymentMethod}</div>
                <div className="stat-label">
                  {t('finanz:mitgliedFinanz.preferredMethod')} ({summary.yearlyStats.preferredMethodPercentage}%)
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Trend Chart */}
      {summary.last12MonthsTrend.length > 0 && (
        <PaymentTrendChart data={summary.last12MonthsTrend} />
      )}
          </>
        )}

        {/* ===== BEITRAG TAB ===== */}
        {activeTab === 'beitrag' && (
          <>
      {/* Beitrag Plan Section - Aidat Planı */}
      {summary.beitragPlan ? (
        <div className="beitrag-plan-section">
          <div className="section-header">
            <h2>📋 {t('finanz:beitragPlan.title')}</h2>
          </div>
          <div className="beitrag-plan-card">
            <div className="beitrag-info">
              <div className="beitrag-amount">
                <span className="amount-value">{formatCurrency(summary.beitragPlan.betrag)}</span>
                <span className="amount-period">
                  / {t(`finanz:beitragPlan.period.${summary.beitragPlan.periodeCode?.toLowerCase() || 'monthly'}`)}
                </span>
              </div>
              <div className="beitrag-details">
                <div className="detail-item">
                  <span className="detail-label">{t('finanz:beitragPlan.paymentDay')}:</span>
                  <span className="detail-value">
                    {summary.beitragPlan.zahlungstagTypCode === 'LAST_DAY'
                      ? t('finanz:beitragPlan.lastDayOfMonth')
                      : `${summary.beitragPlan.zahlungsTag}. ${t('finanz:beitragPlan.dayOfMonth')}`}
                  </span>
                </div>
                {summary.beitragPlan.istPflicht && (
                  <div className="detail-item mandatory">
                    <span className="mandatory-badge">⚠️ {t('finanz:beitragPlan.mandatory')}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Payment Calendar */}
            <div className="beitrag-calendar">
              <h4>{t('finanz:beitragPlan.paymentCalendar')}</h4>
              <div className="calendar-grid">
                {summary.beitragPlan.nextPaymentDates.map((payment, index) => (
                  <div
                    key={index}
                    className={`calendar-item status-${payment.status.toLowerCase()}`}
                    onClick={() => payment.forderungId && navigate(`/meine-finanzen/forderungen/${payment.forderungId}`)}
                    role={payment.forderungId ? 'button' : undefined}
                    tabIndex={payment.forderungId ? 0 : undefined}
                  >
                    <div className="calendar-month">{payment.monthName}</div>
                    <div className="calendar-year">{payment.year}</div>
                    <div className="calendar-amount">{formatCurrency(payment.amount)}</div>
                    <div className={`calendar-status ${payment.status.toLowerCase()}`}>
                      {payment.status === 'PAID' && '✓'}
                      {payment.status === 'OVERDUE' && '!'}
                      {payment.status === 'UNPAID' && '○'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="calendar-legend">
                <span className="legend-item paid">✓ {t('finanz:beitragPlan.status.paid')}</span>
                <span className="legend-item unpaid">○ {t('finanz:beitragPlan.status.unpaid')}</span>
                <span className="legend-item overdue">! {t('finanz:beitragPlan.status.overdue')}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>{t('finanz:beitragPlan.noPlan')}</p>
        </div>
      )}

      {/* Upcoming Payments Section */}
      {summary.upcomingPayments && summary.upcomingPayments.length > 0 && (
        <div className="upcoming-payments-section">
          <div className="section-header">
            <h2>📅 {t('finanz:mitgliedFinanz.upcomingPayments')}</h2>
          </div>
          <div className="upcoming-payments-list">
            {summary.upcomingPayments.map((payment, index) => (
              <div
                key={index}
                className={`upcoming-payment-item ${payment.daysUntil <= 7 ? 'urgent' : payment.daysUntil <= 14 ? 'soon' : ''}`}
                onClick={() => payment.forderungId && navigate(`/meine-finanzen/forderungen/${payment.forderungId}`)}
                role={payment.forderungId ? 'button' : undefined}
                tabIndex={payment.forderungId ? 0 : undefined}
              >
                <div className="payment-date">
                  <span className="day">{new Date(payment.dueDate).getDate()}</span>
                  <span className="month">{new Date(payment.dueDate).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', { month: 'short' })}</span>
                </div>
                <div className="payment-info">
                  <div className="payment-description">{payment.description}</div>
                  <div className="payment-days">
                    {payment.daysUntil === 0
                      ? t('finanz:mitgliedFinanz.dueToday')
                      : payment.daysUntil === 1
                        ? t('finanz:mitgliedFinanz.dueTomorrow')
                        : `${payment.daysUntil} ${t('finanz:mitgliedFinanz.daysLeft')}`}
                  </div>
                </div>
                <div className="payment-amount">{formatCurrency(payment.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
          </>
        )}

        {/* ===== EVENTS TAB ===== */}
        {activeTab === 'events' && (
          <>
      {/* Veranstaltung Anmeldungen Section - Etkinlik Katılımları */}
      {summary.veranstaltungAnmeldungen && summary.veranstaltungAnmeldungen.length > 0 ? (
        <div className="veranstaltung-section">
          <div className="section-header">
            <h2>🎫 {t('finanz:veranstaltungen.title')}</h2>
            <span className="badge badge-info">{summary.veranstaltungAnmeldungen.length}</span>
          </div>
          <div className="veranstaltung-list">
            {summary.veranstaltungAnmeldungen.map(event => (
              <div key={event.id} className={`veranstaltung-item status-${event.zahlungStatus?.toLowerCase() || 'unpaid'}`}>
                <div className="veranstaltung-date">
                  <span className="day">{new Date(event.startdatum).getDate()}</span>
                  <span className="month">
                    {new Date(event.startdatum).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', { month: 'short' })}
                  </span>
                  <span className="year">{new Date(event.startdatum).getFullYear()}</span>
                </div>
                <div className="veranstaltung-info">
                  <h4 className="veranstaltung-title">{event.titel}</h4>
                  {event.ort && <div className="veranstaltung-location">📍 {event.ort}</div>}
                  <div className="veranstaltung-status">
                    <span className={`status-badge ${event.anmeldungStatus?.toLowerCase() || 'pending'}`}>
                      {t(`finanz:veranstaltungen.status.${event.anmeldungStatus?.toLowerCase() || 'pending'}`)}
                    </span>
                  </div>
                </div>
                <div className="veranstaltung-payment">
                  {event.preis && event.preis > 0 ? (
                    <>
                      <div className="payment-amount">{formatCurrency(event.preis)}</div>
                      <div className={`payment-status ${event.zahlungStatus?.toLowerCase() || 'unpaid'}`}>
                        {event.zahlungStatus === 'PAID' && <span className="paid">✓ {t('finanz:veranstaltungen.paid')}</span>}
                        {event.zahlungStatus === 'PENDING' && <span className="pending">⏳ {t('finanz:veranstaltungen.pending')}</span>}
                        {event.zahlungStatus === 'UNPAID' && <span className="unpaid">○ {t('finanz:veranstaltungen.unpaid')}</span>}
                      </div>
                    </>
                  ) : (
                    <div className="free-event">🎁 {t('finanz:veranstaltungen.free')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <p>{t('finanz:veranstaltungen.noEvents')}</p>
        </div>
      )}
          </>
        )}

        {/* ===== CLAIMS TAB ===== */}
        {activeTab === 'claims' && (
          <>
      {/* Unpaid Claims Section */}
      {summary.unpaidClaims.length > 0 && (
        <div className="finance-section">
          <div className="section-header">
            <h2>{t('finanz:mitgliedFinanz.unpaidClaimsTitle')}</h2>
            <span className="badge badge-info">{summary.unpaidClaims.length}</span>
          </div>
          <div className="claims-grid">
            {summary.unpaidClaims.map(forderung => {
                const urgency = getPaymentUrgency(forderung.faelligkeit);
                return (
                  <div
                    key={forderung.id}
                    className={`claim-item claim-${urgency}`}
                  >
                    <div
                      className="claim-content clickable"
                      onClick={() => navigate(`/meine-finanzen/forderungen/${forderung.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') navigate(`/meine-finanzen/forderungen/${forderung.id}`);
                      }}
                    >
                      <div className="claim-main">
                        <h4>{forderung.beschreibung || t('finanz:claims.title')}</h4>
                        <span className="claim-id">#{forderung.forderungsnummer || forderung.id}</span>
                      </div>
                      <div className="claim-details">
                        <div className="claim-date">
                          <CalendarIcon />
                          <span>{formatDate(forderung.faelligkeit)}</span>
                          {urgency === 'overdue' && (
                            <span className="urgency-badge overdue">{t('finanz:mitgliedFinanz.overdue')}</span>
                          )}
                          {urgency === 'urgent' && (
                            <span className="urgency-badge urgent">{t('finanz:mitgliedFinanz.urgent')}</span>
                          )}
                        </div>
                        <div className="claim-amount">
                          {forderung.paidAmount > 0 ? (
                            <>
                              <span className="remaining-amount">{formatCurrency(forderung.remainingAmount)}</span>
                              <span className="original-amount">({formatCurrency(forderung.betrag)})</span>
                            </>
                          ) : (
                            formatCurrency(forderung.betrag)
                          )}
                        </div>
                        <div className="claim-status">
                          {forderung.statusId === 1 ? (
                            <span className="status-badge status-paid">✓ {t('finanz:mitgliedFinanz.paid')}</span>
                          ) : forderung.paidAmount > 0 ? (
                            <span className="status-badge status-partial">{t('finanz:mitgliedFinanz.partiallyPaid')}</span>
                          ) : (
                            <span className="status-badge status-unpaid">{t('finanz:mitgliedFinanz.unpaid')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {forderung.statusId === 2 && (
                      <div className="claim-reference-section">
                        <span className="reference-label">{t('finanz:mitgliedFinanz.paymentReference')}:</span>
                        <span className="reference-value">F{forderung.id}-{new Date(forderung.faelligkeit).getFullYear()}</span>
                        <button
                          className="copy-reference-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`F${forderung.id}-${new Date(forderung.faelligkeit).getFullYear()}`, forderung.id);
                          }}
                          title={t('finanz:bankPayment.copyReference')}
                        >
                          {copiedReference === forderung.id ? '✓' : '📋'}
                        </button>
                      </div>
                    )}

                    {/* Payment Instruction Card */}
                    {forderung.statusId === 2 && verein?.hauptBankkonto?.iban && (
                      <PaymentInstructionCard
                        iban={verein.hauptBankkonto.iban}
                        bic={verein.hauptBankkonto.bic}
                        recipient={verein.name}
                        amount={forderung.betrag}
                        currency="EUR"
                        reference={`F${forderung.id}-${new Date(forderung.faelligkeit).getFullYear()}`}
                        dueDate={forderung.faelligkeit}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Unpaid Event Claims Section - Etkinlik Borçları */}
      {summary.unpaidEventClaims && summary.unpaidEventClaims.length > 0 && (
        <div className="finance-section">
          <div className="section-header">
            <h2>🎫 {t('finanz:mitgliedFinanz.unpaidEventClaimsTitle')}</h2>
            <span className="badge badge-warning">{summary.unpaidEventClaims.length}</span>
          </div>
          <div className="claims-grid">
            {summary.unpaidEventClaims.map(event => (
              <div
                key={`event-${event.id}`}
                className="claim-item claim-event"
              >
                <div className="claim-content">
                  <div className="claim-main">
                    <h4>{event.titel}</h4>
                    <span className="claim-type-badge event">{t('finanz:paymentHistory.eventPayment')}</span>
                  </div>
                  <div className="claim-details">
                    <div className="claim-date">
                      <CalendarIcon />
                      <span>{formatDate(event.startdatum)}</span>
                    </div>
                    <div className="claim-amount">{formatCurrency(event.preis || 0)}</div>
                    <div className="claim-status">
                      <span className="status-badge status-pending">⏳ {t('finanz:veranstaltungen.pending')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid Claims Section - Collapsible */}
      {summary.paidClaims.length > 0 && (
        <div className="finance-section">
          <button
            className="toggle-paid-claims-btn"
            onClick={() => setShowPaidClaims(!showPaidClaims)}
          >
            <span>{showPaidClaims ? '▼' : '▶'}</span>
            {showPaidClaims
              ? t('finanz:mitgliedFinanz.hidePaidClaims')
              : t('finanz:mitgliedFinanz.showPaidClaims')} ({summary.paidClaims.length})
          </button>

          {showPaidClaims && (
            <div className="claims-grid">
              {summary.paidClaims.map(forderung => (
                <div
                  key={forderung.id}
                  className="claim-item claim-paid"
                >
                  <div
                    className="claim-content clickable"
                    onClick={() => navigate(`/meine-finanzen/forderungen/${forderung.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') navigate(`/meine-finanzen/forderungen/${forderung.id}`);
                    }}
                  >
                    <div className="claim-main">
                      <h4>{forderung.beschreibung || t('finanz:claims.title')}</h4>
                      <span className="claim-id">#{forderung.forderungsnummer || forderung.id}</span>
                    </div>
                    <div className="claim-details">
                      <div className="claim-date">
                        <CalendarIcon />
                        <span>{formatDate(forderung.faelligkeit)}</span>
                      </div>
                      <div className="claim-amount">{formatCurrency(forderung.betrag)}</div>
                      <div className="claim-status">
                        <span className="status-badge status-paid">✓ {t('finanz:mitgliedFinanz.paid')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Claims Message */}
      {summary.unpaidClaims.length === 0 && summary.paidClaims.length === 0 && (!summary.unpaidEventClaims || summary.unpaidEventClaims.length === 0) && (
        <div className="empty-state">
          <div className="empty-icon"><ClaimsIcon /></div>
          <p>{t('finanz:mitgliedFinanz.noClaims')}</p>
        </div>
      )}
          </>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === 'history' && (
          <div className="finance-list-page history-tab-embedded">
            {/* Actions Bar */}
            <div className="actions-bar" style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={exportPaymentsToExcel}
                disabled={filteredZahlungen.length === 0}
              >
                <DownloadIcon />
                {t('finanz:paymentHistory.exportExcel')}
              </button>
            </div>

            {/* Filters */}
            <div className="list-filters">
              <div className="search-box">
                <SearchIcon />
                <input
                  type="text"
                  placeholder={t('finanz:paymentHistory.searchPlaceholder')}
                  value={paymentSearchTerm}
                  onChange={e => setPaymentSearchTerm(e.target.value)}
                />
              </div>
              <button
                className={`btn btn-outline filter-toggle ${showPaymentFilters ? 'active' : ''}`}
                onClick={() => setShowPaymentFilters(!showPaymentFilters)}
              >
                <FilterIcon />
                {t('finanz:paymentHistory.filters')}
              </button>
            </div>

            {/* Advanced Filters */}
            {showPaymentFilters && (
              <div className="advanced-filters">
                <div className="filter-row">
                  <div className="filter-group">
                    <label>{t('finanz:paymentHistory.dateRange')}</label>
                    <div className="date-range">
                      <DatePicker
                        selected={paymentStartDate}
                        onChange={date => setPaymentStartDate(date)}
                        selectsStart
                        startDate={paymentStartDate}
                        endDate={paymentEndDate}
                        placeholderText={t('finanz:paymentHistory.startDate')}
                        dateFormat="dd.MM.yyyy"
                        className="date-input"
                      />
                      <span className="date-separator">-</span>
                      <DatePicker
                        selected={paymentEndDate}
                        onChange={date => setPaymentEndDate(date)}
                        selectsEnd
                        startDate={paymentStartDate}
                        endDate={paymentEndDate}
                        minDate={paymentStartDate || undefined}
                        placeholderText={t('finanz:paymentHistory.endDate')}
                        dateFormat="dd.MM.yyyy"
                        className="date-input"
                      />
                    </div>
                  </div>
                  <div className="filter-group">
                    <label>{t('finanz:paymentHistory.amountRange')}</label>
                    <div className="amount-range">
                      <input
                        type="number"
                        placeholder={t('finanz:paymentHistory.minAmount')}
                        value={paymentMinAmount}
                        onChange={e => setPaymentMinAmount(e.target.value)}
                      />
                      <span className="amount-separator">-</span>
                      <input
                        type="number"
                        placeholder={t('finanz:paymentHistory.maxAmount')}
                        value={paymentMaxAmount}
                        onChange={e => setPaymentMaxAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <button className="btn btn-link clear-filters" onClick={clearPaymentFilters}>
                    <XIcon />
                    {t('finanz:paymentHistory.clearFilters')}
                  </button>
                </div>
              </div>
            )}

            {/* Payments Table */}
            {isLoadingPayments ? (
              <Loading />
            ) : (
              <div className="list-table-wrapper">
                <table className="list-table">
                  <thead>
                    <tr>
                      <th>{t('finanz:paymentHistory.paymentType')}</th>
                      <th>{t('finanz:paymentHistory.paymentDescription')}</th>
                      <th
                        className="sortable"
                        onClick={() => {
                          if (paymentSortBy === 'date') {
                            setPaymentSortOrder(paymentSortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setPaymentSortBy('date');
                            setPaymentSortOrder('desc');
                          }
                        }}
                      >
                        {t('finanz:paymentHistory.paymentDate')}
                        {paymentSortBy === 'date' && (paymentSortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th
                        className="sortable"
                        onClick={() => {
                          if (paymentSortBy === 'amount') {
                            setPaymentSortOrder(paymentSortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setPaymentSortBy('amount');
                            setPaymentSortOrder('desc');
                          }
                        }}
                      >
                        {t('finanz:paymentHistory.paymentAmount')}
                        {paymentSortBy === 'amount' && (paymentSortOrder === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th>{t('finanz:paymentHistory.paymentMethod')}</th>
                      <th>{t('finanz:paymentHistory.paymentReference')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredZahlungen.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-message">
                          {t('finanz:paymentHistory.noPayments')}
                        </td>
                      </tr>
                    ) : (
                      filteredZahlungen.map(zahlung => (
                        <tr key={`${zahlung.type}-${zahlung.id}`}>
                          <td>
                            <span className={`payment-type-badge ${zahlung.type}`}>
                              {zahlung.type === 'mitglied'
                                ? t('finanz:paymentHistory.memberPayment')
                                : t('finanz:paymentHistory.eventPayment')}
                            </span>
                          </td>
                          <td>{zahlung.description}</td>
                          <td>{formatPaymentDate(zahlung.zahlungsdatum)}</td>
                          <td className="amount-cell">{formatCurrency(zahlung.betrag)}</td>
                          <td>{zahlung.zahlungsweg || '-'}</td>
                          <td>{zahlung.referenz || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default MitgliedFinanz;

