import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { briefService, briefVorlageService, vereinService } from '../../services';
import { mitgliedService } from '../../services/mitgliedService';
import { TiptapEditor, TiptapEditorRef } from '../../components/Brief';
import { CreateBriefDto, UpdateBriefDto, BriefVorlageDto } from '../../types/brief.types';
import { MitgliedDto } from '../../types/mitglied';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import './BriefForm.css';

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const PreviewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const BriefForm: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['common', 'briefe']);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const isEdit = !!id;

  // Form state
  const [formData, setFormData] = useState<CreateBriefDto>({
    vereinId: user?.vereinId || 0,
    titel: '',
    betreff: '',
    inhalt: '',
    vorlageId: undefined,
  });
  const [selectedMitglied, setSelectedMitglied] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<{ betreff: string; inhalt: string } | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // TipTap editor ref for inserting text
  const editorRef = useRef<TiptapEditorRef>(null);

  // Fetch brief if editing
  const { data: existingBrief } = useQuery({
    queryKey: ['brief', id],
    queryFn: () => briefService.getById(Number(id)),
    enabled: isEdit,
  });

  // Fetch templates for current Verein
  const { data: vorlagen = [] } = useQuery({
    queryKey: ['briefVorlagen', 'verein', user?.vereinId],
    queryFn: () => briefVorlageService.getByVereinId(user!.vereinId!),
    enabled: !!user?.vereinId,
  });

  // Fetch mitglieder by Verein ID
  const { data: mitglieder = [] } = useQuery({
    queryKey: ['mitglieder', 'verein', user?.vereinId],
    queryFn: () => mitgliedService.getByVereinId(user!.vereinId!, true),
    enabled: !!user?.vereinId,
  });

  // Fetch Verein data for placeholder values
  const { data: verein } = useQuery({
    queryKey: ['verein', user?.vereinId],
    queryFn: () => vereinService.getById(user!.vereinId!),
    enabled: !!user?.vereinId,
  });

  // Get selected member object
  const selectedMember = useMemo(() => {
    if (!selectedMitglied) return null;
    return mitglieder.find((m: MitgliedDto) => m.id === selectedMitglied) || null;
  }, [selectedMitglied, mitglieder]);

  // Member field values for quick insert
  const memberFieldValues = useMemo(() => {
    if (!selectedMember) return [];
    return [
      { key: 'vorname', label: 'Ad', value: selectedMember.vorname || '-' },
      { key: 'nachname', label: 'Soyad', value: selectedMember.nachname || '-' },
      { key: 'vollname', label: 'Tam Ad', value: `${selectedMember.vorname || ''} ${selectedMember.nachname || ''}`.trim() || '-' },
      { key: 'email', label: 'E-posta', value: selectedMember.email || '-' },
      { key: 'mitgliedsnummer', label: 'Üye No', value: selectedMember.mitgliedsnummer || '-' },
      { key: 'vereinName', label: 'Dernek Adı', value: verein?.name || '-' },
      { key: 'vereinKurzname', label: 'Dernek Kısa Adı', value: verein?.kurzname || '-' },
      { key: 'beitragBetrag', label: 'Aidat Tutarı', value: selectedMember.beitragBetrag?.toString() || '-' },
    ];
  }, [selectedMember, verein]);

  // Insert value to content using TipTap editor ref
  const insertValueToContent = useCallback((value: string) => {
    if (value === '-') return; // Don't insert empty values
    editorRef.current?.insertText(value);
  }, []);

  // Load existing brief data
  useEffect(() => {
    if (existingBrief) {
      setFormData({
        vereinId: existingBrief.vereinId,
        titel: existingBrief.titel,
        betreff: existingBrief.betreff,
        inhalt: existingBrief.inhalt,
        vorlageId: existingBrief.vorlageId,
      });
      // Load selected recipient if exists
      if (existingBrief.selectedMitgliedIds?.length) {
        setSelectedMitglied(existingBrief.selectedMitgliedIds[0]);
      }
    }
  }, [existingBrief]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateBriefDto) => briefService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      showSuccess(t('briefe:messages.created'));
      navigate('/briefe');
    },
    onError: () => showError(t('briefe:messages.createError')),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateBriefDto) => briefService.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      showSuccess(t('briefe:messages.updated'));
      navigate('/briefe');
    },
    onError: () => showError(t('briefe:messages.updateError')),
  });

  // Send mutation
  const sendMutation = useMutation({
    mutationFn: () => briefService.send({ briefId: Number(id), mitgliedIds: selectedMitglied ? [selectedMitglied] : [] }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      showSuccess(t('briefe:messages.sent', { count: result.length }));
      navigate('/briefe');
    },
    onError: () => showError(t('briefe:messages.sendError')),
  });

  const handleVorlageChange = (vorlageId: number | undefined) => {
    const vorlage = vorlagen.find((v: BriefVorlageDto) => v.id === vorlageId);
    if (vorlage) {
      setFormData(prev => ({
        ...prev,
        vorlageId,
        betreff: vorlage.betreff,
        inhalt: vorlage.inhalt,
      }));
    } else {
      setFormData(prev => ({ ...prev, vorlageId: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      selectedMitgliedIds: selectedMitglied ? [selectedMitglied] : undefined,
    };
    if (isEdit) {
      updateMutation.mutate(dataToSubmit);
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const handleSendNow = () => {
    if (!selectedMitglied) {
      showError(t('briefe:errors.noRecipients'));
      return;
    }
    sendMutation.mutate();
  };

  const handleMitgliedSelect = (mitglied: MitgliedDto) => {
    setSelectedMitglied(mitglied.id);

    // Add greeting to content
    const greeting = `Sayın ${mitglied.vorname} ${mitglied.nachname},\n\n`;

    // If content is empty or only has placeholder, add greeting
    if (!formData.inhalt || formData.inhalt.trim() === '' || formData.inhalt === '<p></p>') {
      setFormData(prev => ({ ...prev, inhalt: `<p>${greeting}</p>` }));
    } else {
      // Prepend greeting to existing content
      setFormData(prev => ({ ...prev, inhalt: `<p>${greeting}</p>${prev.inhalt}` }));
    }
  };

  // Önizleme fonksiyonu - placeholder'ları gerçek değerlerle değiştirir
  const handlePreview = useCallback(async () => {
    if (!selectedMitglied || !user?.vereinId) return;

    setIsLoadingPreview(true);
    try {
      const [previewedBetreff, previewedInhalt] = await Promise.all([
        briefService.previewContent(formData.betreff, selectedMitglied, user.vereinId),
        briefService.previewContent(formData.inhalt, selectedMitglied, user.vereinId)
      ]);
      setPreviewContent({ betreff: previewedBetreff, inhalt: previewedInhalt });
      setShowPreview(true);
    } catch (error) {
      showError(t('briefe:errors.previewError'));
    } finally {
      setIsLoadingPreview(false);
    }
  }, [selectedMitglied, user?.vereinId, formData.betreff, formData.inhalt, showError, t]);

  const closePreview = () => {
    setShowPreview(false);
    setPreviewContent(null);
  };

  return (
    <div className="brief-form-page">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? t('briefe:editLetter') : t('briefe:newLetter')}</h1>
      </div>

      {/* Actions Bar with Back Button */}
      <div className="actions-bar">
        <button
          className="btn-icon"
          onClick={() => navigate('/briefe')}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="brief-form">
        <div className="form-grid">
          {/* Left Column - Letter Content */}
          <div className="form-column main-column">
            {/* Template Selection */}
            <div className="form-group">
              <label>{t('briefe:form.template')}</label>
              <select value={formData.vorlageId || ''}
                onChange={(e) => handleVorlageChange(e.target.value ? Number(e.target.value) : undefined)}>
                <option value="">{t('briefe:form.noTemplate')}</option>
                {vorlagen.map((v: BriefVorlageDto) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Titel */}
            <div className="form-group">
              <label>{t('briefe:form.title')} *</label>
              <input type="text" value={formData.titel} required
                onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
                placeholder={t('briefe:form.titlePlaceholder')} />
            </div>

            {/* Subject */}
            <div className="form-group">
              <label>{t('briefe:form.subject')} *</label>
              <input type="text" value={formData.betreff} required
                onChange={(e) => setFormData({ ...formData, betreff: e.target.value })}
                placeholder={t('briefe:form.subjectPlaceholder')} />
            </div>

            {/* Content - Tiptap Editor */}
            <div className="form-group">
              <label>{t('briefe:form.content')} *</label>
              <TiptapEditor
                ref={editorRef}
                content={formData.inhalt}
                onChange={(content) => setFormData({ ...formData, inhalt: content })}
                placeholder={t('briefe:form.contentPlaceholder')}
                minHeight="400px"
              />
            </div>
          </div>

          {/* Right Column - Recipients */}
          <div className="form-column recipients-column">
            <div className="recipients-panel">
              <h3>{t('briefe:form.recipient')}</h3>

              {/* Selected Member Display */}
              {selectedMitglied && (
                <div className="selected-member-display">
                  <span className="member-name">{selectedMember?.vorname} {selectedMember?.nachname}</span>
                  <div className="selected-member-actions">
                    <button type="button" className="btn-preview" onClick={handlePreview} disabled={isLoadingPreview}>
                      <PreviewIcon />
                      {isLoadingPreview ? t('common:loading') : t('briefe:preview.title')}
                    </button>
                    <button type="button" className="btn-text" onClick={() => setSelectedMitglied(null)}>
                      {t('briefe:form.changeRecipient')}
                    </button>
                  </div>
                </div>
              )}

              {/* Member Field Values - Quick Insert */}
              {selectedMitglied && memberFieldValues.length > 0 && (
                <div className="member-fields-panel">
                  <h4>{t('briefe:form.memberFields')}</h4>
                  <p className="hint-text">{t('briefe:form.memberFieldsHint')}</p>
                  <div className="member-fields-list">
                    {memberFieldValues.map((field) => (
                      <div
                        key={field.key}
                        className={`member-field-item ${field.value === '-' ? 'disabled' : ''}`}
                        onClick={() => insertValueToContent(field.value)}
                        title={field.value !== '-' ? t('briefe:form.clickToInsert') : undefined}
                      >
                        <span className="field-label">{field.label}:</span>
                        <span className="field-value">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search */}
              {!selectedMitglied && (
                <>
                  <div className="search-box">
                    <input type="text" value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('briefe:form.searchMembers')} />
                  </div>

                  {/* Members List */}
                  <div className="members-list">
                    {mitglieder
                      .filter((m: MitgliedDto) => {
                        if (!searchTerm) return true;
                        const search = searchTerm.toLowerCase();
                        return (
                          m.vorname.toLowerCase().includes(search) ||
                          m.nachname.toLowerCase().includes(search) ||
                          m.email?.toLowerCase().includes(search) ||
                          m.mitgliedsnummer.toLowerCase().includes(search)
                        );
                      })
                      .map((m: MitgliedDto) => (
                        <div
                          key={m.id}
                          className="member-item"
                          onClick={() => handleMitgliedSelect(m)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="member-name">{m.vorname} {m.nachname}</span>
                          <span className="member-email">{m.email}</span>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/briefe')}>
            {t('common:cancel')}
          </button>
          <button type="submit" className="btn-primary"
            disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? t('common:saving') : t('common:save')}
          </button>
          {isEdit && (
            <button type="button" className="btn-success" onClick={handleSendNow}
              disabled={sendMutation.isPending || !selectedMitglied}>
              {sendMutation.isPending ? t('briefe:sending') : t('briefe:sendNow')}
            </button>
          )}
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && previewContent && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content preview-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><MailIcon /> {t('briefe:preview.title')}</h2>
              <button className="btn-close" onClick={closePreview}>×</button>
            </div>
            <div className="preview-content">
              {/* Letter Paper */}
              <div className="letter-paper">
                {/* Letter Header */}
                <div className="letter-header">
                  <div className="letter-logo">
                    {verein?.kurzname?.substring(0, 2) || verein?.name?.substring(0, 2) || 'V'}
                  </div>
                  <div className="letter-sender-info">
                    <span className="sender-name">{verein?.name}</span>
                    {verein?.email && <span className="sender-detail">✉ {verein.email}</span>}
                    {verein?.telefon && <span className="sender-detail">☏ {verein.telefon}</span>}
                  </div>
                </div>

                <div className="letter-divider"></div>

                {/* Recipient Info */}
                <div className="letter-recipient">
                  <span className="recipient-label">{t('briefe:form.recipient')}</span>
                  <span className="recipient-name">{selectedMember?.vorname} {selectedMember?.nachname}</span>
                  {selectedMember?.email && <span className="recipient-email">{selectedMember.email}</span>}
                </div>

                {/* Date */}
                <div className="letter-date">
                  {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>

                {/* Subject */}
                <div className="letter-subject">
                  <span className="subject-label">{t('briefe:form.subject')}:</span>
                  <span className="subject-text">{previewContent.betreff || '-'}</span>
                </div>

                {/* Content */}
                <div className="letter-body" dangerouslySetInnerHTML={{ __html: previewContent.inhalt }} />

                {/* Footer */}
                <div className="letter-footer">
                  <div className="footer-signature">
                    {t('briefe:preview.regards')},<br />
                    <strong>{verein?.name}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions single-action">
              <button type="button" className="btn-primary" onClick={closePreview}>
                {t('briefe:preview.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefForm;

