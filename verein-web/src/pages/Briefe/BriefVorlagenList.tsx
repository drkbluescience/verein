import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { briefVorlageService } from '../../services';
import { BriefVorlageDto, BriefVorlageKategorie, KategorieLabels, CreateBriefVorlageDto } from '../../types/brief.types';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { TiptapEditor } from '../../components/Brief';
import './BriefVorlagenList.css';

const BriefVorlagenList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['common', 'briefe']);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVorlage, setEditingVorlage] = useState<BriefVorlageDto | null>(null);
  const [formData, setFormData] = useState<CreateBriefVorlageDto>({
    name: '', betreff: '', inhalt: '', kategorie: BriefVorlageKategorie.Allgemein
  });

  const { data: vorlagen = [], isLoading } = useQuery({
    queryKey: ['briefvorlagen', 'verein', user?.vereinId],
    queryFn: () => briefVorlageService.getByVereinId(user!.vereinId!),
    enabled: !!user?.vereinId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBriefVorlageDto) => briefVorlageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefvorlagen'] });
      showSuccess(t('briefe:vorlagen.messages.created'));
      closeModal();
    },
    onError: () => showError(t('briefe:vorlagen.messages.createError')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateBriefVorlageDto }) => 
      briefVorlageService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefvorlagen'] });
      showSuccess(t('briefe:vorlagen.messages.updated'));
      closeModal();
    },
    onError: () => showError(t('briefe:vorlagen.messages.updateError')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => briefVorlageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefvorlagen'] });
      showSuccess(t('briefe:vorlagen.messages.deleted'));
    },
    onError: () => showError(t('briefe:vorlagen.messages.deleteError')),
  });

  const openCreateModal = () => {
    setEditingVorlage(null);
    setFormData({ name: '', betreff: '', inhalt: '', kategorie: BriefVorlageKategorie.Allgemein });
    setIsModalOpen(true);
  };

  const openEditModal = (vorlage: BriefVorlageDto) => {
    setEditingVorlage(vorlage);
    setFormData({ name: vorlage.name, betreff: vorlage.betreff, inhalt: vorlage.inhalt, kategorie: vorlage.kategorie });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVorlage(null);
    setFormData({ name: '', betreff: '', inhalt: '', kategorie: BriefVorlageKategorie.Allgemein });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVorlage) {
      updateMutation.mutate({ id: editingVorlage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(t('briefe:vorlagen.confirmDelete', { name }))) {
      deleteMutation.mutate(id);
    }
  };

  const getKategorieLabel = (kategorie: BriefVorlageKategorie) => {
    return KategorieLabels[kategorie]?.[i18n.language as 'de' | 'tr'] || kategorie;
  };

  return (
    <div className="vorlagen-page">
      <div className="page-header">
        <h1 className="page-title">{t('briefe:vorlagen.title')}</h1>
        <p className="page-subtitle">{t('briefe:vorlagen.subtitle')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div style={{ flex: 1 }}></div>
        <button className="btn-primary" onClick={openCreateModal}>
          ➕ {t('briefe:vorlagen.newTemplate')}
        </button>
      </div>

      {isLoading ? (
        <div className="loading-container"><div className="spinner"></div></div>
      ) : vorlagen.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>{t('briefe:vorlagen.emptyState.title')}</h3>
          <p>{t('briefe:vorlagen.emptyState.description')}</p>
          <button className="btn-primary" onClick={openCreateModal}>
            {t('briefe:vorlagen.newTemplate')}
          </button>
        </div>
      ) : (
        <div className="vorlagen-grid">
          {vorlagen.map((vorlage: BriefVorlageDto) => (
            <div key={vorlage.id} className="vorlage-card">
              <div className="card-header">
                <span className={`kategorie-badge ${vorlage.kategorie.toLowerCase()}`}>
                  {getKategorieLabel(vorlage.kategorie)}
                </span>
                <div className="card-actions">
                  <button className="btn-icon" onClick={() => openEditModal(vorlage)} title={t('common:edit')}>✏️</button>
                  <button className="btn-icon delete" onClick={() => handleDelete(vorlage.id, vorlage.name)} title={t('common:delete')}>🗑️</button>
                </div>
              </div>
              <h3 className="card-title">{vorlage.name}</h3>
              <p className="card-subject">{vorlage.betreff}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingVorlage ? t('briefe:vorlagen.editTemplate') : t('briefe:vorlagen.newTemplate')}</h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('briefe:vorlagen.form.name')}</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{t('briefe:vorlagen.form.category')}</label>
                <select value={formData.kategorie} onChange={e => setFormData({...formData, kategorie: e.target.value as BriefVorlageKategorie})}>
                  {Object.values(BriefVorlageKategorie).map(kat => (
                    <option key={kat} value={kat}>{getKategorieLabel(kat)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('briefe:form.subject')}</label>
                <input type="text" value={formData.betreff} onChange={e => setFormData({...formData, betreff: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{t('briefe:form.content')}</label>
                <TiptapEditor content={formData.inhalt} onChange={val => setFormData({...formData, inhalt: val})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>{t('common:cancel')}</button>
                <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingVorlage ? t('common:save') : t('common:create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefVorlagenList;
