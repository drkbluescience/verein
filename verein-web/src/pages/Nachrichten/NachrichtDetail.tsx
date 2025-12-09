import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { nachrichtService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import './NachrichtDetail.css';

// SVG Icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const NachrichtDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t, i18n } = useTranslation(['common', 'briefe']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mitgliedId = user?.mitgliedId;

  const { data: nachricht, isLoading } = useQuery({
    queryKey: ['nachricht', id],
    queryFn: () => nachrichtService.getById(Number(id)),
    enabled: !!id,
  });

  // Mark as read when page loads
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: number) => nachrichtService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nachrichten', mitgliedId] });
      queryClient.invalidateQueries({ queryKey: ['nachrichten-unread', mitgliedId] });
      queryClient.invalidateQueries({ queryKey: ['nachricht', id] });
    },
  });

  React.useEffect(() => {
    if (nachricht && !nachricht.gelesenDatum) {
      markAsReadMutation.mutate(nachricht.id);
    }
  }, [nachricht?.id, markAsReadMutation, nachricht]);

  const formatFullDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(i18n.language === 'de' ? 'de-DE' : 'tr-TR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="nachricht-detail-page">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!nachricht) {
    return (
      <div className="nachricht-detail-page">
        <div className="empty-state">
          <h3>{t('briefe:nachrichten.notFound')}</h3>
          <button className="btn-primary" onClick={() => navigate('/nachrichten')}>
            {t('common:back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nachricht-detail-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{nachricht.betreff}</h1>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button
          className="btn-icon"
          onClick={() => navigate('/nachrichten')}
          title={t('common:back')}
        >
          <BackIcon />
        </button>
      </div>

      <div className="letter-preview-wrapper">
        <div className="letter-paper">
          {/* Letter Header */}
          <div className="letter-header">
            <div className="letter-logo">
              {nachricht.absenderName?.substring(0, 2).toUpperCase() || 'VE'}
            </div>
            <div className="letter-sender-info">
              <span className="sender-name">{nachricht.absenderName}</span>
              <span className="sender-detail">
                <MailIcon /> {t('briefe:nachrichten.officialMessage')}
              </span>
            </div>
          </div>

          <div className="letter-divider"></div>

          {/* Date */}
          <div className="letter-date">
            {formatFullDate(nachricht.gesendetDatum)}
          </div>

          {/* Subject */}
          <div className="letter-subject">
            <span className="subject-label">{t('briefe:form.subject')}:</span>
            <span className="subject-text">{nachricht.betreff}</span>
          </div>

          {/* Body */}
          <div className="letter-body" dangerouslySetInnerHTML={{ __html: nachricht.inhalt }} />

          {/* Footer */}
          <div className="letter-footer">
            <div className="closing">{i18n.language === 'de' ? 'Mit freundlichen Grüßen,' : 'Saygılarımızla,'}</div>
            <div className="signature">{nachricht.absenderName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NachrichtDetail;

