import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedService, mitgliedUtils } from '../../services/mitgliedService';
import { MitgliedDto } from '../../types/mitglied';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import MitgliedFormModal from '../../components/Mitglied/MitgliedFormModal';
import DeleteConfirmDialog from '../../components/Mitglied/DeleteConfirmDialog';
import './MitgliedList.css';

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

const UsersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const UsersGroupIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const CakeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const MitgliedList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedMitglied, setSelectedMitglied] = useState<MitgliedDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Determine which Mitglieder to fetch based on user type
  const shouldFetchByVerein = user?.type === 'dernek' && user?.vereinId;
  const vereinId = user?.vereinId;

  // Fetch Mitglieder data
  const {
    data: mitgliederData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['mitglieder', vereinId, currentPage],
    queryFn: async () => {
      if (shouldFetchByVerein && vereinId) {
        // Dernek user - get all members, filter on client side
        return await mitgliedService.getByVereinId(vereinId, false);
      } else if (user?.type === 'admin') {
        // Admin user - all members with pagination
        return await mitgliedService.getAll({
          pageNumber: currentPage,
          pageSize: pageSize
        });
      } else {
        // Mitglied user - should not access this page
        throw new Error('Unauthorized access');
      }
    },
    enabled: !!user && (user.type === 'admin' || (user.type === 'dernek' && !!vereinId)),
  });

  // Process data based on response type
  const mitglieder = useMemo(() => {
    if (!mitgliederData) return [];
    
    // If it's a PagedResult (admin), use items array
    if ('items' in mitgliederData) {
      return mitgliederData.items;
    }
    
    // If it's a direct array (dernek), use as is
    return Array.isArray(mitgliederData) ? mitgliederData : [];
  }, [mitgliederData]);

  // Filter mitglieder based on search term and status
  const filteredMitglieder = useMemo(() => {
    let filtered = mitglieder;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(mitglied =>
        mitglied.vorname.toLowerCase().includes(searchLower) ||
        mitglied.nachname.toLowerCase().includes(searchLower) ||
        mitglied.mitgliedsnummer.toLowerCase().includes(searchLower) ||
        mitglied.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter for all users
    if (statusFilter !== 'all') {
      filtered = filtered.filter(mitglied => {
        if (statusFilter === 'active') {
          return mitglied.aktiv !== false && !mitglied.austrittsdatum;
        } else {
          return mitglied.aktiv === false || !!mitglied.austrittsdatum;
        }
      });
    }

    return filtered;
  }, [mitglieder, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mitglieder.length;
    const active = mitglieder.filter(m => m.aktiv !== false && !m.austrittsdatum).length;
    const inactive = total - active;
    
    return { total, active, inactive };
  }, [mitglieder]);

  if (isLoading) {
    return <Loading text={t('mitglieder:listPage.loading')} />;
  }

  if (error) {
    return (
      <ErrorMessage
        title={t('mitglieder:listPage.error.title')}
        message={t('mitglieder:listPage.error.message')}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="mitglied-list">
      {/* Header */}
      <div className="mitglied-list-header">
        <h1 className="page-title">
          {user?.type === 'admin' ? t('mitglieder:listPage.header.titleAll') : t('mitglieder:listPage.header.titleOur')}
        </h1>
        <p className="page-subtitle">
          {stats.total} {t('mitglieder:listPage.header.stats', { active: stats.active, inactive: stats.inactive }).replace('{active}', stats.active.toString()).replace('{inactive}', stats.inactive.toString())}
        </p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('mitglieder:listPage.search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {user?.type === 'dernek' && (
          <button
            className="btn-primary"
            onClick={() => {
              setFormMode('create');
              setSelectedMitglied(null);
              setIsFormModalOpen(true);
            }}
          >
            <PlusIcon />
            <span>{t('mitglieder:listPage.actions.newMember')}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          {t('mitglieder:listPage.filters.all')} <span className="tab-count">{stats.total}</span>
        </button>
        <button
          className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
          onClick={() => setStatusFilter('active')}
        >
          {t('mitglieder:listPage.filters.active')} <span className="tab-count">{stats.active}</span>
        </button>
        <button
          className={`filter-tab ${statusFilter === 'inactive' ? 'active' : ''}`}
          onClick={() => setStatusFilter('inactive')}
        >
          {t('mitglieder:listPage.filters.inactive')} <span className="tab-count">{stats.inactive}</span>
        </button>
      </div>

      {/* Mitglied Cards */}
      <div className="mitglied-grid">
        {filteredMitglieder.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <UsersIcon />
            </div>
            <h3>{t('mitglieder:listPage.empty.title')}</h3>
            <p>
              {searchTerm
                ? t('mitglieder:listPage.empty.noSearch')
                : t('mitglieder:listPage.empty.noMembers')
              }
            </p>
          </div>
        ) : (
          filteredMitglieder.map((mitglied) => (
            <MitgliedCard
              key={mitglied.id}
              mitglied={mitglied}
              onEdit={(m) => {
                setSelectedMitglied(m);
                setFormMode('edit');
                setIsFormModalOpen(true);
              }}
              onDelete={(m) => {
                setSelectedMitglied(m);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))
        )}
      </div>

      {/* Pagination for admin */}
      {user?.type === 'admin' && 'totalPages' in (mitgliederData || {}) && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            {t('mitglieder:listPage.pagination.previous')}
          </button>

          <span className="pagination-info">
            {t('mitglieder:listPage.pagination.page', { current: currentPage, total: (mitgliederData as any).totalPages }).replace('{current}', currentPage.toString()).replace('{total}', (mitgliederData as any).totalPages.toString())}
          </span>

          <button
            className="pagination-btn"
            disabled={currentPage === (mitgliederData as any).totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            {t('mitglieder:listPage.pagination.next')}
          </button>
        </div>
      )}

      {/* Modals */}
      <MitgliedFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mitglied={selectedMitglied}
        mode={formMode}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        mitglied={selectedMitglied}
      />
    </div>
  );
};

// Mitglied Card Component
interface MitgliedCardProps {
  mitglied: MitgliedDto;
  onEdit: (mitglied: MitgliedDto) => void;
  onDelete: (mitglied: MitgliedDto) => void;
}

const MitgliedCard: React.FC<MitgliedCardProps> = ({ mitglied, onEdit, onDelete }) => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['mitglieder', 'common']);
  const navigate = useNavigate();
  const { user } = useAuth();
  const fullName = mitgliedUtils.getFullName(mitglied);
  const age = mitgliedUtils.calculateAge(mitglied.geburtsdatum);
  const membershipDuration = mitgliedUtils.getMembershipDuration(mitglied.eintrittsdatum);
  const statusText = mitgliedUtils.getStatusText(mitglied);
  const statusColor = mitgliedUtils.getStatusColor(mitglied);

  return (
    <div className="mitglied-card">
      <div className="mitglied-card-header">
        <div className="mitglied-avatar">
          {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div className="mitglied-info">
          <h3 className="mitglied-name">{fullName}</h3>
          <p className="mitglied-number">#{mitglied.mitgliedsnummer}</p>
        </div>
        <div className={`status-badge status-${statusColor}`}>
          {statusText}
        </div>
      </div>

      <div className="mitglied-card-body">
        <div className="mitglied-details">
          {mitglied.email && (
            <div className="detail-item">
              <MailIcon />
              <span className="detail-text">{mitglied.email}</span>
            </div>
          )}

          {mitglied.telefon && (
            <div className="detail-item">
              <PhoneIcon />
              <span className="detail-text">{mitglied.telefon}</span>
            </div>
          )}

          {age && (
            <div className="detail-item">
              <CakeIcon />
              <span className="detail-text">{age} {t('mitglieder:listPage.card.age')}</span>
            </div>
          )}

          <div className="detail-item">
            <CalendarIcon />
            <span className="detail-text">{t('mitglieder:listPage.card.membership')}: {membershipDuration}</span>
          </div>
        </div>
      </div>

      <div className="mitglied-card-footer">
        <button className="card-action-btn" onClick={() => navigate(`/mitglieder/${mitglied.id}`)}>
          <EyeIcon />
          <span>{t('mitglieder:listPage.card.view')}</span>
        </button>
        {user?.type === 'dernek' && (
          <>
            <button className="card-action-btn" onClick={() => onEdit(mitglied)}>
              <EditIcon />
              <span>{t('mitglieder:listPage.card.edit')}</span>
            </button>
            <button className="card-action-btn card-action-btn-danger" onClick={() => onDelete(mitglied)}>
              <TrashIcon />
              <span>{t('mitglieder:listPage.card.delete')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MitgliedList;
