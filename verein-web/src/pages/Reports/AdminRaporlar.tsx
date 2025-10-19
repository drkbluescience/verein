import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import { veranstaltungService } from '../../services/veranstaltungService';
import Loading from '../../components/Common/Loading';
import { MitgliedDto } from '../../types/mitglied';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Reports.css';

// Professional SVG Icons
const Building2Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
    <path d="M10 6h4"/>
    <path d="M10 10h4"/>
    <path d="M10 14h4"/>
    <path d="M10 18h4"/>
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const BarChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="20" y2="10"/>
    <line x1="18" x2="18" y1="20" y2="4"/>
    <line x1="6" x2="6" y1="20" y2="16"/>
  </svg>
);

const MaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="6"/>
    <line x1="14.5" x2="21" y1="9.5" y2="3"/>
    <line x1="15" x2="21" y1="3" y2="3"/>
    <line x1="21" x2="21" y1="3" y2="9"/>
  </svg>
);

const FemaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <line x1="12" x2="12" y1="14" y2="21"/>
    <line x1="8" x2="16" y1="18" y2="18"/>
  </svg>
);

const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const TrendDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
);

const TrendNeutralIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

interface VereinStats {
  vereinId: number;
  vereinName: string;
  totalMitglieder: number;
  activeMitglieder: number;
  totalVeranstaltungen: number;
  upcomingVeranstaltungen: number;
}

const AdminRaporlar: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation('reports');
  const [dateRange, setDateRange] = useState<'30days' | '3months' | '6months' | '1year'>('30days');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch all vereine
  const { data: vereine, isLoading: vereineLoading } = useQuery({
    queryKey: ['vereine'],
    queryFn: vereinService.getAll,
  });

  // Fetch all mitglieder (using large page size to get all)
  const { data: mitgliederData, isLoading: mitgliederLoading } = useQuery({
    queryKey: ['all-mitglieder'],
    queryFn: () => mitgliedService.getAll({ pageNumber: 1, pageSize: 10000 }),
  });

  const allMitglieder = mitgliederData?.items || [];

  // Calculate statistics with period comparison
  const stats = useMemo(() => {
    if (!vereine || allMitglieder.length === 0) return null;

    const now = new Date();
    const totalVereine = vereine.length;
    const activeVereine = vereine.filter(v => v.aktiv).length;
    const totalMitglieder = allMitglieder.length;
    const activeMitglieder = allMitglieder.filter((m: MitgliedDto) => m.aktiv).length;

    // Calculate date ranges based on selection
    const getDaysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    };

    const currentPeriodDays = dateRange === '30days' ? 30 : dateRange === '3months' ? 90 : dateRange === '6months' ? 180 : 365;
    const currentPeriodStart = getDaysAgo(currentPeriodDays);
    const previousPeriodStart = getDaysAgo(currentPeriodDays * 2);
    const previousPeriodEnd = currentPeriodStart;

    // Current period registrations
    const currentPeriodRegistrations = allMitglieder.filter((m: MitgliedDto) =>
      m.eintrittsdatum && new Date(m.eintrittsdatum) >= currentPeriodStart
    ).length;

    // Previous period registrations
    const previousPeriodRegistrations = allMitglieder.filter((m: MitgliedDto) =>
      m.eintrittsdatum &&
      new Date(m.eintrittsdatum) >= previousPeriodStart &&
      new Date(m.eintrittsdatum) < previousPeriodEnd
    ).length;

    // Calculate growth rate
    const growthRate = previousPeriodRegistrations > 0
      ? ((currentPeriodRegistrations - previousPeriodRegistrations) / previousPeriodRegistrations) * 100
      : currentPeriodRegistrations > 0 ? 100 : 0;

    // Monthly trend data (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthRegistrations = allMitglieder.filter((m: MitgliedDto) => {
        if (!m.eintrittsdatum) return false;
        const entryDate = new Date(m.eintrittsdatum);
        return entryDate >= monthStart && entryDate <= monthEnd;
      }).length;

      const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      monthlyData.push({
        month: monthNames[date.getMonth()],
        registrations: monthRegistrations,
        cumulative: 0, // Will be calculated below
      });
    }

    // Calculate cumulative
    let cumulative = totalMitglieder - currentPeriodRegistrations;
    monthlyData.forEach(data => {
      cumulative += data.registrations;
      data.cumulative = cumulative;
    });

    // Age distribution
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-45': 0,
      '46-60': 0,
      '60+': 0,
    };

    allMitglieder.forEach((m: MitgliedDto) => {
      if (m.geburtsdatum) {
        const age = new Date().getFullYear() - new Date(m.geburtsdatum).getFullYear();
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 30) ageGroups['19-30']++;
        else if (age <= 45) ageGroups['31-45']++;
        else if (age <= 60) ageGroups['46-60']++;
        else ageGroups['60+']++;
      }
    });

    // Gender distribution
    const genderDistribution = {
      male: allMitglieder.filter((m: MitgliedDto) => m.geschlechtId === 1).length,
      female: allMitglieder.filter((m: MitgliedDto) => m.geschlechtId === 2).length,
      other: allMitglieder.filter((m: MitgliedDto) => !m.geschlechtId || (m.geschlechtId !== 1 && m.geschlechtId !== 2)).length,
    };

    return {
      totalVereine,
      activeVereine,
      totalMitglieder,
      activeMitglieder,
      ageGroups,
      genderDistribution,
      currentPeriodRegistrations,
      previousPeriodRegistrations,
      growthRate,
      monthlyData,
    };
  }, [vereine, allMitglieder, dateRange]);

  // Calculate per-verein statistics
  const vereinStats = useMemo((): VereinStats[] => {
    if (!vereine || allMitglieder.length === 0) return [];

    return vereine.map(verein => {
      const vereinMitglieder = allMitglieder.filter((m: MitgliedDto) => m.vereinId === verein.id);

      return {
        vereinId: verein.id,
        vereinName: verein.name,
        totalMitglieder: vereinMitglieder.length,
        activeMitglieder: vereinMitglieder.filter((m: MitgliedDto) => m.aktiv).length,
        totalVeranstaltungen: 0, // Will be updated when we fetch veranstaltungen
        upcomingVeranstaltungen: 0,
      };
    });
  }, [vereine, allMitglieder]);

  // PDF Export function
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('reports-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`admin-raporlar-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsExporting(false);
    }
  };

  // Trend badge component
  const TrendBadge: React.FC<{ value: number }> = ({ value }) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const isNeutral = value === 0;

    return (
      <span className={`stat-trend ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
        {isPositive && <TrendUpIcon />}
        {isNegative && <TrendDownIcon />}
        {isNeutral && <TrendNeutralIcon />}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  if (vereineLoading || mitgliederLoading) {
    return <Loading text={t('loading')} />;
  }

  if (!stats) {
    return <div>{t('noData')}</div>;
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>{t('admin.title')}</h1>
        <p>{t('admin.subtitle')}</p>
      </div>

      {/* Toolbar */}
      <div className="reports-toolbar">
        <div className="toolbar-left">
          <div className="date-range-selector">
            <label>Dönem:</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value as any)}>
              <option value="30days">Son 30 Gün</option>
              <option value="3months">Son 3 Ay</option>
              <option value="6months">Son 6 Ay</option>
              <option value="1year">Son 1 Yıl</option>
            </select>
          </div>
        </div>
        <div className="toolbar-right">
          <button
            className="export-button"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <DownloadIcon />
            {isExporting ? 'Dışa Aktarılıyor...' : 'PDF İndir'}
          </button>
        </div>
      </div>

      <div id="reports-content">
        {/* Overall Statistics */}
        <div className="stats-section">
          <h2>{t('admin.overallStats.title')}</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Building2Icon />
              </div>
              <div className="stat-info">
                <h3>{t('admin.overallStats.totalVereine')}</h3>
                <div className="stat-number">{stats.totalVereine}</div>
                <span className="stat-detail">{stats.activeVereine} {t('admin.overallStats.active')}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <UsersIcon />
              </div>
              <div className="stat-info">
                <h3>{t('admin.overallStats.totalMembers')}</h3>
                <div className="stat-number">{stats.totalMitglieder}</div>
                <span className="stat-detail">{stats.activeMitglieder} {t('admin.overallStats.active')}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUpIcon />
              </div>
              <div className="stat-info">
                <h3>Yeni Kayıtlar ({dateRange === '30days' ? '30 Gün' : dateRange === '3months' ? '3 Ay' : dateRange === '6months' ? '6 Ay' : '1 Yıl'})</h3>
                <div className="stat-number">{stats.currentPeriodRegistrations}</div>
                <TrendBadge value={stats.growthRate} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <BarChartIcon />
              </div>
              <div className="stat-info">
                <h3>{t('admin.overallStats.average')}</h3>
                <div className="stat-number">
                  {stats.totalVereine > 0 ? Math.round(stats.totalMitglieder / stats.totalVereine) : 0}
                </div>
                <span className="stat-detail">{t('admin.overallStats.membersPerVerein')}</span>
              </div>
            </div>
          </div>
        </div>

      {/* Monthly Trend Chart */}
      <div className="chart-section">
        <h2>Aylık Üye Kayıt Trendi</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: '0.875rem' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#2196F3"
                strokeWidth={2}
                name="Yeni Kayıtlar"
                dot={{ fill: '#2196F3', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Growth Chart */}
      <div className="chart-section">
        <h2>Kümülatif Üye Artışı</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.monthlyData}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: '0.875rem' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#4CAF50"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCumulative)"
                name="Toplam Üye"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="chart-section">
        <h2>{t('admin.ageDistribution.title')}</h2>
        <div className="chart-container">
          {Object.entries(stats.ageGroups).map(([group, count]) => {
            const percentage = stats.totalMitglieder > 0
              ? Math.round((count / stats.totalMitglieder) * 100)
              : 0;
            return (
              <div key={group} className="chart-bar-item">
                <div className="chart-label">
                  <span>{group} {t('admin.ageDistribution.years')}</span>
                  <span className="chart-value">{count} ({percentage}%)</span>
                </div>
                <div className="chart-bar-bg">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="chart-section">
        <h2>{t('admin.genderDistribution.title')}</h2>
        <div className="chart-container">
          <div className="chart-bar-item">
            <div className="chart-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MaleIcon /> {t('admin.genderDistribution.male')}
              </span>
              <span className="chart-value">
                {stats.genderDistribution.male} (
                {stats.totalMitglieder > 0
                  ? Math.round((stats.genderDistribution.male / stats.totalMitglieder) * 100)
                  : 0}%)
              </span>
            </div>
            <div className="chart-bar-bg">
              <div
                className="chart-bar-fill chart-bar-male"
                style={{
                  width: `${stats.totalMitglieder > 0
                    ? (stats.genderDistribution.male / stats.totalMitglieder) * 100
                    : 0}%`
                }}
              />
            </div>
          </div>

          <div className="chart-bar-item">
            <div className="chart-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FemaleIcon /> {t('admin.genderDistribution.female')}
              </span>
              <span className="chart-value">
                {stats.genderDistribution.female} (
                {stats.totalMitglieder > 0
                  ? Math.round((stats.genderDistribution.female / stats.totalMitglieder) * 100)
                  : 0}%)
              </span>
            </div>
            <div className="chart-bar-bg">
              <div
                className="chart-bar-fill chart-bar-female"
                style={{
                  width: `${stats.totalMitglieder > 0
                    ? (stats.genderDistribution.female / stats.totalMitglieder) * 100
                    : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Per-Verein Statistics */}
      <div className="table-section">
        <h2>{t('admin.vereinStats.title')}</h2>
        <div className="table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>{t('admin.vereinStats.vereinName')}</th>
                <th>{t('admin.vereinStats.totalMembers')}</th>
                <th>{t('admin.vereinStats.activeMembers')}</th>
                <th>{t('admin.vereinStats.activeRate')}</th>
              </tr>
            </thead>
            <tbody>
              {vereinStats.map(stat => (
                <tr key={stat.vereinId}>
                  <td><strong>{stat.vereinName}</strong></td>
                  <td>{stat.totalMitglieder}</td>
                  <td>{stat.activeMitglieder}</td>
                  <td>
                    <span className="percentage-badge">
                      {stat.totalMitglieder > 0 
                        ? Math.round((stat.activeMitglieder / stat.totalMitglieder) * 100) 
                        : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminRaporlar;

