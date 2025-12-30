/**
 * SpendenTab - Donation Protocols
 * Manage cash donation protocols with witness signatures
 */

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { spendenProtokollService } from '../../../services/easyFiBuService';
import { SpendenProtokollDto, SPENDEN_KATEGORIEN } from '../../../types/easyFiBu.types';
import Loading from '../../../components/Common/Loading';
import SpendenModal from './SpendenModal';
import './easyFiBu.css';

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

interface SpendenTabProps {
  vereinId?: number | null;
}

const SpendenTab: React.FC<SpendenTabProps> = ({ vereinId }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [selectedJahr, setSelectedJahr] = useState(currentYear);
  const [kategorieFilter, setKategorieFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProtokoll, setSelectedProtokoll] = useState<SpendenProtokollDto | null>(null);
  const hasVerein = !!vereinId;

  // Fetch protocols
  const { data: protokolle = [], isLoading } = useQuery({
    queryKey: ['spenden-protokolle', vereinId ?? 'none'],
    queryFn: () => spendenProtokollService.getByVerein(vereinId as number),
    enabled: hasVerein,
  });

  // Fetch category summary
  const { data: summary = [] } = useQuery({
    queryKey: ['spenden-summary', vereinId ?? 'none', selectedJahr],
    queryFn: () => spendenProtokollService.getKategorieSummary(vereinId as number, selectedJahr),
    enabled: hasVerein,
  });

  // Filter protocols
  const filteredProtokolle = useMemo(() => {
    if (!hasVerein) return [];
    return protokolle.filter(p => {
      const matchesYear = new Date(p.datum).getFullYear() === selectedJahr;
      const matchesKategorie = kategorieFilter === 'all' || p.zweckKategorie === kategorieFilter;
      return matchesYear && matchesKategorie;
    });
  }, [hasVerein, protokolle, selectedJahr, kategorieFilter]);

  // Calculate total
  const totalBetrag = useMemo(() => {
    if (!hasVerein) return undefined;
    return filteredProtokolle.reduce((sum, p) => sum + p.betrag, 0);
  }, [filteredProtokolle, hasVerein]);

  const formatCurrency = (amount?: number) => {
    if (amount == null) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  const handleAdd = () => {
    if (!hasVerein) return;
    setSelectedProtokoll(null);
    setIsModalOpen(true);
  };

  const handleView = (protokoll: SpendenProtokollDto) => {
    if (!hasVerein) return;
    setSelectedProtokoll(protokoll);
    setIsModalOpen(true);
  };

  // Year options
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  if (isLoading) return <Loading />;

  return (
    <div className="easyfibu-tab spenden-tab">
      <div className="tab-header">
        <div className="tab-title">
          <h2>{t('finanz:easyFiBu.spenden.title')}</h2>
          <p>{t('finanz:easyFiBu.spenden.subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd} disabled={!hasVerein}>
          <PlusIcon /> {t('finanz:easyFiBu.spenden.newProtokoll')}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards spenden-summary">
        <div className="summary-card total">
          <span className="label">{t('finanz:easyFiBu.spenden.gesamtbetrag')}</span>
          <span className="value">{formatCurrency(totalBetrag)}</span>
        </div>
        {(hasVerein ? summary.slice(0, 4) : []).map(s => (
          <div key={s.kategorie} className="summary-card kategorie">
            <span className="label">{s.kategorie}</span>
            <span className="value">{formatCurrency(s.totalBetrag)}</span>
            <span className="count">{s.anzahlProtokolle} {t('finanz:easyFiBu.spenden.newProtokoll')}</span>
          </div>
        ))}
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
          value={kategorieFilter}
          onChange={(e) => setKategorieFilter(e.target.value)}
          className="filter-select"
          disabled={!hasVerein}
        >
          <option value="all">{t('finanz:easyFiBu.common.all')}</option>
          {Object.entries(SPENDEN_KATEGORIEN).map(([key, value]) => (
            <option key={key} value={value}>{t(`finanz:easyFiBu.spenden.kategorien.${key.toLowerCase()}`)}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="data-table spenden-table">
          <thead>
            <tr>
              <th>{t('finanz:easyFiBu.spenden.datum')}</th>
              <th className="text-right">{t('finanz:easyFiBu.spenden.betrag')}</th>
              <th>{t('finanz:easyFiBu.spenden.zweckKategorie')}</th>
              <th>{t('finanz:easyFiBu.spenden.protokollant')}</th>
              <th>{t('finanz:easyFiBu.spenden.zeuge1')}</th>
              <th>{t('finanz:easyFiBu.spenden.zeuge2')}</th>
              <th>{t('finanz:easyFiBu.spenden.zeuge3')}</th>
              <th>{t('finanz:easyFiBu.common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProtokolle.map(protokoll => (
              <tr key={protokoll.id}>
                <td>{formatDate(protokoll.datum)}</td>
                <td className="text-right betrag">{formatCurrency(protokoll.betrag)}</td>
                <td>
                  <span className="kategorie-badge">{protokoll.zweckKategorie || '-'}</span>
                </td>
                <td>{protokoll.protokollant || '-'}</td>
                <td>
                  <span className={`zeuge-status ${protokoll.zeuge1Unterschrift ? 'signed' : ''}`}>
                    {protokoll.zeuge1Name || '-'}
                    {protokoll.zeuge1Unterschrift && <CheckIcon />}
                  </span>
                </td>
                <td>
                  <span className={`zeuge-status ${protokoll.zeuge2Unterschrift ? 'signed' : ''}`}>
                    {protokoll.zeuge2Name || '-'}
                    {protokoll.zeuge2Unterschrift && <CheckIcon />}
                  </span>
                </td>
                <td>
                  <span className={`zeuge-status ${protokoll.zeuge3Unterschrift ? 'signed' : ''}`}>
                    {protokoll.zeuge3Name || '-'}
                    {protokoll.zeuge3Unterschrift && <CheckIcon />}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => handleView(protokoll)}
                    title={t('finanz:easyFiBu.common.edit')}
                    disabled={!hasVerein}
                  >
                    <EyeIcon />
                  </button>
                  {!protokoll.kassenbuchId && (
                    <button
                      className="btn-icon"
                      title={t('finanz:easyFiBu.spenden.kassenbuchVerknuepft')}
                      disabled={!hasVerein}
                    >
                      <LinkIcon />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProtokolle.length === 0 && (
          <div className="empty-state">
            {hasVerein ? t('finanz:easyFiBu.spenden.noProtokolle') : t('common:filter.selectVerein')}
          </div>
        )}
      </div>

      {hasVerein && (
        <SpendenModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          protokoll={selectedProtokoll}
          vereinId={vereinId as number}
        />
      )}
    </div>
  );
};

export default SpendenTab;

