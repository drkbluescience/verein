import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { bankBuchungService } from '../../services/finanzService';
import { BankBuchungDto, CreateBankBuchungDto, UpdateBankBuchungDto } from '../../types/finanz.types';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../Common/Modal';
import styles from './FinanzFormModal.module.css';

interface BankBuchungFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  buchung?: BankBuchungDto | null;
  mode: 'create' | 'edit';
}

const BankBuchungFormModal: React.FC<BankBuchungFormModalProps> = ({
  isOpen,
  onClose,
  buchung,
  mode
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    bankKontoId: '',
    buchungsdatum: new Date().toISOString().split('T')[0],
    betrag: '',
    waehrungId: '1',
    empfaenger: '',
    verwendungszweck: '',
    referenz: '',
    statusId: '1', // BEZAHLT
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load form data when editing
  useEffect(() => {
    if (mode === 'edit' && buchung) {
      setFormData({
        bankKontoId: buchung.bankKontoId.toString(),
        buchungsdatum: buchung.buchungsdatum,
        betrag: buchung.betrag.toString(),
        waehrungId: buchung.waehrungId.toString(),
        empfaenger: buchung.empfaenger || '',
        verwendungszweck: buchung.verwendungszweck || '',
        referenz: buchung.referenz || '',
        statusId: buchung.statusId.toString(),
      });
    } else {
      setFormData({
        bankKontoId: '',
        buchungsdatum: new Date().toISOString().split('T')[0],
        betrag: '',
        waehrungId: '1',
        empfaenger: '',
        verwendungszweck: '',
        referenz: '',
        statusId: '1',
      });
    }
    setErrors({});
  }, [mode, buchung, isOpen]);

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

    if (!formData.bankKontoId) newErrors.bankKontoId = t('common:validation.required');
    if (!formData.betrag) newErrors.betrag = t('common:validation.required');
    if (formData.betrag && parseFloat(formData.betrag) === 0) newErrors.betrag = t('common:validation.mustNotBeZero');
    if (!formData.buchungsdatum) newErrors.buchungsdatum = t('common:validation.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateBankBuchungDto) => bankBuchungService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankBuchungen'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: UpdateBankBuchungDto }) =>
      bankBuchungService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankBuchungen'] });
      onClose();
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === 'create') {
        const createData: CreateBankBuchungDto = {
          vereinId: user?.vereinId || 0,
          bankKontoId: parseInt(formData.bankKontoId),
          buchungsdatum: formData.buchungsdatum,
          betrag: parseFloat(formData.betrag),
          waehrungId: parseInt(formData.waehrungId),
          empfaenger: formData.empfaenger || undefined,
          verwendungszweck: formData.verwendungszweck || undefined,
          referenz: formData.referenz || undefined,
          statusId: parseInt(formData.statusId),
        };
        await createMutation.mutateAsync(createData);
      } else if (buchung) {
        const updateData: UpdateBankBuchungDto = {
          buchungsdatum: formData.buchungsdatum,
          betrag: parseFloat(formData.betrag),
          empfaenger: formData.empfaenger || undefined,
          verwendungszweck: formData.verwendungszweck || undefined,
          referenz: formData.referenz || undefined,
          statusId: parseInt(formData.statusId),
        };
        await updateMutation.mutateAsync({ id: buchung.id, data: updateData });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? t('finanz:bankTransactions.create') : t('finanz:bankTransactions.edit')}
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
            form="buchung-form"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? t('common:saving') : mode === 'create' ? t('common:actions.create') : t('common:actions.save')}
          </button>
        </div>
      }
    >
      <form id="buchung-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Banka Hesabı */}
          <div className={styles.formGroup}>
            <label htmlFor="bankKontoId">
              {t('finanz:bankTransactions.account')} <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="bankKontoId"
              name="bankKontoId"
              value={formData.bankKontoId}
              onChange={handleChange}
              className={errors.bankKontoId ? styles.error : ''}
              disabled={isLoading || mode === 'edit'}
            />
            {errors.bankKontoId && <span className={styles.errorMessage}>{errors.bankKontoId}</span>}
          </div>

          {/* Miktar */}
          <div className={styles.formGroup}>
            <label htmlFor="betrag">
              {t('finanz:bankTransactions.amount')} <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="betrag"
              name="betrag"
              value={formData.betrag}
              onChange={handleChange}
              step="0.01"
              className={errors.betrag ? styles.error : ''}
              disabled={isLoading}
            />
            {errors.betrag && <span className={styles.errorMessage}>{errors.betrag}</span>}
          </div>

          {/* Tarih */}
          <div className={styles.formGroup}>
            <label htmlFor="buchungsdatum">
              {t('finanz:bankTransactions.date')} <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              id="buchungsdatum"
              name="buchungsdatum"
              value={formData.buchungsdatum}
              onChange={handleChange}
              className={errors.buchungsdatum ? styles.error : ''}
              disabled={isLoading}
            />
            {errors.buchungsdatum && <span className={styles.errorMessage}>{errors.buchungsdatum}</span>}
          </div>

          {/* Alıcı/Gönderici */}
          <div className={styles.formGroup}>
            <label htmlFor="empfaenger">{t('finanz:bankTransactions.recipient')}</label>
            <input
              type="text"
              id="empfaenger"
              name="empfaenger"
              value={formData.empfaenger}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Referans */}
          <div className={styles.formGroup}>
            <label htmlFor="referenz">{t('finanz:bankTransactions.reference')}</label>
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
            <label htmlFor="statusId">{t('finanz:bankTransactions.status')}</label>
            <select
              id="statusId"
              name="statusId"
              value={formData.statusId}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="1">{t('finanz:status.paid')}</option>
              <option value="2">{t('finanz:status.open')}</option>
            </select>
          </div>

          {/* Kullanım Amacı */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="verwendungszweck">{t('finanz:bankTransactions.description')}</label>
            <textarea
              id="verwendungszweck"
              name="verwendungszweck"
              value={formData.verwendungszweck}
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

export default BankBuchungFormModal;

