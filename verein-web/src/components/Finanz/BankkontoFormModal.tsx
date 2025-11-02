import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { bankkontoService } from '../../services/finanzService';
import keytableService from '../../services/keytableService';
import { BankkontoDto, CreateBankkontoDto, UpdateBankkontoDto } from '../../types/finanz.types';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../Common/Modal';
import { isValidIban, validateIbanDetailed, formatIban, getCountryNameFromIban } from '../../utils/ibanValidator';
import styles from './FinanzFormModal.module.css';

interface BankkontoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankkonto?: BankkontoDto | null;
  mode: 'create' | 'edit';
}

const BankkontoFormModal: React.FC<BankkontoFormModalProps> = ({
  isOpen,
  onClose,
  bankkonto,
  mode
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Keytable data
  const { data: kontotypen = [] } = useQuery({
    queryKey: ['keytable', 'kontotypen'],
    queryFn: () => keytableService.getKontotypen(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const [formData, setFormData] = useState({
    kontotypId: '',
    iban: '',
    bic: '',
    kontoinhaber: '',
    bankname: '',
    kontoNr: '',
    blz: '',
    beschreibung: '',
    gueltigVon: '',
    gueltigBis: '',
    istStandard: false,
    aktiv: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ibanInfo, setIbanInfo] = useState<{ isValid: boolean; message: string; country?: string } | null>(null);

  // Load form data when editing
  useEffect(() => {
    if (mode === 'edit' && bankkonto) {
      setFormData({
        kontotypId: bankkonto.kontotypId?.toString() || '',
        iban: bankkonto.iban || '',
        bic: bankkonto.bic || '',
        kontoinhaber: bankkonto.kontoinhaber || '',
        bankname: bankkonto.bankname || '',
        kontoNr: bankkonto.kontoNr || '',
        blz: bankkonto.blz || '',
        beschreibung: bankkonto.beschreibung || '',
        gueltigVon: bankkonto.gueltigVon ? bankkonto.gueltigVon.toString().split('T')[0] : '',
        gueltigBis: bankkonto.gueltigBis ? bankkonto.gueltigBis.toString().split('T')[0] : '',
        istStandard: bankkonto.istStandard || false,
        aktiv: bankkonto.aktiv !== false,
      });
    } else {
      setFormData({
        kontotypId: '',
        iban: '',
        bic: '',
        kontoinhaber: '',
        bankname: '',
        kontoNr: '',
        blz: '',
        beschreibung: '',
        gueltigVon: '',
        gueltigBis: '',
        istStandard: false,
        aktiv: true,
      });
    }
    setErrors({});
  }, [mode, bankkonto, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Real-time IBAN validation
    if (name === 'iban' && value) {
      const validation = validateIbanDetailed(value);
      const country = getCountryNameFromIban(value);
      setIbanInfo({
        isValid: validation.isValid,
        message: validation.message,
        country: country || undefined
      });
    } else if (name === 'iban' && !value) {
      setIbanInfo(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // IBAN validation - using mod-97 algorithm
    if (!formData.iban) {
      newErrors.iban = t('common:validation.required');
    } else {
      const ibanValidation = validateIbanDetailed(formData.iban);
      if (!ibanValidation.isValid) {
        newErrors.iban = ibanValidation.message;
      }
    }

    // Date range validation
    if (formData.gueltigVon && formData.gueltigBis && formData.gueltigVon > formData.gueltigBis) {
      newErrors.gueltigBis = t('common:validation.endDateBeforeStartDate');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateBankkontoDto) => bankkontoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankkonten'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: UpdateBankkontoDto }) =>
      bankkontoService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankkonten'] });
      onClose();
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === 'create') {
        const createData: CreateBankkontoDto = {
          vereinId: user?.vereinId || 0,
          kontotypId: formData.kontotypId ? parseInt(formData.kontotypId) : undefined,
          iban: formData.iban,
          bic: formData.bic || undefined,
          kontoinhaber: formData.kontoinhaber || undefined,
          bankname: formData.bankname || undefined,
          kontoNr: formData.kontoNr || undefined,
          blz: formData.blz || undefined,
          beschreibung: formData.beschreibung || undefined,
          gueltigVon: formData.gueltigVon ? new Date(formData.gueltigVon) : undefined,
          gueltigBis: formData.gueltigBis ? new Date(formData.gueltigBis) : undefined,
          istStandard: formData.istStandard,
          aktiv: formData.aktiv,
        };
        createMutation.mutate(createData);
      } else if (bankkonto) {
        const updateData: UpdateBankkontoDto = {
          vereinId: user?.vereinId || 0,
          kontotypId: formData.kontotypId ? parseInt(formData.kontotypId) : undefined,
          iban: formData.iban,
          bic: formData.bic || undefined,
          kontoinhaber: formData.kontoinhaber || undefined,
          bankname: formData.bankname || undefined,
          kontoNr: formData.kontoNr || undefined,
          blz: formData.blz || undefined,
          beschreibung: formData.beschreibung || undefined,
          gueltigVon: formData.gueltigVon ? new Date(formData.gueltigVon) : undefined,
          gueltigBis: formData.gueltigBis ? new Date(formData.gueltigBis) : undefined,
          istStandard: formData.istStandard,
          aktiv: formData.aktiv,
        };
        updateMutation.mutate({ id: bankkonto.id, data: updateData });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? t('finanz:bankAccounts.create') : t('finanz:bankAccounts.edit')}
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
            form="bankkonto-form"
            className={styles.btnPrimary}
            disabled={isLoading}
          >
            {isLoading ? t('common:saving') : mode === 'create' ? t('common:actions.create') : t('common:actions.save')}
          </button>
        </div>
      }
    >
      <form id="bankkonto-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Kontotyp */}
          <div className={styles.formGroup}>
            <label htmlFor="kontotypId">{t('finanz:bankAccounts.accountType')}</label>
            <select
              id="kontotypId"
              name="kontotypId"
              value={formData.kontotypId}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Seçiniz</option>
              {kontotypen.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>

          {/* IBAN */}
          <div className={styles.formGroup}>
            <label htmlFor="iban">
              {t('finanz:bankAccounts.iban')} <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="iban"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
              placeholder="DE89370400440532013000"
              className={errors.iban ? styles.error : ibanInfo?.isValid ? styles.success : ''}
              disabled={isLoading}
            />
            {errors.iban && <span className={styles.errorMessage}>{errors.iban}</span>}
            {ibanInfo && !errors.iban && (
              <div className={ibanInfo.isValid ? styles.successMessage : styles.infoMessage}>
                {ibanInfo.isValid && '✓ '}{ibanInfo.message}
                {ibanInfo.country && ` (${ibanInfo.country})`}
              </div>
            )}
          </div>

          {/* BIC */}
          <div className={styles.formGroup}>
            <label htmlFor="bic">{t('finanz:bankAccounts.bic')}</label>
            <input
              type="text"
              id="bic"
              name="bic"
              value={formData.bic}
              onChange={handleChange}
              placeholder="COBADEFFXXX"
              disabled={isLoading}
            />
          </div>

          {/* Kontoinhaber */}
          <div className={styles.formGroup}>
            <label htmlFor="kontoinhaber">{t('finanz:bankAccounts.accountHolder')}</label>
            <input
              type="text"
              id="kontoinhaber"
              name="kontoinhaber"
              value={formData.kontoinhaber}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Bankname */}
          <div className={styles.formGroup}>
            <label htmlFor="bankname">{t('finanz:bankAccounts.bankName')}</label>
            <input
              type="text"
              id="bankname"
              name="bankname"
              value={formData.bankname}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Beschreibung */}
          <div className={styles.formGroup}>
            <label htmlFor="beschreibung">{t('common:description')}</label>
            <textarea
              id="beschreibung"
              name="beschreibung"
              value={formData.beschreibung}
              onChange={handleChange}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Gültig Von */}
          <div className={styles.formGroup}>
            <label htmlFor="gueltigVon">{t('common:validFrom')}</label>
            <input
              type="date"
              id="gueltigVon"
              name="gueltigVon"
              value={formData.gueltigVon}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Gültig Bis */}
          <div className={styles.formGroup}>
            <label htmlFor="gueltigBis">{t('common:validUntil')}</label>
            <input
              type="date"
              id="gueltigBis"
              name="gueltigBis"
              value={formData.gueltigBis}
              onChange={handleChange}
              className={errors.gueltigBis ? styles.error : ''}
              disabled={isLoading}
            />
            {errors.gueltigBis && <span className={styles.errorMessage}>{errors.gueltigBis}</span>}
          </div>

          {/* Ist Standard */}
          <div className={styles.formGroup}>
            <label htmlFor="istStandard">
              <input
                type="checkbox"
                id="istStandard"
                name="istStandard"
                checked={formData.istStandard}
                onChange={handleChange}
                disabled={isLoading}
              />
              {t('finanz:bankAccounts.isDefault')}
            </label>
          </div>

          {/* Aktiv */}
          <div className={styles.formGroup}>
            <label htmlFor="aktiv">
              <input
                type="checkbox"
                id="aktiv"
                name="aktiv"
                checked={formData.aktiv}
                onChange={handleChange}
                disabled={isLoading}
              />
              {t('common:active')}
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default BankkontoFormModal;

