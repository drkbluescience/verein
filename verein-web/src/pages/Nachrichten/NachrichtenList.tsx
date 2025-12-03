import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { nachrichtService } from '../../services';
import { NachrichtDto } from '../../types/brief.types';
import { useAuth } from '../../contexts/AuthContext';
import './NachrichtenList.css';

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
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
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
          <span className="unread-badge">{unreadCount.count} {t('briefe:nachrichten.unread')}</span>
        )}
      </div>

      <div className="nachrichten-layout">
        {/* Message List */}
        <div className="nachrichten-list">
          {isLoading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : nachrichten.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>{t('briefe:nachrichten.empty')}</h3>
            </div>
          ) : (
            nachrichten.map((nachricht: NachrichtDto) => (
              <div
                key={nachricht.id}
                className={`nachricht-item ${!nachricht.gelesenDatum ? 'unread' : ''} ${selectedNachricht?.id === nachricht.id ? 'selected' : ''}`}
                onClick={() => handleSelectNachricht(nachricht)}
              >
                <div className="nachricht-header">
                  <span className="sender">{nachricht.absenderName}</span>
                  <span className="date">{formatDate(nachricht.gesendetDatum)}</span>
                </div>
                <div className="nachricht-subject">{nachricht.betreff}</div>
                {!nachricht.gelesenDatum && <span className="unread-dot"></span>}
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="nachricht-detail">
          {selectedNachricht ? (
            <>
              <div className="detail-header">
                <h2>{selectedNachricht.betreff}</h2>
                <div className="detail-meta">
                  <span>{t('briefe:nachrichten.from')}: {selectedNachricht.absenderName}</span>
                  <span>{formatDate(selectedNachricht.gesendetDatum)}</span>
                </div>
              </div>
              <div className="detail-content" dangerouslySetInnerHTML={{ __html: selectedNachricht.inhalt }} />
            </>
          ) : (
            <div className="no-selection">
              <span className="icon">✉️</span>
              <p>{t('briefe:nachrichten.selectMessage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NachrichtenList;

