/**
 * Finanz Dashboard - Enhanced Version
 * Advanced financial analytics with KPIs, charts, and insights
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  mitgliedForderungService,
  mitgliedZahlungService,
  bankBuchungService,
} from '../../services/finanzService';
import { mitgliedService } from '../../services/mitgliedService';
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

  // Get vereinId based on user type
  const vereinId = useMemo(() => {
    if (user?.type === 'dernek') return user.vereinId;
    return null; // Admin sees all
  }, [user]);

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
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

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
        month: monthNames[date.getMonth()],
        gelir: Math.round(monthPayments),
        alacak: Math.round(monthClaims),
      });
    }
    return data;
  }, [zahlungen, forderungen]);

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

  // Colors for pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const isLoading = forderungenLoading || zahlungenLoading || bankBuchungenLoading;

  if (isLoading) return <Loading />;

  // Export to Excel function
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Finans Özeti', ''],
      ['', ''],
      ['Toplam Alacak', stats.totalForderungen],
      ['Toplam Alacak Tutarı', `€${stats.totalForderungsBetrag.toFixed(2)}`],
      ['Ödenen Alacaklar', stats.bezahlteForderungen],
      ['Ödenen Tutar', `€${stats.bezahlteForderungenBetrag.toFixed(2)}`],
      ['Açık Alacaklar', stats.offeneForderungen],
      ['Açık Tutar', `€${stats.offeneForderungenBetrag.toFixed(2)}`],
      ['Gecikmiş Ödemeler', stats.overdueForderungenCount],
      ['Gecikmiş Tutar', `€${stats.overdueForderungenBetrag.toFixed(2)}`],
      ['', ''],
      ['Tahsilat Oranı', `${stats.collectionRate.toFixed(1)}%`],
      ['Ortalama Ödeme Süresi', `${stats.avgPaymentDays.toFixed(0)} gün`],
      ['Beklenen Gelir (Bu Ay)', `€${stats.expectedRevenue.toFixed(2)}`],
      ['Nakit Pozisyonu', `€${stats.cashPosition.toFixed(2)}`],
      ['Üye Başına Ortalama Gelir', `€${stats.arpu.toFixed(2)}`],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Özet');

    // Monthly Data Sheet
    const ws2 = XLSX.utils.json_to_sheet(monthlyRevenueData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Aylık Veriler');

    // Payment Methods Sheet
    const ws3 = XLSX.utils.json_to_sheet(paymentMethodsData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Ödeme Yöntemleri');

    XLSX.writeFile(wb, `Finans_Raporu_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="finanz-dashboard">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:dashboard.title')}</h1>
        <button className="btn btn-primary" onClick={exportToExcel}>
          <DownloadIcon />
          Excel'e Aktar
        </button>
      </div>

      {/* Main Stats Grid - 4 columns */}
      <div className="stats-grid">
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
      </div>

      {/* Advanced KPIs Grid - 6 new cards */}
      <div className="stats-grid stats-grid-advanced">
        <StatCard
          title="Tahsilat Oranı"
          value={`${stats.collectionRate.toFixed(1)}%`}
          icon={<PercentIcon />}
          color={stats.collectionRate >= 80 ? 'success' : stats.collectionRate >= 60 ? 'warning' : 'error'}
          subtitle="Ödeme başarı oranı"
        />
        <StatCard
          title="Ortalama Ödeme Süresi"
          value={`${Math.abs(stats.avgPaymentDays).toFixed(0)}`}
          icon={<ClockIcon />}
          color={stats.avgPaymentDays <= 0 ? 'success' : stats.avgPaymentDays <= 7 ? 'warning' : 'error'}
          subtitle={stats.avgPaymentDays <= 0 ? 'Zamanında' : 'Gün gecikme'}
        />
        <StatCard
          title="Gecikmiş Ödemeler"
          value={stats.overdueForderungenCount}
          icon={<AlertCircleIcon />}
          color={stats.overdueForderungenCount === 0 ? 'success' : 'error'}
          subtitle={`€ ${stats.overdueForderungenBetrag.toFixed(2)}`}
        />
        <StatCard
          title="Beklenen Gelir (Bu Ay)"
          value={`€ ${stats.expectedRevenue.toFixed(0)}`}
          icon={<DollarSignIcon />}
          color="primary"
          subtitle="Vadesi bu ay"
        />
        <StatCard
          title="Nakit Pozisyonu"
          value={`€ ${Math.abs(stats.cashPosition).toFixed(0)}`}
          icon={<WalletIcon />}
          color={stats.cashPosition >= 0 ? 'success' : 'warning'}
          subtitle={stats.cashPosition >= 0 ? 'Pozitif' : 'Negatif'}
        />
        <StatCard
          title="Üye Başına Gelir (ARPU)"
          value={`€ ${stats.arpu.toFixed(2)}`}
          icon={<UsersIcon />}
          color="primary"
          subtitle={`${stats.activeMitglieder} aktif üye`}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Revenue Trend */}
        <div className="chart-section chart-section-large">
          <h2>Aylık Gelir Trendi (Son 12 Ay)</h2>
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
                  name="Gelir"
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="alacak"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Alacak"
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="chart-section">
          <h2>Ödeme Yöntemleri Dağılımı</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `€${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bank Transactions Summary */}
      <div className="dashboard-section">
        <h2>{t('finanz:dashboard.bankTransactions')}</h2>
        <div className="section-content">
          <p className="section-stat">
            {t('finanz:dashboard.totalTransactions')}: <strong>{stats.totalBankBuchungen}</strong>
          </p>
          <p className="section-stat">
            {t('finanz:dashboard.totalAmount')}: <strong>€ {stats.totalBankBetrag.toFixed(2)}</strong>
          </p>
        </div>
      </div>

      {/* Info Message */}
      <div className="dashboard-info">
        <p>{t('finanz:dashboard.info')}</p>
        <p style={{ marginTop: '8px', fontSize: '0.875rem', opacity: 0.8 }}>
          💡 Tahsilat oranınız {stats.collectionRate.toFixed(1)}%,
          {stats.overdueForderungenCount > 0
            ? ` ${stats.overdueForderungenCount} gecikmiş ödeme var.`
            : ' tüm ödemeler güncel!'}
        </p>
      </div>
    </div>
  );
};

export default FinanzDashboard;

