import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { briefService, mitgliedService } from '../../services';
import { BriefDto, BriefStatus, StatusLabels } from '../../types/brief.types';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import './BriefeList.css';

// SVG Icons
const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

// Check Icon
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

type TabType = 'all' | 'drafts' | 'sent' | 'read' | 'unread';

const BriefeList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['common', 'briefe']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<BriefDto | null>(null);
  const [briefToDelete, setBriefToDelete] = useState<BriefDto | null>(null);
  const [selectedMitglieder, setSelectedMitglieder] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const vereinId = user?.vereinId;

  // Fetch all briefe
  const { data: allBriefe = [], isLoading } = useQuery({
    queryKey: ['briefe', vereinId],
    queryFn: async () => {
      if (!vereinId) return [];
      return briefService.getByVereinId(vereinId);
    },
    enabled: !!vereinId,
  });

  // Helper to check if a brief has all messages read
  const getReadStatus = (brief: BriefDto) => {
    if (brief.status !== BriefStatus.Gesendet || !brief.recipients || brief.recipients.length === 0) {
      return null; // Not applicable for drafts
    }
    const readCount = brief.recipients.filter(r => r.istGelesen).length;
    const totalCount = brief.recipients.length;
    return { readCount, totalCount, allRead: readCount === totalCount };
  };

  // Filter briefe based on active tab
  const briefe = allBriefe.filter((brief: BriefDto) => {
    switch (activeTab) {
      case 'drafts': return brief.status === BriefStatus.Entwurf;
      case 'sent': return brief.status === BriefStatus.Gesendet;
      case 'read': {
        const status = getReadStatus(brief);
        return status && status.allRead;
      }
      case 'unread': {
        const status = getReadStatus(brief);
        return status && !status.allRead;
      }
      default: return true;
    }
  });

  // Count for tabs
  const draftsCount = allBriefe.filter((b: BriefDto) => b.status === BriefStatus.Entwurf).length;
  const sentCount = allBriefe.filter((b: BriefDto) => b.status === BriefStatus.Gesendet).length;
  const readCount = allBriefe.filter((b: BriefDto) => {
    const status = getReadStatus(b);
    return status && status.allRead;
  }).length;
  const unreadCount = allBriefe.filter((b: BriefDto) => {
    const status = getReadStatus(b);
    return status && !status.allRead;
  }).length;

  // Fetch members for send modal
  const { data: mitglieder = [] } = useQuery({
    queryKey: ['mitglieder', vereinId],
    queryFn: () => mitgliedService.getByVereinId(vereinId || 0),
    enabled: showSendModal && !!vereinId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => briefService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      showSuccess(t('briefe:messages.deleted'));
    },
    onError: () => showError(t('briefe:messages.deleteError')),
  });

  // Send mutation
  const sendMutation = useMutation({
    mutationFn: (data: { briefId: number; mitgliedIds: number[] }) => briefService.send(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['briefe'] });
      showSuccess(t('briefe:messages.sent', { count: data.length }));
      setShowSendModal(false);
      setSelectedBrief(null);
      setSelectedMitglieder([]);
    },
    onError: () => showError(t('briefe:messages.sendError')),
  });

  const openDeleteModal = (brief: BriefDto) => {
    setBriefToDelete(brief);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (briefToDelete) {
      deleteMutation.mutate(briefToDelete.id);
      setShowDeleteModal(false);
      setBriefToDelete(null);
    }
  };

  const openSendModal = (brief: BriefDto) => {
    setSelectedBrief(brief);
    setSelectedMitglieder([]);
    setSearchQuery('');
    setShowSendModal(true);
  };

  const handleSend = () => {
    if (!selectedBrief || selectedMitglieder.length === 0) {
      showError(t('briefe:errors.noRecipients'));
      return;
    }
    sendMutation.mutate({ briefId: selectedBrief.id, mitgliedIds: selectedMitglieder });
  };

  const toggleMitglied = (mitgliedId: number) => {
    setSelectedMitglieder(prev =>
      prev.includes(mitgliedId) ? prev.filter(id => id !== mitgliedId) : [...prev, mitgliedId]
    );
  };

  const filteredMitglieder = mitglieder.filter(m =>
    `${m.vorname} ${m.nachname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAllMitglieder = () => {
    if (selectedMitglieder.length === filteredMitglieder.length) {
      setSelectedMitglieder([]);
    } else {
      setSelectedMitglieder(filteredMitglieder.map(m => m.id));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const locale = i18n.language === 'de' ? 'de-DE' : 'tr-TR';
    return date.toLocaleDateString(locale);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const locale = i18n.language === 'de' ? 'de-DE' : 'tr-TR';
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: BriefStatus) => {
    const label = StatusLabels[status]?.[i18n.language as 'de' | 'tr'] || status;
    return (
      <span className={`status-badge ${status.toLowerCase()}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="briefe-list-page">
      <div className="page-header">
        <h1 className="page-title">{t('briefe:title')}</h1>
        <p className="page-subtitle">{t('briefe:subtitle')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div style={{ flex: 1 }}></div>
        <button className="btn-primary" onClick={() => navigate('/briefe/neu')}>
          {t('briefe:newLetter')}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}>
          {t('briefe:tabs.all')} <span className="tab-count">{allBriefe.length}</span>
        </button>
        <button className={`filter-tab ${activeTab === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveTab('drafts')}>
          {t('briefe:tabs.drafts')} <span className="tab-count">{draftsCount}</span>
        </button>
        <button className={`filter-tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}>
          {t('briefe:tabs.sent')} <span className="tab-count">{sentCount}</span>
        </button>
        <button className={`filter-tab ${activeTab === 'read' ? 'active' : ''}`}
          onClick={() => setActiveTab('read')}>
          {t('briefe:tabs.read')} <span className="tab-count">{readCount}</span>
        </button>
        <button className={`filter-tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}>
          {t('briefe:tabs.unread')} <span className="tab-count">{unreadCount}</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : briefe.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>{t('briefe:emptyState.title')}</h3>
          <p>{t('briefe:emptyState.description')}</p>
          <button className="btn-primary" onClick={() => navigate('/briefe/neu')}>
            {t('briefe:newLetter')}
          </button>
        </div>
      ) : (
        <div className="briefe-table-container">
          <table className="briefe-table">
            <thead>
              <tr>
                <th>{t('briefe:table.title')}</th>
                <th>{t('briefe:table.subject')}</th>
                <th>{t('briefe:table.status')}</th>
                <th>{t('briefe:table.recipients')}</th>
                <th>{t('briefe:table.readStatus')}</th>
                <th>{t('briefe:table.date')}</th>
                <th>{t('briefe:table.time')}</th>
                <th>{t('briefe:table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {briefe.map((brief: BriefDto) => {
                const readStatus = getReadStatus(brief);
                return (
                  <tr key={brief.id}>
                    <td className="name-cell">
                      <span className="brief-name">{brief.titel}</span>
                      {brief.vorlageName && (
                        <span className="template-badge">📋 {brief.vorlageName}</span>
                      )}
                    </td>
                    <td>{brief.betreff}</td>
                    <td>{getStatusBadge(brief.status)}</td>
                    <td className="center-cell">{brief.status === BriefStatus.Gesendet
                      ? brief.nachrichtenCount
                      : (brief.selectedMitgliedIds?.length || brief.selectedMitgliedCount || '-')}</td>
                    <td className="center-cell">
                      {readStatus ? (
                        <span className={`read-status-badge ${readStatus.allRead ? 'all-read' : 'partial'}`}>
                          {readStatus.allRead ? (
                            <><CheckIcon /> {t('briefe:table.allRead')}</>
                          ) : (
                            `${readStatus.readCount}/${readStatus.totalCount}`
                          )}
                        </span>
                      ) : '-'}
                    </td>
                    <td>{formatDate(brief.modified || brief.created)}</td>
                    <td>{formatTime(brief.modified || brief.created)}</td>
                    <td className="actions-cell">
                      <button className="table-action-btn" onClick={() => navigate(`/briefe/${brief.id}`)}
                        title={t('common:view')}><ViewIcon /></button>
                      {brief.status === BriefStatus.Entwurf && (
                        <>
                          <button className="table-action-btn send" onClick={() => openSendModal(brief)}
                            title={t('common:send')}><SendIcon /></button>
                          <button className="table-action-btn" onClick={() => navigate(`/briefe/${brief.id}/bearbeiten`)}
                            title={t('common:edit')}><EditIcon /></button>
                          <button className="table-action-btn delete" onClick={() => openDeleteModal(brief)}
                            title={t('common:delete')}><DeleteIcon /></button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && selectedBrief && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
          <div className="modal-content send-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 {t('common:send')}: {selectedBrief.titel}</h2>
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
                  <div className="empty-state-modal">{t('common:noResults')}</div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && briefToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h2>{t('briefe:deleteModal.title')}</h2>
            <p className="delete-message">
              <strong>"{briefToDelete.titel}"</strong> {t('briefe:deleteModal.message')}
            </p>
            <p className="delete-warning">{t('briefe:deleteModal.warning')}</p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                {t('common:cancel')}
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? '...' : t('common:delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefeList;

