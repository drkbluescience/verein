import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import DatePicker, { registerLocale } from 'react-datepicker';
import { de, tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { VereinDto, UpdateVereinDto, CreateVereinDto } from '../../types/verein';
import { OrganizationDto } from '../../types/organization';
import keytableService from '../../services/keytableService';
import { organizationService } from '../../services/organizationService';
import Modal from '../Common/Modal';
import SocialMediaEditor from './SocialMediaEditor';
import styles from './VereinFormModal.module.css';

// Register locales for date picker
registerLocale('de', de);
registerLocale('tr', tr);

interface VereinFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateVereinDto | CreateVereinDto) => void;
  verein?: VereinDto | null;
  mode: 'create' | 'edit';
}

const VereinFormModal: React.FC<VereinFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  verein,
  mode,
}) => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['vereine', 'common']);

  // Fetch Keytable data
  const { data: rechtsformen = [] } = useQuery({
    queryKey: ['keytable', 'rechtsformen'],
    queryFn: () => keytableService.getRechtsformen(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const { data: organizationOptions = [] } = useQuery<OrganizationDto[]>({
    queryKey: ['organizations', 'verein'],
    queryFn: () => organizationService.getAll({ orgType: 'Verein', includeDeleted: false }),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const [formData, setFormData] = useState<UpdateVereinDto>({
    name: '',
    kurzname: '',
    telefon: '',
    fax: '',
    email: '',
    webseite: '',
    vorstandsvorsitzender: '',
    geschaeftsfuehrer: '',
    kontaktperson: '',
    vertreterEmail: '',
    gruendungsdatum: '',
    zweck: '',
    socialMediaLinks: '',
    rechtsformId: undefined,
    organizationId: undefined,
    aktiv: true,
  });

  const [organizationMode, setOrganizationMode] = useState<'existing' | 'new'>('existing');
  const [gruendungsdatumDate, setGruendungsdatumDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && verein) {
        setFormData({
          name: verein.name,
          kurzname: verein.kurzname || '',
          telefon: verein.telefon || '',
          fax: verein.fax || '',
          email: verein.email || '',
          webseite: verein.webseite || '',
          vorstandsvorsitzender: verein.vorstandsvorsitzender || '',
          geschaeftsfuehrer: verein.geschaeftsfuehrer || '',
          kontaktperson: verein.kontaktperson || '',
          vertreterEmail: verein.vertreterEmail || '',
          gruendungsdatum: verein.gruendungsdatum || '',
          zweck: verein.zweck || '',
          socialMediaLinks: verein.socialMediaLinks || '',
          rechtsformId: verein.rechtsformId,
          organizationId: verein.organizationId,
          aktiv: verein.aktiv,
        });
        setGruendungsdatumDate(verein.gruendungsdatum ? new Date(verein.gruendungsdatum) : null);
        setOrganizationMode('existing');
      } else {
        // Reset form for create mode
        setFormData({
          name: '',
          kurzname: '',
          telefon: '',
          fax: '',
          email: '',
          webseite: '',
          vorstandsvorsitzender: '',
          geschaeftsfuehrer: '',
          kontaktperson: '',
          vertreterEmail: '',
          gruendungsdatum: '',
          zweck: '',
          socialMediaLinks: '',
          rechtsformId: undefined,
          organizationId: undefined,
          aktiv: true,
        });
        setGruendungsdatumDate(null);
        setOrganizationMode('existing');
      }
      setErrors({});
    }
  }, [isOpen, verein, mode]);

  useEffect(() => {
    if (isOpen && mode === 'create' && organizationOptions.length === 0) {
      setOrganizationMode('new');
    }
  }, [isOpen, mode, organizationOptions.length]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleOrganizationModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMode = e.target.value as 'existing' | 'new';
    setOrganizationMode(nextMode);

    if (nextMode === 'new') {
      setFormData((prev) => ({ ...prev, organizationId: undefined }));
    }
  };

  const handleOrganizationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      organizationId: value ? Number(value) : undefined,
    }));

    if (errors.organizationId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.organizationId;
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = t('vereine:validation.nameRequired');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('vereine:validation.invalidEmail');
    }

    if (formData.vertreterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vertreterEmail)) {
      newErrors.vertreterEmail = t('vereine:validation.invalidEmail');
    }

    if (formData.webseite && !/^https?:\/\/.+/.test(formData.webseite)) {
      newErrors.webseite = t('vereine:validation.invalidUrl');
    }

    if (organizationMode === 'existing' && !formData.organizationId) {
      newErrors.organizationId = t('vereine:validation.organizationRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (mode === 'create' && organizationMode === 'new') {
      try {
        const createdOrganization = await organizationService.create({
          name: formData.name?.trim() || '',
          orgType: 'Verein',
          aktiv: true,
        });
        onSubmit({ ...formData, organizationId: createdOrganization.id });
        return;
      } catch (error: any) {
        const responseData = error?.response?.data;
        const message = typeof responseData === 'string'
          ? responseData
          : responseData?.message || error?.message || t('vereine:messages.error');
        setErrors((prev) => ({ ...prev, organizationId: message }));
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? t('vereine:createVerein') : t('vereine:editVerein')}
      size="lg"
      footer={
        <div className={styles.footer}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            {t('common:actions.cancel')}
          </button>
          <button type="submit" form="verein-form" className={styles.btnPrimary}>
            {mode === 'create' ? t('common:actions.create') : t('common:actions.save')}
          </button>
        </div>
      }
    >
      <form id="verein-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
            {/* Dernek Adı */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="name">
                {t('vereine:fields.name')} <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className={errors.name ? styles.error : ''}
                required
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            {/* Organization Selection */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="organizationId">
                {t('vereine:fields.organization')} <span className={styles.required}>*</span>
              </label>
              {mode === 'create' && (
                <div className={styles.toggleGroup}>
                  <label className={styles.toggleOption}>
                    <input
                      type="radio"
                      name="organizationMode"
                      value="existing"
                      checked={organizationMode === 'existing'}
                      onChange={handleOrganizationModeChange}
                    />
                    <span>{t('vereine:fields.organizationSelect')}</span>
                  </label>
                  <label className={styles.toggleOption}>
                    <input
                      type="radio"
                      name="organizationMode"
                      value="new"
                      checked={organizationMode === 'new'}
                      onChange={handleOrganizationModeChange}
                    />
                    <span>{t('vereine:fields.organizationCreate')}</span>
                  </label>
                </div>
              )}

              {organizationMode === 'existing' ? (
                <select
                  id="organizationId"
                  name="organizationId"
                  className={`${styles.selectInput} ${errors.organizationId ? styles.error : ''}`}
                  value={formData.organizationId ?? ''}
                  onChange={handleOrganizationSelect}
                  required
                >
                  <option value="">{t('common:actions.pleaseSelect')}</option>
                  {organizationOptions.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={styles.helperText}>
                  {t('vereine:fields.organizationAuto')}
                </div>
              )}
              {errors.organizationId && <span className={styles.errorMessage}>{errors.organizationId}</span>}
            </div>

            {/* Kısa Ad */}
            <div className={styles.formGroup}>
              <label htmlFor="kurzname">{t('vereine:fields.kurzname')}</label>
              <input
                type="text"
                id="kurzname"
                name="kurzname"
                value={formData.kurzname || ''}
                onChange={handleChange}
              />
            </div>

            {/* Telefon */}
            <div className={styles.formGroup}>
              <label htmlFor="telefon">{t('vereine:fields.telefon')}</label>
              <input
                type="tel"
                id="telefon"
                name="telefon"
                value={formData.telefon || ''}
                onChange={handleChange}
              />
            </div>

            {/* Fax */}
            <div className={styles.formGroup}>
              <label htmlFor="fax">{t('vereine:fields.fax')}</label>
              <input
                type="tel"
                id="fax"
                name="fax"
                value={formData.fax || ''}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email">{t('vereine:fields.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={errors.email ? styles.error : ''}
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>

            {/* Vertreter Email */}
            <div className={styles.formGroup}>
              <label htmlFor="vertreterEmail">{t('vereine:fields.vertreterEmail')}</label>
              <input
                type="email"
                id="vertreterEmail"
                name="vertreterEmail"
                value={formData.vertreterEmail || ''}
                onChange={handleChange}
                className={errors.vertreterEmail ? styles.error : ''}
              />
              {errors.vertreterEmail && <span className={styles.errorMessage}>{errors.vertreterEmail}</span>}
            </div>

            {/* Webseite */}
            <div className={styles.formGroup}>
              <label htmlFor="webseite">{t('vereine:fields.webseite')}</label>
              <input
                type="url"
                id="webseite"
                name="webseite"
                value={formData.webseite || ''}
                onChange={handleChange}
                className={errors.webseite ? styles.error : ''}
                placeholder="https://example.com"
              />
              {errors.webseite && <span className={styles.errorMessage}>{errors.webseite}</span>}
            </div>

            {/* Vorstandsvorsitzender */}
            <div className={styles.formGroup}>
              <label htmlFor="vorstandsvorsitzender">
                {t('vereine:fields.vorstandsvorsitzender')}
              </label>
              <input
                type="text"
                id="vorstandsvorsitzender"
                name="vorstandsvorsitzender"
                value={formData.vorstandsvorsitzender || ''}
                onChange={handleChange}
              />
            </div>

            {/* Geschaeftsfuehrer */}
            <div className={styles.formGroup}>
              <label htmlFor="geschaeftsfuehrer">
                {t('vereine:fields.geschaeftsfuehrer')}
              </label>
              <input
                type="text"
                id="geschaeftsfuehrer"
                name="geschaeftsfuehrer"
                value={formData.geschaeftsfuehrer || ''}
                onChange={handleChange}
              />
            </div>

            {/* Kontaktperson */}
            <div className={styles.formGroup}>
              <label htmlFor="kontaktperson">{t('vereine:fields.kontaktperson')}</label>
              <input
                type="text"
                id="kontaktperson"
                name="kontaktperson"
                value={formData.kontaktperson || ''}
                onChange={handleChange}
              />
            </div>

            {/* Gruendungsdatum */}
            <div className={styles.formGroup}>
              <label htmlFor="gruendungsdatum">
                {t('vereine:fields.gruendungsdatum')}
              </label>
              <DatePicker
                selected={gruendungsdatumDate}
                onChange={(date) => {
                  setGruendungsdatumDate(date);
                  const dateStr = date ? date.toISOString().split('T')[0] : '';
                  setFormData(prev => ({ ...prev, gruendungsdatum: dateStr }));
                }}
                locale={i18n.language}
                dateFormat="dd.MM.yyyy"
                placeholderText={t('vereine:fields.gruendungsdatum')}
                className={styles.datePickerInput}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
              />
            </div>

            {/* Hukuki Şekil */}
            <div className={styles.formGroup}>
              <label htmlFor="rechtsformId">
                {t('vereine:fields.rechtsform')}
              </label>
              <select
                id="rechtsformId"
                name="rechtsformId"
                value={formData.rechtsformId?.toString() || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    rechtsformId: value ? parseInt(value) : undefined,
                  }));
                }}
                className={styles.selectInput}
              >
                <option value="">Seçiniz</option>
                {rechtsformen.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zweck */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="zweck">{t('vereine:fields.zweck')}</label>
              <textarea
                id="zweck"
                name="zweck"
                value={formData.zweck || ''}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Sosyal Medya */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <SocialMediaEditor
                value={formData.socialMediaLinks}
                onChange={(value) => setFormData(prev => ({ ...prev, socialMediaLinks: value }))}
                label={t('vereine:fields.socialMedia')}
              />
            </div>

            {/* Aktiv */}
            <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
              <label htmlFor="aktiv">
                <input
                  type="checkbox"
                  id="aktiv"
                  name="aktiv"
                  checked={formData.aktiv || false}
                  onChange={handleChange}
                />
                {t('vereine:fields.aktiv')}
              </label>
            </div>
          </div>
      </form>
    </Modal>
  );
};

export default VereinFormModal;
