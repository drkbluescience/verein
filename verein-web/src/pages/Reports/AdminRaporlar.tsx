import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import { veranstaltungService } from '../../services/veranstaltungService';
import Loading from '../../components/Common/Loading';
import { MitgliedDto } from '../../types/mitglied';
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

const AdminRaporlar: React.FC = () => {
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

  // Calculate statistics
  const stats = useMemo(() => {
    if (!vereine || allMitglieder.length === 0) return null;

    const totalVereine = vereine.length;
    const activeVereine = vereine.filter(v => v.aktiv).length;
    const totalMitglieder = allMitglieder.length;
    const activeMitglieder = allMitglieder.filter((m: MitgliedDto) => m.aktiv).length;

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

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = allMitglieder.filter((m: MitgliedDto) =>
      m.eintrittsdatum && new Date(m.eintrittsdatum) >= thirtyDaysAgo
    ).length;

    return {
      totalVereine,
      activeVereine,
      totalMitglieder,
      activeMitglieder,
      ageGroups,
      genderDistribution,
      recentRegistrations,
    };
  }, [vereine, allMitglieder]);

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

  if (vereineLoading || mitgliederLoading) {
    return <Loading text="Raporlar yükleniyor..." />;
  }

  if (!stats) {
    return <div>Veri yüklenemedi</div>;
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Genel Raporlar</h1>
        <p>Tüm dernekler için özet istatistikler</p>
      </div>

      {/* Overall Statistics */}
      <div className="stats-section">
        <h2>Genel İstatistikler</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Building2Icon />
            </div>
            <div className="stat-info">
              <h3>Toplam Dernek</h3>
              <div className="stat-number">{stats.totalVereine}</div>
              <span className="stat-detail">{stats.activeVereine} aktif</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <UsersIcon />
            </div>
            <div className="stat-info">
              <h3>Toplam Üye</h3>
              <div className="stat-number">{stats.totalMitglieder}</div>
              <span className="stat-detail">{stats.activeMitglieder} aktif</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUpIcon />
            </div>
            <div className="stat-info">
              <h3>Son 30 Gün</h3>
              <div className="stat-number">{stats.recentRegistrations}</div>
              <span className="stat-detail">Yeni üye kaydı</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <BarChartIcon />
            </div>
            <div className="stat-info">
              <h3>Ortalama</h3>
              <div className="stat-number">
                {stats.totalVereine > 0 ? Math.round(stats.totalMitglieder / stats.totalVereine) : 0}
              </div>
              <span className="stat-detail">Dernek başına üye</span>
            </div>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="chart-section">
        <h2>Yaş Dağılımı</h2>
        <div className="chart-container">
          {Object.entries(stats.ageGroups).map(([group, count]) => {
            const percentage = stats.totalMitglieder > 0 
              ? Math.round((count / stats.totalMitglieder) * 100) 
              : 0;
            return (
              <div key={group} className="chart-bar-item">
                <div className="chart-label">
                  <span>{group} yaş</span>
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
        <h2>Cinsiyet Dağılımı</h2>
        <div className="chart-container">
          <div className="chart-bar-item">
            <div className="chart-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MaleIcon /> Erkek
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
                <FemaleIcon /> Kadın
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
        <h2>Dernek Bazlı İstatistikler</h2>
        <div className="table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Dernek Adı</th>
                <th>Toplam Üye</th>
                <th>Aktif Üye</th>
                <th>Aktif Oran</th>
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
  );
};

export default AdminRaporlar;

