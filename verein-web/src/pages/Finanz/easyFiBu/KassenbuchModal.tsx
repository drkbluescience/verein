/**
 * KassenbuchModal - Modal for creating/editing Kassenbuch entries
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker, { registerLocale } from 'react-datepicker';
import { de, tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { kassenbuchService, fiBuKontoService } from '../../../services/easyFiBuService';
import { KassenbuchDto, CreateKassenbuchDto, UpdateKassenbuchDto } from '../../../types/easyFiBu.types';
import { getLocalizedKontoName } from './kontenUtils';

registerLocale('de', de);
registerLocale('tr', tr);

interface KassenbuchModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: KassenbuchDto | null;
  vereinId: number;
  jahr: number;
}

const KassenbuchModal: React.FC<KassenbuchModalProps> = ({ 
  isOpen, 
  onClose, 
  entry, 
  vereinId, 
  jahr 
}) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [belegDate, setBelegDate] = useState<Date | null>(new Date());

  // Form state
  const [formData, setFormData] = useState<CreateKassenbuchDto>({
    vereinId,
    jahr,
    belegDatum: new Date().toISOString().split('T')[0],
    buchungstext: '',
    fiBuNummer: '',
    kasseEinnahme: 0,
    kasseAusgabe: 0,
    bankEinnahme: 0,
    bankAusgabe: 0,
    notiz: '',
  });

  // Fetch FiBu accounts
  const { data: konten = [] } = useQuery({
    queryKey: ['fibu-konten-active'],
    queryFn: () => fiBuKontoService.getActive(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateKassenbuchDto) => kassenbuchService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kassenbuch', vereinId, jahr] });
      queryClient.invalidateQueries({ queryKey: ['kassenbuch-summary', vereinId, jahr] });
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateKassenbuchDto) => kassenbuchService.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kassenbuch', vereinId, jahr] });
      queryClient.invalidateQueries({ queryKey: ['kassenbuch-summary', vereinId, jahr] });
      onClose();
    },
  });

  // Initialize form with entry data
  useEffect(() => {
    if (entry) {
      setBelegDate(new Date(entry.belegDatum));
      setFormData({
        vereinId,
        jahr,
        belegDatum: entry.belegDatum.split('T')[0],
        buchungstext: entry.buchungstext,
        fiBuNummer: entry.fiBuNummer,
        kasseEinnahme: entry.kasseEinnahme || 0,
        kasseAusgabe: entry.kasseAusgabe || 0,
        bankEinnahme: entry.bankEinnahme || 0,
        bankAusgabe: entry.bankAusgabe || 0,
        notiz: entry.notiz || '',
      });
    } else {
      const today = new Date();
      setBelegDate(today);
      setFormData({
        vereinId,
        jahr,
        belegDatum: today.toISOString().split('T')[0],
        buchungstext: '',
        fiBuNummer: '',
        kasseEinnahme: 0,
        kasseAusgabe: 0,
        bankEinnahme: 0,
        bankAusgabe: 0,
        notiz: '',
      });
    }
  }, [entry, vereinId, jahr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one amount field is filled
    const hasAmount = (formData.kasseEinnahme || 0) > 0 ||
                      (formData.kasseAusgabe || 0) > 0 ||
                      (formData.bankEinnahme || 0) > 0 ||
                      (formData.bankAusgabe || 0) > 0;
    
    if (!hasAmount) {
      alert(t('finanz:easyFiBu.kassenbuch.validation.amountRequired'));
      return;
    }

    if (entry) {
      updateMutation.mutate({
        id: entry.id,
        belegDatum: formData.belegDatum,
        buchungstext: formData.buchungstext,
        fiBuNummer: formData.fiBuNummer,
        einnahme: undefined,
        ausgabe: undefined,
        kasseEinnahme: formData.kasseEinnahme,
        kasseAusgabe: formData.kasseAusgabe,
        bankEinnahme: formData.bankEinnahme,
        bankAusgabe: formData.bankAusgabe,
        mitgliedId: undefined,
        notiz: formData.notiz,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name.includes('Einnahme') || name.includes('Ausgabe'))
        ? (value === '' ? 0 : parseFloat(value) || 0)
        : value,
    }));
  };

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="modal-overlay">
      <div className="modal-content kassenbuch-modal">
        <div className="modal-header">
          <h2>
            {entry 
              ? t('finanz:easyFiBu.kassenbuch.editEntry') 
              : t('finanz:easyFiBu.kassenbuch.newEntry')
            }
          </h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
          <div className="form-group">
            <label htmlFor="belegDatum">{t('finanz:easyFiBu.kassenbuch.belegDatum')}</label>
            <DatePicker
              selected={belegDate}
              onChange={(date) => {
                setBelegDate(date);
                setFormData(prev => ({
                  ...prev,
                  belegDatum: date ? date.toISOString().split('T')[0] : '',
                }));
              }}
              locale={i18n.language}
              dateFormat="dd.MM.yyyy"
              placeholderText={t('finanz:easyFiBu.kassenbuch.belegDatum')}
              className="date-picker-input"
              required
              disabled={isSubmitting}
            />
          </div>

            <div className="form-group">
              <label htmlFor="fiBuNummer">{t('finanz:easyFiBu.kassenbuch.konto')}</label>
              <select
                id="fiBuNummer"
                name="fiBuNummer"
                value={formData.fiBuNummer}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">{t('finanz:easyFiBu.common.select')}</option>
                {konten.map(konto => (
                  <option key={konto.id} value={konto.nummer}>
                    {konto.nummer} - {getLocalizedKontoName(konto, i18n.language)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="buchungstext">{t('finanz:easyFiBu.kassenbuch.buchungstext')}</label>
            <input
              type="text"
              id="buchungstext"
              name="buchungstext"
              value={formData.buchungstext}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="kasseEinnahme">{t('finanz:easyFiBu.kassenbuch.kasseEinnahme')}</label>
              <input
                type="number"
                id="kasseEinnahme"
                name="kasseEinnahme"
                value={formData.kasseEinnahme === 0 ? '' : formData.kasseEinnahme || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="kasseAusgabe">{t('finanz:easyFiBu.kassenbuch.kasseAusgabe')}</label>
              <input
                type="number"
                id="kasseAusgabe"
                name="kasseAusgabe"
                value={formData.kasseAusgabe === 0 ? '' : formData.kasseAusgabe || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bankEinnahme">{t('finanz:easyFiBu.kassenbuch.bankEinnahme')}</label>
              <input
                type="number"
                id="bankEinnahme"
                name="bankEinnahme"
                value={formData.bankEinnahme === 0 ? '' : formData.bankEinnahme || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bankAusgabe">{t('finanz:easyFiBu.kassenbuch.bankAusgabe')}</label>
              <input
                type="number"
                id="bankAusgabe"
                name="bankAusgabe"
                value={formData.bankAusgabe === 0 ? '' : formData.bankAusgabe || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notiz">{t('finanz:easyFiBu.kassenbuch.notiz')}</label>
            <textarea
              id="notiz"
              name="notiz"
              value={formData.notiz || ''}
              onChange={handleChange}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              {t('finanz:easyFiBu.common.cancel')}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? t('finanz:easyFiBu.common.saving') 
                : entry 
                  ? t('finanz:easyFiBu.common.update') 
                  : t('finanz:easyFiBu.common.save')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KassenbuchModal;
