/**
 * KontenModal - Modal for creating/editing FiBu Konto entries
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fiBuKontoService } from '../../../services/easyFiBuService';
import { FiBuKontoDto, CreateFiBuKontoDto, UpdateFiBuKontoDto, FIBU_KATEGORIEN } from '../../../types/easyFiBu.types';

interface KontenModalProps {
  isOpen: boolean;
  onClose: () => void;
  konto: FiBuKontoDto | null;
}

const KontenModal: React.FC<KontenModalProps> = ({ isOpen, onClose, konto }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState('');

  const altKategorieOptions = useMemo(() => ({
    [FIBU_KATEGORIEN.IDEELLER_BEREICH]: ['Aidat', 'Bagis', 'Kira'],
    [FIBU_KATEGORIEN.VERMOEGENSVERWALTUNG]: ['Kira', 'Faiz', 'Yatirim'],
    [FIBU_KATEGORIEN.ZWECKBETRIEB]: ['Etkinlik', 'Hizmet', 'Satis'],
    [FIBU_KATEGORIEN.WIRTSCHAFTLICHER_BETRIEB]: ['Ticari Gelir', 'Ticari Gider'],
    [FIBU_KATEGORIEN.DURCHLAUFENDE_POSTEN]: ['Emanet', 'Transfer'],
    Gelir: ['Aidat', 'Bagis', 'Kira'],
  }), []);


  const defaultFormData: CreateFiBuKontoDto = {
    nummer: '',
    bezeichnung: '',
    kategorie: '',
    unterkategorie: '',
    kontoTyp: '',
    istEinnahme: false,
    istAusgabe: false,
    istDurchlaufend: false,
    beschreibung: '',
    sortierung: 10,
  };

  // Form state
  const [formData, setFormData] = useState<CreateFiBuKontoDto>(defaultFormData);

  const { data: existingKonten = [] } = useQuery({
    queryKey: ['fibu-konten-all'],
    queryFn: () => fiBuKontoService.getAll(),
    enabled: isOpen,
  });

  const handleClose = () => {
    setFormData({ ...defaultFormData });
    setSuccessMessage('');
    onClose();
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateFiBuKontoDto) => fiBuKontoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibu-konten'] });
      queryClient.invalidateQueries({ queryKey: ['fibu-konten', false] });
      setSuccessMessage(t('finanz:easyFiBu.konten.successCreated'));
      setTimeout(() => {
        handleClose();
      }, 1200);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateFiBuKontoDto) => fiBuKontoService.update(konto!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibu-konten'] });
      queryClient.invalidateQueries({ queryKey: ['fibu-konten', false] });
      handleClose();
    },
  });

  // Initialize form with konto data
  useEffect(() => {
    if (konto) {
      const normalizedType = konto.istDurchlaufend
        ? 'durchlaufend'
        : konto.istEinnahme
          ? 'einnahme'
          : konto.istAusgabe
            ? 'ausgabe'
            : '';

      setFormData({
        nummer: konto.nummer,
        bezeichnung: konto.bezeichnung,
        kategorie: konto.kategorie,
        unterkategorie: konto.unterkategorie || '',
        kontoTyp: konto.kontoTyp,
        istEinnahme: normalizedType === 'einnahme',
        istAusgabe: normalizedType === 'ausgabe',
        istDurchlaufend: normalizedType === 'durchlaufend',
        beschreibung: konto.beschreibung || '',
        sortierung: konto.sortierung ?? 10,
      });
    } else {
      setFormData({ ...defaultFormData });
    }
    setSuccessMessage('');
  }, [konto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const kontoArt = formData.istDurchlaufend
      ? 'durchlaufend'
      : formData.istEinnahme
        ? 'einnahme'
        : formData.istAusgabe
          ? 'ausgabe'
          : '';

    if (!kontoArt) {
      alert(t('finanz:easyFiBu.konten.validation.kontoArtRequired'));
      return;
    }

    if (formData.nummer) {
      const duplicate = existingKonten.some((existing) => (
        existing.nummer === formData.nummer && existing.id !== konto?.id
      ));
      if (duplicate) {
        alert(t('finanz:easyFiBu.konten.validation.nummerExists'));
        return;
      }
    }

    if (konto) {
      updateMutation.mutate({
        id: konto.id,
        ...formData,
        aktiv: konto.aktiv,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'nummer') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    } else if (name === 'kategorie') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        unterkategorie: '',
      }));
    } else if (name === 'sortierung') {
      const nextValue = value === '' ? 10 : parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: nextValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const kontoArt = formData.istDurchlaufend
    ? 'durchlaufend'
    : formData.istEinnahme
      ? 'einnahme'
      : formData.istAusgabe
        ? 'ausgabe'
        : '';
  const altKategorien = formData.kategorie
    ? altKategorieOptions[formData.kategorie as keyof typeof altKategorieOptions] || []
    : [];

  const handleAccountTypeChange = (value: 'einnahme' | 'ausgabe' | 'durchlaufend') => {
    setFormData(prev => ({
      ...prev,
      istEinnahme: value === 'einnahme',
      istAusgabe: value === 'ausgabe',
      istDurchlaufend: value === 'durchlaufend',
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content konten-modal">
        <div className="modal-header">
          <h2>
            {konto 
              ? t('finanz:easyFiBu.konten.editKonto') 
              : t('finanz:easyFiBu.konten.newKonto')
            }
          </h2>
          <button className="modal-close" onClick={handleClose} disabled={isSubmitting}>
            X
          </button>
        </div>

        {successMessage && (
          <div className="form-success">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nummer">
                {t('finanz:easyFiBu.konten.nummer')} <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                id="nummer"
                name="nummer"
                value={formData.nummer}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bezeichnung">
              {t('finanz:easyFiBu.konten.bezeichnung')} <span className="required-mark">*</span>
            </label>
            <input
              type="text"
              id="bezeichnung"
              name="bezeichnung"
              value={formData.bezeichnung}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="kategorie">
                {t('finanz:easyFiBu.konten.kategorie')} <span className="required-mark">*</span>
              </label>
              <select
                id="kategorie"
                name="kategorie"
                value={formData.kategorie}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">{t('finanz:easyFiBu.common.select')}</option>
                {Object.entries(FIBU_KATEGORIEN).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="unterkategorie">{t('finanz:easyFiBu.konten.unterkategorie')}</label>
              <select
                id="unterkategorie"
                name="unterkategorie"
                value={formData.unterkategorie}
                onChange={handleChange}
                disabled={isSubmitting || !formData.kategorie}
              >
                <option value="">{t('finanz:easyFiBu.common.select')}</option>
                {altKategorien.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sortierung">{t('finanz:easyFiBu.konten.sortierung')}</label>
              <input
                type="number"
                id="sortierung"
                name="sortierung"
                value={formData.sortierung}
                onChange={handleChange}
                min="0"
                disabled={isSubmitting}
              />
              <div className="help-text">{t('finanz:easyFiBu.konten.sortierungHelp')}</div>
            </div>
          </div>

          <div className="form-group">
            <label>
              {t('finanz:easyFiBu.konten.kontoArt')} <span className="required-mark">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="kontoArt"
                  checked={kontoArt === 'einnahme'}
                  onChange={() => handleAccountTypeChange('einnahme')}
                  disabled={isSubmitting}
                />
                {t('finanz:easyFiBu.konten.einnahme')}
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="kontoArt"
                  checked={kontoArt === 'ausgabe'}
                  onChange={() => handleAccountTypeChange('ausgabe')}
                  disabled={isSubmitting}
                />
                {t('finanz:easyFiBu.konten.ausgabe')}
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="kontoArt"
                  checked={kontoArt === 'durchlaufend'}
                  onChange={() => handleAccountTypeChange('durchlaufend')}
                  disabled={isSubmitting}
                />
                {t('finanz:easyFiBu.konten.durchlaufend')}
              </label>
            </div>
            {kontoArt === 'durchlaufend' && (
              <div className="info-text">
                <span className="info-icon">i</span>
                {t('finanz:easyFiBu.konten.durchlaufendInfo')}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="beschreibung">{t('finanz:easyFiBu.konten.beschreibung')}</label>
            <textarea
              id="beschreibung"
              name="beschreibung"
              value={formData.beschreibung || ''}
              onChange={handleChange}
              rows={3}
              disabled={isSubmitting}
              placeholder={t('finanz:easyFiBu.konten.beschreibungPlaceholder')}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleClose} 
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
                : konto 
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

export default KontenModal;
