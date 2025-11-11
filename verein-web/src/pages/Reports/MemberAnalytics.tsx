import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MitgliedDto } from '../../types/mitglied';
import { VereinDto } from '../../types/verein';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

interface VereinStats {
  vereinId: number;
  vereinName: string;
  totalMitglieder: number;
  activeMitglieder: number;
  totalVeranstaltungen: number;
  upcomingVeranstaltungen: number;
}

interface MemberAnalyticsProps {
  vereine: VereinDto[];
  allMitglieder: MitgliedDto[];
  dateRange: '30days' | '3months' | '6months' | '1year';
  selectedVereinId: number | null;
}

const MemberAnalytics: React.FC<MemberAnalyticsProps> = ({
  vereine,
  allMitglieder,
  dateRange,
  selectedVereinId,
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation('reports');

  // Calculate statistics with period comparison
  const stats = useMemo(() => {
    if (!vereine || allMitglieder.length === 0) return null;

    // Filter data based on selected verein
    const filteredMitglieder = selectedVereinId
      ? allMitglieder.filter((m: MitgliedDto) => m.vereinId === selectedVereinId)
      : allMitglieder;

    const filteredVereine = selectedVereinId
      ? vereine.filter(v => v.id === selectedVereinId)
      : vereine;

    const totalVereine = filteredVereine.length;
    const activeVereine = filteredVereine.filter(v => v.aktiv).length;
    const totalMitglieder = filteredMitglieder.length;
    const activeMitglieder = filteredMitglieder.filter((m: MitgliedDto) => m.aktiv).length;

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
    const currentPeriodRegistrations = filteredMitglieder.filter((m: MitgliedDto) =>
      m.eintrittsdatum && new Date(m.eintrittsdatum) >= currentPeriodStart
    ).length;

    // Previous period registrations
    const previousPeriodRegistrations = filteredMitglieder.filter((m: MitgliedDto) =>
      m.eintrittsdatum &&
      new Date(m.eintrittsdatum) >= previousPeriodStart &&
      new Date(m.eintrittsdatum) < previousPeriodEnd
    ).length;

    // Calculate growth rate
    const growthRate = previousPeriodRegistrations > 0
      ? ((currentPeriodRegistrations - previousPeriodRegistrations) / previousPeriodRegistrations) * 100
      : currentPeriodRegistrations > 0 ? 100 : 0;

    // Monthly trend data (January to current month)
    const monthlyData = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

    for (let month = 0; month <= currentMonth; month++) {
      const monthStart = new Date(currentYear, month, 1);
      const monthEnd = new Date(currentYear, month + 1, 0);

      const monthRegistrations = filteredMitglieder.filter((m: MitgliedDto) => {
        if (!m.eintrittsdatum) return false;
        const entryDate = new Date(m.eintrittsdatum);
        return entryDate >= monthStart && entryDate <= monthEnd;
      }).length;

      monthlyData.push({
        month: monthNames[month],
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

    filteredMitglieder.forEach((m: MitgliedDto) => {
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
      male: filteredMitglieder.filter((m: MitgliedDto) => m.geschlechtId === 1).length,
      female: filteredMitglieder.filter((m: MitgliedDto) => m.geschlechtId === 2).length,
      other: filteredMitglieder.filter((m: MitgliedDto) => !m.geschlechtId || (m.geschlechtId !== 1 && m.geschlechtId !== 2)).length,
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
  }, [vereine, allMitglieder, dateRange, selectedVereinId]);

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
        totalVeranstaltungen: 0,
        upcomingVeranstaltungen: 0,
      };
    });
  }, [vereine, allMitglieder]);

  if (!stats) {
    return <div>{t('noData')}</div>;
  }

  return (
    <>
      {/* Overall Statistics */}
      <div className="stats-section">
        <h2>{t('admin.overallStats.title')}</h2>
        <div className="stats-grid">
          {!selectedVereinId && (
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
          )}

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
              <h3>{t('memberAnalytics.newRegistrations')}</h3>
              <div className="stat-number">{stats.currentPeriodRegistrations}</div>
              <span className="stat-detail">
                {dateRange === '30days' ? t('memberAnalytics.last30Days') : dateRange === '3months' ? t('memberAnalytics.last3Months') : dateRange === '6months' ? t('memberAnalytics.last6Months') : t('memberAnalytics.last1Year')}
              </span>
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
        <h2>{t('memberAnalytics.monthlyTrend')}</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyData} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                style={{ fontSize: '0.7rem' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#666" style={{ fontSize: '0.875rem' }} />
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
                name={t('memberAnalytics.newRegistrationsLabel')}
                dot={{ fill: '#2196F3', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Growth Chart */}
      <div className="chart-section">
        <h2>{t('memberAnalytics.cumulativeGrowth')}</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.monthlyData} margin={{ bottom: 60 }}>
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
                style={{ fontSize: '0.7rem' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#666" style={{ fontSize: '0.875rem' }} />
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
                name={t('memberAnalytics.totalMembers')}
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

      {/* Gender Distribution - Redesigned */}
      <div className="chart-section">
        <h2>{t('admin.genderDistribution.title')}</h2>
        <div className="gender-distribution-container">
          <div className="gender-item">
            <div className="gender-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MaleIcon /> {t('admin.genderDistribution.male')}
              </span>
              <span className="gender-value">
                {stats.genderDistribution.male} ({stats.totalMitglieder > 0 ? Math.round((stats.genderDistribution.male / stats.totalMitglieder) * 100) : 0}%)
              </span>
            </div>
            <div className="gender-bar-bg">
              <div
                className="gender-bar-fill male-fill"
                style={{ width: `${stats.totalMitglieder > 0 ? Math.round((stats.genderDistribution.male / stats.totalMitglieder) * 100) : 0}%` }}
              />
            </div>
          </div>

          <div className="gender-item">
            <div className="gender-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FemaleIcon /> {t('admin.genderDistribution.female')}
              </span>
              <span className="gender-value">
                {stats.genderDistribution.female} ({stats.totalMitglieder > 0 ? Math.round((stats.genderDistribution.female / stats.totalMitglieder) * 100) : 0}%)
              </span>
            </div>
            <div className="gender-bar-bg">
              <div
                className="gender-bar-fill female-fill"
                style={{ width: `${stats.totalMitglieder > 0 ? Math.round((stats.genderDistribution.female / stats.totalMitglieder) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Per-Verein Statistics */}
      <div className="charts-grid-single">
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
    </>
  );
};

export default MemberAnalytics;

