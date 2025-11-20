/**
 * Verein DITIB Zahlung Form Page
 * Create/Edit DITIB payment
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DatePicker, { registerLocale } from 'react-datepicker';
import { de, tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../contexts/AuthContext';
import { vereinDitibZahlungService } from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
import { CreateVereinDitibZahlungDto, UpdateVereinDitibZahlungDto } from '../../types/finanz.types';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './FinanzDetail.css';

// Register locales for date picker
registerLocale('de', de);
registerLocale('tr', tr);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const VereinDitibZahlungForm: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['finanz', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = !!id && id !== 'new';

  const [formData, setFormData] = useState<CreateVereinDitibZahlungDto>({
    vereinId: user?.type === 'dernek' ? user.vereinId! : 0,
    betrag: 0,
    waehrungId: 1, // EUR
    zahlungsdatum: new Date().toISOString().split('T')[0],
    zahlungsperiode: new Date().toISOString().slice(0, 7), // YYYY-MM
    statusId: 2, // OFFEN
  });

  // Date picker states
  const [zahlungsdatumDate, setZahlungsdatumDate] = useState<Date | null>(new Date());
  const [zahlungsperiodeDate, setZahlungsperiodeDate] = useState<Date | null>(new Date());

  // Fetch Vereine (for Admin)
  const { data: vereine = [] } = useQuery({
    queryKey: ['vereine'],
    queryFn: () => vereinService.getAll(),
    enabled: user?.type === 'admin',
  });

  // Fetch existing payment (edit mode)
  const { data: zahlung, isLoading } = useQuery({
    queryKey: ['ditibZahlung', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;
      return await vereinDitibZahlungService.getById(parseInt(id));
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (zahlung) {
      setFormData({
        vereinId: zahlung.vereinId,
        betrag: zahlung.betrag,
        waehrungId: zahlung.waehrungId,
        zahlungsdatum: zahlung.zahlungsdatum.split('T')[0],
        zahlungsperiode: zahlung.zahlungsperiode,
        zahlungsweg: zahlung.zahlungsweg,
        bankkontoId: zahlung.bankkontoId,
        referenz: zahlung.referenz,
        bemerkung: zahlung.bemerkung,
        statusId: zahlung.statusId,
        bankBuchungId: zahlung.bankBuchungId,
      });

      // Set date picker states
      setZahlungsdatumDate(new Date(zahlung.zahlungsdatum));

      // Parse zahlungsperiode (YYYY-MM) to Date
      if (zahlung.zahlungsperiode) {
        const [year, month] = zahlung.zahlungsperiode.split('-');
        setZahlungsperiodeDate(new Date(parseInt(year), parseInt(month) - 1, 1));
      }
    }
  }, [zahlung]);

  const createMutation = useMutation({
    mutationFn: (data: CreateVereinDitibZahlungDto) => vereinDitibZahlungService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ditibZahlungen'] });
      navigate('/finanzen/ditib-zahlungen');
      alert(t('ditibPayments.createSuccess', { ns: 'finanz' }));
    },
    onError: (error: any) => {
      alert(`${t('common:error.error')}: ${error.message || t('ditibPayments.createError', { ns: 'finanz' })}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateVereinDitibZahlungDto) => {
      if (!id) throw new Error('ID not found');
      return vereinDitibZahlungService.update(parseInt(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ditibZahlungen'] });
      queryClient.invalidateQueries({ queryKey: ['ditibZahlung', id] });
      navigate('/finanzen/ditib-zahlungen');
      alert(t('ditibPayments.updateSuccess', { ns: 'finanz' }));
    },
    onError: (error: any) => {
      alert(`${t('common:error.error')}: ${error.message || t('ditibPayments.updateError', { ns: 'finanz' })}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.vereinId === 0) {
      alert(t('ditibPayments.selectVereinError', { ns: 'finanz' }));
      return;
    }

    if (formData.betrag <= 0) {
      alert(t('ditibPayments.invalidAmountError', { ns: 'finanz' }));
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) return <Loading />;

  // Check authorization
  if (user?.type === 'dernek' && zahlung && user.vereinId !== zahlung.vereinId) {
    return <ErrorMessage message={t('common:error.unauthorized')} />;
  }

  return (
    <div className="finanz-detail">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          {isEditMode ? t('ditibPayments.editTitle', { ns: 'finanz' }) : t('ditibPayments.newTitle', { ns: 'finanz' })}
        </h1>
        <p className="page-subtitle">{t('ditibPayments.subtitle', { ns: 'finanz' })}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/finanzen/ditib-zahlungen')}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}></div>
      </div>

      <div className="detail-content">
        <form onSubmit={handleSubmit}>
          <div className="detail-section">
            <h2>{t('ditibPayments.paymentInfo', { ns: 'finanz' })}</h2>
            <div className="detail-grid">
              {/* Verein Selection (Admin only) */}
              {user?.type === 'admin' && (
                <div className="form-group">
                  <label>{t('ditibPayments.verein', { ns: 'finanz' })} *</label>
                  <select
                    value={formData.vereinId}
                    onChange={(e) => setFormData({ ...formData, vereinId: Number(e.target.value) })}
                    required
                  >
                    <option value={0}>{t('ditibPayments.selectVerein', { ns: 'finanz' })}</option>
                    {vereine.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amount */}
              <div className="form-group">
                <label>{t('ditibPayments.amount', { ns: 'finanz' })} *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.betrag}
                  onChange={(e) => setFormData({ ...formData, betrag: parseFloat(e.target.value) })}
                  required
                />
              </div>

              {/* Payment Date */}
              <div className="form-group">
                <label>{t('ditibPayments.paymentDate', { ns: 'finanz' })} *</label>
                <DatePicker
                  selected={zahlungsdatumDate}
                  onChange={(date) => {
                    setZahlungsdatumDate(date);
                    const dateStr = date ? date.toISOString().split('T')[0] : '';
                    setFormData({ ...formData, zahlungsdatum: dateStr });
                  }}
                  locale={i18n.language}
                  dateFormat="dd.MM.yyyy"
                  placeholderText={t('ditibPayments.paymentDate', { ns: 'finanz' })}
                  className="date-picker-input"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={20}
                />
              </div>

              {/* Payment Period */}
              <div className="form-group">
                <label>{t('ditibPayments.paymentPeriod', { ns: 'finanz' })} *</label>
                <DatePicker
                  selected={zahlungsperiodeDate}
                  onChange={(date) => {
                    setZahlungsperiodeDate(date);
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      setFormData({ ...formData, zahlungsperiode: `${year}-${month}` });
                    }
                  }}
                  locale={i18n.language}
                  dateFormat="MM/yyyy"
                  placeholderText={t('ditibPayments.paymentPeriod', { ns: 'finanz' })}
                  className="date-picker-input"
                  showMonthYearPicker
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={20}
                />
              </div>

              {/* Payment Method */}
              <div className="form-group">
                <label>{t('ditibPayments.paymentMethod', { ns: 'finanz' })}</label>
                <select
                  value={formData.zahlungsweg || ''}
                  onChange={(e) => setFormData({ ...formData, zahlungsweg: e.target.value || undefined })}
                >
                  <option value="">{t('ditibPayments.selectPaymentMethod', { ns: 'finanz' })}</option>
                  <option value="Überweisung">{t('ditibPayments.bankTransfer', { ns: 'finanz' })}</option>
                  <option value="Lastschrift">{t('ditibPayments.directDebit', { ns: 'finanz' })}</option>
                  <option value="Bar">{t('ditibPayments.cash', { ns: 'finanz' })}</option>
                  <option value="Scheck">{t('ditibPayments.check', { ns: 'finanz' })}</option>
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label>{t('ditibPayments.status', { ns: 'finanz' })} *</label>
                <select
                  value={formData.statusId}
                  onChange={(e) => setFormData({ ...formData, statusId: Number(e.target.value) })}
                  required
                >
                  <option value={1}>{t('ditibPayments.statusPaid', { ns: 'finanz' })}</option>
                  <option value={2}>{t('ditibPayments.statusPending', { ns: 'finanz' })}</option>
                </select>
              </div>

              {/* Reference */}
              <div className="form-group">
                <label>{t('ditibPayments.reference', { ns: 'finanz' })}</label>
                <input
                  type="text"
                  value={formData.referenz || ''}
                  onChange={(e) => setFormData({ ...formData, referenz: e.target.value || undefined })}
                  maxLength={100}
                />
              </div>

              {/* Notes */}
              <div className="form-group full-width">
                <label>{t('ditibPayments.notes', { ns: 'finanz' })}</label>
                <textarea
                  value={formData.bemerkung || ''}
                  onChange={(e) => setFormData({ ...formData, bemerkung: e.target.value || undefined })}
                  rows={3}
                  maxLength={250}
                />
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/finanzen/ditib-zahlungen')}
            >
              {t('ditibPayments.cancel', { ns: 'finanz' })}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? t('ditibPayments.saving', { ns: 'finanz' })
                : t('ditibPayments.save', { ns: 'finanz' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VereinDitibZahlungForm;

