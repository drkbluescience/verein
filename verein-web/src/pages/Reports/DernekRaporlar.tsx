import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import { veranstaltungService } from '../../services/veranstaltungService';
import Loading from '../../components/Common/Loading';
import { MitgliedDto } from '../../types/mitglied';
import { VeranstaltungDto } from '../../types/veranstaltung';
import './Reports.css';

// Professional SVG Icons
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
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

const DernekRaporlar: React.FC = () => {
  const { user } = useAuth();
  const vereinId = user?.vereinId || 0;

  // Fetch verein details
  const { data: verein, isLoading: vereinLoading } = useQuery({
    queryKey: ['verein', vereinId],
    queryFn: () => vereinService.getById(vereinId),
    enabled: !!vereinId,
  });

  // Fetch mitglieder for this verein
  const { data: mitglieder, isLoading: mitgliederLoading } = useQuery({
    queryKey: ['mitglieder', vereinId],
    queryFn: () => mitgliedService.getByVereinId(vereinId, false),
    enabled: !!vereinId,
  });

  // Fetch veranstaltungen for this verein
  const { data: veranstaltungen, isLoading: veranstaltungenLoading } = useQuery({
    queryKey: ['veranstaltungen', vereinId],
    queryFn: () => veranstaltungService.getByVereinId(vereinId),
    enabled: !!vereinId,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!mitglieder || !veranstaltungen) return null;

    const totalMitglieder = mitglieder.length;
    const activeMitglieder = mitglieder.filter((m: MitgliedDto) => m.aktiv).length;
    const totalVeranstaltungen = veranstaltungen.length;

    const now = new Date();
    const upcomingVeranstaltungen = veranstaltungen.filter((v: VeranstaltungDto) =>
      new Date(v.startdatum) > now
    ).length;

    // Age distribution
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-45': 0,
      '46-60': 0,
      '60+': 0,
    };

    mitglieder.forEach((m: MitgliedDto) => {
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
      male: mitglieder.filter((m: MitgliedDto) => m.geschlechtId === 1).length,
      female: mitglieder.filter((m: MitgliedDto) => m.geschlechtId === 2).length,
      other: mitglieder.filter((m: MitgliedDto) => !m.geschlechtId || (m.geschlechtId !== 1 && m.geschlechtId !== 2)).length,
    };

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = mitglieder.filter((m: MitgliedDto) =>
      m.eintrittsdatum && new Date(m.eintrittsdatum) >= thirtyDaysAgo
    ).length;

    // Monthly registrations (last 6 months)
    const monthlyRegistrations: { [key: string]: number } = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRegistrations[monthKey] = 0;
    }

    mitglieder.forEach((m: MitgliedDto) => {
      if (m.eintrittsdatum) {
        const date = new Date(m.eintrittsdatum);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyRegistrations.hasOwnProperty(monthKey)) {
          monthlyRegistrations[monthKey]++;
        }
      }
    });

    // Upcoming events (next 30 days)
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const upcomingEvents = veranstaltungen
      .filter((v: VeranstaltungDto) => {
        const eventDate = new Date(v.startdatum);
        return eventDate > now && eventDate <= thirtyDaysLater;
      })
      .sort((a: VeranstaltungDto, b: VeranstaltungDto) => new Date(a.startdatum).getTime() - new Date(b.startdatum).getTime())
      .slice(0, 5);

    return {
      totalMitglieder,
      activeMitglieder,
      totalVeranstaltungen,
      upcomingVeranstaltungen,
      ageGroups,
      genderDistribution,
      recentRegistrations,
      monthlyRegistrations,
      upcomingEvents,
    };
  }, [mitglieder, veranstaltungen]);

  if (vereinLoading || mitgliederLoading || veranstaltungenLoading) {
    return <Loading text="Raporlar yükleniyor..." />;
  }

  if (!stats || !verein) {
    return <div>Veri yüklenemedi</div>;
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>{verein.name} - Raporlar</h1>
        <p>Derneğinizin detaylı istatistikleri</p>
      </div>

      {/* Overall Statistics */}
      <div className="stats-section">
        <h2>Genel Bakış</h2>
        <div className="stats-grid">
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
              <CalendarIcon />
            </div>
            <div className="stat-info">
              <h3>Toplam Etkinlik</h3>
              <div className="stat-number">{stats.totalVeranstaltungen}</div>
              <span className="stat-detail">{stats.upcomingVeranstaltungen} yaklaşan</span>
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
              <CheckCircleIcon />
            </div>
            <div className="stat-info">
              <h3>Aktif Oran</h3>
              <div className="stat-number">
                {stats.totalMitglieder > 0
                  ? Math.round((stats.activeMitglieder / stats.totalMitglieder) * 100)
                  : 0}%
              </div>
              <span className="stat-detail">Aktif üye oranı</span>
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

      {/* Monthly Trend */}
      <div className="chart-section">
        <h2>Aylık Üye Kayıt Trendi (Son 6 Ay)</h2>
        <div className="chart-container">
          {Object.entries(stats.monthlyRegistrations).map(([month, count]) => {
            const maxCount = Math.max(...Object.values(stats.monthlyRegistrations), 1);
            const percentage = Math.round((count / maxCount) * 100);
            const [year, monthNum] = month.split('-');
            const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
            const monthName = monthNames[parseInt(monthNum) - 1];
            
            return (
              <div key={month} className="chart-bar-item">
                <div className="chart-label">
                  <span>{monthName} {year}</span>
                  <span className="chart-value">{count} üye</span>
                </div>
                <div className="chart-bar-bg">
                  <div 
                    className="chart-bar-fill chart-bar-trend" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      {stats.upcomingEvents.length > 0 && (
        <div className="table-section">
          <h2>Yaklaşan Etkinlikler (30 Gün)</h2>
          <div className="table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Etkinlik Adı</th>
                  <th>Tarih</th>
                  <th>Kayıt</th>
                  <th>Üye</th>
                </tr>
              </thead>
              <tbody>
                {stats.upcomingEvents.map((event: VeranstaltungDto) => (
                  <tr key={event.id}>
                    <td><strong>{event.titel}</strong></td>
                    <td>{new Date(event.startdatum).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <span className={`badge ${event.anmeldeErforderlich ? 'badge-required' : 'badge-optional'}`}>
                        {event.anmeldeErforderlich ? 'Gerekli' : 'Opsiyonel'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${event.nurFuerMitglieder ? 'badge-members' : 'badge-public'}`}>
                        {event.nurFuerMitglieder ? 'Sadece Üye' : 'Herkese Açık'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DernekRaporlar;

