import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { VereinDto, UpdateVereinDto } from '../../types/verein';
import Modal from '../Common/Modal';
import styles from './VereinFormModal.module.css';

interface VereinFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateVereinDto) => void;
  verein: VereinDto;
}

const VereinFormModal: React.FC<VereinFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  verein,
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine', 'common']);

  const [formData, setFormData] = useState<UpdateVereinDto>({
    name: verein.name,
    kurzname: verein.kurzname || '',
    telefon: verein.telefon || '',
    email: verein.email || '',
    webseite: verein.webseite || '',
    vorstandsvorsitzender: verein.vorstandsvorsitzender || '',
    kontaktperson: verein.kontaktperson || '',
    gruendungsdatum: verein.gruendungsdatum || '',
    zweck: verein.zweck || '',
    aktiv: verein.aktiv,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: verein.name,
        kurzname: verein.kurzname || '',
        telefon: verein.telefon || '',
        email: verein.email || '',
        webseite: verein.webseite || '',
        vorstandsvorsitzender: verein.vorstandsvorsitzender || '',
        kontaktperson: verein.kontaktperson || '',
        gruendungsdatum: verein.gruendungsdatum || '',
        zweck: verein.zweck || '',
        aktiv: verein.aktiv,
      });
      setErrors({});
    }
  }, [isOpen, verein]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = t('vereine:validation.nameRequired');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('vereine:validation.invalidEmail');
    }

    if (formData.webseite && !/^https?:\/\/.+/.test(formData.webseite)) {
      newErrors.webseite = t('vereine:validation.invalidUrl');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('vereine:editVerein')}
      size="lg"
      footer={
        <div className={styles.footer}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            {t('common:actions.cancel')}
          </button>
          <button type="submit" form="verein-form" className={styles.btnPrimary}>
            {t('common:actions.save')}
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
              <input
                type="date"
                id="gruendungsdatum"
                name="gruendungsdatum"
                value={
                  formData.gruendungsdatum
                    ? new Date(formData.gruendungsdatum).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleChange}
              />
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

