/**
 * KassenbuchTab - Cash Book / Ledger
 * Manage cash and bank transactions
 */

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { kassenbuchService, fiBuKontoService } from '../../../services/easyFiBuService';
import { KassenbuchDto, CreateKassenbuchDto, FiBuKontoDto } from '../../../types/easyFiBu.types';
import Loading from '../../../components/Common/Loading';
import KassenbuchModal from './KassenbuchModal';
import './easyFiBu.css';

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

interface KassenbuchTabProps {
  vereinId?: number | null;
}

const KassenbuchTab: React.FC<KassenbuchTabProps> = ({ vereinId }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const [selectedJahr, setSelectedJahr] = useState(currentYear);
  const [selectedKonto, setSelectedKonto] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<KassenbuchDto | null>(null);
  const hasVerein = !!vereinId;

  // Fetch Kassenbuch entries
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['kassenbuch', vereinId ?? 'none', selectedJahr],
    queryFn: () => kassenbuchService.getByVereinAndJahr(vereinId as number, selectedJahr),
    enabled: hasVerein,
  });

  // Fetch FiBu accounts for filter
  const { data: konten = [] } = useQuery({
    queryKey: ['fibu-konten-active'],
    queryFn: () => fiBuKontoService.getActive(),
  });

  // Fetch summary
  const { data: summary } = useQuery({
    queryKey: ['kassenbuch-summary', vereinId ?? 'none', selectedJahr],
    queryFn: () => kassenbuchService.getSummary(vereinId as number, selectedJahr),
    enabled: hasVerein,
  });

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (selectedKonto === 'all') return entries;
    return entries.filter(e => e.fiBuNummer === selectedKonto);
  }, [entries, selectedKonto]);

  // Calculate running balance
  const entriesWithBalance = useMemo(() => {
    let kasseBalance = summary?.kasseSaldo || 0;
    let bankBalance = summary?.bankSaldo || 0;
    
    return filteredEntries.map(entry => {
      const kasseChange = (entry.kasseEinnahme || 0) - (entry.kasseAusgabe || 0);
      const bankChange = (entry.bankEinnahme || 0) - (entry.bankAusgabe || 0);
      return {
        ...entry,
        kasseSaldo: kasseBalance,
        bankSaldo: bankBalance,
      };
    });
  }, [filteredEntries, summary]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  const handleAdd = () => {
    if (!hasVerein) return;
    setSelectedEntry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entry: KassenbuchDto) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  // Generate year options (last 5 years)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  if (isLoading) return <Loading />;

  const summaryData = summary || {
    totalEinnahmen: null,
    totalAusgaben: null,
    kasseSaldo: null,
    bankSaldo: null,
    saldo: null,
  };

  return (
    <div className="easyfibu-tab kassenbuch-tab">
      <div className="tab-header">
        <div className="tab-title">
          <h2>{t('finanz:easyFiBu.kassenbuch.title')}</h2>
          <p>{t('finanz:easyFiBu.kassenbuch.subtitle')}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd} disabled={!hasVerein}>
            <PlusIcon /> {t('finanz:easyFiBu.kassenbuch.newEntry')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card einnahmen">
          <span className="label">{t('finanz:easyFiBu.kassenbuch.summary.totalEinnahmen')}</span>
          <span className="value">{formatCurrency(summaryData.totalEinnahmen || undefined)}</span>
        </div>
        <div className="summary-card ausgaben">
          <span className="label">{t('finanz:easyFiBu.kassenbuch.summary.totalAusgaben')}</span>
          <span className="value">{formatCurrency(summaryData.totalAusgaben || undefined)}</span>
        </div>
        <div className="summary-card kasse">
          <span className="label">{t('finanz:easyFiBu.kassenbuch.summary.kasseSaldo')}</span>
          <span className="value">{formatCurrency(summaryData.kasseSaldo || undefined)}</span>
        </div>
        <div className="summary-card bank">
          <span className="label">{t('finanz:easyFiBu.kassenbuch.summary.bankSaldo')}</span>
          <span className="value">{formatCurrency(summaryData.bankSaldo || undefined)}</span>
        </div>
        <div className="summary-card gesamt">
          <span className="label">{t('finanz:easyFiBu.kassenbuch.summary.gesamtSaldo')}</span>
          <span className="value">{formatCurrency(summaryData.saldo || undefined)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="tab-filters">
        <select
          value={selectedJahr}
          onChange={(e) => setSelectedJahr(Number(e.target.value))}
          className="filter-select"
          disabled={!hasVerein}
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          value={selectedKonto}
          onChange={(e) => setSelectedKonto(e.target.value)}
          className="filter-select"
          disabled={!hasVerein}
        >
          <option value="all">{t('finanz:easyFiBu.common.all')}</option>
          {konten.map(konto => (
            <option key={konto.id} value={konto.nummer}>{konto.nummer} - {konto.bezeichnung}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="data-table kassenbuch-table">
          <thead>
            <tr>
              <th>{t('finanz:easyFiBu.kassenbuch.belegNr')}</th>
              <th>{t('finanz:easyFiBu.kassenbuch.belegDatum')}</th>
              <th>{t('finanz:easyFiBu.kassenbuch.buchungstext')}</th>
              <th>{t('finanz:easyFiBu.kassenbuch.konto')}</th>
              <th className="text-right">{t('finanz:easyFiBu.kassenbuch.kasseEinnahme')}</th>
              <th className="text-right">{t('finanz:easyFiBu.kassenbuch.kasseAusgabe')}</th>
              <th className="text-right">{t('finanz:easyFiBu.kassenbuch.bankEinnahme')}</th>
              <th className="text-right">{t('finanz:easyFiBu.kassenbuch.bankAusgabe')}</th>
              <th>{t('finanz:easyFiBu.common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {entriesWithBalance.map(entry => (
              <tr key={entry.id} className={entry.storniert ? 'storniert-row' : ''}>
                <td>{entry.belegNr}</td>
                <td>{formatDate(entry.belegDatum)}</td>
                <td className="buchungstext-cell">
                  {entry.buchungstext}
                  {entry.storniert && <span className="storno-badge">{t('finanz:easyFiBu.kassenbuch.storniert')}</span>}
                </td>
                <td>{entry.fiBuNummer}</td>
                <td className="text-right einnahme">{formatCurrency(entry.kasseEinnahme)}</td>
                <td className="text-right ausgabe">{formatCurrency(entry.kasseAusgabe)}</td>
                <td className="text-right einnahme">{formatCurrency(entry.bankEinnahme)}</td>
                <td className="text-right ausgabe">{formatCurrency(entry.bankAusgabe)}</td>
                <td>
                  {!entry.storniert && (
                    <>
                      <button className="btn-icon" onClick={() => handleEdit(entry)} title={t('finanz:easyFiBu.common.edit')}>
                        <EditIcon />
                      </button>
                      <button className="btn-icon btn-storno" title={t('finanz:easyFiBu.kassenbuch.storno')}>
                        <XIcon />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEntries.length === 0 && (
          <div className="empty-state">
            {hasVerein ? t('finanz:easyFiBu.kassenbuch.noEntries') : t('common:filter.selectVerein')}
          </div>
        )}
      </div>

      {hasVerein && (
        <KassenbuchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entry={selectedEntry}
          vereinId={vereinId as number}
          jahr={selectedJahr}
        />
      )}
    </div>
  );
};

export default KassenbuchTab;

