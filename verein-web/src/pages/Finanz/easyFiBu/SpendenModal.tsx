/**
 * SpendenModal - Modal for creating/viewing SpendenProtokoll entries
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { spendenProtokollService } from '../../../services/easyFiBuService';
import { 
  SpendenProtokollDto, 
  CreateSpendenProtokollDto, 
  UpdateSpendenProtokollDto,
  CreateSpendenProtokollDetailDto,
  SPENDEN_KATEGORIEN 
} from '../../../types/easyFiBu.types';

interface SpendenModalProps {
  isOpen: boolean;
  onClose: () => void;
  protokoll: SpendenProtokollDto | null;
  vereinId: number;
}

const SpendenModal: React.FC<SpendenModalProps> = ({ 
  isOpen, 
  onClose, 
  protokoll, 
  vereinId 
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<CreateSpendenProtokollDto>({
    vereinId,
    datum: new Date().toISOString().split('T')[0],
    zweck: '',
    zweckKategorie: '',
    protokollant: '',
    zeuge1Name: '',
    zeuge2Name: '',
    zeuge3Name: '',
    bemerkungen: '',
    details: [
      { waehrung: 'EUR', wert: 0, anzahl: 0 }
    ],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateSpendenProtokollDto) => spendenProtokollService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spenden-protokolle', vereinId] });
      queryClient.invalidateQueries({ queryKey: ['spenden-summary', vereinId] });
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateSpendenProtokollDto) => spendenProtokollService.update(protokoll!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spenden-protokolle', vereinId] });
      queryClient.invalidateQueries({ queryKey: ['spenden-summary', vereinId] });
      onClose();
    },
  });

  // Initialize form with protokoll data
  useEffect(() => {
    if (protokoll) {
      setFormData({
        vereinId,
        datum: protokoll.datum.split('T')[0],
        zweck: protokoll.zweck || '',
        zweckKategorie: protokoll.zweckKategorie || '',
        protokollant: protokoll.protokollant || '',
        zeuge1Name: protokoll.zeuge1Name || '',
        zeuge2Name: protokoll.zeuge2Name || '',
        zeuge3Name: protokoll.zeuge3Name || '',
        bemerkungen: protokoll.bemerkungen || '',
        details: protokoll.details.length > 0 ? protokoll.details : [{ waehrung: 'EUR', wert: 0, anzahl: 0 }],
      });
    } else {
      setFormData({
        vereinId,
        datum: new Date().toISOString().split('T')[0],
        zweck: '',
        zweckKategorie: '',
        protokollant: '',
        zeuge1Name: '',
        zeuge2Name: '',
        zeuge3Name: '',
        bemerkungen: '',
        details: [{ waehrung: 'EUR', wert: 0, anzahl: 0 }],
      });
    }
  }, [protokoll, vereinId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (protokoll) {
      updateMutation.mutate({
        id: protokoll.id,
        zweckKategorie: formData.zweckKategorie,
        bemerkungen: formData.bemerkungen,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailChange = (index: number, field: keyof CreateSpendenProtokollDetailDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => 
        i === index ? { ...detail, [field]: field === 'wert' || field === 'anzahl' ? Number(value) || 0 : value } : detail
      ),
    }));
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, { waehrung: 'EUR', wert: 0, anzahl: 0 }],
    }));
  };

  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return formData.details.reduce((sum, detail) => sum + (detail.wert * detail.anzahl), 0);
  };

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isViewOnly = !!protokoll; // Existing protocols are view-only for most fields

  return (
    <div className="modal-overlay">
      <div className="modal-content spenden-modal">
        <div className="modal-header">
          <h2>
            {protokoll 
              ? t('finanz:easyFiBu.spenden.viewProtokoll') 
              : t('finanz:easyFiBu.spenden.newProtokoll')
            }
          </h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="datum">{t('finanz:easyFiBu.spenden.datum')}</label>
              <input
                type="date"
                id="datum"
                name="datum"
                value={formData.datum}
                onChange={handleChange}
                required
                disabled={isSubmitting || isViewOnly}
              />
            </div>

            <div className="form-group">
              <label htmlFor="zweckKategorie">{t('finanz:easyFiBu.spenden.zweckKategorie')}</label>
              <select
                id="zweckKategorie"
                name="zweckKategorie"
                value={formData.zweckKategorie}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">{t('finanz:easyFiBu.common.select')}</option>
                {Object.entries(SPENDEN_KATEGORIEN).map(([key, value]) => (
                  <option key={key} value={value}>
                    {t(`finanz:easyFiBu.spenden.kategorien.${key.toLowerCase()}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="zweck">{t('finanz:easyFiBu.spenden.zweck')}</label>
            <input
              type="text"
              id="zweck"
              name="zweck"
              value={formData.zweck}
              onChange={handleChange}
              disabled={isSubmitting || isViewOnly}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="protokollant">{t('finanz:easyFiBu.spenden.protokollant')}</label>
              <input
                type="text"
                id="protokollant"
                name="protokollant"
                value={formData.protokollant}
                onChange={handleChange}
                disabled={isSubmitting || isViewOnly}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zeuge1Name">{t('finanz:easyFiBu.spenden.zeuge1')}</label>
              <input
                type="text"
                id="zeuge1Name"
                name="zeuge1Name"
                value={formData.zeuge1Name}
                onChange={handleChange}
                disabled={isSubmitting || isViewOnly}
              />
            </div>

            <div className="form-group">
              <label htmlFor="zeuge2Name">{t('finanz:easyFiBu.spenden.zeuge2')}</label>
              <input
                type="text"
                id="zeuge2Name"
                name="zeuge2Name"
                value={formData.zeuge2Name}
                onChange={handleChange}
                disabled={isSubmitting || isViewOnly}
              />
            </div>

            <div className="form-group">
              <label htmlFor="zeuge3Name">{t('finanz:easyFiBu.spenden.zeuge3')}</label>
              <input
                type="text"
                id="zeuge3Name"
                name="zeuge3Name"
                value={formData.zeuge3Name}
                onChange={handleChange}
                disabled={isSubmitting || isViewOnly}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="form-section">
            <h3>{t('finanz:easyFiBu.spenden.details')}</h3>
            
            {formData.details.map((detail, index) => (
              <div key={index} className="detail-row">
                <div className="form-group">
                  <label>{t('finanz:easyFiBu.spenden.waehrung')}</label>
                  <select
                    value={detail.waehrung}
                    onChange={(e) => handleDetailChange(index, 'waehrung', e.target.value)}
                    disabled={isSubmitting || isViewOnly}
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('finanz:easyFiBu.spenden.wert')}</label>
                  <input
                    type="number"
                    value={detail.wert}
                    onChange={(e) => handleDetailChange(index, 'wert', e.target.value)}
                    step="0.01"
                    min="0"
                    disabled={isSubmitting || isViewOnly}
                  />
                </div>

                <div className="form-group">
                  <label>{t('finanz:easyFiBu.spenden.anzahl')}</label>
                  <input
                    type="number"
                    value={detail.anzahl}
                    onChange={(e) => handleDetailChange(index, 'anzahl', e.target.value)}
                    min="0"
                    disabled={isSubmitting || isViewOnly}
                  />
                </div>

                <div className="form-group">
                  <label>{t('finanz:easyFiBu.spenden.summe')}</label>
                  <input
                    type="text"
                    value={`${(detail.wert * detail.anzahl).toFixed(2)} €`}
                    readOnly
                    className="readonly"
                  />
                </div>

                {!isViewOnly && formData.details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="btn btn-danger btn-icon"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {!isViewOnly && (
              <button
                type="button"
                onClick={addDetail}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                {t('finanz:easyFiBu.spenden.addDetail')}
              </button>
            )}
          </div>

          {/* Total */}
          <div className="total-section">
            <div className="total-amount">
              <label>{t('finanz:easyFiBu.spenden.gesamtbetrag')}</label>
              <span className="total-value">{calculateTotal().toFixed(2)} €</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bemerkungen">{t('finanz:easyFiBu.spenden.bemerkungen')}</label>
            <textarea
              id="bemerkungen"
              name="bemerkungen"
              value={formData.bemerkungen || ''}
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
            {!isViewOnly && (
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? t('finanz:easyFiBu.common.saving') 
                  : t('finanz:easyFiBu.common.save')
                }
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpendenModal;