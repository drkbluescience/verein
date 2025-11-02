import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { mitgliedForderungService } from '../../services/finanzService';
import { MitgliedForderungDto, CreateMitgliedForderungDto, UpdateMitgliedForderungDto } from '../../types/finanz.types';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../Common/Modal';
import styles from './FinanzFormModal.module.css';

interface MitgliedForderungFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  forderung?: MitgliedForderungDto | null;
  mode: 'create' | 'edit';
}

const MitgliedForderungFormModal: React.FC<MitgliedForderungFormModalProps> = ({
  isOpen,
  onClose,
  forderung,
  mode
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    mitgliedId: '',
    zahlungTypId: '1',
    forderungsnummer: '',
    betrag: '',
    waehrungId: '1',
    jahr: new Date().getFullYear().toString(),
    quartal: '',
    monat: '',
    faelligkeit: '',
    beschreibung: '',
    statusId: '2', // OFFEN
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load form data when editing
  useEffect(() => {
    if (mode === 'edit' && forderung) {
      setFormData({
        mitgliedId: forderung.mitgliedId.toString(),
        zahlungTypId: forderung.zahlungTypId.toString(),
        forderungsnummer: forderung.forderungsnummer || '',
        betrag: forderung.betrag.toString(),
        waehrungId: forderung.waehrungId.toString(),
        jahr: forderung.jahr?.toString() || new Date().getFullYear().toString(),
        quartal: forderung.quartal?.toString() || '',
        monat: forderung.monat?.toString() || '',
        faelligkeit: forderung.faelligkeit,
        beschreibung: forderung.beschreibung || '',
        statusId: forderung.statusId.toString(),
      });
    } else {
      setFormData({
        mitgliedId: '',
        zahlungTypId: '1',
        forderungsnummer: '',
        betrag: '',
        waehrungId: '1',
        jahr: new Date().getFullYear().toString(),
        quartal: '',
        monat: '',
        faelligkeit: '',
        beschreibung: '',
        statusId: '2',
      });
    }
    setErrors({});
  }, [mode, forderung, isOpen]);

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
    if (!formData.faelligkeit) newErrors.faelligkeit = t('common:validation.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateMitgliedForderungDto) => mitgliedForderungService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitgliedForderungen'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: UpdateMitgliedForderungDto }) =>
      mitgliedForderungService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitgliedForderungen'] });
      onClose();
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === 'create') {
        const createData: CreateMitgliedForderungDto = {
          vereinId: user?.vereinId || 0,
          mitgliedId: parseInt(formData.mitgliedId),
          zahlungTypId: parseInt(formData.zahlungTypId),
          forderungsnummer: formData.forderungsnummer || undefined,
          betrag: parseFloat(formData.betrag),
          waehrungId: parseInt(formData.waehrungId),
          jahr: formData.jahr ? parseInt(formData.jahr) : undefined,
          quartal: formData.quartal ? parseInt(formData.quartal) : undefined,
          monat: formData.monat ? parseInt(formData.monat) : undefined,
          faelligkeit: formData.faelligkeit,
          beschreibung: formData.beschreibung || undefined,
          statusId: parseInt(formData.statusId),
        };
        await createMutation.mutateAsync(createData);
      } else if (forderung) {
        const updateData: UpdateMitgliedForderungDto = {
          betrag: parseFloat(formData.betrag),
          faelligkeit: formData.faelligkeit,
          beschreibung: formData.beschreibung || undefined,
          statusId: parseInt(formData.statusId),
        };
        await updateMutation.mutateAsync({ id: forderung.id, data: updateData });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? t('finanz:claims.create') : t('finanz:claims.edit')}
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
            form="forderung-form"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? t('common:saving') : mode === 'create' ? t('common:actions.create') : t('common:actions.save')}
          </button>
        </div>
      }
    >
      <form id="forderung-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Üye */}
          <div className={styles.formGroup}>
            <label htmlFor="mitgliedId">
              {t('finanz:claims.member')} <span className={styles.required}>*</span>
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

          {/* Miktar */}
          <div className={styles.formGroup}>
            <label htmlFor="betrag">
              {t('finanz:claims.amount')} <span className={styles.required}>*</span>
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

          {/* Vade Tarihi */}
          <div className={styles.formGroup}>
            <label htmlFor="faelligkeit">
              {t('finanz:claims.dueDate')} <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              id="faelligkeit"
              name="faelligkeit"
              value={formData.faelligkeit}
              onChange={handleChange}
              className={errors.faelligkeit ? styles.error : ''}
              disabled={isLoading}
            />
            {errors.faelligkeit && <span className={styles.errorMessage}>{errors.faelligkeit}</span>}
          </div>

          {/* Durum */}
          <div className={styles.formGroup}>
            <label htmlFor="statusId">{t('finanz:claims.status')}</label>
            <select
              id="statusId"
              name="statusId"
              value={formData.statusId}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Seçiniz</option>
              <option value="1">OFFEN</option>
              <option value="2">BEZAHLT</option>
              <option value="3">STORNIERT</option>
            </select>
          </div>

          {/* Açıklama */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="beschreibung">{t('finanz:claims.description')}</label>
            <textarea
              id="beschreibung"
              name="beschreibung"
              value={formData.beschreibung}
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

export default MitgliedForderungFormModal;

