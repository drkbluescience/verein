/**
 * JahresabschlussTab - Year-End Closing
 * Manage annual cash book closings
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { kassenbuchJahresabschlussService } from '../../../services/easyFiBuService';
import { KassenbuchJahresabschlussDto } from '../../../types/easyFiBu.types';
import Loading from '../../../components/Common/Loading';
import Modal from '../../../components/Common/Modal';
import JahresabschlussModal from './JahresabschlussModal';
import './easyFiBu.css';

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CalculatorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/>
    <line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/>
    <line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="16" y2="18"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

interface JahresabschlussTabProps {
  vereinId?: number | null;
}

const JahresabschlussTab: React.FC<JahresabschlussTabProps> = ({ vereinId }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const hasVerein = !!vereinId;
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAbschluss, setSelectedAbschluss] = useState<KassenbuchJahresabschlussDto | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmYear, setConfirmYear] = useState<number | null>(null);

  // Fetch year-end closings
  const { data: abschluesse = [], isLoading } = useQuery({
    queryKey: ['jahresabschluesse', vereinId ?? 'none'],
    queryFn: () => kassenbuchJahresabschlussService.getByVerein(vereinId as number),
    enabled: hasVerein,
  });

  // Calculate mutation
  const calculateMutation = useMutation({
    mutationFn: (jahr: number) => kassenbuchJahresabschlussService.calculateAndCreate(vereinId as number, jahr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jahresabschluesse', vereinId ?? 'none'] });
      setIsCalculating(false);
    },
    onError: () => {
      setIsCalculating(false);
    }
  });

  const formatCurrency = (amount?: number) => {
    if (amount == null) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  const handleCalculate = () => {
    if (!hasVerein) return;
    const year = currentYear - 1; // Calculate for previous year
    setConfirmYear(year);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setConfirmYear(null);
  };

  const handleConfirmCalculate = () => {
    if (!hasVerein) return;
    const year = confirmYear ?? currentYear - 1;
    setIsConfirmOpen(false);
    setIsCalculating(true);
    calculateMutation.mutate(year);
  };

  const handleView = (abschluss: KassenbuchJahresabschlussDto) => {
    if (!hasVerein) return;
    setSelectedAbschluss(abschluss);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    if (!hasVerein) return;
    setSelectedAbschluss(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="easyfibu-tab jahresabschluss-tab">
      <div className="tab-header">
        <div className="tab-title">
          <h2>{t('finanz:easyFiBu.jahresabschluss.title')}</h2>
          <p>{t('finanz:easyFiBu.jahresabschluss.subtitle')}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleCalculate} disabled={!hasVerein || isCalculating}>
            <CalculatorIcon /> {t('finanz:easyFiBu.jahresabschluss.calculate')}
          </button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!hasVerein}>
            <PlusIcon /> {t('finanz:easyFiBu.jahresabschluss.newAbschluss')}
          </button>
        </div>
      </div>

      {/* Closings Grid */}
      <div className="jahresabschluss-grid">
        {abschluesse.map(abschluss => (
          <div key={abschluss.id} className={`abschluss-card ${abschluss.geprueft ? 'geprueft' : ''}`}>
            <div className="card-header">
              <h3>{abschluss.jahr}</h3>
              {abschluss.geprueft && (
                <span className="geprueft-badge">
                  <CheckIcon /> {t('finanz:easyFiBu.jahresabschluss.geprueft')}
                </span>
              )}
            </div>
            <div className="card-body">
              <div className="abschluss-row">
                <span>{t('finanz:easyFiBu.jahresabschluss.kasseAnfang')}</span>
                <span>{formatCurrency(abschluss.kasseAnfangsbestand)}</span>
              </div>
              <div className="abschluss-row">
                <span>{t('finanz:easyFiBu.jahresabschluss.kasseEnde')}</span>
                <span>{formatCurrency(abschluss.kasseEndbestand)}</span>
              </div>
              <div className="abschluss-row">
                <span>{t('finanz:easyFiBu.jahresabschluss.bankAnfang')}</span>
                <span>{formatCurrency(abschluss.bankAnfangsbestand)}</span>
              </div>
              <div className="abschluss-row">
                <span>{t('finanz:easyFiBu.jahresabschluss.bankEnde')}</span>
                <span>{formatCurrency(abschluss.bankEndbestand)}</span>
              </div>
              <hr />
              <div className="abschluss-row einnahmen">
                <span>{t('finanz:easyFiBu.jahresabschluss.totalEinnahmen')}</span>
                <span>{formatCurrency(abschluss.totalEinnahmen)}</span>
              </div>
              <div className="abschluss-row ausgaben">
                <span>{t('finanz:easyFiBu.jahresabschluss.totalAusgaben')}</span>
                <span>{formatCurrency(abschluss.totalAusgaben)}</span>
              </div>
              <div className={`abschluss-row saldo ${abschluss.saldo >= 0 ? 'positive' : 'negative'}`}>
                <span>{t('finanz:easyFiBu.jahresabschluss.saldo')}</span>
                <span>{formatCurrency(abschluss.saldo)}</span>
              </div>
            </div>
            <div className="card-footer">
              {abschluss.geprueft ? (
                <div className="audit-info">
                  <span>{t('finanz:easyFiBu.jahresabschluss.geprueftVon')}: {abschluss.geprueftVon}</span>
                  <span>{t('finanz:easyFiBu.jahresabschluss.geprueftAm')}: {formatDate(abschluss.geprueftAm)}</span>
                </div>
              ) : (
                <button className="btn btn-sm btn-outline" disabled>
                  <CheckIcon /> {t('finanz:easyFiBu.jahresabschluss.pruefen')}
                </button>
              )}
              <button className="btn-icon" onClick={() => handleView(abschluss)} disabled={!hasVerein}>
                <EyeIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {abschluesse.length === 0 && (
        <div className="empty-state">
          {hasVerein ? t('finanz:easyFiBu.jahresabschluss.noAbschluesse') : t('common:filter.selectVerein')}
        </div>
      )}

      {hasVerein && (
        <JahresabschlussModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          abschluss={selectedAbschluss}
          vereinId={vereinId as number}
        />
      )}

      <Modal
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        title={t('finanz:easyFiBu.jahresabschluss.calculateConfirmTitle')}
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseConfirm}
              disabled={isCalculating}
            >
              {t('finanz:easyFiBu.common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirmCalculate}
              disabled={isCalculating}
            >
              {t('finanz:easyFiBu.jahresabschluss.calculate')}
            </button>
          </>
        }
      >
        <p>
          {t('finanz:easyFiBu.jahresabschluss.calculateConfirmMessage', {
            year: confirmYear ?? currentYear - 1,
          })}
        </p>
      </Modal>
    </div>
  );
};

export default JahresabschlussTab;


