import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { veranstaltungService, veranstaltungUtils } from '../../services/veranstaltungService';
import { vereinService } from '../../services/vereinService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { VeranstaltungDto } from '../../types/veranstaltung';
import { VereinDto } from '../../types/verein';
import VeranstaltungFormModal from '../../components/Veranstaltung/VeranstaltungFormModal';
import './VeranstaltungList.css';

// SVG Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

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

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const TableIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/>
  </svg>
);

interface VeranstaltungCardProps {
  veranstaltung: VeranstaltungDto;
  onEdit?: (veranstaltung: VeranstaltungDto) => void;
}

const VeranstaltungCard: React.FC<VeranstaltungCardProps> = ({ veranstaltung, onEdit }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['veranstaltungen', 'common']);
  const { user } = useAuth();
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

  // Check if user can edit (admin or dernek owner)
  const canEdit = user?.type === 'admin' || (user?.type === 'dernek' && user?.vereinId === veranstaltung.vereinId);

  // Check if user can register (only mitglied users)
  const canRegister = user?.type === 'mitglied';

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

  return (
    <div className={`veranstaltung-card ${status}`}>
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="event-title">{veranstaltung.titel}</h3>
          {veranstaltung.istWiederholend && (
            <span className="recurring-badge" title={t('veranstaltungen:recurrence.title')}>
              {t('veranstaltungen:recurrence.badge')}
            </span>
          )}
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
              <span className="detail-text">{t('veranstaltungen:listPage.card.maxParticipants', { count: veranstaltung.maxTeilnehmer }).replace('{count}', veranstaltung.maxTeilnehmer.toString())}</span>
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
              <span className="countdown-text">{t('veranstaltungen:listPage.card.today')}</span>
            ) : daysUntil === 1 ? (
              <span className="countdown-text">{t('veranstaltungen:listPage.card.tomorrow')}</span>
            ) : (
              <span className="countdown-text">
                <CalendarDaysIcon />
                {t('veranstaltungen:listPage.card.daysLeft', { days: daysUntil }).replace('{days}', daysUntil.toString())}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="card-actions">
        <Link to={`/veranstaltungen/${veranstaltung.id}`} className="action-btn">
          <EyeIcon />
        </Link>
        {canEdit && onEdit && (
          <button className="action-btn" onClick={() => onEdit(veranstaltung)}>
            <EditIcon />
          </button>
        )}
        {canRegister && isUpcoming && veranstaltung.anmeldeErforderlich && (
          <Link to={`/veranstaltungen/${veranstaltung.id}`} className="action-btn action-btn-primary">
            <CheckIcon />
          </Link>
        )}
      </div>
    </div>
  );
};

const VeranstaltungList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['veranstaltungen', 'common']);
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVeranstaltung, setSelectedVeranstaltung] = useState<VeranstaltungDto | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);

  // Fetch Vereine (for Admin dropdown)
  const { data: vereine = [] } = useQuery<VereinDto[]>({
    queryKey: ['vereine'],
    queryFn: () => vereinService.getAll(),
    enabled: user?.type === 'admin',
  });

  // Determine data fetching based on user type
  const {
    data: veranstaltungen,
    isLoading,
    error
  } = useQuery({
    queryKey: ['veranstaltungen', user?.type, user?.vereinId || 'all'],
    queryFn: async () => {
      if (user?.type === 'admin') {
        // Admin sees all events
        const result = await veranstaltungService.getAll();
        return result || [];
      } else if (user?.type === 'dernek' && user?.vereinId) {
        // Dernek sees only their events
        const result = await veranstaltungService.getByVereinId(user.vereinId);
        return result || [];
      } else {
        return [];
      }
    },
    enabled: !!user && (user.type === 'admin' || (user.type === 'dernek' && !!user.vereinId)),
  });

  // Filter events based on search and filter criteria
  const filteredVeranstaltungen = veranstaltungen?.filter(veranstaltung => {
    // Verein filter (Admin only)
    if (user?.type === 'admin' && selectedVereinId && veranstaltung.vereinId !== selectedVereinId) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        veranstaltung.titel.toLowerCase().includes(searchLower) ||
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

  const handleOpenCreateModal = () => {
    setSelectedVeranstaltung(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (veranstaltung: VeranstaltungDto) => {
    setSelectedVeranstaltung(veranstaltung);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVeranstaltung(null);
  };

  if (isLoading) {
    return <Loading text={t('veranstaltungen:listPage.loading')} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title={t('veranstaltungen:listPage.error.title')}
        message={t('veranstaltungen:listPage.error.message')}
      />
    );
  }

  // Check user permissions
  if (user?.type === 'mitglied') {
    return (
      <div className="veranstaltung-list">
        <div className="access-denied">
          <h2>{t('veranstaltungen:listPage.accessDenied.title')}</h2>
          <p>{t('veranstaltungen:listPage.accessDenied.message')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="veranstaltung-list">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('veranstaltungen:listPage.header.title')}</h1>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('veranstaltungen:listPage.search.placeholder')}
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

        <div className="filter-controls">
          {/* Admin: Verein Filter */}
          {user?.type === 'admin' && (
            <select
              value={selectedVereinId || ''}
              onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
              className="filter-select"
            >
              <option value="">{t('common:filter.allVereine')}</option>
              {vereine.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}

          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title={t('veranstaltungen:listPage.gridView')}
            >
              <GridIcon />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title={t('veranstaltungen:listPage.tableView')}
            >
              <TableIcon />
            </button>
          </div>

          <button className="btn-primary" onClick={handleOpenCreateModal}>
            <PlusIcon />
            <span>{t('veranstaltungen:listPage.actions.newEvent')}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('veranstaltungen:listPage.filters.all')} <span className="tab-count">{veranstaltungen?.length || 0}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          {t('veranstaltungen:listPage.filters.upcoming')} <span className="tab-count">{veranstaltungen?.filter(v => veranstaltungUtils.isUpcoming(v.startdatum)).length || 0}</span>
        </button>
        <button
          className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          {t('veranstaltungen:listPage.filters.past')} <span className="tab-count">{veranstaltungen?.filter(v => veranstaltungUtils.isPast(v.startdatum, v.enddatum)).length || 0}</span>
        </button>
      </div>

      {/* Event Content - Grid or Table */}
      {sortedVeranstaltungen.length === 0 ? (
        <div className="veranstaltung-grid">
          <div className="empty-state">
            <div className="empty-icon">
              <PartyIcon />
            </div>
            <h3>{t('veranstaltungen:listPage.empty.title')}</h3>
            <p>
              {searchTerm
                ? t('veranstaltungen:listPage.empty.noSearch')
                : t('veranstaltungen:listPage.empty.noEvents')
              }
            </p>
            {!searchTerm && (
              <button className="btn-primary" onClick={handleOpenCreateModal}>
                <PlusIcon />
                <span>{t('veranstaltungen:listPage.actions.addFirstEvent')}</span>
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="veranstaltung-grid">
          {sortedVeranstaltungen.map(veranstaltung => (
            <VeranstaltungCard
              key={veranstaltung.id}
              veranstaltung={veranstaltung}
              onEdit={handleOpenEditModal}
            />
          ))}
        </div>
      ) : (
        <div className="veranstaltung-table-container">
          <table className="veranstaltung-table">
            <thead>
              <tr>
                <th>{t('veranstaltungen:table.title')}</th>
                <th>{t('veranstaltungen:table.date')}</th>
                <th>{t('veranstaltungen:table.time')}</th>
                <th>{t('veranstaltungen:table.location')}</th>
                <th>{t('veranstaltungen:table.participants')}</th>
                <th>{t('veranstaltungen:table.price')}</th>
                <th>{t('veranstaltungen:table.status')}</th>
                <th>{t('veranstaltungen:table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedVeranstaltungen.map(veranstaltung => {
                const status = veranstaltungUtils.getEventStatus(veranstaltung.startdatum, veranstaltung.enddatum);
                const canEdit = user?.type === 'admin' || (user?.type === 'dernek' && user?.vereinId === veranstaltung.vereinId);

                return (
                  <tr key={veranstaltung.id}>
                    <td>
                      <Link to={`/veranstaltungen/${veranstaltung.id}`} className="table-link">
                        <strong>{veranstaltung.titel}</strong>
                      </Link>
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
                        {status === 'upcoming' && t('veranstaltungen:listPage.status.upcoming')}
                        {status === 'ongoing' && t('veranstaltungen:listPage.status.ongoing')}
                        {status === 'past' && t('veranstaltungen:listPage.status.past')}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/veranstaltungen/${veranstaltung.id}`}>
                          <button className="table-action-btn" title={t('veranstaltungen:listPage.actions.view')}>
                            <EyeIcon />
                          </button>
                        </Link>
                        {canEdit && (
                          <button
                            className="table-action-btn"
                            onClick={() => handleOpenEditModal(veranstaltung)}
                            title={t('veranstaltungen:listPage.actions.edit')}
                          >
                            <EditIcon />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Veranstaltung Form Modal */}
      <VeranstaltungFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        veranstaltung={selectedVeranstaltung}
        mode={modalMode}
      />
    </div>
  );
};

export default VeranstaltungList;
