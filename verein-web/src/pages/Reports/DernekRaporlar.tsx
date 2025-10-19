import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { vereinService } from '../../services/vereinService';
import { mitgliedService } from '../../services/mitgliedService';
import { veranstaltungService } from '../../services/veranstaltungService';
import Loading from '../../components/Common/Loading';
import { MitgliedDto } from '../../types/mitglied';
import { VeranstaltungDto } from '../../types/veranstaltung';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

const DernekRaporlar: React.FC = () => {
  const { user } = useAuth();
  const vereinId = user?.vereinId || 0;
  const [dateRange, setDateRange] = useState<'30days' | '3months' | '6months' | '1year'>('30days');
  const [isExporting, setIsExporting] = useState(false);

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

  // Calculate statistics with period comparison
  const stats = useMemo(() => {
    if (!mitglieder || !veranstaltungen) return null;

    const now = new Date();
    const totalMitglieder = mitglieder.length;
    const activeMitglieder = mitglieder.filter((m: MitgliedDto) => m.aktiv).length;
    const totalVeranstaltungen = veranstaltungen.length;
    const upcomingVeranstaltungen = veranstaltungen.filter((v: VeranstaltungDto) =>
      new Date(v.startdatum) > now
    ).length;

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
    const currentPeriodRegistrations = mitglieder.filter((m: MitgliedDto) =>
      m.eintrittsdatum && new Date(m.eintrittsdatum) >= currentPeriodStart
    ).length;

    // Previous period registrations
    const previousPeriodRegistrations = mitglieder.filter((m: MitgliedDto) =>
      m.eintrittsdatum &&
      new Date(m.eintrittsdatum) >= previousPeriodStart &&
      new Date(m.eintrittsdatum) < previousPeriodEnd
    ).length;

    // Calculate growth rate
    const growthRate = previousPeriodRegistrations > 0
      ? ((currentPeriodRegistrations - previousPeriodRegistrations) / previousPeriodRegistrations) * 100
      : currentPeriodRegistrations > 0 ? 100 : 0;

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

    // Monthly registrations (last 12 months) - converted to array for Recharts
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthRegistrations = mitglieder.filter((m: MitgliedDto) => {
        if (!m.eintrittsdatum) return false;
        const entryDate = new Date(m.eintrittsdatum);
        return entryDate >= monthStart && entryDate <= monthEnd;
      }).length;

      const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      monthlyData.push({
        month: monthNames[date.getMonth()],
        registrations: monthRegistrations,
      });
    }

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
      currentPeriodRegistrations,
      previousPeriodRegistrations,
      growthRate,
      monthlyData,
      upcomingEvents,
    };
  }, [mitglieder, veranstaltungen, dateRange]);

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
      pdf.save(`dernek-raporlar-${new Date().toISOString().split('T')[0]}.pdf`);
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
                <h3>Yeni Kayıtlar ({dateRange === '30days' ? '30 Gün' : dateRange === '3months' ? '3 Ay' : dateRange === '6months' ? '6 Ay' : '1 Yıl'})</h3>
                <div className="stat-number">{stats.currentPeriodRegistrations}</div>
                <TrendBadge value={stats.growthRate} />
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
    </div>
  );
};

export default DernekRaporlar;

