import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Adresse, CreateAdresseDto, UpdateAdresseDto } from '../../services/adresseService';
import keytableService from '../../services/keytableService';
import Modal from '../Common/Modal';
import styles from './AdresseFormModal.module.css';

interface AdresseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdresseDto | UpdateAdresseDto) => Promise<void>;
  adresse?: Adresse | null;
  vereinId: number;
}

const AdresseFormModal: React.FC<AdresseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  adresse,
  vereinId,
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['adressen', 'common']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch Keytable data
  const { data: adresseTypen = [] } = useQuery({
    queryKey: ['keytable', 'adressetypen'],
    queryFn: () => keytableService.getAdresseTypen(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const [formData, setFormData] = useState({
    adresseTypId: '',
    strasse: '',
    hausnummer: '',
    adresszusatz: '',
    plz: '',
    ort: '',
    stadtteil: '',
    bundesland: '',
    land: '',
    postfach: '',
    telefonnummer: '',
    faxnummer: '',
    email: '',
    kontaktperson: '',
    hinweis: '',
    istStandard: false,
    aktiv: true,
  });

  useEffect(() => {
    if (adresse) {
      setFormData({
        adresseTypId: adresse.adresseTypId?.toString() || '',
        strasse: adresse.strasse || '',
        hausnummer: adresse.hausnummer || '',
        adresszusatz: adresse.adresszusatz || '',
        plz: adresse.plz || '',
        ort: adresse.ort || '',
        stadtteil: adresse.stadtteil || '',
        bundesland: adresse.bundesland || '',
        land: adresse.land || '',
        postfach: adresse.postfach || '',
        telefonnummer: adresse.telefonnummer || '',
        faxnummer: adresse.faxnummer || '',
        email: adresse.email || '',
        kontaktperson: adresse.kontaktperson || '',
        hinweis: adresse.hinweis || '',
        istStandard: adresse.istStandard || false,
        aktiv: adresse.aktiv !== undefined ? adresse.aktiv : true,
      });
    } else {
      setFormData({
        adresseTypId: '',
        strasse: '',
        hausnummer: '',
        adresszusatz: '',
        plz: '',
        ort: '',
        stadtteil: '',
        bundesland: '',
        land: '',
        postfach: '',
        telefonnummer: '',
        faxnummer: '',
        email: '',
        kontaktperson: '',
        hinweis: '',
        istStandard: false,
        aktiv: true,
      });
    }
    setErrors({});
  }, [adresse, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.strasse.trim()) {
      newErrors.strasse = t('adressen:validation.strasseRequired');
    }

    if (!formData.plz.trim()) {
      newErrors.plz = t('adressen:validation.plzRequired');
    }

    if (!formData.ort.trim()) {
      newErrors.ort = t('adressen:validation.ortRequired');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('adressen:validation.invalidEmail');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        adresseTypId: formData.adresseTypId ? parseInt(formData.adresseTypId) : undefined,
        vereinId,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={adresse ? t('adressen:editAddress') : t('adressen:addAddress')}
      size="lg"
      closeOnOverlayClick={!isSubmitting}
      footer={
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('common:actions.cancel')}
          </button>
          <button
            type="submit"
            form="adresse-form"
            className={styles.btnPrimary}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common:actions.saving') : t('common:actions.save')}
          </button>
        </div>
      }
    >
      <form id="adresse-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Address Type */}
          <div className={styles.formGroup}>
            <label htmlFor="adresseTypId">{t('adressen:fields.addressType')}</label>
            <select
              id="adresseTypId"
              name="adresseTypId"
              value={formData.adresseTypId}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Seçiniz</option>
              {adresseTypen.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Info Section */}
          <div className={styles.formSection}>
            <h3>{t('adressen:sections.basicInfo')}</h3>
            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${styles.flex3}`}>
                <label htmlFor="strasse">
                  {t('adressen:fields.strasse')} <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="strasse"
                  name="strasse"
                  value={formData.strasse}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.strassePlaceholder')}
                  className={errors.strasse ? styles.error : ''}
                />
                {errors.strasse && <span className={styles.errorMessage}>{errors.strasse}</span>}
              </div>
              <div className={`${styles.formGroup} ${styles.flex1}`}>
                <label htmlFor="hausnummer">{t('adressen:fields.hausnummer')}</label>
                <input
                  type="text"
                  id="hausnummer"
                  name="hausnummer"
                  value={formData.hausnummer}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.hausnummerPlaceholder')}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="adresszusatz">{t('adressen:fields.adresszusatz')}</label>
              <input
                type="text"
                id="adresszusatz"
                name="adresszusatz"
                value={formData.adresszusatz}
                onChange={handleChange}
                placeholder={t('adressen:fields.adresszusatzPlaceholder')}
              />
            </div>

            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${styles.flex1}`}>
                <label htmlFor="plz">
                  {t('adressen:fields.plz')} <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="plz"
                  name="plz"
                  value={formData.plz}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.plzPlaceholder')}
                  className={errors.plz ? styles.error : ''}
                />
                {errors.plz && <span className={styles.errorMessage}>{errors.plz}</span>}
              </div>
              <div className={`${styles.formGroup} ${styles.flex2}`}>
                <label htmlFor="ort">
                  {t('adressen:fields.ort')} <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="ort"
                  name="ort"
                  value={formData.ort}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.ortPlaceholder')}
                  className={errors.ort ? styles.error : ''}
                />
                {errors.ort && <span className={styles.errorMessage}>{errors.ort}</span>}
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className={styles.formSection}>
            <h3>{t('adressen:sections.additionalInfo')}</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="stadtteil">{t('adressen:fields.stadtteil')}</label>
                <input
                  type="text"
                  id="stadtteil"
                  name="stadtteil"
                  value={formData.stadtteil}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.stadtteilPlaceholder')}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bundesland">{t('adressen:fields.bundesland')}</label>
                <input
                  type="text"
                  id="bundesland"
                  name="bundesland"
                  value={formData.bundesland}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.bundeslandPlaceholder')}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="land">{t('adressen:fields.land')}</label>
                <input
                  type="text"
                  id="land"
                  name="land"
                  value={formData.land}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.landPlaceholder')}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="postfach">{t('adressen:fields.postfach')}</label>
                <input
                  type="text"
                  id="postfach"
                  name="postfach"
                  value={formData.postfach}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.postfachPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className={styles.formSection}>
            <h3>{t('adressen:sections.contactInfo')}</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="telefonnummer">{t('adressen:fields.telefonnummer')}</label>
                <input
                  type="tel"
                  id="telefonnummer"
                  name="telefonnummer"
                  value={formData.telefonnummer}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.telefonnummerPlaceholder')}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="faxnummer">{t('adressen:fields.faxnummer')}</label>
                <input
                  type="tel"
                  id="faxnummer"
                  name="faxnummer"
                  value={formData.faxnummer}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.faxnummerPlaceholder')}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email">{t('adressen:fields.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.emailPlaceholder')}
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="kontaktperson">{t('adressen:fields.kontaktperson')}</label>
                <input
                  type="text"
                  id="kontaktperson"
                  name="kontaktperson"
                  value={formData.kontaktperson}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.kontaktpersonPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="hinweis">{t('adressen:fields.hinweis')}</label>
              <textarea
                id="hinweis"
                name="hinweis"
                value={formData.hinweis}
                onChange={handleChange}
                placeholder={t('adressen:fields.hinweisPlaceholder')}
                rows={3}
              />
            </div>

            <div className={styles.formCheckboxes}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="istStandard"
                  checked={formData.istStandard}
                  onChange={handleChange}
                />
                <span>{t('adressen:fields.istStandard')}</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="aktiv"
                  checked={formData.aktiv}
                  onChange={handleChange}
                />
                <span>{t('adressen:fields.aktiv')}</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AdresseFormModal;
