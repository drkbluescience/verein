/**
 * KontenModal - Modal for creating/editing FiBu Konto entries
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

  // Form state
  const [formData, setFormData] = useState<CreateFiBuKontoDto>({
    nummer: '',
    bezeichnung: '',
    kategorie: '',
    unterkategorie: '',
    kontoTyp: '',
    istEinnahme: false,
    istAusgabe: false,
    istDurchlaufend: false,
    beschreibung: '',
    sortierung: 0,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateFiBuKontoDto) => fiBuKontoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibu-konten'] });
      queryClient.invalidateQueries({ queryKey: ['fibu-konten', false] });
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateFiBuKontoDto) => fiBuKontoService.update(konto!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibu-konten'] });
      queryClient.invalidateQueries({ queryKey: ['fibu-konten', false] });
      onClose();
    },
  });

  // Initialize form with konto data
  useEffect(() => {
    if (konto) {
      setFormData({
        nummer: konto.nummer,
        bezeichnung: konto.bezeichnung,
        kategorie: konto.kategorie,
        unterkategorie: konto.unterkategorie || '',
        kontoTyp: konto.kontoTyp,
        istEinnahme: konto.istEinnahme,
        istAusgabe: konto.istAusgabe,
        istDurchlaufend: konto.istDurchlaufend,
        beschreibung: konto.beschreibung || '',
        sortierung: konto.sortierung,
      });
    } else {
      setFormData({
        nummer: '',
        bezeichnung: '',
        kategorie: '',
        unterkategorie: '',
        kontoTyp: '',
        istEinnahme: false,
        istAusgabe: false,
        istDurchlaufend: false,
        beschreibung: '',
        sortierung: 0,
      });
    }
  }, [konto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    } else if (name === 'sortierung') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0,
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
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nummer">{t('finanz:easyFiBu.konten.nummer')}</label>
              <input
                type="text"
                id="nummer"
                name="nummer"
                value={formData.nummer}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="kontoTyp">{t('finanz:easyFiBu.konten.kontoTyp')}</label>
              <input
                type="text"
                id="kontoTyp"
                name="kontoTyp"
                value={formData.kontoTyp}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bezeichnung">{t('finanz:easyFiBu.konten.bezeichnung')}</label>
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
              <label htmlFor="kategorie">{t('finanz:easyFiBu.konten.kategorie')}</label>
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
              <input
                type="text"
                id="unterkategorie"
                name="unterkategorie"
                value={formData.unterkategorie}
                onChange={handleChange}
                disabled={isSubmitting}
              />
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
            </div>
          </div>

          <div className="form-group">
            <label>{t('finanz:easyFiBu.konten.kontoArt')}</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="istEinnahme"
                  checked={formData.istEinnahme}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {t('finanz:easyFiBu.konten.einnahme')}
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="istAusgabe"
                  checked={formData.istAusgabe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {t('finanz:easyFiBu.konten.ausgabe')}
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="istDurchlaufend"
                  checked={formData.istDurchlaufend}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {t('finanz:easyFiBu.konten.durchlaufend')}
              </label>
            </div>
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