import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { mitgliedZahlungService } from '../../services/finanzService';
import keytableService from '../../services/keytableService';
import { MitgliedZahlungDto, CreateMitgliedZahlungDto, UpdateMitgliedZahlungDto } from '../../types/finanz.types';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../Common/Modal';
import styles from './FinanzFormModal.module.css';

interface MitgliedZahlungFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  zahlung?: MitgliedZahlungDto | null;
  mode: 'create' | 'edit';
}

const MitgliedZahlungFormModal: React.FC<MitgliedZahlungFormModalProps> = ({
  isOpen,
  onClose,
  zahlung,
  mode
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Keytable data
  const { data: zahlungTypen = [] } = useQuery({
    queryKey: ['keytable', 'zahlungtypen'],
    queryFn: () => keytableService.getZahlungTypen(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: zahlungStatuse = [] } = useQuery({
    queryKey: ['keytable', 'zahlungstatuse'],
    queryFn: () => keytableService.getZahlungStatuse(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: waehrungen = [] } = useQuery({
    queryKey: ['keytable', 'waehrungen'],
    queryFn: () => keytableService.getWaehrungen(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const [formData, setFormData] = useState({
    mitgliedId: '',
    zahlungTypId: '1',
    betrag: '',
    waehrungId: '1',
    zahlungsdatum: new Date().toISOString().split('T')[0],
    zahlungsweg: '',
    referenz: '',
    bemerkung: '',
    statusId: '1', // BEZAHLT
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load form data when editing
  useEffect(() => {
    if (mode === 'edit' && zahlung) {
      setFormData({
        mitgliedId: zahlung.mitgliedId.toString(),
        zahlungTypId: zahlung.zahlungTypId.toString(),
        betrag: zahlung.betrag.toString(),
        waehrungId: zahlung.waehrungId.toString(),
        zahlungsdatum: zahlung.zahlungsdatum,
        zahlungsweg: zahlung.zahlungsweg || '',
        referenz: zahlung.referenz || '',
        bemerkung: zahlung.bemerkung || '',
        statusId: zahlung.statusId.toString(),
      });
    } else {
      setFormData({
        mitgliedId: '',
        zahlungTypId: '1',
        betrag: '',
        waehrungId: '1',
        zahlungsdatum: new Date().toISOString().split('T')[0],
        zahlungsweg: '',
        referenz: '',
        bemerkung: '',
        statusId: '1',
      });
    }
    setErrors({});
  }, [mode, zahlung, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.mitgliedId) newErrors.mitgliedId = t('common:validation.required');
    if (!formData.betrag) newErrors.betrag = t('common:validation.required');
    if (parseFloat(formData.betrag) <= 0) newErrors.betrag = t('common:validation.mustBePositive');
    if (!formData.zahlungsdatum) newErrors.zahlungsdatum = t('common:validation.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateMitgliedZahlungDto) => mitgliedZahlungService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitgliedZahlungen'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: UpdateMitgliedZahlungDto }) =>
      mitgliedZahlungService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitgliedZahlungen'] });
      onClose();
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === 'create') {
        const createData: CreateMitgliedZahlungDto = {
          vereinId: user?.vereinId || 0,
          mitgliedId: parseInt(formData.mitgliedId),
          zahlungTypId: parseInt(formData.zahlungTypId),
          betrag: parseFloat(formData.betrag),
          waehrungId: parseInt(formData.waehrungId),
          zahlungsdatum: formData.zahlungsdatum,
          zahlungsweg: formData.zahlungsweg || undefined,
          referenz: formData.referenz || undefined,
          bemerkung: formData.bemerkung || undefined,
          statusId: parseInt(formData.statusId),
        };
        await createMutation.mutateAsync(createData);
      } else if (zahlung) {
        const updateData: UpdateMitgliedZahlungDto = {
          betrag: parseFloat(formData.betrag),
          zahlungsdatum: formData.zahlungsdatum,
          zahlungsweg: formData.zahlungsweg || undefined,
          referenz: formData.referenz || undefined,
          bemerkung: formData.bemerkung || undefined,
          statusId: parseInt(formData.statusId),
        };
        await updateMutation.mutateAsync({ id: zahlung.id, data: updateData });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? t('finanz:payments.create') : t('finanz:payments.edit')}
      size="lg"
      closeOnOverlayClick={!isLoading}
      footer={
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common:actions.cancel')}
          </button>
          <button
            type="submit"
            form="zahlung-form"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? t('common:saving') : mode === 'create' ? t('common:actions.create') : t('common:actions.save')}
          </button>
        </div>
      }
    >
      <form id="zahlung-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Üye */}
          <div className={styles.formGroup}>
            <label htmlFor="mitgliedId">
              {t('finanz:payments.member')} <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="mitgliedId"
              name="mitgliedId"
              value={formData.mitgliedId}
              onChange={handleChange}
              className={errors.mitgliedId ? styles.error : ''}
              disabled={isLoading || mode === 'edit'}
            />
            {errors.mitgliedId && <span className={styles.errorMessage}>{errors.mitgliedId}</span>}
          </div>

          {/* Ödeme Tipi */}
          <div className={styles.formGroup}>
            <label htmlFor="zahlungTypId">
              {t('finanz:payments.type')} <span className={styles.required}>*</span>
            </label>
            <select
              id="zahlungTypId"
              name="zahlungTypId"
              value={formData.zahlungTypId}
              onChange={handleChange}
              className={errors.zahlungTypId ? styles.error : ''}
              disabled={isLoading}
            >
              <option value="">Seçiniz</option>
              {zahlungTypen.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.zahlungTypId && <span className={styles.errorMessage}>{errors.zahlungTypId}</span>}
          </div>

          {/* Miktar */}
          <div className={styles.formGroup}>
            <label htmlFor="betrag">
              {t('finanz:payments.amount')} <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="betrag"
              name="betrag"
              value={formData.betrag}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={errors.betrag ? styles.error : ''}
              disabled={isLoading}
            />
            {errors.betrag && <span className={styles.errorMessage}>{errors.betrag}</span>}
          </div>

          {/* Para Birimi */}
          <div className={styles.formGroup}>
            <label htmlFor="waehrungId">
              {t('finanz:payments.currency')} <span className={styles.required}>*</span>
            </label>
            <select
              id="waehrungId"
              name="waehrungId"
              value={formData.waehrungId}
              onChange={handleChange}
              className={errors.waehrungId ? styles.error : ''}
              disabled={isLoading}
            >
              <option value="">Seçiniz</option>
              {waehrungen.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
            {errors.waehrungId && <span className={styles.errorMessage}>{errors.waehrungId}</span>}
          </div>

          {/* Ödeme Tarihi */}
          <div className={styles.formGroup}>
            <label htmlFor="zahlungsdatum">
              {t('finanz:payments.date')} <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              id="zahlungsdatum"
              name="zahlungsdatum"
              value={formData.zahlungsdatum}
              onChange={handleChange}
              className={errors.zahlungsdatum ? styles.error : ''}
              disabled={isLoading}
            />
            {errors.zahlungsdatum && <span className={styles.errorMessage}>{errors.zahlungsdatum}</span>}
          </div>

          {/* Ödeme Yöntemi */}
          <div className={styles.formGroup}>
            <label htmlFor="zahlungsweg">{t('finanz:payments.method')}</label>
            <input
              type="text"
              id="zahlungsweg"
              name="zahlungsweg"
              value={formData.zahlungsweg}
              onChange={handleChange}
              placeholder={t('finanz:payments.methodPlaceholder')}
              disabled={isLoading}
            />
          </div>

          {/* Referans */}
          <div className={styles.formGroup}>
            <label htmlFor="referenz">{t('finanz:payments.reference')}</label>
            <input
              type="text"
              id="referenz"
              name="referenz"
              value={formData.referenz}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Durum */}
          <div className={styles.formGroup}>
            <label htmlFor="statusId">{t('finanz:payments.status')}</label>
            <select
              id="statusId"
              name="statusId"
              value={formData.statusId}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Seçiniz</option>
              {zahlungStatuse.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Açıklama */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="bemerkung">{t('finanz:payments.description')}</label>
            <textarea
              id="bemerkung"
              name="bemerkung"
              value={formData.bemerkung}
              onChange={handleChange}
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default MitgliedZahlungFormModal;

