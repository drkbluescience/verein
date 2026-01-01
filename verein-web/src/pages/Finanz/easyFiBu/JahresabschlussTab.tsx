/**
 * JahresabschlussTab - Year-End Closing
 * Manage annual cash book closings
 */

import React, { useEffect, useMemo, useState } from 'react';
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

const OpeningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>
  </svg>
);

const MovementIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h11"/><path d="M9 3l-5 4 5 4"/><path d="M20 17H9"/><path d="M15 13l5 4-5 4"/>
  </svg>
);

const ClosingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 7h10v10H7z"/><path d="M9 12l2 2 4-4"/>
  </svg>
);

const BalanceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v18"/><path d="M5 8h14"/><path d="M7 14h10"/>
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
  const [yearFilter, setYearFilter] = useState<'all' | number>('all');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmYear, setConfirmYear] = useState<number | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditorName, setAuditorName] = useState('');
  const [auditError, setAuditError] = useState<string | null>(null);

  // Fetch year-end closings
  const { data: abschluesse = [], isLoading, isFetching } = useQuery({
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

  const auditMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      kassenbuchJahresabschlussService.markAsAudited(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jahresabschluesse', vereinId ?? 'none'] });
      setIsAuditOpen(false);
      setAuditorName('');
      setAuditError(null);
    },
    onError: () => {
      setAuditError(t('finanz:easyFiBu.common.error'));
    }
  });

  const formatCurrency = (amount?: number | null) => {
    const value = amount ?? 0;
    const formatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
    return formatted.replace(/\s?\u20AC$/, '\u20AC');
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return t('finanz:easyFiBu.jahresabschluss.noData');
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  const noDataLabel = t('finanz:easyFiBu.jahresabschluss.noData');

  const yearOptions = useMemo(() => {
    const years = Array.from(new Set(abschluesse.map(item => item.jahr)));
    return years.sort((a, b) => b - a);
  }, [abschluesse]);

  const filteredAbschluesse = useMemo(() => {
    if (yearFilter === 'all') return abschluesse;
    return abschluesse.filter(item => item.jahr === yearFilter);
  }, [abschluesse, yearFilter]);

  const showSkeleton = isFetching || isCalculating;
  const isAuditing = auditMutation.isPending;

  const availableYear = useMemo(() => {
    if (abschluesse.length === 0) return currentYear;
    const closedYears = new Set(abschluesse.map(item => item.jahr));
    for (let year = currentYear; year >= 2000; year -= 1) {
      if (!closedYears.has(year)) return year;
    }
    return null;
  }, [abschluesse, currentYear]);

  const canCreateNew = hasVerein && availableYear !== null;
  const newAbschlussHint = !hasVerein
    ? t('common:filter.selectVerein')
    : canCreateNew
      ? t('finanz:easyFiBu.jahresabschluss.newAbschlussHint')
      : t('finanz:easyFiBu.jahresabschluss.yearAlreadyClosed', { year: currentYear });

  useEffect(() => {
    if (yearFilter !== 'all' && !yearOptions.includes(yearFilter)) {
      setYearFilter('all');
    }
  }, [yearFilter, yearOptions]);

  useEffect(() => {
    if (filteredAbschluesse.length === 0) {
      if (selectedAbschluss) setSelectedAbschluss(null);
      return;
    }

    if (!selectedAbschluss || !filteredAbschluesse.some(a => a.id === selectedAbschluss.id)) {
      const latest = [...filteredAbschluesse].sort((a, b) => b.jahr - a.jahr)[0];
      setSelectedAbschluss(latest);
    }
  }, [filteredAbschluesse, selectedAbschluss]);

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

  const handleSelect = (abschluss: KassenbuchJahresabschlussDto) => {
    setSelectedAbschluss(abschluss);
  };

  const handleYearFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setYearFilter(value === 'all' ? 'all' : parseInt(value, 10));
  };

  const handleOpenAudit = () => {
    if (!selectedAbschluss || selectedAbschluss.geprueft) return;
    setAuditError(null);
    setIsAuditOpen(true);
  };

  const handleCloseAudit = () => {
    setIsAuditOpen(false);
    setAuditError(null);
    setAuditorName('');
  };

  const handleConfirmAudit = () => {
    if (!selectedAbschluss || selectedAbschluss.geprueft) return;
    const name = auditorName.trim();
    if (!name) {
      setAuditError(t('finanz:easyFiBu.jahresabschluss.auditNameRequired'));
      return;
    }
    auditMutation.mutate({ id: selectedAbschluss.id, name });
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
          <div className="header-action">
            <button
              className="btn btn-secondary"
              onClick={handleCalculate}
              disabled={!hasVerein || isCalculating}
              title={t('finanz:easyFiBu.jahresabschluss.calculateTooltip')}
            >
              <CalculatorIcon /> {t('finanz:easyFiBu.jahresabschluss.calculate')}
            </button>
            <span className="action-hint">
              {t('finanz:easyFiBu.jahresabschluss.calculateHint')}
            </span>
          </div>
          <div className="header-action">
            <button className="btn btn-primary" onClick={handleAdd} disabled={!canCreateNew}>
              <PlusIcon /> {t('finanz:easyFiBu.jahresabschluss.newAbschluss')}
            </button>
            <span className={`action-hint ${!hasVerein || canCreateNew ? '' : 'warning'}`.trim()}>
              {newAbschlussHint}
            </span>
          </div>
        </div>
      </div>

      <div className="jahresabschluss-layout">
        <div className="jahresabschluss-list">
          {yearOptions.length > 1 && (
            <div className="jahresabschluss-filter">
              <label htmlFor="jahresabschluss-year-filter">
                {t('finanz:easyFiBu.common.selectYear')}
              </label>
              <select
                id="jahresabschluss-year-filter"
                value={yearFilter === 'all' ? 'all' : yearFilter}
                onChange={handleYearFilterChange}
                disabled={!hasVerein}
              >
                <option value="all">{t('finanz:filter.allYears')}</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showSkeleton ? (
            <div className="jahresabschluss-grid">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`abschluss-skeleton-${index}`} className="abschluss-card skeleton-card">
                  <div className="card-header">
                    <div className="skeleton-line" style={{ width: '35%' }} />
                    <div className="skeleton-pill" style={{ width: '40%' }} />
                  </div>
                  <div className="card-body">
                    <div className="skeleton-line" style={{ width: '45%' }} />
                    <div className="skeleton-line" style={{ width: '80%' }} />
                    <div className="skeleton-line" style={{ width: '70%' }} />
                    <div className="skeleton-line" style={{ width: '55%' }} />
                    <div className="skeleton-line" style={{ width: '60%' }} />
                  </div>
                  <div className="card-footer">
                    <div className="skeleton-line" style={{ width: '50%' }} />
                    <div className="skeleton-circle" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="jahresabschluss-grid">
              {filteredAbschluesse.map(abschluss => (
                <div
                  key={abschluss.id}
                  className={`abschluss-card ${abschluss.geprueft ? 'geprueft' : ''} ${selectedAbschluss?.id === abschluss.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(abschluss)}
                >
                  <div className="card-header">
                    <div className="card-title">
                      <h3>{abschluss.jahr}</h3>
                      <span className={`audit-badge ${abschluss.geprueft ? 'ok' : 'pending'}`}>
                        {abschluss.geprueft && <CheckIcon />}
                        {abschluss.geprueft
                          ? t('finanz:easyFiBu.jahresabschluss.geprueft')
                          : t('finanz:easyFiBu.jahresabschluss.nichtGeprueft')}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="abschluss-summary">
                      <span className="summary-label">{t('finanz:easyFiBu.jahresabschluss.saldo')}</span>
                      <span
                        className={`summary-value ${
                          abschluss.saldo > 0 ? 'positive' : abschluss.saldo < 0 ? 'negative' : 'neutral'
                        }`}
                      >
                        {formatCurrency(abschluss.saldo)}
                      </span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      className="btn-icon"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleView(abschluss);
                      }}
                      disabled={!hasVerein}
                    >
                      <EyeIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showSkeleton && filteredAbschluesse.length === 0 && (
            <div className="empty-state">
              {hasVerein ? t('finanz:easyFiBu.jahresabschluss.noAbschluesse') : t('common:filter.selectVerein')}
            </div>
          )}
        </div>

        <div className="jahresabschluss-detail">
          {showSkeleton ? (
            <div className="jahresabschluss-detail-panel">
              <div className="skeleton-line" style={{ width: '45%' }} />
              <div className="skeleton-line" style={{ width: '30%' }} />
              <div className="skeleton-line" style={{ width: '80%' }} />
              <div className="skeleton-line" style={{ width: '70%' }} />
              <div className="skeleton-line" style={{ width: '60%' }} />
              <div className="skeleton-line" style={{ width: '85%' }} />
              <div className="skeleton-line" style={{ width: '50%' }} />
            </div>
          ) : selectedAbschluss ? (
            <div className="jahresabschluss-detail-panel">
              <div className="detail-header">
                <div>
                  <div className="detail-year">{selectedAbschluss.jahr}</div>
                  {selectedAbschluss.geprueft && (
                    <div className="detail-meta">
                      <span>
                        {t('finanz:easyFiBu.jahresabschluss.geprueftVon')}: {selectedAbschluss.geprueftVon || noDataLabel}
                      </span>
                      <span>
                        {t('finanz:easyFiBu.jahresabschluss.geprueftAm')}: {formatDate(selectedAbschluss.geprueftAm)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-body">
                <div className="abschluss-section">
                  <div className="abschluss-section-title">
                    <OpeningIcon />
                    <span>{t('finanz:easyFiBu.jahresabschluss.sectionOpening')}</span>
                  </div>
                  <div className="abschluss-row muted">
                    <span>{t('finanz:easyFiBu.jahresabschluss.kasseAnfang')}</span>
                    <span>{formatCurrency(selectedAbschluss.kasseAnfangsbestand)}</span>
                  </div>
                  <div className="abschluss-row muted">
                    <span>{t('finanz:easyFiBu.jahresabschluss.bankAnfang')}</span>
                    <span>{formatCurrency(selectedAbschluss.bankAnfangsbestand)}</span>
                  </div>
                </div>
                <div className="abschluss-section">
                  <div className="abschluss-section-title">
                    <MovementIcon />
                    <span>{t('finanz:easyFiBu.jahresabschluss.sectionTotals')}</span>
                  </div>
                  <div className="abschluss-row einnahmen">
                    <span>{t('finanz:easyFiBu.jahresabschluss.totalEinnahmen')}</span>
                    <span>{formatCurrency(selectedAbschluss.totalEinnahmen)}</span>
                  </div>
                  <div className="abschluss-row ausgaben">
                    <span>{t('finanz:easyFiBu.jahresabschluss.totalAusgaben')}</span>
                    <span>{formatCurrency(selectedAbschluss.totalAusgaben)}</span>
                  </div>
                </div>
                <div className="abschluss-section">
                  <div className="abschluss-section-title">
                    <ClosingIcon />
                    <span>{t('finanz:easyFiBu.jahresabschluss.sectionClosing')}</span>
                  </div>
                  <div className="abschluss-row muted">
                    <span>{t('finanz:easyFiBu.jahresabschluss.kasseEnde')}</span>
                    <span>{formatCurrency(selectedAbschluss.kasseEndbestand)}</span>
                  </div>
                  <div className="abschluss-row muted">
                    <span>{t('finanz:easyFiBu.jahresabschluss.bankEnde')}</span>
                    <span>{formatCurrency(selectedAbschluss.bankEndbestand)}</span>
                  </div>
                </div>
                <div className="detail-saldo">
                  <div className="detail-saldo-title">
                    <BalanceIcon />
                    <span>{t('finanz:easyFiBu.jahresabschluss.sectionSaldo')}</span>
                  </div>
                  <div
                    className={`detail-saldo-value ${
                      selectedAbschluss.saldo > 0 ? 'positive' : selectedAbschluss.saldo < 0 ? 'negative' : 'neutral'
                    }`}
                  >
                    {formatCurrency(selectedAbschluss.saldo)}
                  </div>
                  <div className="detail-saldo-subtext">{t('finanz:easyFiBu.jahresabschluss.saldoSubtext')}</div>
                </div>
              </div>

              <div className="detail-footer">
                <div className="detail-actions">
                  <button className="btn btn-secondary" type="button" disabled>
                    {t('finanz:easyFiBu.jahresabschluss.downloadPdf')}
                  </button>
                  <button className="btn btn-secondary" type="button" disabled>
                    {t('finanz:easyFiBu.jahresabschluss.exportExcel')}
                  </button>
                </div>
                {!selectedAbschluss.geprueft && (
                  <button className="btn btn-primary" type="button" onClick={handleOpenAudit} disabled={isAuditing}>
                    {t('finanz:easyFiBu.jahresabschluss.pruefen')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="jahresabschluss-detail-panel empty">
              <div className="detail-empty-title">
                {hasVerein ? t('finanz:easyFiBu.jahresabschluss.noAbschluesse') : t('common:filter.selectVerein')}
              </div>
              <p className="detail-empty-text">{t('finanz:easyFiBu.jahresabschluss.subtitle')}</p>
              {hasVerein && (
                <button className="btn btn-primary" onClick={handleAdd}>
                  <PlusIcon /> {t('finanz:easyFiBu.jahresabschluss.newAbschluss')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {hasVerein && (
        <JahresabschlussModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          abschluss={selectedAbschluss}
          vereinId={vereinId as number}
          closedYears={abschluesse.map(a => a.jahr)}
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

      <Modal
        isOpen={isAuditOpen}
        onClose={handleCloseAudit}
        title={t('finanz:easyFiBu.jahresabschluss.auditModalTitle')}
        size="sm"
        footer={(
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseAudit}
              disabled={isAuditing}
            >
              {t('finanz:easyFiBu.common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirmAudit}
              disabled={isAuditing}
            >
              {t('finanz:easyFiBu.jahresabschluss.auditModalAction')}
            </button>
          </>
        )}
      >
        <p>{t('finanz:easyFiBu.jahresabschluss.auditModalHint')}</p>
        <div className="form-group">
          <label htmlFor="audit-name">{t('finanz:easyFiBu.jahresabschluss.auditModalNameLabel')}</label>
          <input
            id="audit-name"
            type="text"
            value={auditorName}
            onChange={(event) => {
              setAuditorName(event.target.value);
              if (auditError) setAuditError(null);
            }}
            placeholder={t('finanz:easyFiBu.jahresabschluss.auditModalNamePlaceholder')}
            disabled={isAuditing}
          />
          {auditError && <div className="field-hint warning">{auditError}</div>}
        </div>
      </Modal>
    </div>
  );
};

export default JahresabschlussTab;

