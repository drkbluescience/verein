import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { veranstaltungService, veranstaltungAnmeldungService, veranstaltungUtils } from '../../services/veranstaltungService';
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

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const TableIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
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

const CalendarDaysIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
  </svg>
);

interface VeranstaltungCardProps {
  veranstaltung: VeranstaltungDto;
  isRegistered?: boolean;
}

const VeranstaltungCard: React.FC<VeranstaltungCardProps> = ({ veranstaltung, isRegistered = false }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);
  const navigate = useNavigate();
  const status = veranstaltungUtils.getEventStatus(veranstaltung.startdatum, veranstaltung.enddatum);
  const isUpcoming = veranstaltungUtils.isUpcoming(
    veranstaltung.startdatum,
    veranstaltung.istWiederholend,
    veranstaltung.wiederholungTyp,
    veranstaltung.wiederholungInterval,
    veranstaltung.wiederholungEnde,
    veranstaltung.wiederholungTage,
    veranstaltung.wiederholungMonatTag
  );
  const daysUntil = isUpcoming ? veranstaltungUtils.getDaysUntilEvent(
    veranstaltung.startdatum,
    veranstaltung.istWiederholend,
    veranstaltung.wiederholungTyp,
    veranstaltung.wiederholungInterval,
    veranstaltung.wiederholungEnde,
    veranstaltung.wiederholungTage,
    veranstaltung.wiederholungMonatTag
  ) : null;

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
          <h3 className="event-title">
            {veranstaltung.titel}
            {isRegistered && (
              <span className="registered-badge" style={{
                marginLeft: '8px',
                padding: '2px 8px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckIcon />
                Kayıtlı
              </span>
            )}
          </h3>
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
              {veranstaltungUtils.formatEventDate(
                veranstaltung.startdatum,
                veranstaltung.enddatum,
                veranstaltung.istWiederholend,
                veranstaltung.wiederholungEnde
              )}
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

          {veranstaltung.preis && veranstaltung.preis > 0 && (
            <div className="detail-item">
              <DollarIcon />
              <span className="detail-text">{veranstaltung.preis}€</span>
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
              <span className="countdown-text">
                <CalendarDaysIcon />
                {t('mitglieder:eventsPage.card.daysLeft', { days: daysUntil }).replace('{days}', daysUntil.toString())}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="action-btn" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/veranstaltungen/${veranstaltung.id}`);
        }}>
          <EyeIcon />
        </button>
        {isUpcoming && veranstaltung.anmeldeErforderlich && !isRegistered && (
          <button className="action-btn action-btn-primary" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/veranstaltungen/${veranstaltung.id}`);
          }}>
            <CheckIcon />
          </button>
        )}
      </div>
    </Link>
  );
};

const MitgliedEtkinlikler: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'registered' | 'not-registered'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Fetch events for user's verein
  const {
    data: veranstaltungen,
    isLoading,
    error
  } = useQuery({
    queryKey: ['mitglied-veranstaltungen', user?.vereinId],
    queryFn: async () => {
      if (!user?.vereinId) return [];
      const result = await veranstaltungService.getByVereinId(user.vereinId);
      return result || [];
    },
    enabled: !!user?.vereinId,
  });

  // Fetch user's registrations
  const {
    data: userRegistrations,
    isLoading: registrationsLoading
  } = useQuery({
    queryKey: ['mitglied-anmeldungen', user?.mitgliedId],
    queryFn: async () => {
      if (!user?.mitgliedId) return [];
      const result = await veranstaltungAnmeldungService.getByMitgliedId(user.mitgliedId);
      return result || [];
    },
    enabled: !!user?.mitgliedId,
  });

  // Create a Set of registered event IDs for quick lookup
  const registeredEventIds = new Set(
    userRegistrations?.map(reg => reg.veranstaltungId) || []
  );

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

    // Registration filter
    const isRegistered = registeredEventIds.has(veranstaltung.id);
    if (filter === 'registered') {
      return isRegistered;
    } else if (filter === 'not-registered') {
      return !isRegistered;
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
    past: veranstaltungen?.filter(v => veranstaltungUtils.isPast(v.startdatum, v.enddatum)).length || 0,
    registered: veranstaltungen?.filter(v => registeredEventIds.has(v.id)).length || 0,
    notRegistered: veranstaltungen?.filter(v => !registeredEventIds.has(v.id)).length || 0
  };

  if (!user?.vereinId) {
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

  if (isLoading || registrationsLoading) {
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
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Aramayı temizle"
            >
              <XIcon />
            </button>
          )}
        </div>

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title={t('mitglieder:eventsPage.gridView')}
          >
            <GridIcon />
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title={t('mitglieder:eventsPage.tableView')}
          >
            <TableIcon />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('mitglieder:eventsPage.filters.all')} <span className="tab-count">{stats.total}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          {t('mitglieder:eventsPage.filters.upcoming')} <span className="tab-count">{stats.upcoming}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          {t('mitglieder:eventsPage.filters.past')} <span className="tab-count">{stats.past}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'registered' ? 'active' : ''}`}
          onClick={() => setFilter('registered')}
        >
          {t('mitglieder:eventsPage.filters.registered')} <span className="tab-count">{stats.registered}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'not-registered' ? 'active' : ''}`}
          onClick={() => setFilter('not-registered')}
        >
          {t('mitglieder:eventsPage.filters.notRegistered')} <span className="tab-count">{stats.notRegistered}</span>
        </button>
      </div>

      {/* Events Content - Grid or Table */}
      {sortedVeranstaltungen.length === 0 ? (
        <div className="veranstaltung-grid">
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
        </div>
      ) : viewMode === 'grid' ? (
        <div className="veranstaltung-grid">
          {sortedVeranstaltungen.map((veranstaltung) => (
            <VeranstaltungCard
              key={veranstaltung.id}
              veranstaltung={veranstaltung}
              isRegistered={registeredEventIds.has(veranstaltung.id)}
            />
          ))}
        </div>
      ) : (
        <div className="veranstaltung-table-container">
          <table className="veranstaltung-table">
            <thead>
              <tr>
                <th>{t('mitglieder:eventsPage.table.title')}</th>
                <th>{t('mitglieder:eventsPage.table.date')}</th>
                <th>{t('mitglieder:eventsPage.table.time')}</th>
                <th>{t('mitglieder:eventsPage.table.location')}</th>
                <th>{t('mitglieder:eventsPage.table.participants')}</th>
                <th>{t('mitglieder:eventsPage.table.price')}</th>
                <th>{t('mitglieder:eventsPage.table.status')}</th>
                <th>{t('mitglieder:eventsPage.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedVeranstaltungen.map((veranstaltung) => {
                const status = veranstaltungUtils.getEventStatus(veranstaltung.startdatum, veranstaltung.enddatum);
                const isRegistered = registeredEventIds.has(veranstaltung.id);

                return (
                  <tr
                    key={veranstaltung.id}
                    onClick={() => navigate(`/veranstaltungen/${veranstaltung.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link
                          to={`/veranstaltungen/${veranstaltung.id}`}
                          className="table-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {veranstaltung.titel}
                        </Link>
                        {isRegistered && (
                          <span className="registered-badge" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            background: '#10b981',
                            color: '#ffffff',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            <CheckIcon />
                            {t('mitglieder:eventsPage.registered')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {veranstaltungUtils.formatEventDate(veranstaltung.startdatum, veranstaltung.enddatum)}
                    </td>
                    <td>
                      {veranstaltungUtils.formatEventTime(veranstaltung.startdatum, veranstaltung.enddatum)}
                    </td>
                    <td>{veranstaltung.ort || '-'}</td>
                    <td>
                      {veranstaltung.maxTeilnehmer
                        ? `Max ${veranstaltung.maxTeilnehmer}`
                        : '-'
                      }
                    </td>
                    <td>
                      {veranstaltung.preis && veranstaltung.preis > 0
                        ? `${veranstaltung.preis.toFixed(2)} €`
                        : '-'
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${status}`}>
                        {status === 'upcoming' && t('mitglieder:eventsPage.status.upcoming')}
                        {status === 'ongoing' && t('mitglieder:eventsPage.status.ongoing')}
                        {status === 'past' && t('mitglieder:eventsPage.status.past')}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="table-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/veranstaltungen/${veranstaltung.id}`);
                          }}
                          title={t('mitglieder:eventsPage.actions.view')}
                        >
                          <EyeIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MitgliedEtkinlikler;

