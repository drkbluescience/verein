import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { mitgliedFamilieService, mitgliedService } from '../../services/mitgliedService';
import keytableService from '../../services/keytableService';
import { MitgliedFamilieDto, CreateMitgliedFamilieDto } from '../../types/mitglied';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../Common/Modal';
import styles from './MitgliedFormModal.module.css';

interface MitgliedFamilieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mitgliedId: number;
  vereinId: number;
  familienbeziehung?: MitgliedFamilieDto | null;
  mode: 'create' | 'edit';
}

const MitgliedFamilieFormModal: React.FC<MitgliedFamilieFormModalProps> = ({
  isOpen,
  onClose,
  mitgliedId,
  vereinId,
  familienbeziehung,
  mode,
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglied', 'common']);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Keytable data
  const { data: familienbeziehungTypen = [] } = useQuery({
    queryKey: ['keytable', 'familienbeziehungtypen'],
    queryFn: () => keytableService.getFamilienbeziehungTypen(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: mitgliedFamilieStatuse = [] } = useQuery({
    queryKey: ['keytable', 'mitgliedfamiliestatuse'],
    queryFn: () => keytableService.getMitgliedFamilieStatuse(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Fetch all Mitglieder for parent selection
  const { data: mitglieder = [] } = useQuery({
    queryKey: ['mitglieder', vereinId],
    queryFn: () => mitgliedService.getByVereinId(vereinId),
    enabled: isOpen && !!vereinId,
  });

  const [formData, setFormData] = useState({
    parentMitgliedId: '',
    familienbeziehungTypId: '',
    mitgliedFamilieStatusId: '',
    gueltigVon: '',
    gueltigBis: '',
    hinweis: '',
    aktiv: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load form data when editing
  useEffect(() => {
    if (mode === 'edit' && familienbeziehung) {
      setFormData({
        parentMitgliedId: familienbeziehung.parentMitgliedId.toString(),
        familienbeziehungTypId: familienbeziehung.familienbeziehungTypId.toString(),
        mitgliedFamilieStatusId: familienbeziehung.mitgliedFamilieStatusId?.toString() || '',
        gueltigVon: familienbeziehung.gueltigVon || '',
        gueltigBis: familienbeziehung.gueltigBis || '',
        hinweis: familienbeziehung.hinweis || '',
        aktiv: familienbeziehung.aktiv !== undefined ? familienbeziehung.aktiv : true,
      });
    } else {
      setFormData({
        parentMitgliedId: '',
        familienbeziehungTypId: '',
        mitgliedFamilieStatusId: '',
        gueltigVon: '',
        gueltigBis: '',
        hinweis: '',
        aktiv: true,
      });
    }
    setErrors({});
  }, [mode, familienbeziehung, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

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

    if (!formData.parentMitgliedId) {
      newErrors.parentMitgliedId = t('mitglied:validation.parentRequired');
    }

    if (!formData.familienbeziehungTypId) {
      newErrors.familienbeziehungTypId = t('mitglied:validation.relationshipTypeRequired');
    }

    if (formData.gueltigVon && formData.gueltigBis && formData.gueltigVon > formData.gueltigBis) {
      newErrors.gueltigBis = t('mitglied:validation.endDateAfterStartDate');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateMitgliedFamilieDto) => mitgliedFamilieService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitglied-familie', mitgliedId] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: Partial<CreateMitgliedFamilieDto> }) =>
      mitgliedFamilieService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitglied-familie', mitgliedId] });
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'create') {
        const createData: CreateMitgliedFamilieDto = {
          vereinId,
          mitgliedId,
          parentMitgliedId: parseInt(formData.parentMitgliedId),
          familienbeziehungTypId: parseInt(formData.familienbeziehungTypId),
          mitgliedFamilieStatusId: formData.mitgliedFamilieStatusId
            ? parseInt(formData.mitgliedFamilieStatusId)
            : undefined,
          gueltigVon: formData.gueltigVon || undefined,
          gueltigBis: formData.gueltigBis || undefined,
          hinweis: formData.hinweis || undefined,
          aktiv: formData.aktiv,
        };
        await createMutation.mutateAsync(createData);
      } else if (familienbeziehung) {
        const updateData: Partial<CreateMitgliedFamilieDto> = {
          parentMitgliedId: parseInt(formData.parentMitgliedId),
          familienbeziehungTypId: parseInt(formData.familienbeziehungTypId),
          mitgliedFamilieStatusId: formData.mitgliedFamilieStatusId
            ? parseInt(formData.mitgliedFamilieStatusId)
            : undefined,
          gueltigVon: formData.gueltigVon || undefined,
          gueltigBis: formData.gueltigBis || undefined,
          hinweis: formData.hinweis || undefined,
          aktiv: formData.aktiv,
        };
        await updateMutation.mutateAsync({ id: familienbeziehung.id, data: updateData });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'create'
          ? t('mitglied:addFamilyRelationship')
          : t('mitglied:editFamilyRelationship')
      }
      size="lg"
      footer={
        <div className={styles.footer}>
          <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={isLoading}>
            {t('common:actions.cancel')}
          </button>
          <button type="submit" form="familie-form" className={styles.btnPrimary} disabled={isLoading}>
            {isLoading ? t('common:actions.saving') : t('common:actions.save')}
          </button>
        </div>
      }
    >
      <form id="familie-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Parent Mitglied */}
          <div className={styles.formGroup}>
            <label htmlFor="parentMitgliedId">
              {t('mitglied:fields.parent')} <span className={styles.required}>*</span>
            </label>
            <select
              id="parentMitgliedId"
              name="parentMitgliedId"
              value={formData.parentMitgliedId}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.parentMitgliedId ? styles.error : ''}
            >
              <option value="">Seçiniz</option>
              {mitglieder
                .filter((m) => m.id !== mitgliedId)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.vorname} {m.nachname}
                  </option>
                ))}
            </select>
            {errors.parentMitgliedId && (
              <span className={styles.errorMessage}>{errors.parentMitgliedId}</span>
            )}
          </div>

          {/* Relationship Type */}
          <div className={styles.formGroup}>
            <label htmlFor="familienbeziehungTypId">
              {t('mitglied:fields.relationshipType')} <span className={styles.required}>*</span>
            </label>
            <select
              id="familienbeziehungTypId"
              name="familienbeziehungTypId"
              value={formData.familienbeziehungTypId}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.familienbeziehungTypId ? styles.error : ''}
            >
              <option value="">Seçiniz</option>
              {familienbeziehungTypen.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.familienbeziehungTypId && (
              <span className={styles.errorMessage}>{errors.familienbeziehungTypId}</span>
            )}
          </div>

          {/* Family Status */}
          <div className={styles.formGroup}>
            <label htmlFor="mitgliedFamilieStatusId">{t('mitglied:fields.familyStatus')}</label>
            <select
              id="mitgliedFamilieStatusId"
              name="mitgliedFamilieStatusId"
              value={formData.mitgliedFamilieStatusId}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Seçiniz</option>
              {mitgliedFamilieStatuse.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Valid From */}
          <div className={styles.formGroup}>
            <label htmlFor="gueltigVon">{t('mitglied:fields.validFrom')}</label>
            <input
              type="date"
              id="gueltigVon"
              name="gueltigVon"
              value={formData.gueltigVon}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Valid Until */}
          <div className={styles.formGroup}>
            <label htmlFor="gueltigBis">{t('mitglied:fields.validUntil')}</label>
            <input
              type="date"
              id="gueltigBis"
              name="gueltigBis"
              value={formData.gueltigBis}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.gueltigBis ? styles.error : ''}
            />
            {errors.gueltigBis && <span className={styles.errorMessage}>{errors.gueltigBis}</span>}
          </div>

          {/* Notes */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="hinweis">{t('mitglied:fields.notes')}</label>
            <textarea
              id="hinweis"
              name="hinweis"
              value={formData.hinweis}
              onChange={handleChange}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Active */}
          <div className={styles.formGroup}>
            <label htmlFor="aktiv">
              <input
                type="checkbox"
                id="aktiv"
                name="aktiv"
                checked={formData.aktiv}
                onChange={handleChange}
                disabled={isLoading}
              />
              {t('common:fields.active')}
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default MitgliedFamilieFormModal;

