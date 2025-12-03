import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { briefService, briefVorlageService } from '../../services';
import { mitgliedService } from '../../services/mitgliedService';
import { TiptapEditor } from '../../components/Brief';
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
    name: '',
    betreff: '',
    inhalt: '',
    vorlageId: undefined,
  });
  const [selectedMitglied, setSelectedMitglied] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Load existing brief data
  useEffect(() => {
    if (existingBrief) {
      setFormData({
        name: existingBrief.name,
        betreff: existingBrief.betreff,
        inhalt: existingBrief.inhalt,
        vorlageId: existingBrief.vorlageId,
      });
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
    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
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

  return (
    <div className="brief-form-page">
      <div className="page-header">
        <h1>{isEdit ? t('briefe:editLetter') : t('briefe:newLetter')}</h1>
      </div>

      {/* Actions Bar with Back Button */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '0 24px', maxWidth: '1400px', margin: '0 auto 2rem' }}>
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

            {/* Name */}
            <div className="form-group">
              <label>{t('briefe:form.name')} *</label>
              <input type="text" value={formData.name} required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('briefe:form.namePlaceholder')} />
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
              <h3>{t('briefe:form.recipients')}</h3>

              {/* Selected Member Display */}
              {selectedMitglied && (
                <div className="selected-member-display">
                  <strong>{t('briefe:form.selectedRecipient')}:</strong>
                  <span>{mitglieder.find(m => m.id === selectedMitglied)?.vorname} {mitglieder.find(m => m.id === selectedMitglied)?.nachname}</span>
                  <button type="button" className="btn-text" onClick={() => setSelectedMitglied(null)}>
                    {t('briefe:form.changeRecipient')}
                  </button>
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
    </div>
  );
};

export default BriefForm;

