import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { nachrichtService } from '../../services';
import { NachrichtDto } from '../../types/brief.types';
import { useAuth } from '../../contexts/AuthContext';
import './NachrichtenList.css';

// SVG Icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const NachrichtenList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['common', 'briefe']);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedNachricht, setSelectedNachricht] = useState<NachrichtDto | null>(null);

  // Get mitgliedId from authenticated user
  const mitgliedId = user?.mitgliedId;

  const { data: nachrichten = [], isLoading } = useQuery({
    queryKey: ['nachrichten', mitgliedId],
    queryFn: () => nachrichtService.getByMitgliedId(mitgliedId!),
    enabled: !!mitgliedId,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['nachrichten-unread', mitgliedId],
    queryFn: () => nachrichtService.getUnreadCount(mitgliedId!),
    enabled: !!mitgliedId,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => nachrichtService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nachrichten', mitgliedId] });
      queryClient.invalidateQueries({ queryKey: ['nachrichten-unread', mitgliedId] });
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
        hour: '2-digit', minute: '2-digit'
      });
    }
    return date.toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const formatFullDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleSelectNachricht = (nachricht: NachrichtDto) => {
    setSelectedNachricht(nachricht);
    if (!nachricht.gelesenDatum) {
      markAsReadMutation.mutate(nachricht.id);
    }
  };

  return (
    <div className="nachrichten-page">
      <div className="page-header">
        <h1 className="page-title">{t('briefe:nachrichten.title')}</h1>
        {unreadCount && unreadCount.count > 0 && (
          <p className="page-subtitle">{unreadCount.count} {t('briefe:nachrichten.unread')}</p>
        )}
      </div>

      <div className="nachrichten-layout">
        {/* Message List */}
        <div className="nachrichten-list">
          <div className="nachrichten-list-content">
            {isLoading ? (
              <div className="loading-container"><div className="spinner"></div></div>
            ) : nachrichten.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <InboxIcon />
                </div>
                <h3>{t('briefe:nachrichten.empty')}</h3>
                <p>{t('briefe:nachrichten.emptyDescription')}</p>
              </div>
            ) : (
              nachrichten.map((nachricht: NachrichtDto) => (
                <div
                  key={nachricht.id}
                  className={`nachricht-item ${!nachricht.gelesenDatum ? 'unread' : ''} ${selectedNachricht?.id === nachricht.id ? 'selected' : ''}`}
                  onClick={() => handleSelectNachricht(nachricht)}
                >
                  <div className="nachricht-avatar">
                    <UserIcon />
                  </div>
                  <div className="nachricht-content">
                    <div className="nachricht-header">
                      <span className="sender">{nachricht.absenderName}</span>
                      <span className="date">{formatDate(nachricht.gesendetDatum)}</span>
                    </div>
                    <div className="nachricht-subject">{nachricht.betreff}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className={`nachricht-detail ${selectedNachricht ? 'has-selection' : ''}`}>
          {selectedNachricht ? (
            <>
              <div className="detail-header">
                <h2>{selectedNachricht.betreff}</h2>
                <div className="detail-meta">
                  <span>
                    <UserIcon />
                    {selectedNachricht.absenderName}
                  </span>
                  <span>
                    <CalendarIcon />
                    {formatFullDate(selectedNachricht.gesendetDatum)}
                  </span>
                </div>
              </div>
              <div className="detail-content" dangerouslySetInnerHTML={{ __html: selectedNachricht.inhalt }} />
            </>
          ) : (
            <div className="no-selection">
              <div className="icon">
                <MailIcon />
              </div>
              <p>{t('briefe:nachrichten.selectMessage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NachrichtenList;

