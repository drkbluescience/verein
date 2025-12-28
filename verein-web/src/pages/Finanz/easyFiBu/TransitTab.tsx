/**
 * TransitTab - Durchlaufende Posten (Transit Items)
 * Manage pass-through items for third parties
 */

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { durchlaufendePostenService } from '../../../services/easyFiBuService';
import { DurchlaufendePostenDto, DURCHLAUFENDE_POSTEN_STATUS } from '../../../types/easyFiBu.types';
import Loading from '../../../components/Common/Loading';
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

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

interface TransitTabProps {
  vereinId: number;
}

const TransitTab: React.FC<TransitTabProps> = ({ vereinId }) => {
  const { t } = useTranslation(['finanz', 'common']);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosten, setSelectedPosten] = useState<DurchlaufendePostenDto | null>(null);

  // Fetch transit items
  const { data: posten = [], isLoading } = useQuery({
    queryKey: ['durchlaufende-posten', vereinId],
    queryFn: () => durchlaufendePostenService.getByVerein(vereinId),
    enabled: !!vereinId,
  });

  // Fetch total open amount
  const { data: totalOpen = 0 } = useQuery({
    queryKey: ['durchlaufende-posten-total', vereinId],
    queryFn: () => durchlaufendePostenService.getTotalOpenAmount(vereinId),
    enabled: !!vereinId,
  });

  // Fetch summary by recipient
  const { data: empfaengerSummary = [] } = useQuery({
    queryKey: ['durchlaufende-posten-summary', vereinId],
    queryFn: () => durchlaufendePostenService.getEmpfaengerSummary(vereinId),
    enabled: !!vereinId,
  });

  // Filter items
  const filteredPosten = useMemo(() => {
    if (statusFilter === 'all') return posten;
    return posten.filter(p => p.status === statusFilter);
  }, [posten, statusFilter]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case DURCHLAUFENDE_POSTEN_STATUS.OFFEN: return 'status-offen';
      case DURCHLAUFENDE_POSTEN_STATUS.TEILWEISE: return 'status-teilweise';
      case DURCHLAUFENDE_POSTEN_STATUS.ABGESCHLOSSEN: return 'status-abgeschlossen';
      default: return '';
    }
  };

  const handleAdd = () => {
    setSelectedPosten(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: DurchlaufendePostenDto) => {
    setSelectedPosten(item);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="easyfibu-tab transit-tab">
      <div className="tab-header">
        <div className="tab-title">
          <h2>{t('finanz:easyFiBu.transit.title')}</h2>
          <p>{t('finanz:easyFiBu.transit.subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <PlusIcon /> {t('finanz:easyFiBu.transit.newPosten')}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards transit-summary">
        <div className="summary-card total-open">
          <span className="label">{t('finanz:easyFiBu.transit.summary.totalOffen')}</span>
          <span className="value">{formatCurrency(totalOpen)}</span>
        </div>
        {empfaengerSummary.slice(0, 4).map(s => (
          <div key={s.empfaenger} className="summary-card empfaenger">
            <span className="label">{s.empfaenger}</span>
            <span className="value">{formatCurrency(s.offenerBetrag)}</span>
            <span className="count">{s.anzahlPosten} Posten</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="tab-filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="all">{t('finanz:easyFiBu.common.all')}</option>
          <option value={DURCHLAUFENDE_POSTEN_STATUS.OFFEN}>{t('finanz:easyFiBu.transit.statusValues.offen')}</option>
          <option value={DURCHLAUFENDE_POSTEN_STATUS.TEILWEISE}>{t('finanz:easyFiBu.transit.statusValues.teilweise')}</option>
          <option value={DURCHLAUFENDE_POSTEN_STATUS.ABGESCHLOSSEN}>{t('finanz:easyFiBu.transit.statusValues.abgeschlossen')}</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="data-table transit-table">
          <thead>
            <tr>
              <th>{t('finanz:easyFiBu.transit.bezeichnung')}</th>
              <th>{t('finanz:easyFiBu.transit.empfaenger')}</th>
              <th>{t('finanz:easyFiBu.transit.einnahmenDatum')}</th>
              <th className="text-right">{t('finanz:easyFiBu.transit.einnahmenBetrag')}</th>
              <th>{t('finanz:easyFiBu.transit.ausgabenDatum')}</th>
              <th className="text-right">{t('finanz:easyFiBu.transit.ausgabenBetrag')}</th>
              <th className="text-right">{t('finanz:easyFiBu.transit.offenerBetrag')}</th>
              <th>{t('finanz:easyFiBu.transit.status')}</th>
              <th>{t('finanz:easyFiBu.common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosten.map(item => {
              const offenerBetrag = item.einnahmenBetrag - (item.ausgabenBetrag || 0);
              return (
                <tr key={item.id}>
                  <td>{item.bezeichnung}</td>
                  <td>{item.empfaenger || '-'}</td>
                  <td>{formatDate(item.einnahmenDatum)}</td>
                  <td className="text-right einnahme">{formatCurrency(item.einnahmenBetrag)}</td>
                  <td>{formatDate(item.ausgabenDatum)}</td>
                  <td className="text-right ausgabe">{formatCurrency(item.ausgabenBetrag)}</td>
                  <td className="text-right">{formatCurrency(offenerBetrag)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {t(`finanz:easyFiBu.transit.statusValues.${item.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={() => handleEdit(item)} title={t('finanz:easyFiBu.common.edit')}>
                      <EditIcon />
                    </button>
                    {item.status !== DURCHLAUFENDE_POSTEN_STATUS.ABGESCHLOSSEN && (
                      <button className="btn-icon btn-close" title={t('finanz:easyFiBu.transit.close')}>
                        <CheckCircleIcon />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredPosten.length === 0 && (
          <div className="empty-state">{t('finanz:easyFiBu.transit.noPosten')}</div>
        )}
      </div>
    </div>
  );
};

export default TransitTab;

