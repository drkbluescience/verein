import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { pageNoteService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  PageNoteDto,
  PageNoteCategory,
  PageNotePriority
} from '../../types/pageNote.types';
import PageNoteForm from './PageNoteForm';
import PageNoteList from './PageNoteList';
import './PageNoteModal.css';

interface PageNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageUrl: string;
  pageTitle?: string;
}

/**
 * PageNote Modal Component
 * Main modal for viewing and creating page notes
 */
const PageNoteModal: React.FC<PageNoteModalProps> = ({
  isOpen,
  onClose,
  pageUrl,
  pageTitle
}) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['pageNotesAdmin', 'common']);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Admin and dernek start with 'create' tab, others with 'list'
  const isAdmin = user?.type === 'admin';
  const canCreate = user?.type === 'admin' || user?.type === 'dernek';
  const [activeTab, setActiveTab] = useState<'list' | 'create'>(canCreate ? 'create' : 'list');
  const [notes, setNotes] = useState<PageNoteDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<PageNoteDto | null>(null);

  // Get modal title based on state
  const getModalTitle = () => {
    if (isAdmin) {
      return t('pageNotes.addNewNote');
    }
    if (editingNote) {
      return t('pageNotes.editNote');
    }
    if (activeTab === 'create') {
      return t('pageNotes.newNote');
    }
    return t('pageNotes.myNotes');
  };

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pageNoteService.getMyNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
      showToast(t('pageNotesAdmin:messages.notesLoadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  // Load all user notes (not filtered by page) - skip for admin
  useEffect(() => {
    if (isOpen && user && !isAdmin) {
      loadNotes();
    }
  }, [isOpen, user, isAdmin, loadNotes]);

  const handleCreateNote = async (data: {
    title: string;
    content: string;
    category: PageNoteCategory;
    priority: PageNotePriority;
  }) => {
    try {
      const createData = {
        pageUrl,
        pageTitle,
        title: data.title,
        content: data.content,
        category: data.category,
        priority: data.priority
      };

      console.log('Creating note with data:', createData);
      await pageNoteService.create(createData);

      showToast(t('pageNotesAdmin:messages.noteCreated'), 'success');
      setActiveTab('list');
      loadNotes();
    } catch (error) {
      console.error('Failed to create note:', error);
      showToast(t('pageNotesAdmin:messages.noteCreateError'), 'error');
    }
  };

  const handleUpdateNote = async (id: number, data: {
    title?: string;
    content?: string;
    category?: PageNoteCategory;
    priority?: PageNotePriority;
  }) => {
    try {
      await pageNoteService.update(id, data);
      showToast(t('pageNotesAdmin:messages.noteUpdatedSuccess'), 'success');
      setEditingNote(null);
      loadNotes();
    } catch (error) {
      console.error('Failed to update note:', error);
      showToast(t('pageNotesAdmin:messages.noteUpdateError'), 'error');
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!window.confirm(t('pageNotesAdmin:messages.confirmDelete'))) {
      return;
    }

    try {
      await pageNoteService.delete(id);
      showToast(t('pageNotesAdmin:messages.noteDeleted'), 'success');
      loadNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
      showToast(t('pageNotesAdmin:messages.noteDeleteError'), 'error');
    }
  };

  const handleEditNote = (note: PageNoteDto) => {
    setEditingNote(note);
    setActiveTab('create');
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setActiveTab('list');
  };

  if (!isOpen) return null;

  return (
    <div className="page-note-modal-overlay" onClick={onClose}>
      <div className="page-note-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="page-note-modal-header">
          <h2>{getModalTitle()}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs - Hide for admin */}
        {!isAdmin && (
          <div className="page-note-tabs">
            <button
              className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('list');
                setEditingNote(null);
              }}
            >
              {t('pageNotes.myNotes')} ({notes.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              {editingNote ? t('actions.edit') : t('pageNotes.newNote')}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="page-note-modal-content">
          {activeTab === 'list' && !isAdmin ? (
            <PageNoteList
              notes={notes}
              loading={loading}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onRefresh={loadNotes}
            />
          ) : (
            <PageNoteForm
              onSubmit={editingNote ? 
                (data) => handleUpdateNote(editingNote.id, data) : 
                handleCreateNote
              }
              onCancel={editingNote ? handleCancelEdit : undefined}
              initialData={editingNote ? {
                title: editingNote.title,
                content: editingNote.content,
                category: editingNote.category,
                priority: editingNote.priority
              } : undefined}
              isEditing={!!editingNote}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PageNoteModal;

