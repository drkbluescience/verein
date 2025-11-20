import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { pageNoteService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  PageNoteDto,
  PageNoteStatus,
  PageNoteCategory,
  PageNotePriority,
  PageNoteStatisticsDto,
  CategoryLabels,
  PriorityLabels,
  StatusLabels,
  CategoryIcons,
  PriorityColors
} from '../../types/pageNote.types';
import { formatDistanceToNow } from 'date-fns';
import { de, tr } from 'date-fns/locale';
import PageNoteModal from '../../components/PageNote/PageNoteModal';
import './PageNotesAdmin.css';

// SVG Icons
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

/**
 * Admin Page Notes Dashboard
 * Allows admin to view and manage all page notes
 */
const PageNotesAdmin: React.FC = () => {
  console.log('🎨 PageNotesAdmin component rendering...');

  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['pageNotesAdmin', 'common']);
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const currentLang = i18n.language as 'de' | 'tr';
  const locale = currentLang === 'de' ? de : tr;

  const [notes, setNotes] = useState<PageNoteDto[]>([]);
  const [statistics, setStatistics] = useState<PageNoteStatisticsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PageNoteStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<PageNoteCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<PageNotePriority | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [completingNoteId, setCompletingNoteId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<PageNoteDto | null>(null);

  console.log('👤 PageNotesAdmin - Current user:', user);

  // Load data immediately on mount
  useEffect(() => {
    console.log('🚀 PageNotesAdmin mounted, loading data immediately...');
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect if not admin (but don't block rendering)
  useEffect(() => {
    console.log('🔐 Admin check - user:', user);
    if (user && user.type !== 'admin') {
      console.log('⛔ Not admin, redirecting...');
      window.location.href = '/';
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Admin loading notes...');
      console.log('👤 Current user:', user);
      console.log('🔑 Auth token:', localStorage.getItem('auth_token'));

      const [allNotes, stats] = await Promise.all([
        pageNoteService.getAll(false),
        pageNoteService.getStatistics()
      ]);

      console.log('✅ Notes loaded:', allNotes.length, 'notes');
      console.log('📊 Statistics:', stats);

      setNotes(allNotes);
      setStatistics(stats);
    } catch (error: any) {
      console.error('❌ Failed to load data:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      showToast(t('pageNotesAdmin:messages.loadError') + ': ' + (error.response?.data?.title || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteNote = async (noteId: number, status: PageNoteStatus) => {
    try {
      await pageNoteService.complete(noteId, {
        status,
        adminNotes: adminNotes || undefined
      });
      showToast(t('pageNotesAdmin:messages.noteUpdated'), 'success');
      setCompletingNoteId(null);
      setAdminNotes('');
      loadData();
    } catch (error) {
      console.error('Failed to complete note:', error);
      showToast(t('pageNotesAdmin:messages.noteUpdateError'), 'error');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!window.confirm(t('pageNotesAdmin:messages.confirmDelete'))) {
      return;
    }

    try {
      await pageNoteService.delete(noteId);
      showToast(t('pageNotesAdmin:messages.noteDeleted'), 'success');
      loadData();
    } catch (error) {
      console.error('Failed to delete note:', error);
      showToast(t('pageNotesAdmin:messages.noteDeleteError'), 'error');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Backend sends UTC time, convert to local
      const utcDate = new Date(dateString + 'Z'); // Add Z to indicate UTC
      return formatDistanceToNow(utcDate, {
        addSuffix: true,
        locale
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      // Backend sends UTC time, convert to local
      const utcDate = new Date(dateString + 'Z'); // Add Z to indicate UTC
      return utcDate.toLocaleString(currentLang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Get unique users
  const uniqueUsers = Array.from(new Set(notes.map(note => note.userEmail)))
    .sort()
    .map(email => ({
      email,
      name: notes.find(n => n.userEmail === email)?.userName || email
    }));

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (selectedStatus !== 'all' && note.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && note.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && note.priority !== selectedPriority) return false;
    if (selectedUser === 'mine' && note.userEmail !== user?.email) return false;
    if (selectedUser !== 'all' && selectedUser !== 'mine' && note.userEmail !== selectedUser) return false;
    if (searchTerm && !note.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !note.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Don't block rendering, just show loading
  if (!user) {
    return <div className="page-notes-admin"><div className="loading-state">{t('pageNotesAdmin:status.loading')}</div></div>;
  }

  if (user.type !== 'admin') {
    return <div className="page-notes-admin"><div className="empty-state">{t('pageNotesAdmin:status.unauthorized')}</div></div>;
  }

  return (
    <div className="page-notes-admin">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('pageNotesAdmin:title')}</h1>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button className="add-note-btn" onClick={() => setIsNoteModalOpen(true)}>
          + {t('pageNotesAdmin:header.addNote')}
        </button>
        <button className="refresh-btn" onClick={loadData}>
          {t('pageNotesAdmin:header.refresh')}
        </button>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="statistics-grid">
          <div className="stat-card total">
            <div className="stat-value">{statistics.totalNotes}</div>
            <div className="stat-label">{t('pageNotesAdmin:statistics.total')}</div>
          </div>
          <div className="stat-card mine">
            <div className="stat-value">{notes.filter(n => n.userEmail === user?.email).length}</div>
            <div className="stat-label">{t('pageNotesAdmin:statistics.mine')}</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value">{statistics.pendingNotes}</div>
            <div className="stat-label">{t('pageNotesAdmin:statistics.pending')}</div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-value">{statistics.inProgressNotes}</div>
            <div className="stat-label">{t('pageNotesAdmin:statistics.inProgress')}</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-value">{statistics.completedNotes}</div>
            <div className="stat-label">{t('pageNotesAdmin:statistics.completed')}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <input
          type="text"
          placeholder={t('pageNotesAdmin:filters.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="filter-select"
        >
          <option value="all">{t('pageNotesAdmin:filters.allUsers')}</option>
          <option value="mine">{t('pageNotesAdmin:filters.myNotes')}</option>
          {uniqueUsers.map(u => (
            <option key={u.email} value={u.email}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as PageNoteStatus | 'all')}
          className="filter-select"
        >
          <option value="all">{t('pageNotesAdmin:filters.allStatuses')}</option>
          {Object.values(PageNoteStatus).map(status => (
            <option key={status} value={status}>
              {StatusLabels[status][currentLang]}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as PageNoteCategory | 'all')}
          className="filter-select"
        >
          <option value="all">{t('pageNotesAdmin:filters.allCategories')}</option>
          {Object.values(PageNoteCategory).map(cat => (
            <option key={cat} value={cat}>
              {CategoryIcons[cat]} {CategoryLabels[cat][currentLang]}
            </option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value as PageNotePriority | 'all')}
          className="filter-select"
        >
          <option value="all">{t('pageNotesAdmin:filters.allPriorities')}</option>
          {Object.values(PageNotePriority).map(pri => (
            <option key={pri} value={pri}>
              {PriorityLabels[pri][currentLang]}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Table */}
      <div className="notes-table-container">
        {loading ? (
          <div className="loading-state">{t('pageNotesAdmin:status.loading')}</div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">{t('pageNotesAdmin:table.noNotes')}</div>
        ) : (
          <table className="notes-table">
            <thead>
              <tr>
                <th>{t('pageNotesAdmin:table.title')}</th>
                <th>{t('pageNotesAdmin:table.category')}</th>
                <th>{t('pageNotesAdmin:table.priority')}</th>
                <th>{t('pageNotesAdmin:table.status')}</th>
                <th>{t('pageNotesAdmin:table.user')}</th>
                <th>{t('pageNotesAdmin:table.page')}</th>
                <th>{t('pageNotesAdmin:table.date')}</th>
                <th>{t('pageNotesAdmin:table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map(note => (
                <tr key={note.id} onClick={() => setSelectedNote(note)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="note-title-cell">
                      <strong>{note.title}</strong>
                      <p className="note-content-preview">{note.content.substring(0, 100)}...</p>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">
                      {CategoryLabels[note.category][currentLang]}
                    </span>
                  </td>
                  <td>
                    <span
                      className="priority-badge"
                      style={{ color: PriorityColors[note.priority] }}
                    >
                      {PriorityLabels[note.priority][currentLang]}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${note.status.toLowerCase()}`}>
                      {StatusLabels[note.status][currentLang]}
                    </span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div>{note.userName || 'N/A'}</div>
                      <small>{note.userEmail}</small>
                    </div>
                  </td>
                  <td>
                    <a href={note.pageUrl} target="_blank" rel="noopener noreferrer" className="page-link">
                      {note.pageTitle || note.pageUrl}
                    </a>
                  </td>
                  <td>{formatDate(note.created)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="action-buttons">
                      {note.status !== PageNoteStatus.Completed && (
                        <button
                          className="action-btn complete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompletingNoteId(note.id);
                          }}
                          title={t('pageNotesAdmin:actions.complete')}
                        >
                          <CheckIcon />
                        </button>
                      )}
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        title={t('pageNotesAdmin:actions.delete')}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Complete Note Modal */}
      {completingNoteId && (
        <div className="modal-overlay" onClick={() => setCompletingNoteId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('pageNotesAdmin:completeModal.title')}</h3>
            <div className="form-group">
              <label>{t('pageNotesAdmin:completeModal.statusLabel')}</label>
              <select
                className="form-control"
                onChange={(e) => {
                  const status = e.target.value as PageNoteStatus;
                  if (status) {
                    handleCompleteNote(completingNoteId, status);
                  }
                }}
                defaultValue=""
              >
                <option value="">{t('pageNotesAdmin:completeModal.statusPlaceholder')}</option>
                <option value={PageNoteStatus.InProgress}>{t('pageNotesAdmin:completeModal.statusInProgress')}</option>
                <option value={PageNoteStatus.Completed}>{t('pageNotesAdmin:completeModal.statusCompleted')}</option>
                <option value={PageNoteStatus.Rejected}>{t('pageNotesAdmin:completeModal.statusRejected')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('pageNotesAdmin:completeModal.adminNotesLabel')}</label>
              <textarea
                className="form-control"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={t('pageNotesAdmin:completeModal.adminNotesPlaceholder')}
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setCompletingNoteId(null);
                  setAdminNotes('');
                }}
              >
                {t('pageNotesAdmin:completeModal.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Creation Modal */}
      {isNoteModalOpen && (
        <PageNoteModal
          isOpen={isNoteModalOpen}
          onClose={() => {
            setIsNoteModalOpen(false);
            loadData(); // Refresh data after modal closes
          }}
          pageUrl={location.pathname}
          pageTitle={document.title}
        />
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="note-detail-modal-overlay" onClick={() => setSelectedNote(null)}>
          <div className="note-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="note-detail-header">
              <h2>{selectedNote.title}</h2>
              <button className="note-detail-close" onClick={() => setSelectedNote(null)}>
                ✕
              </button>
            </div>

            <div className="note-detail-body">
              {/* Content */}
              <div className="note-detail-section">
                <div className="note-detail-label">{t('pageNotesAdmin:detailModal.content')}</div>
                <div className="note-detail-content">{selectedNote.content}</div>
              </div>

              {/* Meta Information */}
              <div className="note-detail-section">
                <div className="note-detail-label">{t('pageNotesAdmin:detailModal.info')}</div>
                <div className="note-detail-meta">
                  <div>
                    <div className="note-detail-label" style={{ marginBottom: '4px' }}>{t('pageNotesAdmin:detailModal.category')}</div>
                    <div className="note-detail-badges">
                      <span className="category-badge">
                        {CategoryIcons[selectedNote.category]} {CategoryLabels[selectedNote.category][currentLang]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="note-detail-label" style={{ marginBottom: '4px' }}>{t('pageNotesAdmin:detailModal.priority')}</div>
                    <div className="note-detail-badges">
                      <span className="priority-badge" style={{ color: PriorityColors[selectedNote.priority] }}>
                        {PriorityLabels[selectedNote.priority][currentLang]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="note-detail-label" style={{ marginBottom: '4px' }}>{t('pageNotesAdmin:detailModal.status')}</div>
                    <div className="note-detail-badges">
                      <span className={`status-badge status-${selectedNote.status.toLowerCase()}`}>
                        {StatusLabels[selectedNote.status][currentLang]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="note-detail-label" style={{ marginBottom: '4px' }}>{t('pageNotesAdmin:detailModal.date')}</div>
                    <div className="note-detail-value">{formatDateTime(selectedNote.created)}</div>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="note-detail-section">
                <div className="note-detail-label">{t('pageNotesAdmin:detailModal.user')}</div>
                <div className="note-detail-value">
                  <div><strong>{selectedNote.userName || 'N/A'}</strong></div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedNote.userEmail}</div>
                </div>
              </div>

              {/* Page Information */}
              <div className="note-detail-section">
                <div className="note-detail-label">{t('pageNotesAdmin:detailModal.page')}</div>
                <div className="note-detail-value">
                  <div><strong>{selectedNote.pageTitle || t('pageNotesAdmin:detailModal.noTitle')}</strong></div>
                  <a
                    href={selectedNote.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="note-detail-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedNote.pageUrl}
                  </a>
                </div>
              </div>

              {/* Admin Notes (if completed) */}
              {selectedNote.adminNotes && (
                <div className="note-detail-section">
                  <div className="note-detail-label">{t('pageNotesAdmin:detailModal.adminNotes')}</div>
                  <div className="note-detail-content" style={{ borderLeftColor: '#10b981' }}>
                    {selectedNote.adminNotes}
                  </div>
                  {selectedNote.completedBy && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                      {t('pageNotesAdmin:detailModal.completedBy')} {selectedNote.completedBy} • {selectedNote.completedAt && formatDate(selectedNote.completedAt)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="note-detail-footer">
              {selectedNote.status !== PageNoteStatus.Completed && (
                <button
                  className="note-detail-btn complete"
                  onClick={() => {
                    setSelectedNote(null);
                    setCompletingNoteId(selectedNote.id);
                  }}
                >
                  {t('pageNotesAdmin:detailModal.completeButton')}
                </button>
              )}
              <button
                className="note-detail-btn delete"
                onClick={() => {
                  setSelectedNote(null);
                  handleDeleteNote(selectedNote.id);
                }}
              >
                {t('pageNotesAdmin:detailModal.deleteButton')}
              </button>
              <button
                className="note-detail-btn close"
                onClick={() => setSelectedNote(null)}
              >
                {t('pageNotesAdmin:detailModal.closeButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageNotesAdmin;

