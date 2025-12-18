import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pageNoteService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import PageNoteModal from './PageNoteModal';
import './PageNoteButton.css';

/**
 * Floating Note Button Component
 * Displays a floating button in the bottom-right corner
 * Shows badge with note count for current page
 */
const PageNoteButton: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Don't show on auth pages or admin page notes page
  const isAuthPage = location.pathname.startsWith('/auth') ||
                     location.pathname === '/login' ||
                     location.pathname === '/register';
  const isAdminNotesPage = location.pathname === '/admin/page-notes';

  // Load note count (for admin and dernek users)
  useEffect(() => {
    if (!isAuthenticated || isAuthPage || isAdminNotesPage) return;
    if (user?.type !== 'admin' && user?.type !== 'dernek') return;

    const loadNoteCount = async () => {
      try {
        setLoading(true);
        // Admin sees all notes count, dernek and others see their own
        const notes = user?.type === 'admin'
          ? await pageNoteService.getAll(false)
          : await pageNoteService.getMyNotes();
        setNoteCount(notes.length);
      } catch (error) {
        console.error('Failed to load note count:', error);
        setNoteCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadNoteCount();
  }, [isAuthenticated, isAuthPage, isAdminNotesPage, user]);

  // Refresh note count when modal closes
  const handleModalClose = async () => {
    setIsModalOpen(false);

    // Refresh count (admin sees all, others see their own)
    try {
      const notes = user?.type === 'admin'
        ? await pageNoteService.getAll(false)
        : await pageNoteService.getMyNotes();
      setNoteCount(notes.length);
    } catch (error) {
      console.error('Failed to refresh note count:', error);
    }
  };

  // Handle button click - always open modal
  const handleClick = () => {
    setIsModalOpen(true);
  };

  // Don't render if not authenticated, on auth pages, on admin notes page, or not admin/dernek user
  if (!isAuthenticated || isAuthPage || isAdminNotesPage) {
    return null;
  }
  if (user?.type !== 'admin' && user?.type !== 'dernek') {
    return null;
  }

  return (
    <>
      <button
        className="page-note-button"
        onClick={handleClick}
        title="Notlarım"
        aria-label="Notlarım"
      >
        <span className="note-icon">Not</span>
        {noteCount > 0 && (
          <span className="note-badge">{noteCount}</span>
        )}
      </button>

      {/* Show modal for all users */}
      {isModalOpen && (
        <PageNoteModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          pageUrl={location.pathname}
          pageTitle={document.title}
        />
      )}
    </>
  );
};

export default PageNoteButton;

