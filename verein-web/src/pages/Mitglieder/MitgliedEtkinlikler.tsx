import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { veranstaltungService, veranstaltungUtils } from '../../services/veranstaltungService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { VeranstaltungDto } from '../../types/veranstaltung';
import '../Veranstaltungen/VeranstaltungList.css';

// SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const PartyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><circle cx="12" cy="12" r="2"/><path d="m4.5 9.5 15 15"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

interface VeranstaltungCardProps {
  veranstaltung: VeranstaltungDto;
}

const VeranstaltungCard: React.FC<VeranstaltungCardProps> = ({ veranstaltung }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);
  const status = veranstaltungUtils.getEventStatus(veranstaltung.startdatum, veranstaltung.enddatum);
  const isUpcoming = veranstaltungUtils.isUpcoming(veranstaltung.startdatum);
  const daysUntil = isUpcoming ? veranstaltungUtils.getDaysUntilEvent(veranstaltung.startdatum) : null;

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return <span className="status-badge upcoming">{t('mitglieder:eventsPage.status.upcoming')}</span>;
      case 'ongoing':
        return <span className="status-badge ongoing">{t('mitglieder:eventsPage.status.ongoing')}</span>;
      case 'past':
        return <span className="status-badge past">{t('mitglieder:eventsPage.status.past')}</span>;
      default:
        return null;
    }
  };

  return (
    <Link to={`/veranstaltungen/${veranstaltung.id}`} className={`veranstaltung-card ${status}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="event-title">{veranstaltung.titel}</h3>
        </div>
        {getStatusBadge()}
      </div>

      <div className="card-content">
        {veranstaltung.beschreibung && (
          <p className="event-description">
            {veranstaltungUtils.getShortDescription(veranstaltung.beschreibung, 100)}
          </p>
        )}

        <div className="event-details">
          <div className="detail-item">
            <CalendarIcon />
            <span className="detail-text">
              {veranstaltungUtils.formatEventDate(veranstaltung.startdatum, veranstaltung.enddatum)}
            </span>
          </div>

          <div className="detail-item">
            <ClockIcon />
            <span className="detail-text">
              {veranstaltungUtils.formatEventTime(veranstaltung.startdatum, veranstaltung.enddatum)}
            </span>
          </div>

          {veranstaltung.ort && (
            <div className="detail-item">
              <MapPinIcon />
              <span className="detail-text">{veranstaltung.ort}</span>
            </div>
          )}

          {veranstaltung.maxTeilnehmer && (
            <div className="detail-item">
              <UsersIcon />
              <span className="detail-text">{t('mitglieder:eventsPage.card.maxParticipants', { count: veranstaltung.maxTeilnehmer }).replace('{count}', veranstaltung.maxTeilnehmer.toString())}</span>
            </div>
          )}

          {veranstaltung.kosten && veranstaltung.kosten > 0 && (
            <div className="detail-item">
              <DollarIcon />
              <span className="detail-text">{veranstaltung.kosten}€</span>
            </div>
          )}
        </div>

        {isUpcoming && daysUntil !== null && (
          <div className="countdown">
            {daysUntil === 0 ? (
              <span className="countdown-text">{t('mitglieder:eventsPage.card.today')}</span>
            ) : daysUntil === 1 ? (
              <span className="countdown-text">{t('mitglieder:eventsPage.card.tomorrow')}</span>
            ) : (
              <span className="countdown-text">{t('mitglieder:eventsPage.card.daysLeft', { days: daysUntil }).replace('{days}', daysUntil.toString())}</span>
            )}
          </div>
        )}
      </div>

      <div className="card-actions" onClick={(e) => e.preventDefault()}>
        <button className="action-btn" onClick={(e) => { e.preventDefault(); window.location.href = `/veranstaltungen/${veranstaltung.id}`; }}>
          <EyeIcon />
          <span>{t('mitglieder:eventsPage.card.details')}</span>
        </button>
        {isUpcoming && veranstaltung.istAnmeldungErforderlich && (
          <button className="action-btn action-btn-primary" onClick={(e) => { e.preventDefault(); /* Kayıt ol işlemi */ }}>
            <CheckIcon />
            <span>{t('mitglieder:eventsPage.card.register')}</span>
          </button>
        )}
      </div>
    </Link>
  );
};

const MitgliedEtkinlikler: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);
  const { selectedVereinId } = useAuth();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch events for selected verein
  const {
    data: veranstaltungen,
    isLoading,
    error
  } = useQuery({
    queryKey: ['mitglied-veranstaltungen', selectedVereinId],
    queryFn: async () => {
      if (!selectedVereinId) return [];
      const result = await veranstaltungService.getByVereinId(selectedVereinId);
      return result || [];
    },
    enabled: !!selectedVereinId,
  });

  // Filter and search
  const filteredVeranstaltungen = veranstaltungen?.filter(veranstaltung => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        veranstaltung.titel?.toLowerCase().includes(searchLower) ||
        veranstaltung.beschreibung?.toLowerCase().includes(searchLower) ||
        veranstaltung.ort?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Status filter
    if (filter === 'upcoming') {
      return veranstaltungUtils.isUpcoming(veranstaltung.startdatum);
    } else if (filter === 'past') {
      return veranstaltungUtils.isPast(veranstaltung.startdatum, veranstaltung.enddatum);
    }

    return true;
  }) || [];

  // Sort events: upcoming first, then by date
  const sortedVeranstaltungen = [...filteredVeranstaltungen].sort((a, b) => {
    const aUpcoming = veranstaltungUtils.isUpcoming(a.startdatum);
    const bUpcoming = veranstaltungUtils.isUpcoming(b.startdatum);

    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;

    return new Date(a.startdatum).getTime() - new Date(b.startdatum).getTime();
  });

  // Calculate stats
  const stats = {
    total: veranstaltungen?.length || 0,
    upcoming: veranstaltungen?.filter(v => veranstaltungUtils.isUpcoming(v.startdatum)).length || 0,
    past: veranstaltungen?.filter(v => veranstaltungUtils.isPast(v.startdatum, v.enddatum)).length || 0
  };

  if (!selectedVereinId) {
    return (
      <div className="veranstaltung-list">
        <div className="empty-state" style={{ margin: '100px 24px' }}>
          <div className="empty-icon">
            <PartyIcon />
          </div>
          <h3>{t('mitglieder:eventsPage.noVerein.title')}</h3>
          <p>{t('mitglieder:eventsPage.noVerein.message')}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading text={t('mitglieder:eventsPage.loading')} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title={t('mitglieder:eventsPage.error.title')}
        message={t('mitglieder:eventsPage.error.message')}
      />
    );
  }

  return (
    <div className="veranstaltung-list">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('mitglieder:eventsPage.header.title')}</h1>
        <p className="page-subtitle" style={{ color: '#ffffff' }}>
          {t('mitglieder:eventsPage.header.stats', { total: stats.total, upcoming: stats.upcoming, past: stats.past }).replace('{total}', stats.total.toString()).replace('{upcoming}', stats.upcoming.toString()).replace('{past}', stats.past.toString())}
        </p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('mitglieder:eventsPage.search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('mitglieder:eventsPage.filters.all')}
        </button>
        <button
          className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          {t('mitglieder:eventsPage.filters.upcoming')}
        </button>
        <button
          className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          {t('mitglieder:eventsPage.filters.past')}
        </button>
      </div>

      {/* Events Grid */}
      <div className="veranstaltung-grid">
        {sortedVeranstaltungen.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <PartyIcon />
            </div>
            <h3>{t('mitglieder:eventsPage.empty.title')}</h3>
            <p>
              {searchTerm
                ? t('mitglieder:eventsPage.empty.noSearch')
                : filter === 'upcoming'
                ? t('mitglieder:eventsPage.empty.noUpcoming')
                : filter === 'past'
                ? t('mitglieder:eventsPage.empty.noPast')
                : t('mitglieder:eventsPage.empty.noEvents')
              }
            </p>
          </div>
        ) : (
          sortedVeranstaltungen.map((veranstaltung) => (
            <VeranstaltungCard key={veranstaltung.id} veranstaltung={veranstaltung} />
          ))
        )}
      </div>
    </div>
  );
};

export default MitgliedEtkinlikler;

