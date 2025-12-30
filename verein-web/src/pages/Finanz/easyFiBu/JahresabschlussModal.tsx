/**
 * JahresabschlussModal - Modal for creating/editing/viewing KassenbuchJahresabschluss entries
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { kassenbuchJahresabschlussService } from '../../../services/easyFiBuService';
import { 
  KassenbuchJahresabschlussDto, 
  CreateKassenbuchJahresabschlussDto, 
  UpdateKassenbuchJahresabschlussDto 
} from '../../../types/easyFiBu.types';

interface JahresabschlussModalProps {
  isOpen: boolean;
  onClose: () => void;
  abschluss: KassenbuchJahresabschlussDto | null;
  vereinId: number;
}

const JahresabschlussModal: React.FC<JahresabschlussModalProps> = ({ 
  isOpen, 
  onClose, 
  abschluss, 
  vereinId 
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<CreateKassenbuchJahresabschlussDto>({
    vereinId,
    jahr: new Date().getFullYear(),
    kasseAnfangsbestand: 0,
    bankAnfangsbestand: 0,
    kasseEndbestand: 0,
    bankEndbestand: 0,
    totalEinnahmen: 0,
    totalAusgaben: 0,
    saldo: 0,
    bemerkungen: '',
  });

  // Update form state
  const [updateData, setUpdateData] = useState<UpdateKassenbuchJahresabschlussDto>({
    id: 0,
    kasseEndbestand: 0,
    bankEndbestand: 0,
    totalEinnahmen: 0,
    totalAusgaben: 0,
    saldo: 0,
    bemerkungen: '',
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateKassenbuchJahresabschlussDto) => kassenbuchJahresabschlussService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jahresabschluesse', vereinId] });
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateKassenbuchJahresabschlussDto) => kassenbuchJahresabschlussService.update(abschluss!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jahresabschluesse', vereinId] });
      onClose();
    },
  });

  // Calculate mutation
  const calculateMutation = useMutation({
    mutationFn: (jahr: number) => kassenbuchJahresabschlussService.calculateAndCreate(vereinId, jahr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jahresabschluesse', vereinId] });
      onClose();
    },
  });

  // Initialize form with abschluss data
  useEffect(() => {
    if (abschluss) {
      setUpdateData({
        id: abschluss.id,
        kasseEndbestand: abschluss.kasseEndbestand,
        bankEndbestand: abschluss.bankEndbestand,
        totalEinnahmen: abschluss.totalEinnahmen,
        totalAusgaben: abschluss.totalAusgaben,
        saldo: abschluss.saldo,
        bemerkungen: abschluss.bemerkungen || '',
      });
    } else {
      setFormData({
        vereinId,
        jahr: new Date().getFullYear(),
        kasseAnfangsbestand: 0,
        bankAnfangsbestand: 0,
        kasseEndbestand: 0,
        bankEndbestand: 0,
        totalEinnahmen: 0,
        totalAusgaben: 0,
        saldo: 0,
        bemerkungen: '',
      });
      setUpdateData({
        id: 0,
        kasseEndbestand: 0,
        bankEndbestand: 0,
        totalEinnahmen: 0,
        totalAusgaben: 0,
        saldo: 0,
        bemerkungen: '',
      });
    }
  }, [abschluss, vereinId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (abschluss) {
      updateMutation.mutate(updateData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jahr' ? parseInt(value) || new Date().getFullYear() : parseFloat(value) || 0,
    }));
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleCalculate = () => {
    calculateMutation.mutate(formData.jahr);
  };

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending || calculateMutation.isPending;
  const isViewOnly = !!abschluss;
  const canEdit = !abschluss || !abschluss.geprueft;

  return (
    <div className="modal-overlay">
      <div className="modal-content jahresabschluss-modal">
        <div className="modal-header">
          <h2>
            {abschluss 
              ? t('finanz:easyFiBu.jahresabschluss.viewAbschluss') 
              : t('finanz:easyFiBu.jahresabschluss.newAbschluss')
            }
          </h2>
          <button className="modal-close" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {!isViewOnly ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jahr">{t('finanz:easyFiBu.jahresabschluss.jahr')}</label>
                  <input
                    type="number"
                    id="jahr"
                    name="jahr"
                    value={formData.jahr}
                    onChange={handleCreateChange}
                    min="2000"
                    max="2100"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="kasseAnfangsbestand">{t('finanz:easyFiBu.jahresabschluss.kasseAnfangsbestand')}</label>
                  <input
                    type="number"
                    id="kasseAnfangsbestand"
                    name="kasseAnfangsbestand"
                    value={formData.kasseAnfangsbestand}
                    onChange={handleCreateChange}
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bankAnfangsbestand">{t('finanz:easyFiBu.jahresabschluss.bankAnfangsbestand')}</label>
                  <input
                    type="number"
                    id="bankAnfangsbestand"
                    name="bankAnfangsbestand"
                    value={formData.bankAnfangsbestand}
                    onChange={handleCreateChange}
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="kasseEndbestand">{t('finanz:easyFiBu.jahresabschluss.kasseEndbestand')}</label>
                  <input
                    type="number"
                    id="kasseEndbestand"
                    name="kasseEndbestand"
                    value={formData.kasseEndbestand}
                    onChange={handleCreateChange}
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bankEndbestand">{t('finanz:easyFiBu.jahresabschluss.bankEndbestand')}</label>
                  <input
                    type="number"
                    id="bankEndbestand"
                    name="bankEndbestand"
                    value={formData.bankEndbestand}
                    onChange={handleCreateChange}
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="totalEinnahmen">{t('finanz:easyFiBu.jahresabschluss.totalEinnahmen')}</label>
                  <input
                    type="number"
                    id="totalEinnahmen"
                    name="totalEinnahmen"
                    value={formData.totalEinnahmen}
                    onChange={handleCreateChange}
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="totalAusgaben">{t('finanz:easyFiBu.jahresabschluss.totalAusgaben')}</label>
                  <input
                    type="number"
                    id="totalAusgaben"
                    name="totalAusgaben"
                    value={formData.totalAusgaben}
                    onChange={handleCreateChange}
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="saldo">{t('finanz:easyFiBu.jahresabschluss.saldo')}</label>
                <input
                  type="number"
                  id="saldo"
                  name="saldo"
                  value={formData.saldo}
                  onChange={handleCreateChange}
                  step="0.01"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bemerkungen">{t('finanz:easyFiBu.jahresabschluss.bemerkungen')}</label>
                <textarea
                  id="bemerkungen"
                  name="bemerkungen"
                  value={formData.bemerkungen || ''}
                  onChange={handleCreateChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={handleCalculate}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  {t('finanz:easyFiBu.jahresabschluss.calculate')}
                </button>
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
                    : t('finanz:easyFiBu.common.save')
                  }
                </button>
              </div>
            </>
          ) : (
            <>
              {/* View-only fields for existing abschluss */}
              <div className="view-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.jahr')}</label>
                    <input
                      type="text"
                      value={abschluss.jahr}
                      readOnly
                      className="readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.status')}</label>
                    <input
                      type="text"
                      value={abschluss.geprueft ? t('finanz:easyFiBu.jahresabschluss.geprueft') : t('finanz:easyFiBu.jahresabschluss.nichtGeprueft')}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>

                {abschluss.geprueftVon && (
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.geprueftVon')}</label>
                    <input
                      type="text"
                      value={abschluss.geprueftVon}
                      readOnly
                      className="readonly"
                    />
                  </div>
                )}

                {abschluss.geprueftAm && (
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.geprueftAm')}</label>
                    <input
                      type="text"
                      value={new Date(abschluss.geprueftAm).toLocaleDateString()}
                      readOnly
                      className="readonly"
                    />
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.kasseAnfangsbestand')}</label>
                    <input
                      type="text"
                      value={`${abschluss.kasseAnfangsbestand.toFixed(2)} €`}
                      readOnly
                      className="readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.bankAnfangsbestand')}</label>
                    <input
                      type="text"
                      value={`${abschluss.bankAnfangsbestand.toFixed(2)} €`}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.kasseEndbestand')}</label>
                    <input
                      type="text"
                      value={`${abschluss.kasseEndbestand.toFixed(2)} €`}
                      readOnly
                      className="readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.bankEndbestand')}</label>
                    <input
                      type="text"
                      value={`${abschluss.bankEndbestand.toFixed(2)} €`}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.totalEinnahmen')}</label>
                    <input
                      type="text"
                      value={`${abschluss.totalEinnahmen.toFixed(2)} €`}
                      readOnly
                      className="readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.totalAusgaben')}</label>
                    <input
                      type="text"
                      value={`${abschluss.totalAusgaben.toFixed(2)} €`}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t('finanz:easyFiBu.jahresabschluss.saldo')}</label>
                  <input
                    type="text"
                    value={`${abschluss.saldo.toFixed(2)} €`}
                    readOnly
                    className="readonly"
                  />
                </div>

                {canEdit && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="kasseEndbestand">{t('finanz:easyFiBu.jahresabschluss.kasseEndbestand')}</label>
                        <input
                          type="number"
                          id="kasseEndbestand"
                          name="kasseEndbestand"
                          value={updateData.kasseEndbestand}
                          onChange={handleUpdateChange}
                          step="0.01"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="bankEndbestand">{t('finanz:easyFiBu.jahresabschluss.bankEndbestand')}</label>
                        <input
                          type="number"
                          id="bankEndbestand"
                          name="bankEndbestand"
                          value={updateData.bankEndbestand}
                          onChange={handleUpdateChange}
                          step="0.01"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="totalEinnahmen">{t('finanz:easyFiBu.jahresabschluss.totalEinnahmen')}</label>
                        <input
                          type="number"
                          id="totalEinnahmen"
                          name="totalEinnahmen"
                          value={updateData.totalEinnahmen}
                          onChange={handleUpdateChange}
                          step="0.01"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="totalAusgaben">{t('finanz:easyFiBu.jahresabschluss.totalAusgaben')}</label>
                        <input
                          type="number"
                          id="totalAusgaben"
                          name="totalAusgaben"
                          value={updateData.totalAusgaben}
                          onChange={handleUpdateChange}
                          step="0.01"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="saldo">{t('finanz:easyFiBu.jahresabschluss.saldo')}</label>
                      <input
                        type="number"
                        id="saldo"
                        name="saldo"
                        value={updateData.saldo}
                        onChange={handleUpdateChange}
                        step="0.01"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="bemerkungen">{t('finanz:easyFiBu.jahresabschluss.bemerkungen')}</label>
                      <textarea
                        id="bemerkungen"
                        name="bemerkungen"
                        value={updateData.bemerkungen || ''}
                        onChange={handleUpdateChange}
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </div>
                  </>
                )}

                {abschluss.bemerkungen && !canEdit && (
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.jahresabschluss.bemerkungen')}</label>
                    <textarea
                      value={abschluss.bemerkungen}
                      readOnly
                      className="readonly"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  {t('finanz:easyFiBu.common.close')}
                </button>
                
                {canEdit && (
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? t('finanz:easyFiBu.common.saving') 
                      : t('finanz:easyFiBu.common.update')
                    }
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default JahresabschlussModal;