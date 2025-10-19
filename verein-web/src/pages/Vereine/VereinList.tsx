import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { vereinService } from '../../services/vereinService';
import { VereinDto, CreateVereinDto, UpdateVereinDto } from '../../types/verein';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import VereinFormModal from '../../components/Vereine/VereinFormModal';
import './VereinList.css';

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

const BuildingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
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

const VereinList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['vereine', 'common']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedVerein, setSelectedVerein] = useState<VereinDto | null>(null);

  // Fetch Vereine
  const {
    data: vereine,
    isLoading,
    error,
    refetch
  } = useQuery<VereinDto[]>({
    queryKey: ['vereine'],
    queryFn: vereinService.getAll,
  });

  // Create Verein Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateVereinDto) => vereinService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vereine'] });
      setIsFormModalOpen(false);
      setSelectedVerein(null);
    },
    onError: (error: any) => {
      console.error('Create error:', error);
    }
  });

  // Update Verein Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVereinDto }) =>
      vereinService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vereine'] });
      setIsFormModalOpen(false);
      setSelectedVerein(null);
    },
    onError: (error: any) => {
      console.error('Update error:', error);
    }
  });

  // Filter vereine based on search and active status
  const filteredVereine = vereine?.filter(verein => {
    // Search filter - check if search term is empty first for performance
    const matchesSearch = !searchTerm ||
                         verein.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verein.vereinsnummer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verein.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verein.kurzname?.toLowerCase().includes(searchTerm.toLowerCase());

    // Active filter - only show active if showActiveOnly is true
    const matchesActiveFilter = !showActiveOnly || verein.aktiv === true;

    return matchesSearch && matchesActiveFilter;
  }) || [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleActiveToggle = () => {
    setShowActiveOnly(!showActiveOnly);
  };

  const handleCreateVerein = () => {
    setFormMode('create');
    setSelectedVerein(null);
    setIsFormModalOpen(true);
  };

  const handleEditVerein = (verein: VereinDto) => {
    setFormMode('edit');
    setSelectedVerein(verein);
    setIsFormModalOpen(true);
  };

  const handleSubmitVerein = (data: CreateVereinDto | UpdateVereinDto) => {
    if (formMode === 'create') {
      createMutation.mutate(data as CreateVereinDto);
    } else if (formMode === 'edit' && selectedVerein) {
      updateMutation.mutate({ id: selectedVerein.id, data: data as UpdateVereinDto });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (isLoading) {
    return <Loading text={t('vereine:list.loading')} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title={t('vereine:list.loadError')}
        message={t('vereine:list.loadErrorMessage')}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="verein-list">
      {/* Header */}
      <div className="verein-list-header">
        <h1 className="page-title">{t('vereine:title')}</h1>
        <p className="page-subtitle">{t('vereine:subtitle')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('vereine:list.search')}
            value={searchTerm}
            onChange={handleSearch}
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
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title={t('vereine:list.gridView')}
            >
              <GridIcon />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title={t('vereine:list.tableView')}
            >
              <TableIcon />
            </button>
          </div>

          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={handleActiveToggle}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">{t('vereine:list.showActiveOnly')}</span>
          </label>

          <button className="btn-primary" onClick={handleCreateVerein}>
            <PlusIcon />
            <span>{t('vereine:list.newVerein')}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">{t('vereine:stats.total')}</span>
          <span className="stat-value">{vereine?.length || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('vereine:stats.active')}</span>
          <span className="stat-value">{vereine?.filter(v => v.aktiv).length || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('vereine:stats.showing')}</span>
          <span className="stat-value">{filteredVereine.length}</span>
        </div>
      </div>

      {/* Verein Content - Grid or Table */}
      {filteredVereine.length === 0 ? (
        <div className="verein-grid">
          <div className="empty-state">
            <div className="empty-icon">
              <BuildingIcon />
            </div>
            <h3>{t('vereine:list.notFound')}</h3>
            <p>
              {searchTerm
                ? t('vereine:list.noResults')
                : t('vereine:list.noData')}
            </p>
            {!searchTerm && (
              <button className="btn-primary" onClick={handleCreateVerein}>
                <PlusIcon />
                <span>{t('vereine:list.addFirst')}</span>
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="verein-grid">
          {filteredVereine.map((verein) => (
            <div key={verein.id} className="verein-card">
              <div className="card-header">
                <div className="card-title-section">
                  <h3>{verein.name}</h3>
                  {verein.kurzname && (
                    <span className="card-subtitle">{verein.kurzname}</span>
                  )}
                </div>
                <div className={`status-badge ${verein.aktiv ? 'status-active' : 'status-inactive'}`}>
                  {verein.aktiv ? t('vereine:card.statusActive') : t('vereine:card.statusInactive')}
                </div>
              </div>

              <div className="card-content">
                {verein.vereinsnummer && (
                  <div className="info-row">
                    <span className="info-label">{t('vereine:card.number')}</span>
                    <span className="info-value">{verein.vereinsnummer}</span>
                  </div>
                )}

                {verein.email && (
                  <div className="info-row">
                    <span className="info-label">{t('vereine:card.email')}</span>
                    <span className="info-value">{verein.email}</span>
                  </div>
                )}

                {verein.telefon && (
                  <div className="info-row">
                    <span className="info-label">{t('vereine:card.phone')}</span>
                    <span className="info-value">{verein.telefon}</span>
                  </div>
                )}

                {verein.vorstandsvorsitzender && (
                  <div className="info-row">
                    <span className="info-label">{t('vereine:card.president')}</span>
                    <span className="info-value">{verein.vorstandsvorsitzender}</span>
                  </div>
                )}

                {verein.webseite && (
                  <div className="info-row">
                    <span className="info-label">{t('vereine:card.website')}</span>
                    <a
                      href={verein.webseite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-link"
                    >
                      {verein.webseite}
                    </a>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button
                  className="action-btn"
                  title={t('vereine:actions.edit')}
                  onClick={() => handleEditVerein(verein)}
                >
                  <EditIcon />
                  <span>{t('vereine:actions.edit')}</span>
                </button>
                <button
                  className="action-btn"
                  title={t('vereine:actions.details')}
                  onClick={() => navigate(`/vereine/${verein.id}`)}
                >
                  <EyeIcon />
                  <span>{t('vereine:actions.details')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="verein-table-container">
          <table className="verein-table">
            <thead>
              <tr>
                <th>{t('vereine:table.name')}</th>
                <th>{t('vereine:table.number')}</th>
                <th>{t('vereine:table.email')}</th>
                <th>{t('vereine:table.phone')}</th>
                <th>{t('vereine:table.president')}</th>
                <th>{t('vereine:table.status')}</th>
                <th>{t('vereine:table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredVereine.map((verein) => (
                <tr key={verein.id} onClick={() => navigate(`/vereine/${verein.id}`)}>
                  <td>
                    <div className="table-name-cell">
                      <strong>{verein.name}</strong>
                      {verein.kurzname && (
                        <span className="table-subtitle">{verein.kurzname}</span>
                      )}
                    </div>
                  </td>
                  <td>{verein.vereinsnummer || '-'}</td>
                  <td>{verein.email || '-'}</td>
                  <td>{verein.telefon || '-'}</td>
                  <td>{verein.vorstandsvorsitzender || '-'}</td>
                  <td>
                    <span className={`status-badge ${verein.aktiv ? 'status-active' : 'status-inactive'}`}>
                      {verein.aktiv ? t('vereine:card.statusActive') : t('vereine:card.statusInactive')}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/vereine/${verein.id}`);
                        }}
                        title={t('vereine:actions.details')}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        className="table-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVerein(verein);
                        }}
                        title={t('vereine:actions.edit')}
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Verein Form Modal */}
      <VereinFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitVerein}
        verein={selectedVerein}
        mode={formMode}
      />
    </div>
  );
};

export default VereinList;
