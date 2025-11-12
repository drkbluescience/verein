/**
 * Mitglied Forderung (Claims) List Page
 * Display member claims/invoices with filtering and actions
 * Accessible by: Admin, Dernek (organization admin)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { mitgliedForderungService } from '../../services/finanzService';
import { vereinService } from '../../services/vereinService';
import { MitgliedForderungDto, ZahlungStatus } from '../../types/finanz.types';
import Loading from '../../components/Common/Loading';
import ErrorMessage from '../../components/Common/ErrorMessage';
import MitgliedForderungFormModal from '../../components/Finanz/MitgliedForderungFormModal';
import * as XLSX from 'xlsx';
import './FinanzList.css';

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const MitgliedForderungList: React.FC = () => {
  // @ts-ignore - i18next type definitions
  const { t } = useTranslation(['finanz', 'common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'open'>('all');
  const [selectedVereinId, setSelectedVereinId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForderung, setSelectedForderung] = useState<MitgliedForderungDto | null>(null);

  // Get vereinId based on user type
  const vereinId = useMemo(() => {
    if (user?.type === 'dernek') return user.vereinId;
    return null; // Admin sees all
  }, [user]);

  // Fetch Vereine (for Admin dropdown)
  const { data: vereine = [] } = useQuery({
    queryKey: ['vereine'],
    queryFn: () => vereinService.getAll(),
    enabled: user?.type === 'admin',
  });

  // Fetch claims
  const { data: forderungen = [], isLoading, error } = useQuery({
    queryKey: ['forderungen', vereinId],
    queryFn: async () => {
      if (vereinId) {
        // Dernek user - get all claims for their verein
        const allForderungen = await mitgliedForderungService.getAll();
        return allForderungen.filter(f => f.vereinId === vereinId);
      }
      // Admin - get all claims
      return await mitgliedForderungService.getAll();
    },
    enabled: !!user,
  });

  // Filter and search
  const filteredForderungen = useMemo(() => {
    return forderungen.filter(f => {
      // Verein filter (Admin only)
      if (selectedVereinId && f.vereinId !== selectedVereinId) return false;

      // Status filter
      if (statusFilter === 'paid' && f.statusId !== ZahlungStatus.BEZAHLT) return false;
      if (statusFilter === 'open' && f.statusId !== ZahlungStatus.OFFEN) return false;

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          f.forderungsnummer?.toLowerCase().includes(search) ||
          f.beschreibung?.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [forderungen, statusFilter, searchTerm, selectedVereinId]);

  const getStatusBadge = (statusId: number, faelligkeit: string) => {
    if (statusId === ZahlungStatus.BEZAHLT) {
      return <span className="badge badge-success">{t('finanz:status.paid')}</span>;
    }

    // Check if overdue
    const today = new Date();
    const dueDate = new Date(faelligkeit);
    const isOverdue = dueDate < today;

    if (isOverdue) {
      return <span className="badge badge-error">Gecikmiş</span>;
    }

    return <span className="badge badge-warning">{t('finanz:status.open')}</span>;
  };

  const isOverdue = (faelligkeit: string, statusId: number) => {
    if (statusId === ZahlungStatus.BEZAHLT) return false;
    return new Date(faelligkeit) < new Date();
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredForderungen.map(f => ({
      [t('finanz:export.invoiceNoColumn')]: f.forderungsnummer || '-',
      [t('finanz:export.amountColumn')]: f.betrag,
      [t('finanz:export.dueDateColumn')]: new Date(f.faelligkeit).toLocaleDateString('tr-TR'),
      [t('finanz:export.statusColumn')]: f.statusId === 1 ? t('finanz:export.statusPaid') : t('finanz:export.statusOpen'),
      [t('finanz:export.overdueColumn')]: isOverdue(f.faelligkeit, f.statusId) ? t('finanz:export.yes') : t('finanz:export.no'),
      [t('finanz:export.descriptionColumn')]: f.beschreibung || '-',
      [t('finanz:export.paidDateColumn')]: f.bezahltAm ? new Date(f.bezahltAm).toLocaleDateString('tr-TR') : '-',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('finanz:export.claimsSheet'));
    XLSX.writeFile(wb, `${t('finanz:export.claimsFileName')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={t('common:error.loadingFailed')} />;

  return (
    <div className="finanz-list">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">{t('finanz:claims.title')}</h1>
        <p className="page-subtitle">{t('finanz:claims.subtitle')}</p>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar" style={{ padding: '0 24px 24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/finanzen')}
          title={t('common:back')}
        >
          <ArrowLeftIcon />
        </button>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-secondary" onClick={exportToExcel}>
          <DownloadIcon />
          Excel
        </button>
        <button className="btn btn-primary" onClick={() => {
          setSelectedForderung(null);
          setIsModalOpen(true);
        }}>
          <PlusIcon />
          {t('finanz:claims.new')}
        </button>
      </div>

      {/* Filters */}
      <div className="list-filters">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('common:actions.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          {/* Admin: Verein Filter */}
          {user?.type === 'admin' && (
            <select
              value={selectedVereinId || ''}
              onChange={(e) => setSelectedVereinId(e.target.value ? Number(e.target.value) : null)}
              className="filter-select"
            >
              <option value="">{t('finanz:filter.allVereine')}</option>
              {vereine.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">{t('finanz:filter.allStatus')}</option>
            <option value="paid">{t('finanz:status.paid')}</option>
            <option value="open">{t('finanz:status.open')}</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredForderungen.length === 0 ? (
        <div className="empty-state">
          <p>{t('finanz:claims.empty')}</p>
        </div>
      ) : (
        <div className="list-table-container">
          <table className="list-table">
            <thead>
              <tr>
                <th>{t('finanz:claims.number')}</th>
                {user?.type === 'admin' && <th>{t('common:verein')}</th>}
                <th>{t('finanz:claims.amount')}</th>
                <th>{t('finanz:claims.dueDate')}</th>
                <th>{t('finanz:claims.status')}</th>
                <th>{t('finanz:claims.description')}</th>
                <th>{t('common:common.actionsColumn')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredForderungen.map((forderung) => {
                const verein = vereine.find(v => v.id === forderung.vereinId);
                return (
                  <tr
                    key={forderung.id}
                    className={isOverdue(forderung.faelligkeit, forderung.statusId) ? 'row-overdue' : ''}
                  >
                    <td className="cell-number">{forderung.forderungsnummer || '-'}</td>
                    {user?.type === 'admin' && (
                      <td className="cell-verein">{verein?.name || '-'}</td>
                    )}
                    <td className="cell-amount">€ {forderung.betrag.toFixed(2)}</td>
                    <td className="cell-date">
                      {new Date(forderung.faelligkeit).toLocaleDateString()}
                      {isOverdue(forderung.faelligkeit, forderung.statusId) && (
                        <span className="overdue-indicator" title="Gecikmiş">⚠️</span>
                      )}
                    </td>
                    <td>{getStatusBadge(forderung.statusId, forderung.faelligkeit)}</td>
                    <td className="cell-description">{forderung.beschreibung || '-'}</td>
                    <td className="cell-actions">
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/meine-finanzen/forderungen/${forderung.id}`)}
                      title={t('common:view')}
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSelectedForderung(forderung);
                        setIsModalOpen(true);
                      }}
                      title={t('common:edit')}
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="list-summary">
        <p>
          {t('finanz:claims.total')}: <strong>{filteredForderungen.length}</strong>
        </p>
        <p>
          {t('finanz:claims.totalAmount')}: <strong>€ {filteredForderungen.reduce((sum, f) => sum + f.betrag, 0).toFixed(2)}</strong>
        </p>
      </div>

      {/* Modal Form */}
      <MitgliedForderungFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedForderung(null);
        }}
        forderung={selectedForderung}
        mode={selectedForderung ? 'edit' : 'create'}
      />
    </div>
  );
};

export default MitgliedForderungList;

