import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { VereinDto, UpdateVereinDto } from '../../types/verein';
import './VereinFormModal.css';

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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content verein-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('vereine:editVerein')}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="verein-form">
          <div className="form-grid">
            {/* Dernek Adı */}
            <div className="form-group full-width">
              <label htmlFor="name">
                {t('vereine:fields.name')} <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                required
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Kısa Ad */}
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
              <label htmlFor="email">{t('vereine:fields.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Webseite */}
            <div className="form-group">
              <label htmlFor="webseite">{t('vereine:fields.webseite')}</label>
              <input
                type="url"
                id="webseite"
                name="webseite"
                value={formData.webseite || ''}
                onChange={handleChange}
                className={errors.webseite ? 'error' : ''}
                placeholder="https://example.com"
              />
              {errors.webseite && <span className="error-message">{errors.webseite}</span>}
            </div>

            {/* Vorstandsvorsitzender */}
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group full-width">
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
            <div className="form-group checkbox-group">
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

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('common:actions.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('common:actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VereinFormModal;

