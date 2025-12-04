import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { briefVorlageService } from '../../services';
import { BriefVorlageDto, BriefVorlageKategorie, KategorieLabels, CreateBriefVorlageDto, UpdateBriefVorlageDto, AvailablePlaceholders } from '../../types/brief.types';
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vorlageToDelete, setVorlageToDelete] = useState<{ id: number; name: string } | null>(null);
  const [selectedKategorie, setSelectedKategorie] = useState<BriefVorlageKategorie | 'all'>('all');
  const [previewVorlage, setPreviewVorlage] = useState<BriefVorlageDto | null>(null);
  const [formData, setFormData] = useState<CreateBriefVorlageDto>({
    vereinId: user?.vereinId || 0,
    name: '',
    beschreibung: '',
    betreff: '',
    inhalt: '',
    kategorie: BriefVorlageKategorie.Allgemein
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

  const toggleAktivMutation = useMutation({
    mutationFn: ({ id, aktiv }: { id: number; aktiv: boolean }) =>
      briefVorlageService.update(id, { aktiv } as UpdateBriefVorlageDto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['briefvorlagen'] });
      showSuccess(variables.aktiv
        ? t('briefe:vorlagen.messages.activated')
        : t('briefe:vorlagen.messages.deactivated')
      );
    },
    onError: () => showError(t('briefe:vorlagen.messages.toggleError')),
  });

  const openCreateModal = () => {
    setEditingVorlage(null);
    setFormData({
      vereinId: user?.vereinId || 0,
      name: '',
      beschreibung: '',
      betreff: '',
      inhalt: '',
      kategorie: BriefVorlageKategorie.Allgemein
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vorlage: BriefVorlageDto) => {
    setEditingVorlage(vorlage);
    setFormData({
      vereinId: vorlage.vereinId,
      name: vorlage.name,
      beschreibung: vorlage.beschreibung || '',
      betreff: vorlage.betreff,
      inhalt: vorlage.inhalt,
      kategorie: vorlage.kategorie
    });
    setIsModalOpen(true);
  };

  // Şablon kopyalama
  const duplicateVorlage = (vorlage: BriefVorlageDto) => {
    setEditingVorlage(null);
    setFormData({
      vereinId: user?.vereinId || 0,
      name: `${vorlage.name} (${t('briefe:vorlagen.copy')})`,
      beschreibung: vorlage.beschreibung || '',
      betreff: vorlage.betreff,
      inhalt: vorlage.inhalt,
      kategorie: vorlage.kategorie
    });
    setIsModalOpen(true);
  };

  // Aktif/Pasif toggle
  const toggleAktiv = (vorlage: BriefVorlageDto) => {
    toggleAktivMutation.mutate({ id: vorlage.id, aktiv: !vorlage.aktiv });
  };

  // Önizleme
  const openPreview = (vorlage: BriefVorlageDto) => {
    setPreviewVorlage(vorlage);
  };

  const closePreview = () => {
    setPreviewVorlage(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVorlage(null);
    setFormData({
      vereinId: user?.vereinId || 0,
      name: '',
      beschreibung: '',
      betreff: '',
      inhalt: '',
      kategorie: BriefVorlageKategorie.Allgemein
    });
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
    setVorlageToDelete({ id, name });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (vorlageToDelete) {
      deleteMutation.mutate(vorlageToDelete.id);
    }
    setShowDeleteConfirm(false);
    setVorlageToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setVorlageToDelete(null);
  };

  const getKategorieLabel = (kategorie: BriefVorlageKategorie) => {
    return KategorieLabels[kategorie]?.[i18n.language as 'de' | 'tr'] || kategorie;
  };

  // Filtered vorlagen based on selected category
  const filteredVorlagen = useMemo(() => {
    if (selectedKategorie === 'all') return vorlagen;
    return vorlagen.filter((v: BriefVorlageDto) => v.kategorie === selectedKategorie);
  }, [vorlagen, selectedKategorie]);

  // Category counts for filter tabs
  const kategorieCount = useMemo(() => {
    const counts: Record<string, number> = { all: vorlagen.length };
    Object.values(BriefVorlageKategorie).forEach(kat => {
      counts[kat] = vorlagen.filter((v: BriefVorlageDto) => v.kategorie === kat).length;
    });
    return counts;
  }, [vorlagen]);

  // Insert placeholder into content
  const insertPlaceholder = (placeholder: string) => {
    setFormData(prev => ({
      ...prev,
      inhalt: prev.inhalt + placeholder
    }));
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          {t('briefe:vorlagen.newTemplate')}
        </button>
      </div>

      {/* Category Filter Tabs */}
      {vorlagen.length > 0 && (
        <div className="filter-tabs-container">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${selectedKategorie === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedKategorie('all')}
            >
              {t('common:all')} <span className="tab-count">{kategorieCount.all}</span>
            </button>
            {Object.values(BriefVorlageKategorie).map(kat => (
              kategorieCount[kat] > 0 && (
                <button
                  key={kat}
                  className={`filter-tab ${selectedKategorie === kat ? 'active' : ''}`}
                  onClick={() => setSelectedKategorie(kat)}
                >
                  {getKategorieLabel(kat)} <span className="tab-count">{kategorieCount[kat]}</span>
                </button>
              )
            ))}
          </div>
        </div>
      )}

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
      ) : filteredVorlagen.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>{t('briefe:vorlagen.noResults')}</h3>
          <p>{t('briefe:vorlagen.noResultsDescription')}</p>
        </div>
      ) : (
        <div className="vorlagen-grid">
          {filteredVorlagen.map((vorlage: BriefVorlageDto) => (
            <div key={vorlage.id} className={`vorlage-card ${!vorlage.aktiv ? 'inactive' : ''}`}>
              <div className="card-header">
                <div className="card-badges">
                  <span className={`kategorie-badge ${vorlage.kategorie.toLowerCase()}`}>
                    {getKategorieLabel(vorlage.kategorie)}
                  </span>
                  {vorlage.istSystemvorlage && (
                    <span className="system-badge" title={t('briefe:vorlagen.systemTemplate')}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                    </span>
                  )}
                  {!vorlage.aktiv && (
                    <span className="inactive-badge">{t('briefe:vorlagen.inactive')}</span>
                  )}
                </div>
                <div className="card-actions">
                  <button className="btn-icon" onClick={() => openPreview(vorlage)} title={t('briefe:vorlagen.preview')}>👁️</button>
                  <button className="btn-icon" onClick={() => duplicateVorlage(vorlage)} title={t('briefe:vorlagen.duplicate')}>📋</button>
                  <button className="btn-icon" onClick={() => openEditModal(vorlage)} title={t('common:edit')}>✏️</button>
                  {!vorlage.istSystemvorlage && (
                    <button className="btn-icon delete" onClick={() => handleDelete(vorlage.id, vorlage.name)} title={t('common:delete')}>🗑️</button>
                  )}
                </div>
              </div>
              <h3 className="card-title" onClick={() => openPreview(vorlage)} style={{ cursor: 'pointer' }}>{vorlage.name}</h3>
              {vorlage.beschreibung && (
                <p className="card-description">{vorlage.beschreibung}</p>
              )}
              <p className="card-subject">{vorlage.betreff}</p>
              <div className="card-footer">
                <span className="card-date">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {formatDate(vorlage.created)}
                </span>
                {!vorlage.istSystemvorlage && (
                  <label className="toggle-switch" title={vorlage.aktiv ? t('briefe:vorlagen.deactivate') : t('briefe:vorlagen.activate')}>
                    <input
                      type="checkbox"
                      checked={vorlage.aktiv}
                      onChange={() => toggleAktiv(vorlage)}
                      disabled={toggleAktivMutation.isPending}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-with-sidebar" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingVorlage ? t('briefe:vorlagen.editTemplate') : t('briefe:vorlagen.newTemplate')}</h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body-with-sidebar">
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>{t('briefe:vorlagen.form.name')} *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>{t('briefe:vorlagen.form.description')}</label>
                  <textarea
                    value={formData.beschreibung || ''}
                    onChange={e => setFormData({...formData, beschreibung: e.target.value})}
                    placeholder={t('briefe:vorlagen.form.descriptionPlaceholder')}
                    rows={2}
                  />
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
                  <label>{t('briefe:form.subject')} *</label>
                  <input type="text" value={formData.betreff} onChange={e => setFormData({...formData, betreff: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>{t('briefe:form.content')} *</label>
                  <TiptapEditor content={formData.inhalt} onChange={val => setFormData({...formData, inhalt: val})} />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>{t('common:cancel')}</button>
                  <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingVorlage ? t('common:save') : t('common:create')}
                  </button>
                </div>
              </form>

              {/* Placeholder Panel */}
              <div className="placeholder-panel">
                <h4>{t('briefe:vorlagen.placeholders.title')}</h4>
                <p className="placeholder-hint">{t('briefe:vorlagen.placeholders.hint')}</p>
                <div className="placeholder-list">
                  {AvailablePlaceholders.map(ph => (
                    <button
                      key={ph.key}
                      type="button"
                      className="placeholder-item"
                      onClick={() => insertPlaceholder(ph.key)}
                      title={ph.description[i18n.language as 'de' | 'tr']}
                    >
                      <span className="placeholder-key">{ph.key}</span>
                      <span className="placeholder-label">{ph.label[i18n.language as 'de' | 'tr']}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && vorlageToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="delete-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>{t('briefe:vorlagen.deleteModal.title')}</h3>
            <p>
              <strong>"{vorlageToDelete.name}"</strong> {t('briefe:vorlagen.deleteModal.message')}
            </p>
            <p className="warning-text">{t('briefe:vorlagen.deleteModal.warning')}</p>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={cancelDelete}>
                {t('common:cancel')}
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? t('common:deleting') : t('common:delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewVorlage && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content preview-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="preview-header-info">
                <h2>{previewVorlage.name}</h2>
                <span className={`kategorie-badge ${previewVorlage.kategorie.toLowerCase()}`}>
                  {getKategorieLabel(previewVorlage.kategorie)}
                </span>
              </div>
              <button className="btn-close" onClick={closePreview}>✕</button>
            </div>
            <div className="preview-content">
              {previewVorlage.beschreibung && (
                <p className="preview-description">{previewVorlage.beschreibung}</p>
              )}
              <div className="preview-field">
                <label>{t('briefe:form.subject')}</label>
                <p className="preview-subject">{previewVorlage.betreff}</p>
              </div>
              <div className="preview-field">
                <label>{t('briefe:form.content')}</label>
                <div
                  className="preview-body"
                  dangerouslySetInnerHTML={{ __html: previewVorlage.inhalt }}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={closePreview}>
                {t('common:close')}
              </button>
              <button type="button" className="btn-secondary" onClick={() => { closePreview(); duplicateVorlage(previewVorlage); }}>
                📋 {t('briefe:vorlagen.duplicate')}
              </button>
              <button type="button" className="btn-primary" onClick={() => { closePreview(); openEditModal(previewVorlage); }}>
                ✏️ {t('common:edit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefVorlagenList;
