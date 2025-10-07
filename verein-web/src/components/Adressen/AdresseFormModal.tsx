import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Adresse, CreateAdresseDto, UpdateAdresseDto } from '../../services/adresseService';
import './AdresseFormModal.css';

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

  // Form state
  const [formData, setFormData] = useState({
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

  // Load existing adresse data when editing
  useEffect(() => {
    if (adresse) {
      setFormData({
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
        aktiv: adresse.aktiv !== false,
      });
    } else {
      // Reset form for new adresse
      setFormData({
        strasse: '',
        hausnummer: '',
        adresszusatz: '',
        plz: '',
        ort: '',
        stadtteil: '',
        bundesland: '',
        land: 'Deutschland',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.strasse.trim()) {
      newErrors.strasse = t('adressen:errors.strasseRequired');
    }
    if (!formData.plz.trim()) {
      newErrors.plz = t('adressen:errors.plzRequired');
    }
    if (!formData.ort.trim()) {
      newErrors.ort = t('adressen:errors.ortRequired');
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('adressen:errors.invalidEmail');
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content adresse-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{adresse ? t('adressen:editAddress') : t('adressen:addAddress')}</h2>
          <button className="close-button" onClick={handleClose} disabled={isSubmitting}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="adresse-form">
          {/* Basic Info Section */}
          <div className="form-section">
            <h3>{t('adressen:sections.basicInfo')}</h3>
            <div className="form-row">
              <div className="form-group flex-3">
                <label htmlFor="strasse">
                  {t('adressen:fields.strasse')} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="strasse"
                  name="strasse"
                  value={formData.strasse}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.strassePlaceholder')}
                  className={errors.strasse ? 'error' : ''}
                />
                {errors.strasse && <span className="error-message">{errors.strasse}</span>}
              </div>
              <div className="form-group flex-1">
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

            <div className="form-group">
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

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="plz">
                  {t('adressen:fields.plz')} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="plz"
                  name="plz"
                  value={formData.plz}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.plzPlaceholder')}
                  className={errors.plz ? 'error' : ''}
                />
                {errors.plz && <span className="error-message">{errors.plz}</span>}
              </div>
              <div className="form-group flex-2">
                <label htmlFor="ort">
                  {t('adressen:fields.ort')} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="ort"
                  name="ort"
                  value={formData.ort}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.ortPlaceholder')}
                  className={errors.ort ? 'error' : ''}
                />
                {errors.ort && <span className="error-message">{errors.ort}</span>}
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="form-section">
            <h3>{t('adressen:sections.additionalInfo')}</h3>
            <div className="form-row">
              <div className="form-group">
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
              <div className="form-group">
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

            <div className="form-row">
              <div className="form-group">
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
              <div className="form-group">
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
          <div className="form-section">
            <h3>{t('adressen:sections.contactInfo')}</h3>
            <div className="form-row">
              <div className="form-group">
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
              <div className="form-group">
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">{t('adressen:fields.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('adressen:fields.emailPlaceholder')}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
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

          {/* Notes and Settings Section */}
          <div className="form-section">
            <div className="form-group">
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

            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="istStandard"
                  checked={formData.istStandard}
                  onChange={handleChange}
                />
                <span>{t('adressen:fields.istStandard')}</span>
              </label>
              <label className="checkbox-label">
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

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('common:actions.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common:status.saving') : t('common:actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdresseFormModal;

