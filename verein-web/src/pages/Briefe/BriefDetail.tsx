import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { briefService, mitgliedService } from '../../services';
import { BriefStatus, StatusLabels } from '../../types/brief.types';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import './BriefDetail.css';

// Back Icon
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const BriefDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['common', 'briefe']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedMitglieder, setSelectedMitglieder] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: brief, isLoading } = useQuery({
    queryKey: ['brief', id],
    queryFn: () => briefService.getById(Number(id)),
    enabled: !!id,
  });

  // Fetch members for send modal
  const { data: mitglieder = [] } = useQuery({
    queryKey: ['mitglieder', user?.vereinId],
    queryFn: () => mitgliedService.getByVereinId(user?.vereinId || 0),
    enabled: showSendModal && !!user?.vereinId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => briefService.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      showSuccess(t('briefe:messages.deleted'));
      navigate('/briefe');
    },
    onError: () => showError(t('briefe:messages.deleteError')),
  });

  const sendMutation = useMutation({
    mutationFn: (mitgliedIds: number[]) => briefService.send({ briefId: Number(id), mitgliedIds }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      queryClient.invalidateQueries({ queryKey: ['brief', id] });
      showSuccess(t('briefe:messages.sent', { count: data.length }));
      setShowSendModal(false);
      setSelectedMitglieder([]);
    },
    onError: () => showError(t('briefe:messages.sendError')),
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (brief && window.confirm(t('briefe:confirmDelete', { name: brief.titel }))) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (!brief) {
    return (
      <div className="brief-detail-page">
        <div className="error-state">
          <h2>{t('briefe:errors.notFound')}</h2>
          <button className="btn-secondary" onClick={() => navigate('/briefe')}>
            ← {t('common:back')}
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = StatusLabels[brief.status]?.[i18n.language as 'de' | 'tr'] || brief.status;

  const handleSend = () => {
    if (selectedMitglieder.length === 0) {
      showError(t('briefe:errors.noRecipients'));
      return;
    }
    sendMutation.mutate(selectedMitglieder);
  };

  const toggleMitglied = (mitgliedId: number) => {
    setSelectedMitglieder(prev =>
      prev.includes(mitgliedId)
        ? prev.filter(id => id !== mitgliedId)
        : [...prev, mitgliedId]
    );
  };

  const toggleAllMitglieder = () => {
    if (selectedMitglieder.length === filteredMitglieder.length) {
      setSelectedMitglieder([]);
    } else {
      setSelectedMitglieder(filteredMitglieder.map(m => m.id));
    }
  };

  const filteredMitglieder = mitglieder.filter(m =>
    `${m.vorname} ${m.nachname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="brief-detail-page">
      <div className="page-header">
        <button className="btn-icon-back" onClick={() => navigate('/briefe')} title={t('common:back')}>
          <BackIcon />
        </button>
        <div className="header-actions">
          {brief.status === BriefStatus.Entwurf && (
            <>
              <button className="btn-primary" onClick={() => setShowSendModal(true)}>
                {t('common:send')}
              </button>
              <button className="btn-secondary" onClick={() => navigate(`/briefe/${id}/bearbeiten`)}>
                {t('common:edit')}
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                {t('common:delete')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="brief-detail-content">
        <div className="brief-header">
          <h1>{brief.titel}</h1>
          <span className={`status-badge ${brief.status.toLowerCase()}`}>{statusLabel}</span>
        </div>

        <div className="brief-meta">
          <div className="meta-item">
            <span className="label">{t('briefe:form.subject')}:</span>
            <span className="value">{brief.betreff}</span>
          </div>
          {brief.vorlageName && (
            <div className="meta-item">
              <span className="label">{t('briefe:form.template')}:</span>
              <span className="value">📋 {brief.vorlageName}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="label">{t('briefe:table.recipients')}:</span>
            <span className="value">{brief.nachrichtenCount || 0}</span>
          </div>
          <div className="meta-item">
            <span className="label">{t('common:created')}:</span>
            <span className="value">{formatDate(brief.created)}</span>
          </div>
        </div>

        <div className="brief-body">
          <h3>{t('briefe:detail.content')}</h3>
          <div className="content-preview" dangerouslySetInnerHTML={{ __html: brief.inhalt }} />
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
          <div className="modal-content send-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 {t('common:send')}: {brief.titel}</h2>
              <button className="modal-close" onClick={() => setShowSendModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="search-box">
                <input
                  type="text"
                  placeholder={t('briefe:form.searchMembers')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="select-actions">
                <button type="button" className="btn-link" onClick={toggleAllMitglieder}>
                  {selectedMitglieder.length === filteredMitglieder.length
                    ? t('briefe:form.clearSelection')
                    : t('briefe:form.selectAll')}
                </button>
                <span className="selected-count">
                  {selectedMitglieder.length} {t('briefe:form.selected')}
                </span>
              </div>
              <div className="members-list">
                {filteredMitglieder.map(m => (
                  <label key={m.id} className="member-item">
                    <input
                      type="checkbox"
                      checked={selectedMitglieder.includes(m.id)}
                      onChange={() => toggleMitglied(m.id)}
                    />
                    <span className="member-name">{m.vorname} {m.nachname}</span>
                    <span className="member-email">{m.email}</span>
                  </label>
                ))}
                {filteredMitglieder.length === 0 && (
                  <div className="empty-state">{t('common:noResults')}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSendModal(false)}>
                {t('common:cancel')}
              </button>
              <button
                className="btn-primary"
                onClick={handleSend}
                disabled={selectedMitglieder.length === 0 || sendMutation.isPending}
              >
                {sendMutation.isPending ? '...' : `📤 ${t('common:send')} (${selectedMitglieder.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefDetail;

