/**
 * TransitModal - Modal for creating/editing DurchlaufendePosten entries
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { durchlaufendePostenService, fiBuKontoService } from '../../../services/easyFiBuService';
import {
  DurchlaufendePostenDto,
  CreateDurchlaufendePostenDto,
  UpdateDurchlaufendePostenDto,
  DURCHLAUFENDE_POSTEN_STATUS
} from '../../../types/easyFiBu.types';

interface TransitModalProps {
  isOpen: boolean;
  onClose: () => void;
  posten: DurchlaufendePostenDto | null;
  vereinId: number;
}

const TransitModal: React.FC<TransitModalProps> = ({ 
  isOpen, 
  onClose, 
  posten, 
  vereinId 
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<CreateDurchlaufendePostenDto>({
    vereinId,
    fiBuNummer: '',
    bezeichnung: '',
    empfaenger: '',
    einnahmenDatum: new Date().toISOString().split('T')[0],
    einnahmenBetrag: 0,
    bemerkungen: '',
  });

  // Update form state
  const [updateData, setUpdateData] = useState<UpdateDurchlaufendePostenDto>({
    id: 0,
    bezeichnung: '',
    empfaenger: '',
    ausgabenDatum: '',
    ausgabenBetrag: 0,
    referenz: '',
    status: '',
    kassenbuchAusgabeId: undefined,
    bemerkungen: '',
  });

  // Fetch FiBu accounts
  const { data: konten = [] } = useQuery({
    queryKey: ['fibu-konten-active'],
    queryFn: () => fiBuKontoService.getActive(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateDurchlaufendePostenDto) => durchlaufendePostenService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten', vereinId] });
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten-total', vereinId] });
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten-summary', vereinId] });
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateDurchlaufendePostenDto) => durchlaufendePostenService.update(posten!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten', vereinId] });
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten-total', vereinId] });
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten-summary', vereinId] });
      onClose();
    },
  });

  // Close mutation
  const closeMutation = useMutation({
    mutationFn: ({ id, ausgabenDatum, ausgabenBetrag, referenz }: { 
      id: number; 
      ausgabenDatum: string; 
      ausgabenBetrag: number; 
      referenz?: string; 
    }) => durchlaufendePostenService.close(id, ausgabenDatum, ausgabenBetrag, referenz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten', vereinId] });
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten-total', vereinId] });
      queryClient.invalidateQueries({ queryKey: ['durchlaufende-posten-summary', vereinId] });
      onClose();
    },
  });

  // Initialize form with posten data
  useEffect(() => {
    if (posten) {
      setUpdateData({
        id: posten.id,
        bezeichnung: posten.bezeichnung,
        empfaenger: posten.empfaenger || '',
        ausgabenDatum: posten.ausgabenDatum || '',
        ausgabenBetrag: posten.ausgabenBetrag || 0,
        referenz: posten.referenz || '',
        status: posten.status,
        kassenbuchAusgabeId: posten.kassenbuchAusgabeId,
        bemerkungen: posten.bemerkungen || '',
      });
    } else {
      setFormData({
        vereinId,
        fiBuNummer: '',
        bezeichnung: '',
        empfaenger: '',
        einnahmenDatum: new Date().toISOString().split('T')[0],
        einnahmenBetrag: 0,
        bemerkungen: '',
      });
      setUpdateData({
        id: 0,
        bezeichnung: '',
        empfaenger: '',
        ausgabenDatum: '',
        ausgabenBetrag: 0,
        referenz: '',
        status: '',
        kassenbuchAusgabeId: undefined,
        bemerkungen: '',
      });
    }
  }, [posten, vereinId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (posten) {
      updateMutation.mutate(updateData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'einnahmenBetrag' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: name === 'ausgabenBetrag' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleClose = () => {
    if (posten && updateData.ausgabenDatum && updateData.ausgabenBetrag) {
      closeMutation.mutate({
        id: posten.id,
        ausgabenDatum: updateData.ausgabenDatum,
        ausgabenBetrag: updateData.ausgabenBetrag,
        referenz: updateData.referenz,
      });
    }
  };

  if (!isOpen) return null;

  const isSubmitting = createMutation.isPending || updateMutation.isPending || closeMutation.isPending;
  const isViewOnly = !!posten;
  const canClose = posten && (posten.status === DURCHLAUFENDE_POSTEN_STATUS.OFFEN || posten.status === DURCHLAUFENDE_POSTEN_STATUS.TEILWEISE);

  return (
    <div className="modal-overlay">
      <div className="modal-content transit-modal">
        <div className="modal-header">
          <h2>
            {posten 
              ? t('finanz:easyFiBu.transit.editPosten') 
              : t('finanz:easyFiBu.transit.newPosten')
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
                  <label htmlFor="fiBuNummer">{t('finanz:easyFiBu.transit.konto')}</label>
                  <select
                    id="fiBuNummer"
                    name="fiBuNummer"
                    value={formData.fiBuNummer}
                    onChange={handleCreateChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">{t('finanz:easyFiBu.common.select')}</option>
                    {konten
                      .filter(k => k.istDurchlaufend)
                      .map(konto => (
                        <option key={konto.id} value={konto.nummer}>
                          {konto.nummer} - {konto.bezeichnung}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="einnahmenDatum">{t('finanz:easyFiBu.transit.einnahmenDatum')}</label>
                  <input
                    type="date"
                    id="einnahmenDatum"
                    name="einnahmenDatum"
                    value={formData.einnahmenDatum}
                    onChange={handleCreateChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bezeichnung">{t('finanz:easyFiBu.transit.bezeichnung')}</label>
                <input
                  type="text"
                  id="bezeichnung"
                  name="bezeichnung"
                  value={formData.bezeichnung}
                  onChange={handleCreateChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="empfaenger">{t('finanz:easyFiBu.transit.empfaenger')}</label>
                  <input
                    type="text"
                    id="empfaenger"
                    name="empfaenger"
                    value={formData.empfaenger}
                    onChange={handleCreateChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="einnahmenBetrag">{t('finanz:easyFiBu.transit.einnahmenBetrag')}</label>
                  <input
                    type="number"
                    id="einnahmenBetrag"
                    name="einnahmenBetrag"
                    value={formData.einnahmenBetrag || ''}
                    onChange={handleCreateChange}
                    step="0.01"
                    min="0"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bemerkungen">{t('finanz:easyFiBu.transit.bemerkungen')}</label>
                <textarea
                  id="bemerkungen"
                  name="bemerkungen"
                  value={formData.bemerkungen || ''}
                  onChange={handleCreateChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </>
          ) : (
            <>
              {/* View-only fields for existing posten */}
              <div className="view-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.transit.konto')}</label>
                    <input
                      type="text"
                      value={`${posten.fiBuNummer} - ${posten.fiBuKontoBezeichnung || ''}`}
                      readOnly
                      className="readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.transit.status')}</label>
                    <input
                      type="text"
                      value={posten.status}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.transit.einnahmenDatum')}</label>
                    <input
                      type="text"
                      value={new Date(posten.einnahmenDatum).toLocaleDateString()}
                      readOnly
                      className="readonly"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('finanz:easyFiBu.transit.einnahmenBetrag')}</label>
                    <input
                      type="text"
                      value={`${posten.einnahmenBetrag.toFixed(2)} €`}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bezeichnung">{t('finanz:easyFiBu.transit.bezeichnung')}</label>
                  <input
                    type="text"
                    id="bezeichnung"
                    name="bezeichnung"
                    value={updateData.bezeichnung}
                    onChange={handleUpdateChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="empfaenger">{t('finanz:easyFiBu.transit.empfaenger')}</label>
                  <input
                    type="text"
                    id="empfaenger"
                    name="empfaenger"
                    value={updateData.empfaenger}
                    onChange={handleUpdateChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ausgabenDatum">{t('finanz:easyFiBu.transit.ausgabenDatum')}</label>
                    <input
                      type="date"
                      id="ausgabenDatum"
                      name="ausgabenDatum"
                      value={updateData.ausgabenDatum}
                      onChange={handleUpdateChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ausgabenBetrag">{t('finanz:easyFiBu.transit.ausgabenBetrag')}</label>
                    <input
                      type="number"
                      id="ausgabenBetrag"
                      name="ausgabenBetrag"
                      value={updateData.ausgabenBetrag || ''}
                      onChange={handleUpdateChange}
                      step="0.01"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="referenz">{t('finanz:easyFiBu.transit.referenz')}</label>
                  <input
                    type="text"
                    id="referenz"
                    name="referenz"
                    value={updateData.referenz || ''}
                    onChange={handleUpdateChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bemerkungen">{t('finanz:easyFiBu.transit.bemerkungen')}</label>
                  <textarea
                    id="bemerkungen"
                    name="bemerkungen"
                    value={updateData.bemerkungen || ''}
                    onChange={handleUpdateChange}
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </>
          )}

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

            {isViewOnly && canClose && (
              <button 
                type="button" 
                onClick={handleClose}
                className="btn btn-success"
                disabled={isSubmitting || !updateData.ausgabenDatum || !updateData.ausgabenBetrag}
              >
                {isSubmitting 
                  ? t('finanz:easyFiBu.transit.closing') 
                  : t('finanz:easyFiBu.transit.closePosten')
                }
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransitModal;