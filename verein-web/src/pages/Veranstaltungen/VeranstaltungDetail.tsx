import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { veranstaltungService, veranstaltungAnmeldungService, veranstaltungUtils } from '../../services/veranstaltungService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { VeranstaltungAnmeldungDto } from '../../types/veranstaltung';
import './VeranstaltungDetail.css';

// SVG Icons
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

interface AnmeldungCardProps {
  anmeldung: VeranstaltungAnmeldungDto;
}

const AnmeldungCard: React.FC<AnmeldungCardProps> = ({ anmeldung }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['veranstaltungen', 'common']);

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('common:notSpecified');
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="anmeldung-card">
      <div className="anmeldung-header">
        <div className="participant-info">
          <h4 className="participant-name">
            {anmeldung.name || 'İsimsiz Katılımcı'}
          </h4>
          {anmeldung.email && (
            <p className="participant-email">{anmeldung.email}</p>
          )}
        </div>
        <div className="anmeldung-status">
          <span className="status-badge active">Kayıtlı</span>
        </div>
      </div>
      
      <div className="anmeldung-details">
        {anmeldung.telefon && (
          <div className="detail-item">
            <span className="detail-icon">📞</span>
            <span className="detail-text">{anmeldung.telefon}</span>
          </div>
        )}
        
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span className="detail-text">
            {t('veranstaltungen:detailPage.anmeldung.registeredOn')}: {formatDate(anmeldung.anmeldedatum)}
          </span>
        </div>

        {anmeldung.teilnehmerAnzahl && anmeldung.teilnehmerAnzahl > 1 && (
          <div className="detail-item">
            <span className="detail-icon">👥</span>
            <span className="detail-text">
              {anmeldung.teilnehmerAnzahl} {t('veranstaltungen:detailPage.anmeldung.person')}
            </span>
          </div>
        )}
        
        {anmeldung.bemerkung && (
          <div className="detail-item">
            <span className="detail-icon">💬</span>
            <span className="detail-text">{anmeldung.bemerkung}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const VeranstaltungDetail: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['veranstaltungen', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const eventId = parseInt(id || '0');

  // Fetch event details
  const {
    data: veranstaltung,
    isLoading: eventLoading,
    error: eventError
  } = useQuery({
    queryKey: ['veranstaltung', eventId],
    queryFn: () => veranstaltungService.getById(eventId),
    enabled: !!eventId,
  });

  // Fetch event registrations
  const {
    data: anmeldungen,
    isLoading: anmeldungenLoading,
    error: anmeldungenError
  } = useQuery({
    queryKey: ['veranstaltung-anmeldungen', eventId],
    queryFn: () => veranstaltungAnmeldungService.getByVeranstaltungId(eventId),
    enabled: !!eventId,
  });

  // Check permissions
  const hasAccess = () => {
    if (user?.type === 'admin') return true;
    if (user?.type === 'dernek' && user?.vereinId === veranstaltung?.vereinId) return true;
    return false;
  };

  if (eventLoading || anmeldungenLoading) {
    return <Loading text={t('veranstaltungen:detailPage.loading')} />;
  }

  if (eventError || !veranstaltung) {
    return (
      <ErrorMessage
        title={t('veranstaltungen:detailPage.error.title')}
        message={t('veranstaltungen:detailPage.error.message')}
      />
    );
  }

  if (!hasAccess()) {
    return (
      <div className="veranstaltung-detail">
        <div className="access-denied">
          <h2>{t('veranstaltungen:detailPage.accessDenied.title')}</h2>
          <p>{t('veranstaltungen:detailPage.accessDenied.message')}</p>
          <Link to="/veranstaltungen" className="btn-primary">
            {t('veranstaltungen:detailPage.accessDenied.backButton')}
          </Link>
        </div>
      </div>
    );
  }

  const status = veranstaltungUtils.getEventStatus(veranstaltung.startdatum, veranstaltung.enddatum);
  const isUpcoming = veranstaltungUtils.isUpcoming(veranstaltung.startdatum);
  const daysUntil = isUpcoming ? veranstaltungUtils.getDaysUntilEvent(veranstaltung.startdatum) : null;

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return <span className="status-badge upcoming">{t('veranstaltungen:listPage.status.upcoming')}</span>;
      case 'ongoing':
        return <span className="status-badge ongoing">{t('veranstaltungen:listPage.status.ongoing')}</span>;
      case 'past':
        return <span className="status-badge past">{t('veranstaltungen:listPage.status.past')}</span>;
      default:
        return null;
    }
  };

  const totalParticipants = anmeldungen?.reduce((sum, anmeldung) => 
    sum + (anmeldung.teilnehmerAnzahl || 1), 0
  ) || 0;

  return (
    <div className="veranstaltung-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="header-navigation">
          <button
            onClick={() => navigate('/veranstaltungen')}
            className="back-button"
          >
            ← {t('veranstaltungen:detailPage.back')}
          </button>
        </div>

        <div className="header-content">
          <div className="event-title-section">
            <h1 className="event-title">{veranstaltung.titel}</h1>
            {getStatusBadge()}
          </div>

          {isUpcoming && daysUntil !== null && (
            <div className="countdown-section">
              {daysUntil === 0 ? (
                <span className="countdown-today">{t('veranstaltungen:detailPage.countdown.today')}</span>
              ) : daysUntil === 1 ? (
                <span className="countdown-soon">{t('veranstaltungen:detailPage.countdown.tomorrow')}</span>
              ) : (
                <span className="countdown-days">{t('veranstaltungen:detailPage.countdown.daysLeft', { days: daysUntil }).replace('{days}', daysUntil.toString())}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="detail-content">
        {/* Event Information */}
        <div className="event-info-section">
          <div className="info-card">
            <h2 className="section-title">{t('veranstaltungen:detailPage.sections.eventInfo')}</h2>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.date')}</span>
                  <span className="info-value">
                    {veranstaltungUtils.formatEventDate(veranstaltung.startdatum, veranstaltung.enddatum)}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🕐</span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.time')}</span>
                  <span className="info-value">
                    {veranstaltungUtils.formatEventTime(veranstaltung.startdatum, veranstaltung.enddatum)}
                  </span>
                </div>
              </div>

              {veranstaltung.ort && (
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div className="info-content">
                    <span className="info-label">{t('veranstaltungen:detailPage.fields.location')}</span>
                    <span className="info-value">{veranstaltung.ort}</span>
                  </div>
                </div>
              )}

              <div className="info-item">
                <span className="info-icon">👥</span>
                <div className="info-content">
                  <span className="info-label">{t('veranstaltungen:detailPage.fields.participants')}</span>
                  <span className="info-value">
                    {totalParticipants}
                    {veranstaltung.maxTeilnehmer && ` / ${veranstaltung.maxTeilnehmer}`}
                  </span>
                </div>
              </div>

              {veranstaltung.kosten && veranstaltung.kosten > 0 && (
                <div className="info-item">
                  <span className="info-icon">💰</span>
                  <div className="info-content">
                    <span className="info-label">{t('veranstaltungen:detailPage.fields.fee')}</span>
                    <span className="info-value">{veranstaltung.kosten}€</span>
                  </div>
                </div>
              )}

              {veranstaltung.anmeldeschluss && (
                <div className="info-item">
                  <span className="info-icon">⏰</span>
                  <div className="info-content">
                    <span className="info-label">{t('veranstaltungen:detailPage.fields.registrationDeadline')}</span>
                    <span className="info-value">
                      {new Date(veranstaltung.anmeldeschluss).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {veranstaltung.beschreibung && (
              <div className="description-section">
                <h3>{t('veranstaltungen:detailPage.sections.description')}</h3>
                <p className="event-description">{veranstaltung.beschreibung}</p>
              </div>
            )}

            {veranstaltung.hinweise && (
              <div className="notes-section">
                <h3>{t('veranstaltungen:detailPage.sections.notes')}</h3>
                <p className="event-notes">{veranstaltung.hinweise}</p>
              </div>
            )}
          </div>
        </div>

        {/* Participants Section */}
        <div className="participants-section">
          <div className="participants-card">
            <div className="section-header">
              <h2 className="section-title">
                {t('veranstaltungen:detailPage.sections.participants')} ({anmeldungen?.length || 0})
              </h2>
              <div className="section-actions">
                <button className="btn-secondary">
                  <ChartIcon />
                  <span>{t('veranstaltungen:detailPage.actions.getReport')}</span>
                </button>
                <button className="btn-primary">
                  <PlusIcon />
                  <span>{t('veranstaltungen:detailPage.actions.addParticipant')}</span>
                </button>
              </div>
            </div>

            {anmeldungenError ? (
              <ErrorMessage
                title={t('veranstaltungen:detailPage.participantsError.title')}
                message={t('veranstaltungen:detailPage.participantsError.message')}
              />
            ) : anmeldungen && anmeldungen.length > 0 ? (
              <div className="anmeldungen-grid">
                {anmeldungen.map(anmeldung => (
                  <AnmeldungCard
                    key={anmeldung.id}
                    anmeldung={anmeldung}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-participants">
                <div className="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>{t('veranstaltungen:detailPage.emptyParticipants.title')}</h3>
                <p>{t('veranstaltungen:detailPage.emptyParticipants.message')}</p>
                <button className="btn-primary">
                  <PlusIcon />
                  <span>{t('veranstaltungen:detailPage.emptyParticipants.addButton')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="action-buttons">
          <button className="btn-secondary">
            <EditIcon />
            <span>{t('veranstaltungen:detailPage.actions.edit')}</span>
          </button>
          <button className="btn-secondary">
            <CopyIcon />
            <span>{t('veranstaltungen:detailPage.actions.copy')}</span>
          </button>
          <button className="btn-danger">
            <DeleteIcon />
            <span>{t('veranstaltungen:detailPage.actions.delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VeranstaltungDetail;
