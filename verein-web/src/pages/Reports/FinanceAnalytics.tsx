import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VereinDto } from '../../types/verein';
import { MitgliedDto } from '../../types/mitglied';
import { MitgliedForderungDto, MitgliedZahlungDto } from '../../types/finanz.types';
import { mitgliedForderungService, mitgliedZahlungService } from '../../services/finanzService';
import Loading from '../../components/Common/Loading';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import './Reports.css';

// Professional SVG Icons
const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const TrendingDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/>
    <polyline points="16 17 22 17 22 11"/>
  </svg>
);

const DollarSignIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const PercentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

interface FinanceAnalyticsProps {
  vereine: VereinDto[];
  allMitglieder: MitgliedDto[];
  selectedVereinId: number | null;
}

const FinanceAnalytics: React.FC<FinanceAnalyticsProps> = ({
  vereine,
  allMitglieder,
  selectedVereinId,
}) => {
  // Fetch financial data
  const { data: forderungen, isLoading: forderungenLoading } = useQuery({
    queryKey: ['all-forderungen'],
    queryFn: mitgliedForderungService.getAll,
  });

  const { data: zahlungen, isLoading: zahlungenLoading } = useQuery({
    queryKey: ['all-zahlungen'],
    queryFn: mitgliedZahlungService.getAll,
  });

  // Normalize data
  const allForderungen = useMemo((): MitgliedForderungDto[] => {
    if (!forderungen) return [];
    return forderungen;
  }, [forderungen]);

  const allZahlungen = useMemo((): MitgliedZahlungDto[] => {
    if (!zahlungen) return [];
    return zahlungen;
  }, [zahlungen]);

  // Calculate overall financial KPIs
  const financialKPIs = useMemo(() => {
    const totalRevenue = allZahlungen.reduce((sum: number, z: MitgliedZahlungDto) => sum + z.betrag, 0);
    const totalClaims = allForderungen.reduce((sum: number, f: MitgliedForderungDto) => sum + f.betrag, 0);
    const paidClaims = allForderungen.filter((f: MitgliedForderungDto) => f.statusId === 1).reduce((sum: number, f: MitgliedForderungDto) => sum + f.betrag, 0);
    const collectionRate = totalClaims > 0 ? (paidClaims / totalClaims) * 100 : 0;
    const netProfit = totalRevenue - totalClaims;
    
    // Calculate YoY growth (simplified - comparing last 6 months vs previous 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const recentRevenue = allZahlungen.filter((z: MitgliedZahlungDto) => new Date(z.zahlungsdatum) >= sixMonthsAgo)
      .reduce((sum: number, z: MitgliedZahlungDto) => sum + z.betrag, 0);
    const previousRevenue = allZahlungen.filter((z: MitgliedZahlungDto) => {
      const date = new Date(z.zahlungsdatum);
      return date >= twelveMonthsAgo && date < sixMonthsAgo;
    }).reduce((sum: number, z: MitgliedZahlungDto) => sum + z.betrag, 0);

    const growthRate = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalClaims,
      netProfit,
      collectionRate,
      growthRate,
    };
  }, [allForderungen, allZahlungen]);

  // Calculate per-verein financial performance
  const vereinFinanceStats = useMemo(() => {
    if (!vereine || allForderungen.length === 0) return [];

    // Filter by selected verein if applicable
    const filteredVereine = selectedVereinId
      ? vereine.filter((v: VereinDto) => v.id === selectedVereinId)
      : vereine;

    return filteredVereine.map(verein => {
      // Get mitglieder for this verein
      const vereinMitglieder = allMitglieder.filter((m: MitgliedDto) => m.vereinId === verein.id);
      const vereinMitgliederIds = vereinMitglieder.map((m: MitgliedDto) => m.id);

      // Get forderungen for this verein's mitglieder
      const vereinForderungen = allForderungen.filter((f: MitgliedForderungDto) => vereinMitgliederIds.includes(f.mitgliedId));
      const vereinZahlungen = allZahlungen.filter((z: MitgliedZahlungDto) => vereinMitgliederIds.includes(z.mitgliedId));

      const totalRevenue = vereinZahlungen.reduce((sum: number, z: MitgliedZahlungDto) => sum + z.betrag, 0);
      const totalClaims = vereinForderungen.reduce((sum: number, f: MitgliedForderungDto) => sum + f.betrag, 0);
      const paidClaims = vereinForderungen.filter((f: MitgliedForderungDto) => f.statusId === 1).reduce((sum: number, f: MitgliedForderungDto) => sum + f.betrag, 0);
      const openClaims = vereinForderungen.filter((f: MitgliedForderungDto) => f.statusId !== 1).reduce((sum: number, f: MitgliedForderungDto) => sum + f.betrag, 0);
      const collectionRate = totalClaims > 0 ? (paidClaims / totalClaims) * 100 : 0;
      const netProfit = totalRevenue - totalClaims;
      const activeMitglieder = vereinMitglieder.filter((m: MitgliedDto) => m.aktiv).length;
      const arpu = activeMitglieder > 0 ? totalRevenue / activeMitglieder : 0;

      return {
        vereinId: verein.id,
        vereinName: verein.name,
        totalRevenue,
        totalClaims,
        netProfit,
        openClaims,
        collectionRate,
        arpu,
        memberCount: activeMitglieder,
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue); // Sort by revenue descending
  }, [vereine, allMitglieder, allForderungen, allZahlungen, selectedVereinId]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return vereinFinanceStats.map(stat => ({
      name: stat.vereinName.length > 15 ? stat.vereinName.substring(0, 15) + '...' : stat.vereinName,
      gelir: Math.round(stat.totalRevenue),
      alacak: Math.round(stat.totalClaims),
      kar: Math.round(stat.netProfit),
    }));
  }, [vereinFinanceStats]);

  // Export to Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['FİNANSAL ANALİZ RAPORU', ''],
      ['Tarih:', new Date().toLocaleDateString('tr-TR')],
      ['', ''],
      ['GENEL ÖZET', ''],
      ['Toplam Gelir', `€${financialKPIs.totalRevenue.toFixed(2)}`],
      ['Toplam Alacak', `€${financialKPIs.totalClaims.toFixed(2)}`],
      ['Net Kar/Zarar', `€${financialKPIs.netProfit.toFixed(2)}`],
      ['Tahsilat Oranı', `${financialKPIs.collectionRate.toFixed(1)}%`],
      ['Büyüme Oranı (YoY)', `${financialKPIs.growthRate.toFixed(1)}%`],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Özet');

    // Dernek Performance Sheet
    const performanceData = vereinFinanceStats.map(stat => ({
      'Dernek': stat.vereinName,
      'Toplam Gelir': stat.totalRevenue.toFixed(2),
      'Toplam Alacak': stat.totalClaims.toFixed(2),
      'Net Kar/Zarar': stat.netProfit.toFixed(2),
      'Açık Alacak': stat.openClaims.toFixed(2),
      'Tahsilat Oranı (%)': stat.collectionRate.toFixed(1),
      'ARPU': stat.arpu.toFixed(2),
      'Aktif Üye Sayısı': stat.memberCount,
    }));
    const ws2 = XLSX.utils.json_to_sheet(performanceData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Dernek Performansı');

    XLSX.writeFile(wb, `Finansal_Analiz_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (forderungenLoading || zahlungenLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* Financial KPIs */}
      <div className="stats-section">
        <div className="section-header">
          <h2>Finansal Özet</h2>
          <button className="btn btn-secondary" onClick={exportToExcel}>
            <DownloadIcon />
            Excel İndir
          </button>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#4CAF50' }}>
              <DollarSignIcon />
            </div>
            <div className="stat-info">
              <h3>Toplam Gelir</h3>
              <div className="stat-number">€{financialKPIs.totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div>
              <span className="stat-detail">Tüm ödemeler</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#2196F3' }}>
              <DollarSignIcon />
            </div>
            <div className="stat-info">
              <h3>Net Kar/Zarar</h3>
              <div className="stat-number" style={{ color: financialKPIs.netProfit >= 0 ? '#4CAF50' : '#F44336' }}>
                €{financialKPIs.netProfit.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </div>
              <span className="stat-detail">Gelir - Alacak</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: financialKPIs.collectionRate >= 80 ? '#4CAF50' : financialKPIs.collectionRate >= 60 ? '#FF9800' : '#F44336' }}>
              <PercentIcon />
            </div>
            <div className="stat-info">
              <h3>Tahsilat Oranı</h3>
              <div className="stat-number">{financialKPIs.collectionRate.toFixed(1)}%</div>
              <span className="stat-detail">Ödenen / Toplam</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: financialKPIs.growthRate >= 0 ? '#4CAF50' : '#F44336' }}>
              {financialKPIs.growthRate >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            </div>
            <div className="stat-info">
              <h3>Büyüme Oranı</h3>
              <div className="stat-number" style={{ color: financialKPIs.growthRate >= 0 ? '#4CAF50' : '#F44336' }}>
                {financialKPIs.growthRate >= 0 ? '+' : ''}{financialKPIs.growthRate.toFixed(1)}%
              </div>
              <span className="stat-detail">Son 6 ay vs önceki 6 ay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dernek Performance Chart */}
      <div className="chart-section">
        <h2>Dernek Bazlı Finansal Performans</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ bottom: 80, left: 20, right: 20, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#666"
                style={{ fontSize: '0.75rem' }}
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
                formatter={(value: any) => `€${value.toLocaleString('de-DE')}`}
              />
              <Legend />
              <Bar dataKey="gelir" fill="#4CAF50" name="Gelir" />
              <Bar dataKey="alacak" fill="#2196F3" name="Alacak" />
              <Bar dataKey="kar" fill="#FF9800" name="Net Kar/Zarar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="table-section">
        <h2>Detaylı Dernek Performans Tablosu</h2>
        <div className="table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Dernek</th>
                <th>Toplam Gelir</th>
                <th>Toplam Alacak</th>
                <th>Net Kar/Zarar</th>
                <th>Açık Alacak</th>
                <th>Tahsilat Oranı</th>
                <th>ARPU</th>
                <th>Aktif Üye</th>
              </tr>
            </thead>
            <tbody>
              {vereinFinanceStats.map((stat, index) => (
                <tr key={stat.vereinId}>
                  <td><strong>{stat.vereinName}</strong></td>
                  <td>€{stat.totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                  <td>€{stat.totalClaims.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: stat.netProfit >= 0 ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
                    €{stat.netProfit.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </td>
                  <td>€{stat.openClaims.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span
                      className="percentage-badge"
                      style={{
                        backgroundColor: stat.collectionRate >= 80 ? '#4CAF50' : stat.collectionRate >= 60 ? '#FF9800' : '#F44336',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {stat.collectionRate.toFixed(1)}%
                    </span>
                  </td>
                  <td>€{stat.arpu.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                  <td>{stat.memberCount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                <td>TOPLAM</td>
                <td>€{financialKPIs.totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                <td>€{financialKPIs.totalClaims.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                <td style={{ color: financialKPIs.netProfit >= 0 ? '#4CAF50' : '#F44336' }}>
                  €{financialKPIs.netProfit.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </td>
                <td>-</td>
                <td>{financialKPIs.collectionRate.toFixed(1)}%</td>
                <td>-</td>
                <td>{allMitglieder.filter(m => m.aktiv).length}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Insights Section */}
      <div className="chart-section">
        <h2>💡 Önemli Bulgular</h2>
        <div className="insights-container">
          {vereinFinanceStats.length > 0 && (
            <>
              <div className="insight-card insight-success">
                <h4>🏆 En Yüksek Gelir</h4>
                <p><strong>{vereinFinanceStats[0].vereinName}</strong></p>
                <p>€{vereinFinanceStats[0].totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
              </div>

              <div className="insight-card insight-info">
                <h4>📊 En Yüksek Tahsilat Oranı</h4>
                <p><strong>{[...vereinFinanceStats].sort((a, b) => b.collectionRate - a.collectionRate)[0].vereinName}</strong></p>
                <p>{[...vereinFinanceStats].sort((a, b) => b.collectionRate - a.collectionRate)[0].collectionRate.toFixed(1)}%</p>
              </div>

              <div className="insight-card insight-warning">
                <h4>💰 En Yüksek ARPU</h4>
                <p><strong>{[...vereinFinanceStats].sort((a, b) => b.arpu - a.arpu)[0].vereinName}</strong></p>
                <p>€{[...vereinFinanceStats].sort((a, b) => b.arpu - a.arpu)[0].arpu.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
              </div>

              {vereinFinanceStats.some(s => s.collectionRate < 60) && (
                <div className="insight-card insight-error">
                  <h4>⚠️ Dikkat Gereken Dernekler</h4>
                  <p>Tahsilat oranı %60'ın altında olan dernekler var</p>
                  <p>{vereinFinanceStats.filter(s => s.collectionRate < 60).length} dernek</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FinanceAnalytics;

