/**
 * JahresabschlussModal - Modal for creating/editing/viewing KassenbuchJahresabschluss entries
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kassenbuchJahresabschlussService, kassenbuchService } from '../../../services/easyFiBuService';
import { 
  KassenbuchJahresabschlussDto, 
  CreateKassenbuchJahresabschlussDto, 
  UpdateKassenbuchJahresabschlussDto 
} from '../../../types/easyFiBu.types';

interface JahresabschlussModalProps {
  isOpen: boolean;
  onClose: () => void;
  abschluss: KassenbuchJahresabschlussDto | null;
  vereinId: number;
  closedYears: number[];
}

const JahresabschlussModal: React.FC<JahresabschlussModalProps> = ({ 
  isOpen, 
  onClose, 
  abschluss, 
  vereinId,
  closedYears
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [autoFilledFields, setAutoFilledFields] = useState<Record<string, boolean>>({});
  const [hasCalculatedTotals, setHasCalculatedTotals] = useState(false);
  const [isOpeningLoading, setIsOpeningLoading] = useState(false);
  const [openingLocked, setOpeningLocked] = useState(false);
  const [duplicateYearError, setDuplicateYearError] = useState<string | null>(null);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear; y >= 2000; y--) {
      if (!closedYears.includes(y)) years.push(y);
    }
    return years;
  }, [closedYears, currentYear]);

  const defaultYear = useMemo(
    () => yearOptions[0] ?? currentYear,
    [yearOptions, currentYear]
  );
  const isAudited = !!abschluss?.geprueft;
  const formatCurrency = (value?: number | null) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value ?? 0);

  // Form state
  const [formData, setFormData] = useState<CreateKassenbuchJahresabschlussDto>({
    vereinId,
    jahr: defaultYear,
    kasseAnfangsbestand: 0,
    bankAnfangsbestand: 0,
    kasseEndbestand: 0,
    bankEndbestand: 0,
    totalEinnahmen: 0,
    totalAusgaben: 0,
    saldo: 0,
    bemerkungen: '',
  });

  // Update form state
  const [updateData, setUpdateData] = useState<UpdateKassenbuchJahresabschlussDto>({
    id: 0,
    kasseEndbestand: 0,
    bankEndbestand: 0,
    totalEinnahmen: 0,
    totalAusgaben: 0,
    saldo: 0,
    bemerkungen: '',
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateKassenbuchJahresabschlussDto) => kassenbuchJahresabschlussService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jahresabschluesse', vereinId] });
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateKassenbuchJahresabschlussDto) => kassenbuchJahresabschlussService.update(abschluss!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jahresabschluesse', vereinId] });
      onClose();
    },
  });

  // Calculate mutation
  const calculateSummaryMutation = useMutation({
    mutationFn: (jahr: number) => kassenbuchService.getSummary(vereinId, jahr),
    onSuccess: (summary) => {
      const computedSaldo = (summary.kasseSaldo ?? 0) + (summary.bankSaldo ?? 0);
      setFormData(prev => ({
        ...prev,
        totalEinnahmen: summary.totalEinnahmen,
        totalAusgaben: summary.totalAusgaben,
        saldo: computedSaldo,
        kasseEndbestand: summary.kasseSaldo,
        bankEndbestand: summary.bankSaldo,
      }));
      setAutoFilledFields(prev => ({
        ...prev,
        totalEinnahmen: true,
        totalAusgaben: true,
        saldo: true,
        kasseEndbestand: true,
        bankEndbestand: true,
      }));
      setHasCalculatedTotals(true);
    },
    onError: () => {
      setHasCalculatedTotals(false);
    }
  });

  // Initialize form with abschluss data
  useEffect(() => {
    if (abschluss) {
      setUpdateData({
        id: abschluss.id,
        kasseEndbestand: abschluss.kasseEndbestand,
        bankEndbestand: abschluss.bankEndbestand,
        totalEinnahmen: abschluss.totalEinnahmen,
        totalAusgaben: abschluss.totalAusgaben,
        saldo: abschluss.saldo,
        bemerkungen: abschluss.bemerkungen || '',
      });
    } else {
      setFormData({
        vereinId,
        jahr: defaultYear,
        kasseAnfangsbestand: 0,
        bankAnfangsbestand: 0,
        kasseEndbestand: 0,
        bankEndbestand: 0,
        totalEinnahmen: 0,
        totalAusgaben: 0,
        saldo: 0,
        bemerkungen: '',
      });
      setUpdateData({
        id: 0,
        kasseEndbestand: 0,
        bankEndbestand: 0,
        totalEinnahmen: 0,
        totalAusgaben: 0,
        saldo: 0,
        bemerkungen: '',
      });
      setHasCalculatedTotals(false);
      setAutoFilledFields({});
      setOpeningLocked(false);
      setDuplicateYearError(null);
    }
  }, [abschluss, vereinId, defaultYear]);

  // Prefill opening balances from the previous year's closing when available
  useEffect(() => {
    if (abschluss) return;
    let isMounted = true;
    const fetchPreviousYear = async () => {
      setIsOpeningLoading(true);
      try {
        const previousYear = formData.jahr - 1;
        const previousAbschluss = await kassenbuchJahresabschlussService.getByVereinAndJahr(vereinId, previousYear);
        if (!isMounted || !previousAbschluss) return;
        setFormData(prev => ({
          ...prev,
          kasseAnfangsbestand: previousAbschluss.kasseEndbestand,
          bankAnfangsbestand: previousAbschluss.bankEndbestand,
        }));
        setOpeningLocked(true);
        setAutoFilledFields(prev => ({
          ...prev,
          kasseAnfangsbestand: true,
          bankAnfangsbestand: true,
        }));
      } catch {
        if (!isMounted) return;
        setOpeningLocked(false);
        setFormData(prev => ({
          ...prev,
          kasseAnfangsbestand: autoFilledFields.kasseAnfangsbestand ? 0 : prev.kasseAnfangsbestand,
          bankAnfangsbestand: autoFilledFields.bankAnfangsbestand ? 0 : prev.bankAnfangsbestand,
        }));
        setAutoFilledFields(prev => {
          const next = { ...prev };
          delete next.kasseAnfangsbestand;
          delete next.bankAnfangsbestand;
          return next;
        });
      } finally {
        if (isMounted) setIsOpeningLoading(false);
      }
    };

    fetchPreviousYear();
    return () => { isMounted = false; };
  }, [abschluss, formData.jahr, vereinId]);

  // Ensure selected year is not already closed
  useEffect(() => {
    if (abschluss) return;
    if (closedYears.includes(formData.jahr)) {
      const fallbackYear = defaultYear;
      setFormData(prev => ({
        ...prev,
        jahr: fallbackYear,
      }));
      setHasCalculatedTotals(false);
      setDuplicateYearError(
        t('finanz:easyFiBu.jahresabschluss.yearAlreadyClosed', { year: formData.jahr })
      );
    }
  }, [abschluss, closedYears, defaultYear, formData.jahr, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (abschluss) {
      updateMutation.mutate(updateData);
    } else {
      if (!hasCalculatedTotals || yearOptions.length === 0 || !!duplicateYearError) return;
      setIsConfirmSaveOpen(true);
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (['kasseEndbestand', 'bankEndbestand', 'totalEinnahmen', 'totalAusgaben', 'saldo'].includes(name)) return;
    if (openingLocked && ['kasseAnfangsbestand', 'bankAnfangsbestand'].includes(name)) return;

    if (name === 'jahr') {
      const parsedYear = parseInt(value) || currentYear;
      setHasCalculatedTotals(false);
      setAutoFilledFields(prev => ({
        kasseAnfangsbestand: prev.kasseAnfangsbestand,
        bankAnfangsbestand: prev.bankAnfangsbestand,
      }));
      if (closedYears.includes(parsedYear)) {
        setDuplicateYearError(
          t('finanz:easyFiBu.jahresabschluss.yearAlreadyClosed', { year: parsedYear })
        );
      } else {
        setDuplicateYearError(null);
      }
      setFormData(prev => ({
        ...prev,
        jahr: parsedYear,
        kasseEndbestand: 0,
        bankEndbestand: 0,
        totalEinnahmen: 0,
        totalAusgaben: 0,
        saldo: 0,
      }));
      return;
    }

    const numericFields: Array<keyof CreateKassenbuchJahresabschlussDto> = [
      'kasseAnfangsbestand',
      'bankAnfangsbestand',
      'kasseEndbestand',
      'bankEndbestand',
      'totalEinnahmen',
      'totalAusgaben',
      'saldo',
    ];

    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name as keyof CreateKassenbuchJahresabschlussDto)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (['kasseEndbestand', 'bankEndbestand', 'totalEinnahmen', 'totalAusgaben', 'saldo'].includes(name)) return;
    setUpdateData(prev => ({
      ...prev,
      [name]: name === 'bemerkungen' ? value : parseFloat(value) || 0,
    }));
  };

  const handleCalculate = () => {
    if (yearOptions.length === 0) return;
    setHasCalculatedTotals(false);
    setDuplicateYearError(null);
    calculateSummaryMutation.mutate(formData.jahr);
  };

  const handleConfirmSave = () => {
    if (!hasCalculatedTotals || yearOptions.length === 0 || !!duplicateYearError) return;
    if (closedYears.includes(formData.jahr)) {
      setDuplicateYearError(
        t('finanz:easyFiBu.jahresabschluss.yearAlreadyClosed', { year: formData.jahr })
      );
      setIsConfirmSaveOpen(false);
      return;
    }
    setIsConfirmSaveOpen(false);
    createMutation.mutate(formData);
  };

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending || calculateSummaryMutation.isPending;
  const isViewOnly = !!abschluss;
  const canEdit = !abschluss || !abschluss.geprueft;
  const autoTooltip = t('finanz:easyFiBu.jahresabschluss.systemCalculated');
  const isSaveDisabled =
    isSubmitting ||
    isOpeningLoading ||
    (!abschluss && (!hasCalculatedTotals || !!duplicateYearError || yearOptions.length === 0));

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content jahresabschluss-modal">
          <div className="modal-header">
            <h2>
              {abschluss 
                ? t('finanz:easyFiBu.jahresabschluss.viewAbschluss') 
                : t('finanz:easyFiBu.jahresabschluss.newAbschluss')
              }
            </h2>
            <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            {!isViewOnly ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="jahr">{t('finanz:easyFiBu.jahresabschluss.jahr')}</label>
                    <select
                      id="jahr"
                      name="jahr"
                      value={yearOptions.length === 0 ? '' : formData.jahr}
                      onChange={handleCreateChange}
                      disabled={isSubmitting || isOpeningLoading || yearOptions.length === 0}
                      required
                    >
                      {yearOptions.length === 0 && (
                        <option value="">
                          {t('finanz:easyFiBu.jahresabschluss.noAvailableYear')}
                        </option>
                      )}
                      {yearOptions.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {duplicateYearError && (
                      <div className="field-hint warning">{duplicateYearError}</div>
                    )}
                  </div>
                </div>

                <p className="field-hint muted">
                  {t('finanz:easyFiBu.jahresabschluss.autoLockInfo')}
                </p>

                <h4 className="section-title">{t('finanz:easyFiBu.jahresabschluss.sectionOpening')}</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="kasseAnfangsbestand">{t('finanz:easyFiBu.jahresabschluss.kasseAnfangsbestand')}</label>
                    <input
                      type="number"
                      id="kasseAnfangsbestand"
                      name="kasseAnfangsbestand"
                      value={formData.kasseAnfangsbestand}
                      onChange={handleCreateChange}
                      step="0.01"
                      disabled={isSubmitting || isOpeningLoading}
                      readOnly={openingLocked}
                      className={autoFilledFields.kasseAnfangsbestand ? 'auto-field' : ''}
                      title={autoFilledFields.kasseAnfangsbestand ? autoTooltip : undefined}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bankAnfangsbestand">{t('finanz:easyFiBu.jahresabschluss.bankAnfangsbestand')}</label>
                    <input
                      type="number"
                      id="bankAnfangsbestand"
                      name="bankAnfangsbestand"
                      value={formData.bankAnfangsbestand}
                      onChange={handleCreateChange}
                      step="0.01"
                      disabled={isSubmitting || isOpeningLoading}
                      readOnly={openingLocked}
                      className={autoFilledFields.bankAnfangsbestand ? 'auto-field' : ''}
                      title={autoFilledFields.bankAnfangsbestand ? autoTooltip : undefined}
                    />
                  </div>
                </div>
                {openingLocked && (
                  <p className="field-hint muted">
                    {t('finanz:easyFiBu.jahresabschluss.openingAutoNote')}
                  </p>
                )}

                <h4 className="section-title">{t('finanz:easyFiBu.jahresabschluss.sectionTotals')}</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="totalEinnahmen">{t('finanz:easyFiBu.jahresabschluss.totalEinnahmen')}</label>
                    <input
                      type="number"
                      id="totalEinnahmen"
                      name="totalEinnahmen"
                      value={formData.totalEinnahmen}
                      step="0.01"
                      readOnly
                      disabled={isSubmitting || isOpeningLoading}
                      className={autoFilledFields.totalEinnahmen ? 'auto-field' : ''}
                      title={autoFilledFields.totalEinnahmen ? autoTooltip : undefined}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="totalAusgaben">{t('finanz:easyFiBu.jahresabschluss.totalAusgaben')}</label>
                    <input
                      type="number"
                      id="totalAusgaben"
                      name="totalAusgaben"
                      value={formData.totalAusgaben}
                      step="0.01"
                      readOnly
                      disabled={isSubmitting || isOpeningLoading}
                      className={autoFilledFields.totalAusgaben ? 'auto-field' : ''}
                      title={autoFilledFields.totalAusgaben ? autoTooltip : undefined}
                    />
                  </div>
                </div>

                <h4 className="section-title">{t('finanz:easyFiBu.jahresabschluss.sectionClosing')}</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="kasseEndbestand">{t('finanz:easyFiBu.jahresabschluss.kasseEndbestand')}</label>
                    <input
                      type="number"
                      id="kasseEndbestand"
                      name="kasseEndbestand"
                      value={formData.kasseEndbestand}
                      step="0.01"
                      readOnly
                      disabled={isSubmitting || isOpeningLoading}
                      className={autoFilledFields.kasseEndbestand ? 'auto-field' : ''}
                      title={autoFilledFields.kasseEndbestand ? autoTooltip : undefined}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bankEndbestand">{t('finanz:easyFiBu.jahresabschluss.bankEndbestand')}</label>
                    <input
                      type="number"
                      id="bankEndbestand"
                      name="bankEndbestand"
                      value={formData.bankEndbestand}
                      step="0.01"
                      readOnly
                      disabled={isSubmitting || isOpeningLoading}
                      className={autoFilledFields.bankEndbestand ? 'auto-field' : ''}
                      title={autoFilledFields.bankEndbestand ? autoTooltip : undefined}
                    />
                  </div>
                </div>

                <h4 className="section-title saldo-title">{t('finanz:easyFiBu.jahresabschluss.sectionSaldo')}</h4>
                <div
                  className={`saldo-card ${formData.saldo < 0 ? 'negative' : 'positive'}`}
                  title={autoFilledFields.saldo ? autoTooltip : undefined}
                  aria-label={t('finanz:easyFiBu.jahresabschluss.saldo')}
                >
                  <div className="saldo-label">{t('finanz:easyFiBu.jahresabschluss.saldo')}</div>
                  <div className="saldo-value">{formatCurrency(formData.saldo)}</div>
                  <div className="saldo-subtext">{t('finanz:easyFiBu.jahresabschluss.saldoSubtext')}</div>
                </div>

                <h4 className="section-title">{t('finanz:easyFiBu.jahresabschluss.sectionAudit')}</h4>
                <div className="form-row audit-row">
                  <div className="form-group audit-radio-group">
                    <span className="radio-legend">{t('finanz:easyFiBu.jahresabschluss.auditStatus')}</span>
                    <label className="radio-label">
                      <input type="radio" checked={!isAudited} readOnly />
                      <span>{t('finanz:easyFiBu.jahresabschluss.nichtGeprueft')}</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" checked={isAudited} readOnly />
                      <span>{t('finanz:easyFiBu.jahresabschluss.geprueft')}</span>
                    </label>
                  </div>
                  {isAudited && (
                    <div className="audit-meta-grid">
                      <div className="form-group">
                        <label>{t('finanz:easyFiBu.jahresabschluss.geprueftVon')}</label>
                        <input type="text" value="-" readOnly className="readonly" />
                      </div>
                      <div className="form-group">
                        <label>{t('finanz:easyFiBu.jahresabschluss.geprueftAm')}</label>
                        <input type="text" value="-" readOnly className="readonly" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group remarks-group">
                  <label htmlFor="bemerkungen">{t('finanz:easyFiBu.jahresabschluss.bemerkungen')}</label>
                  <textarea
                    id="bemerkungen"
                    name="bemerkungen"
                    value={formData.bemerkungen || ''}
                    onChange={handleCreateChange}
                    rows={3}
                    placeholder={t('finanz:easyFiBu.jahresabschluss.bemerkungenPlaceholder')}
                    disabled={isSubmitting}
                  />
                </div>
                <p className="field-hint muted">
                  {t('finanz:easyFiBu.jahresabschluss.bemerkungenHelper')}
                </p>

                {!hasCalculatedTotals && !abschluss && (
                  <div className="field-hint warning">
                    {t('finanz:easyFiBu.jahresabschluss.calculateFirst')}
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={handleCalculate}
                    className="btn btn-secondary"
                    disabled={isSubmitting || isOpeningLoading || yearOptions.length === 0 || !!duplicateYearError}
                  >
                    {t('finanz:easyFiBu.jahresabschluss.calculate')}
                  </button>
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                  >
                    {t('finanz:easyFiBu.common.cancel')}
                  </button>
                  <button 
                    type={abschluss ? 'submit' : 'button'}
                    className="btn btn-primary"
                    disabled={isSaveDisabled}
                    title={!abschluss && !hasCalculatedTotals ? t('finanz:easyFiBu.jahresabschluss.calculateFirst') : undefined}
                    onClick={() => {
                      if (abschluss) return;
                      if (isSaveDisabled) return;
                      setIsConfirmSaveOpen(true);
                    }}
                  >
                    {isSubmitting 
                      ? t('finanz:easyFiBu.common.saving') 
                      : t('finanz:easyFiBu.common.save')
                    }
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* View-only fields for existing abschluss */}
                <div className="view-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('finanz:easyFiBu.jahresabschluss.jahr')}</label>
                      <input
                        type="text"
                        value={abschluss.jahr}
                        readOnly
                        className="readonly"
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('finanz:easyFiBu.jahresabschluss.status')}</label>
                      <input
                        type="text"
                        value={abschluss.geprueft ? t('finanz:easyFiBu.jahresabschluss.geprueft') : t('finanz:easyFiBu.jahresabschluss.nichtGeprueft')}
                        readOnly
                        className="readonly"
                      />
                    </div>
                  </div>

                  <h4 className="section-title">{t('finanz:easyFiBu.jahresabschluss.sectionAudit')}</h4>
                <div className="form-row audit-row">
                  <div className="form-group audit-radio-group">
                    <label className="radio-label">
                      <input type="radio" checked={!abschluss.geprueft} readOnly />
                      <span>{t('finanz:easyFiBu.jahresabschluss.nichtGeprueft')}</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" checked={abschluss.geprueft} readOnly />
                      <span>{t('finanz:easyFiBu.jahresabschluss.geprueft')}</span>
                    </label>
                  </div>
                  {abschluss.geprueft && (
                    <div className="audit-meta-grid">
                      <div className="form-group">
                        <label>{t('finanz:easyFiBu.jahresabschluss.geprueftVon')}</label>
                        <input
                          type="text"
                          value={abschluss.geprueftVon || '-'}
                          readOnly
                          className="readonly"
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('finanz:easyFiBu.jahresabschluss.geprueftAm')}</label>
                        <input
                          type="text"
                          value={abschluss.geprueftAm ? new Date(abschluss.geprueftAm).toLocaleDateString() : '-'}
                          readOnly
                          className="readonly"
                        />
                      </div>
                    </div>
                  )}
                </div>

                  <h4 className="section-title">{t('finanz:easyFiBu.jahresabschluss.sectionOpening')}</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('finanz:easyFiBu.jahresabschluss.kasseAnfangsbestand')}</label>
                      <input
                        type="text"
                        value={formatCurrency(abschluss.kasseAnfangsbestand)}
                        readOnly
                        className="readonly"
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('finanz:easyFiBu.jahresabschluss.bankAnfangsbestand')}</label>
                      <input
                        type="text"
                        value={formatCurrency(abschluss.bankAnfangsbestand)}
                        readOnly
                        className="readonly"
                      />
                    </div>
                  </div>

                  <h4 className="section-title">{t('finanz:easyFiBu.jahresabschluss.sectionTotals')}</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('finanz:easyFiBu.jahresabschluss.totalEinnahmen')}</label>
                      <input
                        type="text"
                        value={formatCurrency(abschluss.totalEinnahmen)}
                        readOnly
                        className="readonly"
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('finanz:easyFiBu.jahresabschluss.totalAusgaben')}</label>
                      <input
                        type="text"
                        value={formatCurrency(abschluss.totalAusgaben)}
                        readOnly
                        className="readonly"
                      />
                    </div>
                  </div>

                  <h4 className="section-title">{t('finanz:easyFiBu.jahresabschluss.sectionClosing')}</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('finanz:easyFiBu.jahresabschluss.kasseEndbestand')}</label>
                      <input
                        type="text"
                        value={formatCurrency(abschluss.kasseEndbestand)}
                        readOnly
                        className="readonly"
                      />
                    </div>

                    <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.bankEndbestand')}</label>
                    <input
                      type="text"
                      value={formatCurrency(abschluss.bankEndbestand)}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>

                <h4 className="section-title saldo-title">{t('finanz:easyFiBu.jahresabschluss.sectionSaldo')}</h4>
                <div
                  className={`saldo-card ${abschluss.saldo < 0 ? 'negative' : 'positive'}`}
                  title={autoTooltip}
                >
                  <div className="saldo-label">{t('finanz:easyFiBu.jahresabschluss.saldo')}</div>
                  <div className="saldo-value">{formatCurrency(abschluss.saldo)}</div>
                  <div className="saldo-subtext">{t('finanz:easyFiBu.jahresabschluss.saldoSubtext')}</div>
                </div>

                {canEdit && (
                  <div className="form-group remarks-group">
                    <label htmlFor="bemerkungen">{t('finanz:easyFiBu.jahresabschluss.bemerkungen')}</label>
                      <textarea
                        id="bemerkungen"
                        name="bemerkungen"
                        value={updateData.bemerkungen || ''}
                        onChange={handleUpdateChange}
                        rows={3}
                        placeholder={t('finanz:easyFiBu.jahresabschluss.bemerkungenPlaceholder')}
                        disabled={isSubmitting}
                    />
                  </div>
                )}
                <p className="field-hint muted">
                  {t('finanz:easyFiBu.jahresabschluss.bemerkungenHelper')}
                </p>

                  {abschluss.bemerkungen && !canEdit && (
                    <div className="form-group">
                      <label>{t('finanz:easyFiBu.jahresabschluss.bemerkungen')}</label>
                      <textarea
                        value={abschluss.bemerkungen}
                        readOnly
                        className="readonly"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                  >
                    {t('finanz:easyFiBu.common.close')}
                  </button>
                  
                  {canEdit && (
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting 
                        ? t('finanz:easyFiBu.common.saving') 
                        : t('finanz:easyFiBu.common.update')
                      }
                    </button>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      {isConfirmSaveOpen && !abschluss && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h4>{t('finanz:easyFiBu.jahresabschluss.closeConfirmTitle')}</h4>
            <p>{t('finanz:easyFiBu.jahresabschluss.closeConfirmIntro', { year: formData.jahr })}</p>
            <ul>
              <li>{t('finanz:easyFiBu.jahresabschluss.closeConfirmImpact1')}</li>
              <li>{t('finanz:easyFiBu.jahresabschluss.closeConfirmImpact2')}</li>
              <li>{t('finanz:easyFiBu.jahresabschluss.closeConfirmImpact3', { nextYear: formData.jahr + 1 })}</li>
            </ul>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setIsConfirmSaveOpen(false)}
                disabled={isSubmitting}
              >
                {t('finanz:easyFiBu.common.cancel')}
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleConfirmSave}
                disabled={isSubmitting || isSaveDisabled}
              >
                {t('finanz:easyFiBu.jahresabschluss.closeConfirmAction')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JahresabschlussModal;
