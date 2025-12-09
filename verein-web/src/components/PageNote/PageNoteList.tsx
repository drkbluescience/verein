import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  PageNoteDto,
  CategoryLabels,
  PriorityLabels,
  StatusLabels,
  PriorityColors
} from '../../types/pageNote.types';
import { formatDistanceToNow } from 'date-fns';
import { de, tr } from 'date-fns/locale';

interface PageNoteListProps {
  notes: PageNoteDto[];
  loading: boolean;
  onEdit: (note: PageNoteDto) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

/**
 * PageNote List Component
 * Displays list of page notes
 */
const PageNoteList: React.FC<PageNoteListProps> = ({
  notes,
  loading,
  onEdit,
  onDelete,
  onRefresh
}) => {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const currentLang = i18n.language as 'de' | 'tr';
  const locale = currentLang === 'de' ? de : tr;

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

  const canEdit = (note: PageNoteDto) => {
    return note.userEmail === user?.email;
  };

  const canDelete = (note: PageNoteDto) => {
    return note.userEmail === user?.email || user?.type === 'admin';
  };

  if (loading) {
    return (
      <div className="page-note-list-loading">
        <div className="spinner"></div>
        <p>{t('pageNotes.loading')}</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="page-note-list-empty">
        <h3>{t('pageNotes.noNotes')}</h3>
        <p>{t('pageNotes.noNotesDescription')}</p>
        <p className="empty-hint">{t('pageNotes.noNotesHint')}</p>
      </div>
    );
  }

  return (
    <div className="page-note-list">
      <div className="list-header">
        <span>{t('pageNotes.noteCount', { count: notes.length })}</span>
        <button className="refresh-button" onClick={onRefresh} title={t('pageNotes.refresh')}>
          {t('pageNotes.refresh')}
        </button>
      </div>

      <div className="notes-container">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            {/* Header */}
            <div className="note-card-header">
              <div className="note-meta">
                <span className="note-category">
                  {CategoryLabels[note.category][currentLang]}
                </span>
                <span
                  className="note-priority"
                  style={{ color: PriorityColors[note.priority] }}
                >
                  {PriorityLabels[note.priority][currentLang]}
                </span>
              </div>
              <div className="note-actions">
                {canEdit(note) && (
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(note)}
                    title={t('actions.edit')}
                  >
                    {t('actions.edit')}
                  </button>
                )}
                {canDelete(note) && (
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(note.id)}
                    title={t('actions.delete')}
                  >
                    {t('actions.delete')}
                  </button>
                )}
              </div>
            </div>

            {/* Page Link */}
            {note.pageUrl && (
              <div className="note-page-link">
                <a href={note.pageUrl} className="page-link">
                  {note.pageTitle || note.pageUrl}
                </a>
              </div>
            )}

            {/* Title */}
            <h4 className="note-title">{note.title}</h4>

            {/* Content */}
            <p className="note-content">{note.content}</p>

            {/* Footer */}
            <div className="note-card-footer">
              <span className="note-status">
                {StatusLabels[note.status][currentLang]}
              </span>
              <span className="note-date">
                {formatDate(note.created)}
              </span>
            </div>

            {/* Admin Notes */}
            {note.adminNotes && (
              <div className="admin-notes">
                <strong>{t('pageNotes.adminNote')}</strong> {note.adminNotes}
              </div>
            )}

            {/* Completed Info */}
            {note.completedBy && note.completedAt && (
              <div className="completed-info">
                {t('pageNotes.completedBy', { name: note.completedBy })} - {formatDate(note.completedAt)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageNoteList;

